.PHONY: help install build serve clean watch production deploy test lint

# Run Ruby commands through the asdf-managed Ruby (3.3.5, see .tool-versions)
# instead of relying on shell shims, which may not be on PATH (e.g. non-login
# shells, or another Ruby manager like rbenv taking priority).
BUNDLE = asdf exec bundle

# Notion CMS environment variables (only needed once notion.enabled is true in _config.yml)
ENV_VARS = NOTION_TOKEN=$(shell cat .env 2>/dev/null | grep NOTION_TOKEN | cut -d '=' -f2) \
	NOTION_POSTS_DB=$(shell cat .env 2>/dev/null | grep NOTION_POSTS_DB | cut -d '=' -f2)

help: ## Show this help
	@echo "Available commands for the Houblons Nous Jekyll site:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install all dependencies (Ruby + Node.js)
	asdf install
	$(BUNDLE) install
	bun install

build: ## Build the site in development mode
	$(ENV_VARS) $(BUNDLE) exec jekyll build

serve: ## Start the dev server with live reload on http://localhost:4001
	$(ENV_VARS) $(BUNDLE) exec jekyll serve --config _config.yml,_config.dev.yml

clean: ## Remove all generated files
	$(BUNDLE) exec jekyll clean
	rm -rf _site .jekyll-cache .sass-cache

watch: ## Build and watch for changes
	$(BUNDLE) exec jekyll build --watch

production: ## Build for production with optimizations
	$(BUNDLE) exec jekyll build --config _config.yml,_config_prod.yml

test: ## Run the production build as a smoke test
	$(BUNDLE) exec jekyll build --config _config.yml,_config_prod.yml

lint: ## Run project linters (see also `bun run lint`)
	bun run lint

notion-sync: ## Rebuild the site, pulling fresh content from Notion
	$(ENV_VARS) $(BUNDLE) exec jekyll build --config _config.yml,_config_prod.yml
