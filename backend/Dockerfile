FROM python:3.8-slim-buster
RUN apt-get update
RUN apt-get -y install ffmpeg libavcodec-extra
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
CMD gunicorn -b 0.0.0.0:$PORT --timeout 1000 app:app