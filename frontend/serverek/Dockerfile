FROM node

RUN mkdir -p /app
WORKDIR /app
COPY . /app
RUN npm install

EXPOSE 9999

CMD ["node", "server.js"]