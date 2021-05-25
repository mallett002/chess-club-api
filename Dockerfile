FROM node:12-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN ls -lah

EXPOSE 4001

CMD [ "npm", "start" ]
