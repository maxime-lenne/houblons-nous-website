.PHONY: help install build serve clean watch production deploy test lint

# Notion CMS environment variables (only needed once notion.enabled is true in _config.yml)
ENV_VARS = NOTION_TOKEN=$(shell cat .env 2>/dev/null | grep NOTION_TOKEN | cut -d '=' -f2) \
	NOTION_POSTS_DB=$(shell cat .env 2>/dev/null | grep NOTION_POSTS_DB | cut -d '=' -f2)

help: ## Show this help
	@echo "Available commands for the Houblons Nous Jekyll site:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install all dependencies (Ruby + Node.js)
	asdf install
	asdf reshim
	bundle install
	bun install

build: ## Build the site in development mode
	$(ENV_VARS) bundle exec jekyll build

serve: ## Start the dev server with live reload on http://localhost:4001
	$(ENV_VARS) bundle exec jekyll serve --config _config.yml,_config.dev.yml

clean: ## Remove all generated files
	bundle exec jekyll clean
	rm -rf _site .jekyll-cache .sass-cache

watch: ## Build and watch for changes
	bundle exec jekyll build --watch

production: ## Build for production with optimizations
	bundle exec jekyll build --config _config.yml,_config_prod.yml

test: ## Run the production build as a smoke test
	bundle exec jekyll build --config _config.yml,_config_prod.yml

lint: ## Run project linters (see also `bun run lint`)
	bun run lint

notion-sync: ## Rebuild the site, pulling fresh content from Notion
	$(ENV_VARS) bundle exec jekyll build --config _config.yml,_config_prod.yml
