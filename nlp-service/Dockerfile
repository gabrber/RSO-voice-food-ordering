FROM node:11

WORKDIR ~/containers/nlpservice

COPY package*.json ./

USER node

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start"]
