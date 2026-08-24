.PHONY: help install build serve clean watch production deploy test lint

# Run Ruby commands through the asdf-managed Ruby (3.3.5, see .tool-versions)
# instead of relying on shell shims, which may not be on PATH (e.g. non-login
# shells, or another Ruby manager like rbenv taking priority). Falls back to
# plain `bundle` where asdf isn't installed (e.g. CI, which sets up Ruby
# directly — see .github/workflows/jekyll.yml).
HAS_ASDF := $(shell command -v asdf >/dev/null 2>&1 && echo 1)

ifeq ($(HAS_ASDF),1)
BUNDLE = asdf exec bundle
else
BUNDLE = bundle
endif

# Baserow CMS environment variables (only needed once baserow.enabled is true in _config.yml).
# Any *_TABLE var left unset in .env just falls back to the matching local
# Jekyll collection (see _config.yml `collections:`) — no build breakage.
BASEROW_ENV_KEYS = BASEROW_TOKEN BASEROW_API_URL \
	BASEROW_LOCATIONS_TABLE BASEROW_PEOPLE_TABLE \
	BASEROW_BIERES_TABLE BASEROW_EVENEMENTS_TABLE BASEROW_ASSOCIATIONS_TABLE \
	BASEROW_QUARTIER_EVENEMENTS_TABLE
ENV_VARS = $(foreach key,$(BASEROW_ENV_KEYS),$(key)=$(shell cat .env 2>/dev/null | grep "^$(key)=" | cut -d '=' -f2))

help: ## Show this help
	@echo "Available commands for the Houblons Nous Jekyll site:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install all dependencies (Ruby + Node.js)
ifeq ($(HAS_ASDF),1)
	asdf install
endif
	$(BUNDLE) install
	bun install

build: ## Build the site in development mode
	@$(ENV_VARS) $(BUNDLE) exec jekyll build

serve: ## Start the dev server with live reload on http://localhost:4001
	@$(ENV_VARS) $(BUNDLE) exec jekyll serve --config _config.yml,_config.dev.yml

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

baserow-sync: ## Rebuild the site, pulling fresh content from Baserow
	@$(ENV_VARS) $(BUNDLE) exec jekyll build --config _config.yml,_config_prod.yml
