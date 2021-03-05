FROM python:3.8
WORKDIR /app
RUN curl https://github.com/onnx/models/raw/master/text/machine_comprehension/roberta/model/roberta-sequence-classification-9.onnx \
 -o roberta-sequence-classification-9.onnx
ADD requirements.txt .
RUN pip install -r requirements.txt
COPY . .
ENTRYPOINT [ "python" ]
CMD [ "app.py" ]
