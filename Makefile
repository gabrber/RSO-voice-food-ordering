build:
        docker-compose build
        docker-compose up -d
        docker exec -it mongodb-test bash -c ./script.sh