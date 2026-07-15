# Arquitetura — Plataforma SaaS para Imobiliárias (Auth & Property Management)

> Documento vivo. Atualizado a cada fase do roadmap. Ver status de implementação em `/README.md`.

---

## 00. Histórico de decisão — pivot de domínio

O projeto começou como demo genérica de "produtos" (Fase 0/1) e foi redirecionado pra um **SaaS de gestão de imóveis pra imobiliárias** antes da Fase 4/5 começarem. Nada do domínio `Product` chegou a ser implementado — só existia em placeholders (`package.json`/`README`) e neste documento. O pivot foi, portanto, um rename de planejamento (`products-frontend`→`properties-frontend`, `products-service`→`properties-service`, `postgres-products`→`postgres-properties`), não uma migração de dados reais. `auth-service` (em implementação) e `packages/ui` (concluído) são agnósticos de domínio e não foram afetados.

---

## 01. Objetivo do projeto

Construir uma plataforma SaaS de referência para **imobiliárias** — gestão de imóveis (cadastro, busca, filtros, dashboard) — demonstrando, em código real e testado, como compor uma aplicação usando **Micro Frontends** (Next.js + Module Federation) e **Microservices** (Fastify + Prisma), com dois domínios de negócio isolados — **autenticação** e **imóveis** — comunicando-se por contratos explícitos (HTTP + JWT no backend, Module Federation + eventos no frontend), sem nunca compartilhar banco de dados ou lógica de negócio entre domínios.

Serve como baseline de engenharia para: Clean Architecture, SOLID, TDD com cobertura mínima de 95%, Repository Pattern, Dependency Injection e isolamento real de deploy entre partes do sistema. A arquitetura do `properties-service` já nasce preparada (contratos/interfaces, sem implementação) para integrações futuras de IA — recomendação de imóveis, geração de descrição — ver seção 10.

**Não-objetivos (por enquanto):** não implementa IA de fato (só os contratos/abstrações); não cobre pagamento, contrato digital ou assinatura eletrônica; não é um CRM completo de leads.

---

## 02. Requisitos funcionais

### Auth (auth-frontend + auth-service)

| #    | Requisito                                                                                       |
| ---- | ----------------------------------------------------------------------------------------------- |
| RF01 | Usuário se cadastra com nome, email e senha                                                     |
| RF02 | Usuário faz login com email e senha, recebe access token + refresh token                        |
| RF03 | Access token expira em 15 min; sistema renova via refresh token automaticamente, sem novo login |
| RF04 | Usuário faz logout — refresh token correspondente é invalidado no banco                         |
| RF05 | Usuário visualiza seu próprio perfil (nome, email, data de criação)                             |
| RF06 | Senhas nunca trafegam nem são persistidas em texto puro (hash bcrypt)                           |

### Properties (properties-frontend + properties-service)

| #    | Requisito                                                                                                                                     |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| RF07 | Usuário autenticado lista imóveis, paginados e ordenáveis                                                                                     |
| RF08 | Usuário busca imóveis por título/descrição/endereço                                                                                           |
| RF09 | Usuário filtra imóveis por cidade, bairro, tipo, preço, quartos, banheiros, vagas de garagem, área, status, aceita financiamento, aceita pets |
| RF10 | Usuário autenticado cadastra novo imóvel (todos os campos da entidade `Property` — ver seção 10)                                              |
| RF11 | Usuário autenticado edita imóvel existente                                                                                                    |
| RF12 | Usuário autenticado exclui imóvel                                                                                                             |
| RF13 | Usuário visualiza detalhes de um imóvel específico                                                                                            |
| RF14 | Usuário não autenticado é redirecionado para `auth-frontend` ao tentar acessar qualquer rota de imóveis                                       |
| RF15 | Dashboard exibe métricas: quantidade total, vendidos, alugados, disponíveis, preço médio, distribuição por cidade e por bairro                |

### Cross-cutting

| #    | Requisito                                                                                                                                             |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| RF16 | `properties-frontend` exibe estado de autenticação (nome do usuário, avatar, logout) sem reimplementar lógica de auth — consome via Module Federation |
| RF17 | Tema (light/dark) e componentes visuais são consistentes entre os dois frontends                                                                      |

---

## 03. Requisitos não funcionais

| #     | Requisito                                                                                         | Como é atendido                                                                                   |
| ----- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| RNF01 | Cobertura de testes ≥ 95% em toda camada de aplicação/domínio                                     | Vitest (frontend) + Vitest/Supertest (backend), threshold enforced em CI                          |
| RNF02 | Zero uso de `any` em TypeScript                                                                   | `strict: true` + `@typescript-eslint/no-explicit-any: error`                                      |
| RNF03 | Cada serviço/app deployável de forma 100% independente                                            | `package.json` próprio, `Dockerfile` próprio, banco próprio                                       |
| RNF04 | Nenhum serviço acessa banco de outro serviço                                                      | Bancos físicos separados (`auth_db`, `properties_db`), sem VPN/rede compartilhada de DB           |
| RNF05 | Autenticação stateless entre serviços (sem chamada síncrona serviço-a-serviço para validar token) | JWT HS256 com segredo compartilhado via env var — cada serviço valida assinatura localmente       |
| RNF06 | Tempo de resposta p95 < 300ms em rotas de leitura sob carga local                                 | Índices Prisma nos campos de busca/filtro, paginação obrigatória                                  |
| RNF07 | Acessibilidade (a11y) nos componentes de UI                                                       | Radix UI (primitivas acessíveis) + `eslint-plugin-jsx-a11y`                                       |
| RNF08 | Observabilidade mínima (logs estruturados, health checks)                                         | Pino nos serviços Fastify, rotas `/health` e `/health/ready`                                      |
| RNF09 | Repositório auditável — histórico de commits semântico e rastreável                               | Conventional Commits + GitFlow, validado via `commitlint` no `commit-msg` hook                    |
| RNF10 | Segurança de senha e sessão seguindo boas práticas OWASP                                          | bcrypt (cost 10+), cookies `httpOnly`/`Secure`/`SameSite`, refresh token rotacionável e revogável |

---

## 04. Arquitetura geral

```mermaid
graph TB
    subgraph Client["Navegador"]
        U["Usuário"]
    end

    subgraph Frontends["Micro Frontends"]
        AF["auth-frontend :3000<br/>Next.js App Router"]
        PF["properties-frontend :3003<br/>Next.js App Router (host)"]
    end

    subgraph Shared["Compartilhado (build-time)"]
        UI["packages/ui<br/>design system"]
    end

    GW["api-gateway :3004<br/>Fastify — proxy, CORS, rate-limit"]

    subgraph Services["Microservices (rede interna — sem porta pública em produção)"]
        AS["auth-service :3001<br/>Fastify"]
        PS["properties-service :3002<br/>Fastify"]
    end

    subgraph DB["Bancos (isolados)"]
        DBA[("postgres-auth :5433")]
        DBP[("postgres-properties :5434")]
    end

    U --> AF
    U --> PF
    PF -. "Module Federation (runtime)<br/>Header/AuthStatus/UserMenu" .-> AF
    AF -- workspace --> UI
    PF -- workspace --> UI
    AF -- "HTTP + JWT" --> GW
    PF -- "HTTP + JWT" --> GW
    GW -- "proxy /api/auth/*" --> AS
    GW -- "proxy /api/properties/*" --> PS
    AS --> DBA
    PS --> DBP
    AS -. "JWT_SECRET (só verificação de assinatura)" .-> PS
```

**Princípios que governam toda decisão de arquitetura neste projeto:**

1. **Isolamento de domínio primeiro.** Auth e Properties nunca importam código um do outro, nunca compartilham banco. A única ponte é HTTP (backend) e Module Federation/eventos (frontend).
2. **Dependência aponta para dentro.** Em cada serviço/app, `domain` não conhece `infra`; `infra` implementa interfaces definidas em `domain`. Ver seção 13.
3. **Testável por construção.** Toda regra de negócio é isolável de I/O (banco, HTTP, filesystem) via injeção de dependência — permite testar sem mocks frágeis de framework.
4. **Cada camada só resolve um tipo de problema.** Zod valida forma; use case decide regra de negócio; repository decide acesso a dado. Nunca misturar.
5. **Um único ponto de entrada público pros services.** `auth-frontend`/`properties-frontend` nunca chamam `auth-service`/`properties-service` direto — sempre via `api-gateway` (seção 04a). Autenticação (verificação de JWT) continua descentralizada em cada service — o gateway não decide quem está autenticado, só encaminha.

### Fluxo de autenticação (login → refresh → logout)

```mermaid
sequenceDiagram
    participant U as Usuário
    participant AF as auth-frontend
    participant GW as api-gateway
    participant AS as auth-service
    participant DB as postgres-auth

    U->>AF: preenche login (email, senha)
    AF->>GW: POST /api/auth/login
    GW->>AS: proxy → POST /login (prefixo /api/auth removido)
    AS->>DB: findByEmail + compara hash bcrypt
    DB-->>AS: User
    AS->>DB: cria RefreshToken (hash)
    AS-->>GW: 200 { accessToken } + Set-Cookie refreshToken (httpOnly)
    GW-->>AF: repassa resposta sem alterar corpo/cookie
    AF->>AF: guarda accessToken em memória (nunca localStorage)

    Note over AF,AS: 15 min depois — access token expira
    AF->>GW: POST /api/auth/refresh (cookie refreshToken)
    GW->>AS: proxy → POST /refresh
    AS->>DB: valida hash + revokedAt IS NULL
    AS->>DB: revoga token antigo, cria novo (rotation)
    AS-->>GW: 200 { accessToken } + Set-Cookie novo refreshToken
    GW-->>AF: repassa resposta

    U->>AF: clica logout
    AF->>GW: POST /api/auth/logout (accessToken + cookie)
    GW->>AS: proxy → POST /logout
    AS->>DB: revoga RefreshToken atual
    AS-->>GW: 204
    GW-->>AF: repassa resposta
    AF->>AF: limpa accessToken da memória
```

### Fluxo Micro Frontends (Module Federation em runtime)

```mermaid
sequenceDiagram
    participant U as Usuário
    participant PF as properties-frontend (host)
    participant AF as auth-frontend (remote)
    participant GW as api-gateway
    participant PS as properties-service

    U->>PF: acessa /properties
    PF->>PF: SSR da página (Server Components)
    PF->>AF: dynamic import remoteEntry.js (client-side, ssr:false — direto no auth-frontend, não passa pelo gateway)
    AF-->>PF: chunk de Header/AuthStatus/UserMenu
    PF->>PF: renderiza host + componentes federados na mesma árvore React
    PF->>GW: GET /api/properties (com accessToken)
    GW->>PS: proxy → GET /properties (prefixo /api removido)
    PS-->>GW: lista paginada de imóveis
    GW-->>PF: repassa resposta

    alt auth-frontend fora do ar
        PF->>AF: falha ao carregar remoteEntry.js
        PF->>PF: ErrorBoundary → fallback local mínimo (sem quebrar a página)
    end
```

Nota: o `remoteEntry.js` do Module Federation é buscado **direto no `auth-frontend`** (ativo estático servido pela própria origem dele) — não passa pelo `api-gateway`, que só encaminha tráfego de API (`/api/*`), não assets de build.

### Fluxo Microservices (isolamento de validação JWT)

```mermaid
sequenceDiagram
    participant PF as properties-frontend
    participant GW as api-gateway
    participant PS as properties-service
    participant AS as auth-service

    PF->>GW: POST /api/properties (Authorization: Bearer accessToken)
    GW->>GW: CORS + rate-limit — repassa header Authorization sem abrir o token
    GW->>PS: proxy → POST /properties
    PS->>PS: middleware onRequest decodifica JWT com JWT_SECRET local
    Note over GW,AS: gateway não tem JWT_SECRET — não valida, só transporta.<br/>PS não chama AS por rede — validação 100% local em cada service.
    alt assinatura válida e não expirado
        PS->>PS: request.user = { id, email }
        PS->>PS: use case cria imóvel
        PS-->>GW: 201 Property
    else assinatura inválida/expirado
        PS-->>GW: 401 Unauthorized
    end
    GW-->>PF: repassa resposta
```

---

## 04a. API Gateway

Novo serviço `services/api-gateway` (Fastify) — **único ponto de entrada HTTP público** pra `auth-service` e `properties-service`. `auth-frontend` e `properties-frontend` nunca chamam esses services direto — só o gateway (princípio 5 da seção 04). Em produção, `auth-service`/`properties-service` não publicam porta pro host, só ficam acessíveis na rede interna do Docker (seção 20); em dev local a porta continua exposta pra debug direto via curl/Insomnia, nunca usada pelo código do frontend.

### Responsabilidade: proxy + cross-cutting, nunca regra de negócio

| Rota (gateway)                     | Encaminha para                                      | Prefixo removido antes do proxy                            |
| ---------------------------------- | --------------------------------------------------- | ---------------------------------------------------------- |
| `/api/auth/*`                      | `auth-service` (env `AUTH_SERVICE_URL`)             | `/api/auth` → ex.: `/api/auth/login` vira `/login`         |
| `/api/properties/*`                | `properties-service` (env `PROPERTIES_SERVICE_URL`) | `/api` → ex.: `/api/properties/123` vira `/properties/123` |
| `GET /health`, `GET /health/ready` | resolvido localmente no gateway                     | — (readiness verifica se os dois services respondem)       |

Implementação: `@fastify/http-proxy` (plugin oficial do ecossistema Fastify), registrado uma vez por service upstream. Sem lógica própria de domínio — se um dia o gateway precisar de uma regra de negócio, é sinal de que ela pertence a um dos services, não a ele (viola SRP, seção 14).

### O que passa a ser centralizado aqui (e o que continua descentralizado)

| Concern            | Antes (por service)                   | Agora                                                                                                                      |
| ------------------ | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| CORS               | `@fastify/cors` em cada service       | Só no gateway — services internos não recebem mais tráfego de browser direto, não precisam validar `Origin`                |
| Rate limiting      | `@fastify/rate-limit` em cada service | Só no gateway, por IP + rota — um único lugar pra ajustar limite global (seção 18)                                         |
| `x-request-id`     | Gerado em cada service se ausente     | Gerado no gateway (primeiro ponto de contato) se ausente, propagado até o banco (seção 25)                                 |
| Verificação de JWT | Local em cada service                 | **Continua local em cada service** — o gateway repassa o header `Authorization` sem abrir o token, não guarda `JWT_SECRET` |

**Por que o gateway não valida JWT:** se ele validasse e os services confiassem cegamente nisso, um bypass de rede (acesso direto a um service, erro de config) viraria falha de autenticação silenciosa. Mantendo RNF05 (seção 03) intacto — cada service segue sendo a fonte da verdade da própria autorização; o gateway é só transporte, nunca decisor.

### Docker

`services/api-gateway/Dockerfile` segue o mesmo shape multi-stage da seção 19. É o único serviço dessa camada com porta publicada no host em produção (`API_GATEWAY_PORT`, default `3004`).

---

## 05. Micro Frontends

Dois apps Next.js (App Router) totalmente independentes, cada um com seu próprio `package.json`, build, deploy e porta:

| App                   | Porta | Domínio                                                                   | Não pode conter                                                        |
| --------------------- | ----- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `auth-frontend`       | 3000  | login, cadastro, logout, refresh, perfil                                  | lógica de imóveis                                                      |
| `properties-frontend` | 3003  | dashboard, listagem, CRUD, busca, filtros, paginação, detalhes de imóveis | lógica de autenticação (exceto checar/redirecionar se não autenticado) |

**Regra de fronteira:** `properties-frontend` sabe que existe "um usuário autenticado ou não" — mas não sabe _como_ login funciona. Essa fronteira é o contrato exposto por Module Federation (seção 06) + a API pública do `auth-service` (seção 09).

Cada MFE segue a estrutura feature-based descrita em `references/architecture.md` da skill: `features/<domínio>/<subfeature>/{components,hooks,services,schemas,types}` com `index.ts` de contrato público.

---

## 06. Module Federation (Webpack 5)

> **⚠️ Atualização (Fase 3):** `@module-federation/nextjs-mf` recusa **categoricamente** qualquer projeto com App Router — checagem hardcoded na própria lib (`"App Directory is not supported by nextjs-mf... do not open git issues about this"`), sem flag de bypass, sem depender de versão. Isso trava o `next dev`/`next build` inteiro, não só a federação. A exposição via webpack foi **adiada pra Fase 6** (decisão do usuário) — os componentes `Header`/`AuthStatus`/`UserMenu` já existem e são testados em `src/components/federation/` de `auth-frontend`, só a config do `next.config.js` foi removida por ora. O conteúdo abaixo descreve a **intenção original**; o mecanismo real será decidido na Fase 6 entre: (a) `ModuleFederationPlugin` cru via `@module-federation/enhanced/webpack` (bypassa o wrapper que tem o bloqueio, mais baixo nível, sem as conveniências de SSR/path-rewrite automáticas do `nextjs-mf`), ou (b) outra estratégia de composição runtime. Decisão fica pra quando `properties-frontend` (o host) existir de verdade pra testar contra.

**Biblioteca (intenção original, pendente confirmação na Fase 6):** `@module-federation/nextjs-mf` (Webpack 5 `ModuleFederationPlugin` sob o capô, adaptado pro build do Next.js).

**Topologia decidida (Fase 0):** federação direta, sem app "shell". `properties-frontend` é **host**; `auth-frontend` é **remote**.

```js
// apps/auth-frontend/next.config.js — expõe
new NextFederationPlugin({
  name: 'authFrontend',
  filename: 'static/chunks/remoteEntry.js',
  exposes: {
    './Header': './src/components/Header',
    './AuthStatus': './src/components/AuthStatus',
    './UserMenu': './src/components/UserMenu',
  },
  shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
})
```

```js
// apps/properties-frontend/next.config.js — consome
new NextFederationPlugin({
  name: 'propertiesFrontend',
  remotes: {
    authFrontend: `authFrontend@${process.env.NEXT_PUBLIC_AUTH_FRONTEND_URL}/_next/static/chunks/remoteEntry.js`,
  },
  shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
})
```

**Regras obrigatórias:**

- Só componentes `"use client"` são expostos. **Rotas de página nunca são federadas** — RSC (React Server Components) não federa de forma estável entre apps Next.js independentes; federar página quebraria streaming/SSR do host.
- Componentes remotos são importados via `dynamic(() => import('authFrontend/Header'), { ssr: false })` — nunca `ssr: true` num remote (o remote não está disponível durante o build do host).
- `auth-frontend` precisa estar rodando (dev) ou deployado (prod) para `properties-frontend` funcionar plenamente — em caso de falha ao carregar o remote, `properties-frontend` cai num fallback local mínimo (ver `ErrorBoundary` em torno do `dynamic import`).
- `react`/`react-dom` são `singleton: true` — nunca duas cópias de React na mesma página (quebraria hooks).

---

## 07. Shared Packages

| Pacote                                      | O que compartilha                                                                                 | Mecanismo                 | Quando muda                                                                     |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------- |
| `packages/ui`                               | Primitivas visuais estáticas (Button, Input, Card, Modal, Toast, Loading, Error, Layout, Sidebar) | npm workspace, build-time | Só quando o pacote é republicado/reinstalado — não em runtime                   |
| Module Federation exposes (`auth-frontend`) | `Header`, `AuthStatus`, `UserMenu` — componentes com **estado vivo** de sessão                    | Webpack remote, runtime   | A cada deploy do `auth-frontend`, sem precisar redeployar `properties-frontend` |

**Por que os dois mecanismos coexistem:** um Design System não muda por usuário logado — é seguro compartilhar em build-time. Já o estado "quem está logado agora" só existe no domínio de auth em runtime — só faz sentido via um remote que o dono do domínio publica e controla.

`packages/ui` não tem build step próprio (Fase 1) — exporta `src/` direto; apps consumidores usam `transpilePackages: ['@microfrontends/ui']` no `next.config.js`.

---

## 08. Design System

Base: **shadcn/ui** (componentes copiados/customizáveis, não pacote fechado) + **Radix UI** (acessibilidade) + **class-variance-authority** (variantes tipadas) + Tailwind com CSS variables de tema (light/dark).

Componentes obrigatórios em `packages/ui` (ver seção 07): `Button`, `Input`, `Card`, `Modal`, `Toast`, `Loading`, `Error`, `Layout`, `Header`, `Sidebar`.

**Regras:**

- Nunca cor Tailwind hardcoded (`bg-blue-500`) — sempre CSS variable semântica (`bg-primary`).
- Extensão de comportamento via slots/`children`/compound components — nunca props booleanas (`showX`) que ramificam a lógica interna do componente (viola OCP).
- `Sidebar`/`Header` não importam `next/navigation` — recebem `active`/estado via props. Quem decide o que está "ativo" é o app consumidor (mantém o design system framework-agnostic e testável sem mocks de Next.js).

---

## 09. Auth Service

Fastify + Prisma + PostgreSQL (`auth_db`, porta 5433). Dono exclusivo dos dados de identidade. Acessado só via `api-gateway` (seção 04a) — rotas abaixo são as reais do service; do lado de fora, o cliente chama `/api/auth/<rota>`.

### Rotas

| Método | Rota        | Descrição                                                                 | Auth requerida         |
| ------ | ----------- | ------------------------------------------------------------------------- | ---------------------- |
| POST   | `/register` | Cria usuário (hash bcrypt da senha)                                       | Não                    |
| POST   | `/login`    | Autentica, retorna access token (corpo) + refresh token (cookie httpOnly) | Não                    |
| POST   | `/refresh`  | Emite novo access token a partir do refresh token válido                  | Refresh token (cookie) |
| POST   | `/logout`   | Revoga o refresh token atual                                              | Access token           |
| GET    | `/me`       | Retorna perfil do usuário autenticado                                     | Access token           |

### Modelo de dados

```
User          { id, name, email (unique), passwordHash, createdAt, updatedAt }
RefreshToken  { id, token (hash), userId (FK), expiresAt, revokedAt (nullable), createdAt }
```

Refresh token é armazenado como hash (não em texto puro) — mesmo em caso de vazamento de banco, tokens não são diretamente reutilizáveis. Rotação: a cada `/refresh`, o token antigo é revogado e um novo é emitido (refresh token rotation), mitigando replay de token roubado.

---

## 10. Property Service

Fastify + Prisma + PostgreSQL (`properties_db`, porta 5434). Dono exclusivo do catálogo de imóveis. Acessado só via `api-gateway` (seção 04a) — rotas abaixo são as reais do service; do lado de fora, o cliente chama `/api/properties/<rota>`.

### Rotas

| Método | Rota                 | Descrição                                                                 | Auth requerida |
| ------ | -------------------- | ------------------------------------------------------------------------- | -------------- |
| GET    | `/properties`        | Lista paginada e ordenável, com filtros (ver abaixo)                      | Access token   |
| GET    | `/properties/search` | Busca textual (título/descrição/endereço) combinada com os mesmos filtros | Access token   |
| GET    | `/properties/:id`    | Detalhe de um imóvel                                                      | Access token   |
| POST   | `/properties`        | Cria imóvel                                                               | Access token   |
| PUT    | `/properties/:id`    | Atualiza imóvel                                                           | Access token   |
| DELETE | `/properties/:id`    | Remove imóvel                                                             | Access token   |

**Filtros (query params) em `/properties` e `/properties/search`:** `city`, `district`, `type`, `minPrice`/`maxPrice`, `bedrooms`, `bathrooms`, `garageSpaces`, `minArea`/`maxArea`, `status`, `acceptsFinancing`, `acceptsPets`, `page`, `limit`, `sortBy`/`sortOrder`.

### Entidade Property

```
Property {
  id                String   @id
  title             String
  description       String
  type              PropertyType
  status            PropertyStatus
  price             Decimal
  condominiumFee    Decimal?
  iptu              Decimal?
  bedrooms          Int
  bathrooms         Int
  garageSpaces      Int
  area              Decimal          // m² privativos
  lotArea           Decimal?         // m² do terreno (Land/House/Farm)
  floor             Int?
  furnished         Boolean
  acceptsFinancing  Boolean
  acceptsPets       Boolean
  address           String
  number            String
  district          String
  city              String
  state             String
  zipCode           String
  latitude          Decimal?
  longitude         Decimal?
  brokerId          String           // referência solta ao User do auth-service (sem FK — bancos isolados)
  createdAt         DateTime
  updatedAt         DateTime
}

enum PropertyType   { Apartment, House, Land, Commercial, Farm, Studio, Penthouse }
enum PropertyStatus { Available, Reserved, Sold, Rented, Inactive }
```

### Dashboard — métricas agregadas

Endpoint dedicado (`GET /properties/metrics`, detalhado na Fase 4) retorna: quantidade total de imóveis, quantidade por status (vendidos/alugados/disponíveis), preço médio, quantidade agrupada por cidade e por bairro. Calculado via agregação Prisma (`groupBy`/`aggregate`) na camada `infra/repositories` — a regra de "o que é uma métrica" fica no use case (`application/usecases/get-dashboard-metrics`), não no repository.

### Preparação para IA (contratos, sem implementação)

A Fase 4 cria só as **interfaces** abaixo em `properties-service/src/domain/ai/` (DIP — o domínio define o contrato, a implementação concreta vem depois, em fase futura não coberta por este roadmap):

```ts
interface AIProvider {
  isAvailable(): Promise<boolean>
}

interface EmbeddingProvider {
  embed(text: string): Promise<number[]>
}

interface ChatProvider {
  complete(prompt: string): Promise<string>
}

interface PropertyRecommendationProvider {
  recommend(propertyId: string, limit: number): Promise<string[]> // ids de imóveis similares
}

interface DescriptionGeneratorProvider {
  generate(property: Property): Promise<string>
}
```

Nenhum use case da Fase 4 depende dessas interfaces ainda (nenhuma feature de IA é exposta na Fase 4/5) — elas existem só como contrato arquitetural pronto pra uma fase futura de IA plugar uma implementação (ex.: OpenAI, Bedrock) sem tocar em `domain`/`application`.

### Validação de autenticação sem acoplamento a auth-service

`properties-service` **não chama `auth-service` por rede** pra validar token. Um middleware Fastify (`onRequest` hook) decodifica e verifica a assinatura JWT localmente usando `JWT_SECRET` (env var compartilhada entre os dois serviços). Se a assinatura é válida e o token não expirou, a requisição segue com `request.user = { id, email }` no contexto. Isso mantém os dois serviços desacoplados em runtime (nenhum é dependência de disponibilidade do outro para validar sessão).

---

## 11. Banco de dados

**Regra inegociável: um banco físico por serviço, nunca compartilhado.**

| Serviço              | Banco           | Porta (local) | Tabelas                |
| -------------------- | --------------- | ------------- | ---------------------- |
| `auth-service`       | `auth_db`       | 5433          | `User`, `RefreshToken` |
| `properties-service` | `properties_db` | 5434          | `Property`             |

Cada serviço tem sua própria connection string (`AUTH_DATABASE_URL` / `PROPERTIES_DATABASE_URL`), seu próprio container Postgres no `docker-compose.yml`, e seu próprio ciclo de migrations. Não existem foreign keys entre bancos (impossível fisicamente) — a relação `Property.brokerId` (referência ao `User` do `auth-service`) é armazenada como valor solto (UUID), sem FK, validada por contrato de API, não por constraint de banco.

---

## 12. Prisma

Cada serviço tem seu próprio `prisma/schema.prisma`, `prisma/migrations/`, e `prisma/seed.ts`.

**Regra inegociável: regra de negócio nunca importa `@prisma/client` diretamente.** Fluxo obrigatório:

```
Use Case → interface Repository (domain) → implementação Prisma (infra)
```

```ts
// domain/repositories/user-repository.ts — abstração, sem Prisma
export interface UserRepository {
  findByEmail(email: string): Promise<User | null>
  create(data: CreateUserData): Promise<User>
}

// infra/database/prisma/prisma-user-repository.ts — detalhe de implementação
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } })
  }
  async create(data: CreateUserData) {
    return this.prisma.user.create({ data })
  }
}
```

Isso permite testar use cases com um `InMemoryUserRepository` (fake), sem subir Postgres — testes de unidade rápidos e determinísticos. Testes de integração (contra Postgres real via Testcontainers) cobrem só a implementação concreta do repository.

---

## 13. Clean Architecture

Camadas por serviço backend:

```
domain/         → entities, interfaces de repository, regras de negócio puras (sem framework)
application/    → use cases (orquestram domain), DTOs, erros de aplicação
infra/          → implementações concretas: Prisma repositories, HTTP (Fastify controllers/rotas), middlewares
main/           → composition root: server.ts monta tudo (injeção de dependência manual/factory)
```

Regra de dependência: setas sempre apontam pra dentro.

```
infra → application → domain
main  → infra (monta) + application (usa)
```

`domain` nunca importa de `application` ou `infra`. `application` nunca importa `infra` diretamente — recebe implementações via injeção (parâmetro de factory/construtor), respeitando DIP (seção 14).

No frontend, o equivalente é:

```
View (page/componente) → Controller (orquestra estado) → Service (regra de negócio) → Repository (acesso a dados) → API
```

Ver `references/architecture.md` da skill pra exemplos completos de cada camada.

---

## 14. SOLID

Aplicação concreta neste projeto (exemplos completos em `references/architecture.md`):

| Princípio | Onde aparece aqui                                                                                                                           |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **S**RP   | Cada use case faz uma coisa (`RegisterUserUseCase`, `LoginUseCase` — nunca um `AuthUseCase` genérico)                                       |
| **O**CP   | Componentes de UI estendidos via slots/children (`DataTable` com `toolbar`/`emptyState`), nunca props booleanas                             |
| **L**SP   | Qualquer `UserRepository` (Prisma real ou InMemory fake) é intercambiável nos use cases sem alterar comportamento externo                   |
| **I**SP   | Hooks segregados por operação (`useCreateProperty`, `useUpdateProperty` — nunca um hook `usePropertyActions` genérico)                      |
| **D**IP   | Use cases recebem `Repository` por interface no construtor; Fastify controller recebe use case já instanciado (composition root em `main/`) |

---

## 15. TDD obrigatório

Ciclo aplicado a **toda** funcionalidade, sem exceção, em ambos os lados (frontend/backend):

```
1. Escrever teste que descreve o comportamento esperado
2. Rodar — ver falhar (RED) — confirma que o teste testa algo real
3. Implementar o mínimo pra passar (GREEN)
4. Refatorar mantendo os testes verdes
5. Validar cobertura da funcionalidade
```

Nenhum código de produção é escrito sem um teste falhando antes que o justifique. Commits de funcionalidade sempre incluem teste + implementação juntos (ou teste primeiro, em commit separado `test:` seguido de `feat:`).

---

## 16. Estratégia de testes (Frontend e Backend)

### Backend (Vitest + Supertest)

| Camada                             | Tipo de teste | Isolamento                                                                       |
| ---------------------------------- | ------------- | -------------------------------------------------------------------------------- |
| `domain`/`application` (use cases) | Unitário      | `Repository` fake/in-memory, sem banco                                           |
| `infra/repositories`               | Integração    | Postgres real via Testcontainers                                                 |
| `infra/http` (controllers/rotas)   | Integração    | Supertest contra instância Fastify em memória, use cases reais + repository fake |
| `infra/middlewares`                | Unitário      | Request/reply mockados                                                           |

### Frontend (Vitest + Testing Library + MSW)

| Camada                  | Tipo de teste                                   | Isolamento                                                                           |
| ----------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------ |
| Componentes             | Comportamento (render, interação, a11y)         | Testing Library, nunca snapshot puro                                                 |
| Hooks (TanStack Query)  | Comportamento (loading/success/error)           | MSW intercepta toda chamada HTTP — nunca API real, nunca `fetch` mockado manualmente |
| Forms                   | Fluxo completo (preencher → validar → submeter) | `user-event`, MSW                                                                    |
| Features isoladas (MFE) | Contrato público (`index.ts`)                   | Mock de `CustomEvent`/remote, nunca sub-caminho interno de outra feature             |

**Regra absoluta:** nenhum teste, em nenhum dos dois lados, depende de rede real ou serviço real rodando. Backend usa fakes/Testcontainers; frontend usa MSW.

Cobertura mínima: **95%** em `domain`, `application` (backend) e `hooks`/`services` (frontend) — medida por `vitest run --coverage` com `thresholds` configurado (falha o build se cair abaixo).

---

## 17. TanStack Query

Uso obrigatório para **todo** dado remoto no frontend — nunca `fetch`/`axios` direto em `useEffect`.

| Recurso            | Uso neste projeto                                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `QueryClient`      | Uma instância por app (singleton em `lib/query-client.ts`), com `HydrationBoundary` pra SSR                              |
| Custom hooks       | Um hook por operação (`useLogin`, `useProperties`, `useCreateProperty`) — nunca hook genérico                            |
| Mutations          | `useMutation` com `onSuccess` invalidando a query key relacionada                                                        |
| Infinite Query     | Listagem de imóveis usa `useInfiniteQuery` (scroll infinito) como alternativa à paginação numerada, conforme UX da tela  |
| Optimistic Updates | Edição/exclusão de imóvel atualiza o cache local antes da resposta do servidor, com rollback em `onError`                |
| Invalidation       | Toda mutation de escrita invalida a query key de listagem correspondente                                                 |
| Retry              | 3 tentativas com backoff exponencial em queries de leitura; mutations nunca fazem retry automático (evita duplicar POST) |
| Suspense           | Listagens críticas usam `useSuspenseQuery` + `<Suspense>` com skeleton                                                   |

Camada de acesso HTTP nunca fica dentro do componente nem do hook — fica em `services/*.service.ts`, injetada no hook (DIP).

---

## 18. Segurança

| Ameaça                                          | Mitigação                                                                                                                                                           |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Senha em texto puro                             | bcrypt, salt rounds ≥ 10, nunca logada nem retornada em nenhuma resposta de API                                                                                     |
| Roubo de access token via XSS                   | Access token de curta duração (15 min), mantido em memória no frontend (não em `localStorage`)                                                                      |
| Roubo de refresh token                          | Cookie `httpOnly` + `Secure` + `SameSite=Strict`, hash no banco, rotação a cada uso                                                                                 |
| Replay de refresh token revogado                | Verificação de `revokedAt` no banco antes de emitir novo access token                                                                                               |
| CSRF                                            | `SameSite=Strict` nos cookies + verificação de origem (`Origin`/`Referer`) em rotas mutáveis                                                                        |
| Força bruta em `/login`                         | Rate limiting (`@fastify/rate-limit`) centralizado no `api-gateway`, por IP + rota (seção 04a)                                                                      |
| Enumeração de usuário                           | Mensagens de erro genéricas em login/registro (não revelar se o email existe)                                                                                       |
| Injeção SQL                                     | Prisma (queries parametrizadas por construção) — nunca query raw concatenando input do usuário                                                                      |
| Validação de entrada ausente                    | Zod em toda fronteira: body/query/params de rota, variáveis de ambiente, formulários                                                                                |
| Segredos versionados                            | `.env` no `.gitignore`; `.env.example` documenta chaves sem valores reais                                                                                           |
| Cabeçalhos HTTP inseguros                       | `@fastify/helmet` no `api-gateway` e em ambos os serviços (defesa em profundidade)                                                                                  |
| CORS aberto                                     | `@fastify/cors` centralizado no `api-gateway`, com origem explícita (só as URLs dos frontends conhecidas) — services internos não recebem tráfego direto de browser |
| Service exposto direto, sem passar pelo gateway | Em produção, `auth-service`/`properties-service` não publicam porta pro host — só rede interna Docker (seção 04a/20)                                                |

---

## 19. Docker

Cada um dos 5 projetos (`auth-frontend`, `properties-frontend`, `auth-service`, `properties-service`, `api-gateway`) tem seu próprio `Dockerfile` multi-stage (`deps` → `build` → `runtime`), imagem final mínima (`node:20-alpine`), usuário non-root, e `HEALTHCHECK` apontando pra rota de health do próprio app/serviço.

Exemplo de shape (detalhado por serviço na fase de implementação correspondente):

```dockerfile
FROM node:20-alpine AS deps
# instala deps de produção do workspace específico

FROM node:20-alpine AS build
# build (tsc / next build)

FROM node:20-alpine AS runtime
USER node
HEALTHCHECK CMD wget -qO- http://localhost:$PORT/health || exit 1
CMD ["node", "dist/main/server.js"]
```

---

## 20. Docker Compose

`docker-compose.yml` na raiz orquestra o stack completo: `postgres-auth`, `postgres-properties`, `auth-service`, `properties-service`, `api-gateway`, `auth-frontend`, `properties-frontend`, ligados por uma rede Docker interna, com `depends_on` + `condition: service_healthy` garantindo ordem de subida (bancos → `auth-service`/`properties-service` → `api-gateway` → frontends). Só `api-gateway` e os frontends publicam porta pro host (`ports:`); `auth-service`/`properties-service` ficam só em `expose:` (visíveis na rede interna, não no host) — reforça a regra da seção 04a de que ninguém fora do gateway fala com eles direto. Skeleton atual (Fase 0) só tem os dois bancos; os demais serviços entram nas Fases 2–6, cada um adicionado + validado (`docker compose up`) na fase em que é implementado.

---

## 21. CI/CD

Pipeline (GitHub Actions, um workflow por tipo de check, disparado em PR para `develop`/`main`):

| Job                                    | O que roda                                                       | Bloqueia merge se falhar |
| -------------------------------------- | ---------------------------------------------------------------- | ------------------------ |
| `lint`                                 | ESLint + Prettier check em todos os workspaces alterados         | Sim                      |
| `typecheck`                            | `tsc --noEmit` em todos os workspaces alterados                  | Sim                      |
| `test`                                 | Vitest (frontend) + Vitest/Supertest (backend), com `--coverage` | Sim                      |
| `coverage-gate`                        | Falha se cobertura de algum workspace < 95%                      | Sim                      |
| `build`                                | Build de produção de cada app/serviço alterado                   | Sim                      |
| `docker-build` (só em push pra `main`) | Build das imagens Docker de cada projeto                         | Sim                      |

Estratégia de monorepo no CI: jobs rodam só nos workspaces afetados pelo diff (evita rebuildar tudo a cada PR pequeno) — detalhado na Fase 6/7 quando o pipeline é escrito.

---

## 22. Git Flow

Branches permanentes: `main` (produção, tags SemVer) e `develop` (integração). Trabalho sempre em `feature/<nome>`, `release/<versão>` ou `hotfix/<descrição>`, nunca commit direto em `main`/`develop`. Fluxo completo, comandos exatos e regras de merge `--no-ff` documentados em `references/git.md` da skill — seguido à risca neste projeto (ver histórico: `main` iniciado com commit vazio, `develop` recebe o scaffold real via merge de feature branches).

---

## 23. Conventional Commits

Formato obrigatório, validado pelo hook `commit-msg` (`commitlint` + `@commitlint/config-conventional`):

```
<tipo>(<escopo>): <descrição no imperativo, minúsculas, sem ponto final>
```

Tipos usados neste projeto: `feat`, `fix`, `chore`, `refactor`, `test`, `docs`, `style`, `perf`, `ci`. Exemplos reais já no histórico: `chore: scaffold monorepo with npm workspaces and tooling`.

---

## 24. ESLint / Prettier / Husky

- **ESLint:** config base compartilhada (`.eslintrc.base.json` na raiz) com `@typescript-eslint/recommended` + `recommended-requiring-type-checking`, `no-explicit-any: error`. Cada app/pacote estende e adiciona plugins específicos (ex.: `packages/ui` adiciona `react`, `react-hooks`, `jsx-a11y`).
- **Prettier:** `.prettierrc` único na raiz (sem ponto e vírgula, aspas simples, trailing comma), aplicado via `lint-staged` no pre-commit.
- **Husky:** `.husky/pre-commit` roda `lint-staged` (Prettier nos arquivos staged); `.husky/commit-msg` roda `commitlint`. Ambos testados e funcionando desde a Fase 0.
- **EditorConfig:** `.editorconfig` na raiz garante LF, UTF-8, indentação de 2 espaços consistente entre editores.

---

## 25. Observabilidade (Pino, OpenTelemetry, Health Checks)

| Item                | Ferramenta                                                                       | Onde                                                                                                                                                                                        |
| ------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Logging estruturado | **Pino** (logger nativo do Fastify)                                              | `auth-service`, `properties-service` — JSON estruturado, nível configurável via `LOG_LEVEL`                                                                                                 |
| Tracing distribuído | **OpenTelemetry** (`@opentelemetry/sdk-node` + auto-instrumentation HTTP/Prisma) | Ambos os serviços — exporta pra console em dev, OTLP collector em produção (endpoint configurável via env)                                                                                  |
| Health checks       | Rotas dedicadas                                                                  | `GET /health` (liveness — processo de pé) e `GET /health/ready` (readiness — banco acessível) em cada serviço, usadas pelo `HEALTHCHECK` do Docker e pelo `depends_on.condition` do compose |

Correlação: `api-gateway` gera `x-request-id` no primeiro ponto de contato (se o cliente não mandou um), propaga em todo o resto da cadeia (`auth-service`/`properties-service`), logado em todo log daquela requisição e incluído no trace — permite seguir uma requisição do frontend até o banco, mesmo passando por dois processos Fastify diferentes.

---

## 26. Logging

Regras práticas:

- Nunca `console.log` em código de produção (`no-console` no ESLint permite só `warn`/`error`).
- Backend: Pino via `request.log` do Fastify (já inclui `request-id`, método, rota, status, duração).
- Nunca logar dado sensível: senha, token (mesmo hash), cookie, header `Authorization`. Sanitização via `redact` do Pino nesses campos.
- Nível por ambiente: `debug` em dev, `info` em produção; `error` sempre com stack trace estruturado (nunca `String(error)` perdendo contexto).
- Frontend: erros de mutation/query logados via `onError` do TanStack Query pra um serviço de monitoramento (a integrar na Fase 6/7) — nunca só `console.error` silencioso.

---

## 27. Tratamento de erros

### Backend

Hierarquia de erros de aplicação (`application/errors/`), cada um mapeado a um status HTTP no error handler global do Fastify:

```
AppError (base, abstrata)
├── ValidationError        → 400
├── UnauthorizedError       → 401
├── ForbiddenError          → 403
├── NotFoundError           → 404
├── ConflictError           → 409  (ex.: email já cadastrado)
└── InternalError           → 500  (nunca expõe stack/detalhes internos na resposta)
```

Use cases lançam esses erros; nunca lançam `Error` genérico. Controller nunca faz `try/catch` de regra de negócio — delega ao error handler global do Fastify (`setErrorHandler`), que serializa `{ statusCode, error, message }` de forma consistente.

### Frontend

- Erros de query/mutation nunca aparecem como tela branca — `error.tsx` (Next.js) por rota + `ErrorBoundary` em componentes críticos.
- Mensagens de erro de API são mapeadas para texto amigável (nunca exibir mensagem crua do backend) via um dicionário de erros por código.
- Falha ao carregar remote do Module Federation (`auth-frontend` fora do ar) tem fallback visual próprio, não quebra a página inteira do `properties-frontend`.

---

## 28. Performance

| Técnica                               | Onde                                                                                                                                        |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Server Components por padrão          | Toda página Next.js que não precisa de interatividade                                                                                       |
| `prefetchQuery` + `HydrationBoundary` | Dados críticos da rota inicial (lista de imóveis, métricas do dashboard, perfil do usuário)                                                 |
| Paginação/Infinite Query              | Nunca carregar lista completa de imóveis de uma vez                                                                                         |
| Índices no banco                      | `Property.city`/`district`/`type`/`status` (filtros), `User.email` (unique + lookup de login), `RefreshToken.tokenHash` (lookup de refresh) |
| `React.memo`/`useMemo`/`useCallback`  | Componentes de lista com muitos itens, callbacks passados como prop pra listas                                                              |
| Connection pooling Prisma             | `connection_limit` configurado por serviço, evita esgotar conexões do Postgres sob carga                                                    |
| Cache HTTP                            | Rotas de leitura pública (nenhuma, neste projeto, já que tudo exige auth) — N/A por ora                                                     |

---

## 29. Deploy

Cada projeto builda e deploya independentemente — não existe "deploy da plataforma" como unidade única.

1. **Serviços (`auth-service`, `properties-service`):** imagem Docker publicada em registry, deployada em qualquer orquestrador (Docker Compose em staging local; Kubernetes/ECS/Cloud Run em produção — não prescrito neste projeto, documentado como próximo passo na Fase 6/7). Nunca exposto publicamente — só acessível pelo `api-gateway` na rede interna.
2. **`api-gateway`:** mesmo tipo de imagem, é o único backend com endpoint público. URL pública dele é o que os frontends configuram (`NEXT_PUBLIC_API_GATEWAY_URL`), nunca a URL de um service individual.
3. **Frontends (`auth-frontend`, `properties-frontend`):** build Next.js standalone, containerizado da mesma forma, ou deploy em plataforma serverless compatível (Vercel) — exige atenção especial ao Module Federation (remote precisa de URL pública estável e CORS liberado pro host) — isso é independente do gateway, que só cuida de tráfego `/api/*`.
4. **Migrations de banco:** rodadas via `prisma migrate deploy` como step de deploy do serviço correspondente, antes do container novo receber tráfego (readiness gate).
5. **Ordem seguindo dependência:** bancos → `auth-service`/`properties-service` → `api-gateway` → `auth-frontend` (dono do remote) → `properties-frontend` (consome o remote).

Detalhamento de pipeline de deploy real fica pra Fase 6 (integração) / Fase 7 (documentação final), quando os 4 projetos existirem de fato.

---

## 30. Critérios de aceite

Uma fase do roadmap (seção 31) só é considerada **concluída** quando:

- [ ] Todo comportamento descrito nos requisitos funcionais da fase tem teste automatizado cobrindo golden path + erro + edge case relevante
- [ ] Cobertura da fase ≥ 95% (`vitest run --coverage`)
- [ ] `tsc --noEmit` sem erros
- [ ] `npm run build` do(s) workspace(s) da fase sem erros
- [ ] `npm run lint` sem erros
- [ ] Nenhum `any`, nenhum `TODO`/`FIXME` sem issue associada
- [ ] README do projeto/pacote da fase atualizado (funcionalidades, env vars, como rodar)
- [ ] Fluxo testado manualmente ponta a ponta (quando há UI) — não só teste automatizado
- [ ] Commit(s) da fase seguem Conventional Commits e foram mergeados em `develop` via `feature/*` com `--no-ff`

---

## 31. Roadmap de implementação

```
Fase 0 → Scaffold monorepo + tooling + docker-compose skeleton                    [CONCLUÍDA]
Fase 1 → packages/ui (design system compartilhado)                                [CONCLUÍDA]
Fase 2  → auth-service (backend completo, TDD)                                     [CONCLUÍDA]
Fase 2a → api-gateway (Fastify, proxy + CORS + rate-limit, TDD — seção 04a)          [CONCLUÍDA]
Fase 3  → auth-frontend (MFE completo, TDD — já consome só o api-gateway)          [CONCLUÍDA]
Fase 4  → properties-service (backend completo, TDD — entidade Property, dashboard, contratos de IA) [CONCLUÍDA]
Fase 5  → properties-frontend (MFE completo, TDD — dashboard, listagem, CRUD, busca, filtros)
Fase 6  → Module Federation wiring + docker-compose completo + smoke e2e + CI/CD
Fase 7  → Documentação final consolidada + observabilidade + revisão de segurança
```

Cada fase segue o ciclo descrito na seção 15 (TDD) e só avança pra próxima após validação com o responsável pelo projeto (checkpoint manual, não automático).

---

## 32. Regras para a IA seguir durante o desenvolvimento

1. **Nunca pular etapas.** Antes de codar uma funcionalidade: explicar arquitetura → escrever teste → rodar e ver falhar → implementar → refatorar → validar cobertura.
2. **Nunca usar `any`.** Se o tipo é genuinamente desconhecido, modelar com `unknown` + type guard, ou schema Zod.
3. **Nunca acessar Prisma fora de `infra/repositories`.** Regra de negócio depende de interface, não de implementação.
4. **Nunca fetch em `useEffect`.** Todo dado remoto passa por TanStack Query + camada `services/`.
5. **Nunca misturar responsabilidade.** Um arquivo, uma razão pra mudar (SRP) — componente não valida, service não renderiza, controller não faz query direta.
6. **Nunca testar implementação interna.** Teste observa comportamento (o que o usuário vê/recebe), não estado interno de hook/classe.
7. **Nunca commitar sem passar pela ordem:** tipos → build → testes → README → commit (ver `references/git.md`).
8. **Nunca introduzir acoplamento entre `auth-frontend` e `properties-frontend`** além do contrato explícito de Module Federation definido na seção 06 — nenhum import direto de código interno de um pro outro.
9. **Nunca fazer frontend chamar `auth-service`/`properties-service` direto.** Toda chamada de API passa por `api-gateway` (seção 04a) — `NEXT_PUBLIC_API_GATEWAY_URL`, nunca `NEXT_PUBLIC_AUTH_SERVICE_URL`/`NEXT_PUBLIC_PROPERTIES_SERVICE_URL` num app novo.
10. **Nunca colocar regra de negócio ou verificação de JWT no `api-gateway`.** Ele só faz proxy + CORS + rate-limit; autenticação continua verificada localmente em cada service (RNF05).
11. **Sempre justificar decisão arquitetural não-óbvia** com uma linha de "porquê", não só "o quê" (comentários no código só quando o porquê não é derivável do nome/estrutura).
12. **Sempre atualizar este documento** quando uma decisão de arquitetura mudar durante a implementação de uma fase — este arquivo reflete a arquitetura real, não a intenção inicial.
