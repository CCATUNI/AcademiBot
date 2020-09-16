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
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules/
COPY --from=builder /usr/src/app/dist ./dist/
COPY --from=builder /usr/src/app/package.json ./
COPY ./public ./public/
EXPOSE 80
ENV DATABASE_DIALECT=postgres
ENV NODE_ENV=production
CMD ["npm", "run", "start:prod"]