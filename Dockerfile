# syntax = docker/dockerfile:1

ARG NODE_VERSION=20
ARG PORT=3000

FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app

### build stage
FROM base AS build

COPY --link package.json package-lock.json ./
RUN npm install

COPY --link . .
RUN npm run build

### run stage
FROM base

ENV NODE_ENV=production

COPY --from=build /app/.output /app
RUN chown -R node.node .
USER node

CMD [ "node", "server/index.mjs" ]
