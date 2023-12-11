all: up

up:
	@docker-compose up --build

down:
	@docker-compose down

clean: down
	@docker images -q | xargs docker rmi
	@docker volume ls -q | xargs docker volume rm

re: clean all

fclean: clean
	@docker system prune -af