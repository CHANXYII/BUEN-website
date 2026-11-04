# Production image: build the static site with Node, then serve out/ with nginx.
#   docker compose up --build        -> http://localhost:8080
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG BASE_PATH=
ENV BASE_PATH=$BASE_PATH NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/out /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/ >/dev/null || exit 1
