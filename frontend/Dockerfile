FROM node as build
RUN mkdir -p /app
WORKDIR /app
COPY . /app
RUN npm install
RUN npm run build

# production environment
FROM nginx
COPY --from=build /app/build /var/www
COPY nginx.conf /etc/nginx/nginx.conf
COPY ./certificates /etc/ssl
ENTRYPOINT ["nginx","-g","daemon off;"]