FROM node:11

WORKDIR /usr/src/nlpservice

COPY package*.json ./

USER root

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start"]
