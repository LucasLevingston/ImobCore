# products-frontend

Micro Frontend de produtos — Next.js (App Router).

**Status:** aguardando implementação (Fase 5 do roadmap). Ver `/README.md` na raiz do monorepo.

## Responsabilidades (quando implementado)

- Listagem, cadastro, edição, exclusão, busca, paginação, detalhes de produtos
- Consome exclusivamente `products-service`
- Sem lógica de autenticação própria — consome `Header`/`AuthStatus`/`UserMenu` de `auth-frontend` via Module Federation
- Redireciona para `auth-frontend` se usuário não autenticado
