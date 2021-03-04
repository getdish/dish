FROM buildkite/agent:ubuntu

RUN apt-get update && apt-get install --no-install-recommends -y \
        nmap awscli iproute2 apt-transport-https ca-certificates curl gnupg-agent software-properties-common \
    && curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add - \
    && add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable" \
    && apt-get update && apt-get install --no-install-recommends -y \
        docker-ce docker-ce-cli containerd.io

COPY hooks/ /buildkite/hooks/

COPY ./docker-entrypoint.d /docker-entrypoint.d

CMD ["start", "--spawn", "6"]
