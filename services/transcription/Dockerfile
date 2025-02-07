FROM python:3.11-bookworm

WORKDIR /app

COPY pyproject.toml ./

RUN pip3 install poetry && poetry install

COPY . .

EXPOSE 8000

CMD ["poetry", "run", "uvicorn", "main:app"]
