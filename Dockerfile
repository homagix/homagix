# syntax = docker/dockerfile:1

ARG NODE_VERSION=22
ARG PORT=3000

FROM node:${NODE_VERSION}-alpine
RUN apk update && \
    apk upgrade && \
    apk add npm>=11
WORKDIR /build

COPY --link . .
RUN npm install && \
    npm run build && \
    mv .output /app && \
    rm -rf /build

WORKDIR /app
ENV NODE_ENV=production

CMD [ "node", "server/index.mjs" ]
