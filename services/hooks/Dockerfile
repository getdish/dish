FROM registry.dishapp.com/dish-base:latest

WORKDIR /app

RUN rm -r snackui

WORKDIR /app/services/hooks

CMD ["node", "dist/index.js"]
