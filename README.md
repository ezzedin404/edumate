# Edumate

AI-powered high-scallable courses platform.

## Table of Contents
* [Main Features](#main-features)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Tech-stack](#tech-stack)

## Main Features
* Tutors and students can register to the platform to sync there data.
* Tutors create courses each course consist of lectures.
* Lectures have auto-generated transcript.
* Lectures support PDF attachments and exams with MSQs or written questions.
* Written questions is auto corrected with AI given tutor's ideal answer.
* Student can ask questions and get asnwered from lecture's content and attachments.

## Prerequisites
* `git`
* `docker`
* `docker-compose`

## Installation
1. Clone the source code using `git`
```bash
git clone https://github.com/ezz256/edumate
```
2. Entre project's directory
```bash
cd edumate
```
3. Add required environment variables in `.env` file
4. Build and run application's services
```bash
docker compose up
```

## Tech-stack
* FastAPI & ExpressJS (TypeScript)
* PostgreSQL
* Qdrant
* KeyCloak
* Minio
* Nginx
* Docker

