FROM rust:1.46-buster as builder
WORKDIR /build

RUN curl https://download.pytorch.org/libtorch/cpu/libtorch-cxx11-abi-shared-with-deps-1.6.0%2Bcpu.zip \
          -o /build/libtorch.zip
RUN unzip /build/libtorch.zip
RUN cp -a /build/libtorch/lib/ /usr/lib/x86_64-linux-gnu

ADD services/bert/Cargo.lock .
ADD services/bert/Cargo.toml .
ADD services/bert/main.rs .
RUN cargo build --release


FROM debian:buster-slim
WORKDIR /app
RUN true
RUN apt-get update && apt-get install -y curl openssl libgomp1

COPY --from=builder /build/libtorch/lib /usr/lib/x86_64-linux-gnu/
COPY --from=builder /build/target/release/rust-bert-dish .
ADD services/bert/download_deps.sh .
ADD services/bert/entry.sh .
RUN /app/download_deps.sh

CMD ["/app/entry.sh"]
