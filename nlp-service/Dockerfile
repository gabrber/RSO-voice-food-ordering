FROM node:11

WORKDIR /usr/src/nlpservice

COPY package*.json ./

USER node

RUN sudo chmod -R 777 /usr/src

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start"]
