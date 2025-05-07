# clangen-lite build
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS uv

WORKDIR /app

COPY . .
RUN uv sync
RUN uv run vendors/clangen-lite/build.py vendors/clangen-lite public

# clangensim build
FROM node:22.15-alpine AS nodejs

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install

COPY . .
COPY --from=uv /app/public ./public
RUN npm run build

# final
FROM scratch
COPY --from=nodejs /app/dist .
