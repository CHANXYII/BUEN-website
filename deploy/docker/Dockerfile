# POC/demo image: builds the static site, then serves it with nginx.
# Build from the repo root:  docker build -f deploy/docker/Dockerfile -t buen-poc .
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json ./
COPY app ./app
COPY src ./src
COPY deploy/CNAME* ./deploy/
RUN npm run build

FROM nginx:1.27-alpine
COPY deploy/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/deploy/site /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/ >/dev/null || exit 1
