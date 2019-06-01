build:
        docker-compose build
        docker-compose up
configure:
        docker exec -it db-backend bash -c ./script.sh
