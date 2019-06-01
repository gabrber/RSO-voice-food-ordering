FROM mongo:4.0.4
COPY script.sh .
COPY mongo.js .
RUN chmod +x script.sh

CMD [ "mongod", "--port", "37017"]
