# Makefile for Docker operations with Colima
.PHONY: help dev prod build clean logs shell test env-setup

# Default target
help:
	@echo "Available commands:"
	@echo "  make dev      - Start development environment"
	@echo "  make prod     - Start production environment"
	@echo "  make build    - Build Docker images"
	@echo "  make clean    - Clean up containers and images"
	@echo "  make logs     - Show container logs"
	@echo "  make shell    - Open shell in development container"
	@echo "  make test     - Run tests in container"
	@echo "  make env-setup - Setup environment files"

# Environment setup
env-setup:
	@echo "Setting up environment files..."
	@if [ ! -f .env.development ]; then \
		cp .env.example .env.development; \
		echo "Created .env.development from .env.example"; \
	else \
		echo ".env.development already exists"; \
	fi
	@if [ ! -f .env.production ]; then \
		cp .env.example .env.production; \
		echo "Created .env.production from .env.example"; \
	else \
		echo ".env.production already exists"; \
	fi
	@echo ""
	@echo "⚠️  IMPORTANT: Please edit the following files with your actual values:"
	@echo "   - .env.development (for development)"
	@echo "   - .env.production (for production)"
	@echo ""
	@echo "   Required variables to update:"
	@echo "   - VITE_API_KEY=your-actual-reqres-api-key"
	@echo ""

# Development
dev:
	@echo "Starting development environment..."
	docker-compose up app-dev

dev-build:
	@echo "Building and starting development environment..."
	docker-compose up --build app-dev

dev-detached:
	@echo "Starting development environment in background..."
	docker-compose up -d app-dev

# Production
prod:
	@echo "Starting production environment..."
	docker-compose -f docker-compose.prod.yml up

prod-build:
	@echo "Building and starting production environment..."
	docker-compose -f docker-compose.prod.yml up --build

prod-detached:
	@echo "Starting production environment in background..."
	docker-compose -f docker-compose.prod.yml up -d

# Build
build:
	@echo "Building Docker images..."
	docker-compose build

build-prod:
	@echo "Building production image..."
	docker build --target production -t user-backoffice:prod .

build-dev:
	@echo "Building development image..."
	docker build --target dev -t user-backoffice:dev .

# Cleanup
clean:
	@echo "Cleaning up containers and images..."
	docker-compose down
	docker-compose -f docker-compose.prod.yml down
	docker system prune -f

clean-all:
	@echo "Cleaning up everything..."
	docker-compose down -v --rmi all
	docker-compose -f docker-compose.prod.yml down -v --rmi all
	docker system prune -af

# Logs
logs:
	@echo "Showing development logs..."
	docker-compose logs -f app-dev

logs-prod:
	@echo "Showing production logs..."
	docker-compose -f docker-compose.prod.yml logs -f

# Shell access
shell:
	@echo "Opening shell in development container..."
	docker-compose exec app-dev sh

# Testing
test:
	@echo "Running tests in container..."
	docker-compose exec app-dev pnpm test

test-e2e:
	@echo "Running e2e tests in container..."
	docker-compose exec app-dev pnpm test:e2e

# Colima specific commands
colima-start:
	@echo "Starting Colima..."
	colima start

colima-stop:
	@echo "Stopping Colima..."
	colima stop

colima-status:
	@echo "Colima status:"
	colima status

# Health checks
health:
	@echo "Checking development health..."
	curl -f http://localhost:5173 || echo "Development server not healthy"
	@echo "Checking production health..."
	curl -f http://localhost:8080/health || echo "Production server not healthy" 