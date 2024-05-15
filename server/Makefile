.PHONY: run
run:
	@echo "Running server..."
	go run ./cmd/server

.PHONY: run-swagger
run-swagger: swaggo
	@echo "Running swagger server..."
	go run ./cmd/swagger

.PHONY: swaggo
swaggo:
	@echo "Generating swagger docs..."
	swag init -d cmd/server -o docs --parseInternal --pdl 3

.PHONY: swagfmt
swagfmt:
	@echo "Formatting swagger docs..."
	swag fmt

