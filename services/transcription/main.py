import os
from typing import Annotated
from fastapi import Depends, FastAPI, HTTPException, UploadFile
from deepgram import (
    DeepgramClient,
    PrerecordedOptions,
)
from fastapi.responses import JSONResponse
from pydantic import BaseModel

app = FastAPI()

DEEPGRAM_API_KEY = os.environ["DEEPGRAM_API_KEY"]

DeepgramDep = Annotated[
    DeepgramClient, Depends(lambda: DeepgramClient(api_key=DEEPGRAM_API_KEY))
]


@app.post("/api/v1/transcribe", status_code=201)
async def transcribe(file: UploadFile, deepgram: DeepgramDep) -> JSONResponse:
    try:
        transcription = deepgram.listen.rest.v("1").transcribe_file(
            {"buffer": await file.read()},
            PrerecordedOptions(model="nova-2", smart_format=True),
        )
        return JSONResponse(
            {
                "transcription": transcription["results"]["channels"][0][
                    "alternatives"
                ]["transcript"]
            }
        )
    except Exception as e:
        raise HTTPException(500, detail=e)
