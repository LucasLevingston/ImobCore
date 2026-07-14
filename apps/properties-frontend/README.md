# properties-frontend

Micro Frontend de imóveis — Next.js (App Router).

**Status:** aguardando implementação (Fase 5 do roadmap). Ver `/README.md` na raiz do monorepo e `/docs/ARCHITECTURE.md`.

## Responsabilidades (quando implementado)

- Dashboard com métricas (quantidade de imóveis, vendidos, alugados, disponíveis, preço médio, distribuição por cidade/bairro)
- Listagem, cadastro, edição, exclusão, busca, filtros e paginação de imóveis
- Detalhes do imóvel
- Consome exclusivamente `properties-service`
- Sem lógica de autenticação própria — consome `Header`/`AuthStatus`/`UserMenu` de `auth-frontend` via Module Federation
- Redireciona para `auth-frontend` se usuário não autenticado
