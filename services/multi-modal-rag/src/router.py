from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse
from langchain_community.vectorstores.qdrant import Qdrant
from pydantic import BaseModel

from src.retriever import PdfContent

from .dependencies import (
    RetrieverDep,
    OpenAIClientDep,
    QdrantClientDep,
)

router = APIRouter(prefix="/api/v1/rag")


class CreateStoreRequest(BaseModel):
    lecture: int
    text: str


@router.post("/", status_code=201)
async def create_store(
    request: CreateStoreRequest,
    qdrant_client: QdrantClientDep,
    retriever: RetrieverDep,
    openai_client: OpenAIClientDep,
    pdfs: list[UploadFile] = File(...),
) -> None:
    vectorstore = Qdrant(qdrant_client, str(request.lecture))
    pdf_contents = [PdfContent.from_file(pdf.file, openai_client) for pdf in pdfs]
    retriever.add_collection(vectorstore, pdf_contents)


@router.get("/")
async def answer(
    query: str,
    lecture: int,
    qdrant_client: QdrantClientDep,
    retriever: RetrieverDep,
) -> JSONResponse:
    vectorstore = Qdrant(qdrant_client, str(lecture))
    return JSONResponse({"response": retriever.respond(vectorstore, query)})
