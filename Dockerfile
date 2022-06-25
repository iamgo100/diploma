FROM python:3.10-alpine
RUN python -m pip install --upgrade pip

COPY ./requirements.txt .
RUN pip install -r requirements.txt

COPY ./DiplomaProject /app

WORKDIR /app

COPY ./entrypoint.sh /
ENTRYPOINT ["sh", "/entrypoint.sh"]