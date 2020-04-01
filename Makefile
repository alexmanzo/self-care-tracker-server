# ----------------
# Make help script
# ----------------

# Usage:
# Add help text after target name starting with '\#\#'
# A category can be added with @category. Team defaults:
# 	dev-environment
# 	docker
# 	drush

# Output colors
GREEN  := $(shell tput -Txterm setaf 2)
WHITE  := $(shell tput -Txterm setaf 7)
YELLOW := $(shell tput -Txterm setaf 3)
RESET  := $(shell tput -Txterm sgr0)

# Detect OS
OS_NAME := $(shell uname -s | tr A-Z a-z)

# Script
HELP_FUN = \
	%help; \
	while(<>) { push @{$$help{$$2 // 'options'}}, [$$1, $$3] if /^([a-zA-Z\-]+)\s*:.*\#\#(?:@([a-zA-Z\-]+))?\s(.*)$$/ }; \
	print "usage: make [target]\n\n"; \
	print "see makefile for additional commands\n\n"; \
	for (sort keys %help) { \
	print "${WHITE}$$_:${RESET}\n"; \
	for (@{$$help{$$_}}) { \
	$$sep = " " x (32 - length $$_->[0]); \
	print "  ${YELLOW}$$_->[0]${RESET}$$sep${GREEN}$$_->[1]${RESET}\n"; \
	}; \
	print "\n"; }

help: ## Show help (same if no target is specified).
	@perl -e '$(HELP_FUN)' $(MAKEFILE_LIST) $(filter-out $@,$(MAKECMDGOALS))

#
# Dev Environment settings
#

include .env

.PHONY: up down stop prune ps shell drush logs help

default: up

#
# Dev Operations
#
up: ##@docker Start containers and display status.
	@echo "Starting up containers for $(PROJECT_NAME)..."
	docker-compose pull
	docker-compose up -d --remove-orphans
	docker-compose ps

down: stop

stop: ##@docker Stop and remove containers.
	@echo "Stopping containers for $(PROJECT_NAME)..."
	@docker-compose stop

clean: ##@docker Remove containers and other files created during install.
	make prune
	rm .env

prune: ##@docker Remove containers for project.
	@echo "Removing containers for $(PROJECT_NAME)..."
	@docker-compose down -v

ps: ##@docker List containers.
	@docker ps --filter name='$(PROJECT_NAME)*'

shell: ##@docker Shell into the container. Specify container name.
	docker exec -ti -e COLUMNS=$(shell tput cols) -e LINES=$(shell tput lines) $(shell docker ps --filter name='$(PROJECT_NAME)_php' --format "{{ .ID }}") sh

logs: ##@docker Display log.
	@docker-compose logs -f $(filter-out $@,$(MAKECMDGOALS))

#
# Dev Environment build operations
#
install: ##@dev-environment Configure development environment.
	make down
	make up
	@echo "Pulling database for $(PROJECT_NAME)..."
	make import-db

import-db: ##@dev-environment Import locally cached copy of `database.sql` to project dir.
	docker-compose exec mongo mongoexport -h ds249017.mlab.com:49017 -d self-care-tasks -c tasks -u $(MONGO_PROD_USERNAME) -p $(MONGO_PROD_PASSWORD) -o export.json
	docker-compose exec mongo mongoimport --db $(MONGO_LOCAL_DATABASE) -u $(MONGO_LOCAL_USERNAME) -p $(MONGO_LOCAL_PASSWORD) --collection tasks --drop --file export.json

npm-install: ##theme Installs npm dependencies
	docker-compose exec node 'npm install'


# https://stackoverflow.com/a/6273809/1826109
%:
	@: