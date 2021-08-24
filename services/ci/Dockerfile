FROM buildkite/agent:ubuntu

# adding our deps
RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add - \
        && add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
        && apt-get remove docker docker-engine docker.io containerd runc \
        && apt-get update \
        && apt-get install --no-install-recommends -y \
            nmap awscli iproute2 apt-transport-https ca-certificates curl gnupg gnupg-agent software-properties-common \
            net-tools postgresql-client nodejs npm docker-ce docker-ce-cli containerd.io git-crypt lsb-release \
        && curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose \
        && chmod +x /usr/local/bin/docker-compose \
        && curl -o- -L https://yarnpkg.com/install.sh | bash \
        && apt-get clean

COPY ./docker-entrypoint.d /docker-entrypoint.d
COPY hooks/ /buildkite/hooks/

ENV PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"

CMD ["start"]

