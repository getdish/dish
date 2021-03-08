FROM tensorflow/tensorflow:2.0.0-py3

# Install system packages
RUN apt-get update && apt-get install -y --no-install-recommends \
      bzip2 \
      g++ \
      git \
      graphviz \
      libgl1-mesa-glx \
      libhdf5-dev \
      openmpi-bin \
      wget && \
    rm -rf /var/lib/apt/lists/*

COPY models /models
COPY src /src

WORKDIR /src

RUN pip install -r requirements.txt

ENV PYTHONPATH='/src/:$PYTHONPATH'

ENTRYPOINT [ "python" ]
CMD [ "evaluater/server.py", "-b", "MobileNet", "-w", "models/MobileNet/weights_mobilenet_aesthetic_0.07.hdf5" ]
