FROM node:13 AS builder
RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin
WORKDIR /usr/src/app
COPY ./package*.json ./
RUN NODE_OPTIONS="--max_old_space_size=1024" npm ci
COPY tsconfig.json ./
COPY src/ ./src/
COPY ./tsconfig*.json ./
RUN NODE_OPTIONS="--max_old_space_size=1024" npm run build
RUN npm ci --production
RUN /usr/local/bin/node-prune
RUN npm prune --production

FROM node:10-alpine
RUN apk --update add postgresql-client
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules/
COPY --from=builder /usr/src/app/dist ./dist/
COPY --from=builder /usr/src/app/package.json ./
COPY ./public ./public/
RUN mkdir ./tmp
EXPOSE 80
ENV NODE_ENV=production
ENV MICROSERVICES_BATCH=0
ENV MICROSERVICES_FACEBOOKAPI=1
ENV MICROSERVICES_GRAPHQL=0
ENV GOOGLE_DIALOGFLOW_LANGUAGE=es
ENV BATCH_DATABASE_BACKUP="0 0 1 * * *"
ENV BATCH_FILE_SYNC="0 0 4 * * *"
ENV BATCH_SYNC_ACCOUNTS="0 0 2 * * *"
ENV PORT=80
ENV DB_DIALECT=postgres
ENV DB_PORT=5432
ENV DB_NAME=academibot
ENV UPLOAD_FOLDER="files/"
CMD ["npm", "run", "start:prod"]