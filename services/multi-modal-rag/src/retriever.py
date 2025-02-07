import os
from tempfile import TemporaryDirectory
from typing import IO, Self
from langchain_core.stores import BaseStore
from langchain_core.vectorstores.base import VectorStore
from unstructured.documents.elements import CompositeElement
from unstructured.partition.pdf import partition_pdf
import uuid

from langchain.retrievers.multi_vector import MultiVectorRetriever
from langchain.schema.document import Document
from langchain_openai import ChatOpenAI

import base64
from langchain.schema.messages import HumanMessage, AIMessage

from langchain.schema.runnable import RunnablePassthrough
from langchain.prompts import ChatPromptTemplate
from langchain.schema.output_parser import StrOutputParser

from src.dependencies import OPENAI_MODEL


ID_KEY = "doc_id"
TEMPLATE = """Answer the question based only on the following context, which can include text and images:
{context}
Question: {question}
"""


def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


def summarize_image(encoded_image, chat_model: ChatOpenAI) -> str:
    prompt = [
        AIMessage(content="You are a bot that is good at analyzing images."),
        HumanMessage(
            content=[
                {"type": "text", "text": "Describe the contents of this image."},
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/jpeg;base64,{encoded_image}"},
                },
            ]
        ),
    ]
    response = chat_model.invoke(prompt)
    return response.content


def summarize_text(text: str, chat_model: ChatOpenAI) -> str:
    prompt = f"Summarize the following text:\n\n{text}\n\nSummary:"
    response = chat_model.invoke([HumanMessage(content=prompt)])
    return response.content


def to_docs(contents: list[str]) -> list[Document]:
    return [Document(page_content=content) for content in contents]


class PdfContent:
    def __init__(
        self, texts: list[str], images: list[str], chat_model: ChatOpenAI
    ) -> None:
        self._texts = texts
        self._images = images
        self._chat_model = chat_model

    @classmethod
    def from_file(cls, file: IO[bytes], chat_model: ChatOpenAI) -> Self:
        images_dir = TemporaryDirectory()
        raw_pdf_elements = partition_pdf(
            file=file,
            extract_images_in_pdf=True,
            infer_table_structure=True,
            chunking_strategy="by_title",
            max_characters=3000,
            new_after_n_chars=3800,
            combine_text_under_n_chars=1000,
            image_output_dir_path=images_dir.name,
        )

        text_elements = [
            element.text
            for element in raw_pdf_elements
            if isinstance(element, CompositeElement)
        ]
        image_elements = [
            encode_image(os.path.join(images_dir.name, image_name))
            for image_name in os.listdir(images_dir.name)
            if image_name.endswith(("png", "jpg", "jpeg"))
        ]
        return PdfContent(text_elements, image_elements, chat_model)

    @property
    def texts(self) -> list[Document]:
        return to_docs(self._texts)

    @property
    def texts_summaries(self) -> list[str]:
        return [summarize_text(text, self._chat_model) for text in self._texts]

    @property
    def images(self) -> list[Document]:
        return to_docs(self._images)

    @property
    def images_summaries(self) -> list[str]:
        return [summarize_image(image, self._chat_model) for image in self._images]


class Retriever:

    def __init__(
        self,
        chat_model: ChatOpenAI,
        docstore: BaseStore[str, Document],
    ) -> None:
        self._chat_model = chat_model
        self._docstore = docstore

    def add_collection(self, vectorstore: VectorStore, pdfs: list[PdfContent]) -> None:
        for pdf in pdfs:
            self._add_documents_to_retriever(
                vectorstore, pdf.texts_summaries, pdf.texts
            )
            self._add_documents_to_retriever(
                vectorstore, pdf.images_summaries, pdf.images
            )

    def respond(self, vectorstore: VectorStore, query: str) -> str:
        retriever = MultiVectorRetriever(
            vectorstore=vectorstore, docstore=self._docstore, id_key=ID_KEY
        )
        prompt = ChatPromptTemplate.from_template(TEMPLATE)
        model = ChatOpenAI(temperature=0.2, model=OPENAI_MODEL)
        chain = (
            {"context": retriever, "question": RunnablePassthrough()}
            | prompt
            | model
            | StrOutputParser()
        )
        return chain.invoke(query)

    def _add_documents_to_retriever(
        self, vectorstore: VectorStore, summaries: list[str], docs: list[Document]
    ) -> None:
        doc_ids = [str(uuid.uuid4()) for _ in summaries]
        summary_docs = [
            Document(page_content=s, metadata={ID_KEY: doc_ids[i]})
            for i, s in enumerate(summaries)
        ]
        vectorstore.add_documents(summary_docs)
        self._docstore.mset(list(zip(doc_ids, docs)))
