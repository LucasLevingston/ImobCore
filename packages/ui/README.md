# @microfrontends/ui

Design system compartilhado — shadcn/ui + Tailwind + class-variance-authority.

**Status:** aguardando implementação (Fase 1 do roadmap). Ver `/README.md` na raiz do monorepo.

## Componentes planejados

Button, Input, Card, Modal, Toast, Loading, Error, Layout, Header, Sidebar.

Consumido em build-time (npm workspace) por `auth-frontend` e `products-frontend`. Diferente do Module Federation, que só carrega em runtime os componentes com estado vivo de autenticação (`AuthStatus`, `UserMenu`).
