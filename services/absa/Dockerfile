FROM python:3.8-slim
WORKDIR /app
ENV FLASK_APP=server.py

RUN pip install \
      flask \
      aspect-based-sentiment-analysis

COPY services/absa/setup.py /app
RUN python setup.py

COPY services/absa/server.py /app

CMD ["python", "-m", "flask", "run", "--host=0.0.0.0"]
