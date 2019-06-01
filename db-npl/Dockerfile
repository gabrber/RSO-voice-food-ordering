FROM mongo:4.0.4

ENV DB_NAME "rso_nlp"
ENV DB_USERNAME "nlp"
ENV DB_PASSWORD "nlp123"

COPY script.sh .
COPY mongo.js .

RUN chmod +x script.sh