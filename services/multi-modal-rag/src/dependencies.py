from typing import Annotated
import os

from fastapi import Depends
from langchain_core.stores import InMemoryStore
from langchain_openai import ChatOpenAI
from qdrant_client import QdrantClient

from src.retriever import Retriever

QDRANT_HOST = os.environ["QDRANT_HOST"]
QDRANT_PORT = int(os.environ["QDRANT_PORT"])
QDRANT_API_KEY = os.environ["QDRANT_API_KEY"]

OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]
OPENAI_BASE_URL = os.environ["OPENAI_BASE_URL"]
OPENAI_MODEL = os.environ["OPENAI_MODEL"]


def _get_qdrant_client() -> QdrantClient:
    return QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT, api_key=QDRANT_API_KEY)


def _get_openai_client() -> ChatOpenAI:
    return ChatOpenAI(
        api_key=OPENAI_API_KEY,  # type: ignore
        base_url=OPENAI_BASE_URL,
        model=OPENAI_MODEL,
    )


def _get_retriever() -> Retriever:
    return Retriever(_get_openai_client(), InMemoryStore())


QdrantClientDep = Annotated[QdrantClient, Depends(_get_qdrant_client)]
OpenAIClientDep = Annotated[ChatOpenAI, Depends(_get_openai_client)]
RetrieverDep = Annotated[Retriever, Depends(_get_retriever)]
