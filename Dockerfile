FROM node:16

COPY ./package.json ./app/package.json

WORKDIR /app

RUN yarn

EXPOSE 3333

CMD ./wait-for-it.sh postgres:5432 -- && yarn run-migrations && yarn seed:run && yarn dev
