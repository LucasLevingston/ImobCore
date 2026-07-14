# @microfrontends/ui

Design system compartilhado — shadcn/ui + Radix UI + Tailwind + class-variance-authority.

**Status:** Fase 1 concluída. Consumido por `auth-frontend` (Fase 3) e `products-frontend` (Fase 5) via npm workspace.

## Componentes

| Componente                                                  | Arquivo              | Baseado em                                                               |
| ----------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------ |
| `Button`                                                    | `components/Button`  | CVA + `@radix-ui/react-slot` (suporte a `asChild`)                       |
| `Input`                                                     | `components/Input`   | HTML nativo + estado de erro                                             |
| `Card` (+ Header/Title/Description/Content/Footer)          | `components/Card`    | Compound component                                                       |
| `Loading`                                                   | `components/Loading` | `lucide-react`                                                           |
| `ErrorState`                                                | `components/Error`   | Slot `onRetry` (OCP)                                                     |
| `Modal` (+ Trigger/Content/Header/Title/Description/Footer) | `components/Modal`   | `@radix-ui/react-dialog`                                                 |
| `Toast` + `Toaster` + `useToast`/`toast()`                  | `components/Toast`   | `@radix-ui/react-toast`, store em módulo (chamável fora da árvore React) |
| `Layout`                                                    | `components/Layout`  | Landmark `<main>`, `fullWidth` opcional                                  |
| `Header`                                                    | `components/Header`  | Slots `logo`/`nav`/`actions` (sem estado de auth)                        |
| `Sidebar`                                                   | `components/Sidebar` | Recebe `items` com `active` resolvido pelo app (sem `next/navigation`)   |

## Uso

```tsx
import { Button, Card, CardContent, useToast } from '@microfrontends/ui'
import '@microfrontends/ui/globals.css'
```

No `next.config.js` do app consumidor:

```js
module.exports = {
  transpilePackages: ['@microfrontends/ui'],
}
```

No `tailwind.config.ts` do app consumidor:

```ts
import uiPreset from '@microfrontends/ui/tailwind.config'

export default {
  presets: [uiPreset],
  content: ['./src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
}
```

## Por que não usa Module Federation

Design system muda em build-time (nova versão do pacote), não em runtime por usuário logado — não há motivo pra pagar o custo de um remote federado aqui. Module Federation neste projeto é reservado só pra `Header`/`AuthStatus`/`UserMenu` com estado vivo de sessão, expostos por `auth-frontend` (ver `/docs/ARCHITECTURE.md`, seções 06 e 07).

## Rodar testes

```bash
npm run test --workspace=@microfrontends/ui
npm run test:coverage --workspace=@microfrontends/ui
```

Cobertura mínima: 95% (enforced via `vitest.config.ts` `coverage.thresholds`).

## Testes — infraestrutura reutilizável

`src/test-utils/`:

- `renderWithUser(ui)` — combina `render()` + `userEvent.setup()`, evita repetição em todo teste com interação.
- `resetToasts()` — limpa o estado global do módulo de toast entre testes (store fica fora da árvore React, precisa de reset explícito).
