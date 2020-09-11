FROM tiangolo/meinheld-gunicorn:python3.8
WORKDIR /app
ENV FLASK_APP=server.py

RUN pip install \
      flask \
      flask_cors \
      aspect-based-sentiment-analysis

COPY services/absa/setup.py /app
RUN python setup.py

COPY services/absa/server.py /app/main.py

