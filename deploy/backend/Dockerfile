FROM node:20-alpine3.17

# envs
ENV AUTH_DRIVER=jwt
ENV AUTH_JWT_SECRET=77f26710ece0610a207ff1350442ee932b9bb4905c9163d72259e33a23ec858d

ENV HASH_DRIVER=bcrypt

ENV CACHE_DRIVER=redis
ENV CACHE_REDIS_HOST=redis
ENV CACHE_REDIS_PORT=6379
ENV CACHE_REDIS_PASSWORD=redis

ENV RATES_DRIVER=binance

ENV JOB_SNAPSHOT_CRON_EXPRESSION="0 2 * * *"
ENV JOB_RATES_CRON_EXPRESSION="55 1 * * *"

ENV POSTGRES_HOST=db
ENV POSTGRES_PORT=5432
ENV POSTGRES_DATABASE=wellets
ENV POSTGRES_USER=wellets
ENV POSTGRES_PASSWORD=wellets
ENV POSTGRES_SSL=false
ENV POSTGRES_SSL_REJECT_UNAUTHORIZED=false

# app
WORKDIR /app

COPY ./package.json ./yarn.lock ./
RUN --mount=type=cache,target=/root/.cache/yarn yarn

COPY ./tsconfig.json ./
COPY ./jest.config.js ./
COPY ./babel.config.js ./
COPY ./ecosystem.config.js ./
COPY ./genOrmconfig.js ./
COPY ./src ./src/

RUN yarn build

ENV NODE_ENV=production

EXPOSE 3333

# service
CMD yarn gen:ormconfig && yarn typeorm migration:run && yarn start
