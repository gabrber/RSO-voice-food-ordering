build:
	docker-compose build
	docker-compose up -d
	docker exec -it db-backend bash -c ./script.sh
	docker exec -it db-nlp bash -c ./script.sh
