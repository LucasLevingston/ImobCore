# properties-service

Microservice de imóveis — Fastify + Prisma + PostgreSQL. Dono exclusivo do catálogo de imóveis. Acessado só via `api-gateway` (nunca direto por frontend) — ver `docs/ARCHITECTURE.md` seção 04a.

**Status:** Fase 4 concluída. 87 testes, 100% cobertura (exceto o repositório Prisma — testes de integração escritos, pendente Docker pra rodar neste ambiente).

## Arquitetura

Clean Architecture: `domain` (entidade `Property`, contrato `PropertyRepository`, contratos de IA sem implementação) → `application` (DTOs Zod, use cases, erros) → `infra` (Fastify HTTP, Prisma) → `main` (composition root).

## Autenticação

Não emite nem verifica sessão por rede — decodifica e valida a assinatura JWT localmente com o mesmo `JWT_SECRET` do `auth-service` (`onRequest` hook em todas as rotas de `/properties/*`). Se `auth-service` cair, `properties-service` continua validando tokens já emitidos normalmente.

## Rotas

Todas exigem `Authorization: Bearer <accessToken>`.

| Método | Rota                  | Descrição                                          |
| ------ | --------------------- | -------------------------------------------------- |
| GET    | `/properties`         | Lista paginada/ordenável com filtros               |
| GET    | `/properties/search`  | Busca textual (`q`) + os mesmos filtros            |
| GET    | `/properties/metrics` | Métricas agregadas do dashboard                    |
| GET    | `/properties/:id`     | Detalhe de um imóvel                               |
| POST   | `/properties`         | Cria imóvel (`brokerId` vem do token, não do body) |
| PUT    | `/properties/:id`     | Atualiza campos parciais                           |
| DELETE | `/properties/:id`     | Remove imóvel                                      |

Filtros (`/properties` e `/properties/search`): `city`, `district`, `type`, `minPrice`/`maxPrice`, `bedrooms`, `bathrooms`, `garageSpaces`, `minArea`/`maxArea`, `status`, `acceptsFinancing`, `acceptsPets`, `page`, `limit`, `sortBy`, `sortOrder`.

## Preparação para IA

`src/domain/ai/` define 5 interfaces (`AIProvider`, `EmbeddingProvider`, `ChatProvider`, `PropertyRecommendationProvider`, `DescriptionGeneratorProvider`) — contrato arquitetural (DIP), sem implementação nem uso nesta fase. Uma fase futura de IA pluga um provider concreto sem tocar em `domain`/`application`.

## Variáveis de ambiente

`PROPERTIES_SERVICE_PORT`, `PROPERTIES_DATABASE_URL`, `JWT_SECRET` (compartilhado com `auth-service` só pra verificação de assinatura).

## Como rodar

```bash
npm run dev --workspace=properties-service
```

## Como testar

```bash
npm run test --workspace=properties-service              # unit (rápido, sem Docker)
npm run test:coverage --workspace=properties-service      # cobertura (mínimo 95%)
npm run test:integration --workspace=properties-service   # repositório Prisma real (precisa Docker — Testcontainers)
```
