.PHONY: help install dev test test-coverage test-integration lint format format-check typecheck build \
	docker-up docker-down docker-build docker-logs docker-ps docker-clean

# Um Makefile na raiz (não um por workspace) — mesmo racional dos scripts
# agregados em package.json (`npm run test --workspaces --if-present`):
# monorepo com um comando único por operação, delegando pros workspaces.

.DEFAULT_GOAL := help

help: ## Lista os comandos disponíveis
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-18s\033[0m %s\n", $$1, $$2}'

install: ## Instala deps de todos os workspaces (postinstall já roda prisma generate)
	npm install

dev: ## Lembrete: cada app/service sobe individualmente, ver README de cada um
	@echo "Rode 'npm run dev --workspace=<nome>' ou 'make docker-up' pra stack completa"

test: ## Testes unitários de todos os workspaces
	npm run test --workspaces --if-present

test-coverage: ## Testes + cobertura de todos os workspaces
	npm run test:coverage --workspaces --if-present

test-integration: ## Testes de integração Prisma (precisa Docker rodando)
	npm run test:integration --workspace=auth-service --if-present
	npm run test:integration --workspace=properties-service --if-present

lint: ## Lint do repo inteiro (Biome + ESLint, comando único na raiz — não por workspace)
	npm run lint

format: ## Formata todo o repo com Biome
	npm run format

format-check: ## Confere formatação sem alterar arquivos
	npm run format:check

typecheck: ## Typecheck de todos os workspaces
	npm run typecheck --workspaces --if-present

build: ## Build de produção de todos os workspaces
	npm run build --workspaces --if-present

docker-up: ## Sobe a stack completa (bancos + services + frontends)
	docker compose up --build -d

docker-down: ## Derruba a stack (mantém os volumes/bancos)
	docker compose down

docker-build: ## Rebuilda as imagens sem subir containers
	docker compose build

docker-logs: ## Segue os logs de todos os containers
	docker compose logs -f

docker-ps: ## Status dos containers da stack
	docker compose ps -a

docker-clean: ## Derruba a stack E remove os volumes (apaga os bancos)
	docker compose down -v
