# properties-service

Microservice de imóveis — Fastify + Prisma + PostgreSQL.

**Status:** aguardando implementação (Fase 4 do roadmap). Ver `/README.md` na raiz do monorepo e `/docs/ARCHITECTURE.md`.

## Responsabilidades (quando implementado)

- CRUD de imóveis (`Property`), busca, filtros, paginação, ordenação
- Regras de negócio do domínio imobiliário
- Contratos (interfaces, sem implementação) para IA: `AIProvider`, `EmbeddingProvider`, `ChatProvider`, `PropertyRecommendationProvider`, `DescriptionGeneratorProvider`
- Valida JWT emitido pelo `auth-service` (segredo compartilhado via env var — sem chamada de rede entre serviços)
- Banco próprio (`properties_db`) — nunca compartilhado com `auth-service`

## Entidade Property

`id`, `title`, `description`, `type`, `status`, `price`, `condominiumFee`, `iptu`, `bedrooms`, `bathrooms`, `garageSpaces`, `area`, `lotArea`, `floor`, `furnished`, `acceptsFinancing`, `acceptsPets`, `address`, `number`, `district`, `city`, `state`, `zipCode`, `latitude`, `longitude`, `brokerId`, `createdAt`, `updatedAt`.

**Type:** `Apartment | House | Land | Commercial | Farm | Studio | Penthouse`
**Status:** `Available | Reserved | Sold | Rented | Inactive`

## Rotas planejadas

```
GET    /properties
GET    /properties/:id
POST   /properties
PUT    /properties/:id
DELETE /properties/:id
GET    /properties/search
```

Filtros: cidade, bairro, tipo, preço, quartos, banheiros, vagas de garagem, área, status, aceita financiamento, aceita pets.
