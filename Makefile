.PHONY: up-dev down-dev install up-prod up-prod-detached up-prod-fresh up-prod-detached-fresh logs-prod logs-prod-app logs-prod-nginx

DOCKER_COMPOSE_DEV := docker compose -f docker-compose.dev.yml
DOCKER_COMPOSE_PROD := docker compose -f docker-compose.prod.yml

up-dev:
	$(DOCKER_COMPOSE_DEV) up --build

down-dev:
	$(DOCKER_COMPOSE_DEV) down

install:
	$(DOCKER_COMPOSE_DEV) install

# Fully rebuild and start production stack (Laravel + React) with live logs.
# This stays attached so it exits only when containers stop.
up-prod:
	$(DOCKER_COMPOSE_PROD) down -v || true
	rm -rf vendor node_modules
	$(DOCKER_COMPOSE_PROD) up --build

# Same as up-prod, but returns immediately after startup.
up-prod-detached:
	$(DOCKER_COMPOSE_PROD) down || true
	rm -rf vendor node_modules
	$(DOCKER_COMPOSE_PROD) up --build -d
	$(DOCKER_COMPOSE_PROD) exec -T app sh -lc "mkdir -p public/blog_images public/blog_inline && chown -R www-data:www-data public/blog_images public/blog_inline && chmod -R 775 public/blog_images public/blog_inline"
	$(DOCKER_COMPOSE_PROD) exec -T app sh -lc "php artisan storage:link || true"
	$(DOCKER_COMPOSE_PROD) exec -T app php artisan optimize:clear

# Destructive rebuild variants (also remove DB volume).
up-prod-fresh:
	$(DOCKER_COMPOSE_PROD) down -v || true
	rm -rf vendor node_modules
	$(DOCKER_COMPOSE_PROD) up --build

up-prod-detached-fresh:
	$(DOCKER_COMPOSE_PROD) down -v || true
	rm -rf vendor node_modules
	$(DOCKER_COMPOSE_PROD) up --build -d

logs-prod:
	$(DOCKER_COMPOSE_PROD) logs -f

logs-prod-app:
	$(DOCKER_COMPOSE_PROD) logs -f app

logs-prod-nginx:
	$(DOCKER_COMPOSE_PROD) logs -f nginx
