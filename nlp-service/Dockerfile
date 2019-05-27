FROM node:11

WORKDIR /usr/node

ENV MONGO_HOST=46.101.104.71

ENV MONGO_PORT=37017

ENV MONGO_DB=rso_nlp

COPY package*.json ./

USER root

RUN npm install

COPY . .

COPY ./certs ./

EXPOSE 5000

CMD [ "npm", "start"]
