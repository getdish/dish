FROM registry.dishapp.com/dish-base:latest

RUN apt-get update > /dev/null && apt-get install -y git gnupg wget lsb-release > /dev/null && \
      echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list && \
      wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - && \
      echo "deb http://deb.debian.org/debian buster-backports main" >> /etc/apt/sources.list && \
      apt-get update > /dev/null && \
      apt-get install -y s3cmd > /dev/null && \
      apt-get install -y vim cron curl postgresql-client-12 > /dev/null && \
      apt-get clean

WORKDIR /app

# copy in all things we need
COPY dsh dsh.ts package.json .env .env.production .env.test ./

# lets ./dsh work
RUN git init && git add ./dsh && git commit -m 'init'

COPY services/cron/cron-jobs /etc/cron.d/cron-jobs
RUN chmod 0744 /etc/cron.d/cron-jobs
RUN crontab /etc/cron.d/cron-jobs
RUN touch /var/log/cron.log

ARG GIT_BRANCH=""
ARG GIT_COMMIT=""
ENV GIT_BRANCH=${GIT_BRANCH}
ENV GIT_COMMIT=${GIT_COMMIT}

CMD cron && tail -f /var/log/cron.log
