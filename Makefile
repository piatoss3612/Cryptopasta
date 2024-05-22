.PHONY: up
up:
	docker-compose up -d $(service)

.PHONY: up-build
up-build:
	docker-compose up -d --build

.PHONY: down
down:
	docker-compose down $(service)