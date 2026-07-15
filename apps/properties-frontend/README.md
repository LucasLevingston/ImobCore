# properties-frontend

Micro Frontend de imóveis — Next.js (App Router). Consome exclusivamente o `api-gateway` (nunca `properties-service` direto).

**Status:** Fase 5 concluída. 78 testes, 100% cobertura (exceto `app/`, `mocks/`, `test-utils/`, `types/`).

## Funcionalidades

- Dashboard com métricas (total, por status, preço médio, distribuição por cidade/bairro)
- Listagem paginada com filtros (busca textual, cidade, tipo, status, faixa de preço)
- Cadastro, edição e exclusão (com confirmação) de imóveis
- Detalhe de imóvel

## Autenticação — como funciona (sem UI própria)

Este app não tem login/cadastro — a responsabilidade é 100% do `auth-frontend` (docs seção 05). `properties-frontend` só sabe "há sessão ou não":

1. `middleware.ts` checa a presença do cookie `refreshToken` em **toda** rota. Sem cookie, redireciona (cross-origin) pro `auth-frontend` (`NEXT_PUBLIC_AUTH_FRONTEND_URL`), preservando a URL original em `?redirectTo=`.
2. Com cookie presente, a primeira chamada autenticada (`apiClient`) tenta usar o access token em memória — como este app nunca fez login, o token começa nulo, a chamada recebe 401 e o `apiClient` dispara um refresh silencioso (`POST /api/auth/refresh`, usa o cookie automaticamente). O token resultante fica em memória (Zustand) só pra essa sessão de página.
3. `/api/health` é o único endpoint público (fora do middleware) — usado pelo `HEALTHCHECK` do Docker.

**Limitação conhecida:** igual documentado em `auth-frontend/README.md` — cookies não são escopados por porta, então isso funciona em dev local (`localhost`, portas diferentes). Em produção com domínios diferentes por app, a estratégia de sessão cross-app precisa ser revista.

## Module Federation (adiado — Fase 6)

Não consome `Header`/`AuthStatus`/`UserMenu` de `auth-frontend` ainda — `@module-federation/nextjs-mf` é incompatível com App Router (ver `docs/ARCHITECTURE.md` seção 06). Sem UI de sessão própria neste app por ora (só o redirect do middleware).

## Variáveis de ambiente

`NEXT_PUBLIC_API_GATEWAY_URL`, `NEXT_PUBLIC_AUTH_FRONTEND_URL` — ambas obrigatórias, _baked_ em build-time (convenção Next.js pra env vars `NEXT_PUBLIC_*`).

## Como rodar

```bash
npm run dev --workspace=properties-frontend
```

## Como testar

```bash
npm run test --workspace=properties-frontend
npm run test:coverage --workspace=properties-frontend
```
