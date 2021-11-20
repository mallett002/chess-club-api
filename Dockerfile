FROM node:12-alpine as builder

WORKDIR /usr/src/app

COPY . .

RUN npm i
RUN npm run build

USER node

########################

FROM node:12-alpine

EXPOSE 4000

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/scripts ./scripts
COPY --from=builder /usr/src/app/package.json .
COPY --from=builder /usr/src/app/package-lock.json .
COPY --from=builder /usr/src/app/config ./config

RUN echo running ls in start stage
RUN ls -lah dist
RUN ls -lah scripts

USER node
CMD ["node", "--experimental-modules", "dist/index.js"]
