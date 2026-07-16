# auth-frontend

Micro Frontend de autenticação — Next.js (App Router).

**Status:** Fase 3 concluída, Module Federation (Fase 6) exposta. Ver `/docs/ARCHITECTURE.md` seções 05, 06 e 09.

## Responsabilidades

- Login, cadastro, logout, refresh token automático, perfil do usuário
- Consome **exclusivamente** `api-gateway` (`NEXT_PUBLIC_API_GATEWAY_URL`) — nunca `auth-service` direto (docs seção 04a)
- Sem lógica de imóveis
- `Header`, `AuthStatus`, `UserMenu` (`src/components/federation/`) expostos via Module Federation (`ModuleFederationPlugin` cru, `@module-federation/enhanced/webpack` — `nextjs-mf` não suporta App Router, ver `docs/ARCHITECTURE.md` seção 06). `properties-frontend` consome como remote.

## Arquitetura

```
src/
├── app/                    rotas Next.js (login, register, profile) + layout + providers
├── components/federation/  Header, AuthStatus, UserMenu — expostos via Module Federation (remoteEntry.js)
├── features/auth/
│   ├── register/           schema Zod + service + hook (useRegister) + RegisterForm
│   ├── login/              schema Zod + service + hook (useLogin) + LoginForm
│   ├── logout/             service + hook (useLogout) + LogoutButton
│   └── profile/            service + hook (useProfile) + ProfileCard
├── lib/
│   ├── env.ts               validação Zod de env vars
│   └── api-client.ts         fetch wrapper: injeta Authorization, refresh automático em 401
├── stores/auth-store.ts     Zustand — accessToken em memória (nunca localStorage) + user
├── mocks/                   handlers MSW (usados só em teste)
└── middleware.ts             protege /profile checando presença do cookie de refresh
```

## Autenticação — como funciona

1. Login: `POST /api/auth/login` retorna `accessToken` (guardado em memória via Zustand) + `Set-Cookie` `refreshToken` (httpOnly, gerenciado pelo browser)
2. Toda chamada autenticada injeta `Authorization: Bearer <accessToken>`
3. Em qualquer 401, o `apiClient` tenta `POST /api/auth/refresh` uma vez (usa o cookie automaticamente) e repete a chamada original com o token novo — transparente pro código que chamou
4. Se o refresh falhar, a sessão local é limpa (`useAuthStore.clear()`)
5. Logout sempre limpa a sessão local, mesmo se a chamada ao servidor falhar (fail-safe)

**Limitação conhecida:** o `middleware.ts` só confirma a _presença_ do cookie de refresh (não valida) — funciona em dev local porque `auth-frontend` e `api-gateway` compartilham o mesmo host (`localhost`, portas diferentes; cookies não são escopados por porta). Em produção, se `auth-frontend` e `api-gateway` estiverem em domínios diferentes, essa checagem de middleware precisa ser revista (cookie `Domain` compartilhado ou estratégia de sessão diferente) — a validação real de qualquer forma sempre acontece client-side via `useProfile`.

## Variáveis de ambiente

`NEXT_PUBLIC_API_GATEWAY_URL` — obrigatória, é _baked_ em build-time (convenção Next.js pra env vars `NEXT_PUBLIC_*`).

## Como rodar

```bash
npm run dev --workspace=auth-frontend
```

## Como testar

```bash
npm run test --workspace=auth-frontend            # 70 testes — MSW mocka toda chamada HTTP, sem backend real
npm run test:coverage --workspace=auth-frontend    # cobertura (95%+; app/ e mocks/ excluídos do gate — ver vitest.config.ts)
```

## Docker

```bash
docker compose up auth-frontend -d   # depende de api-gateway healthy
```
