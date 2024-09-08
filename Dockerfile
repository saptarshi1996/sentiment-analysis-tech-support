FROM python:3.9.0

WORKDIR /app

COPY requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt

ARG module

COPY wait-for-it.sh /app/wait-for-it.sh

COPY ./${module} /app/${module}/
COPY ./shared /app/shared/
COPY .env /app/
