build:
        docker-compose build
        docker-compose up -d
configure:
        docker exec -it db-backend bash -c ./script.sh
