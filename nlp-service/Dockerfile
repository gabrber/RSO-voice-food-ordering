FROM node:11

WORKDIR /usr/node

COPY package*.json ./

USER node

RUN npm install

COPY . .

EXPOSE 5000

CMD [ "npm", "start"]
