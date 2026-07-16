# @microfrontends/ui

Design system compartilhado — shadcn/ui + Radix UI + Tailwind + class-variance-authority.

**Status:** Fase 1 concluída, mais uma leva de componentes reutilizáveis adicionada depois (issues #1–#9 do repositório). Consumido por `auth-frontend` e `properties-frontend` via npm workspace.

## Componentes

| Componente                                                                 | Arquivo                    | Baseado em                                                                                   |
| -------------------------------------------------------------------------- | -------------------------- | -------------------------------------------------------------------------------------------- |
| `Button`                                                                   | `components/Button`        | CVA + `@radix-ui/react-slot` (suporte a `asChild`), `loadingText` customizável               |
| `SubmitButton`                                                             | `components/SubmitButton`  | `Button` com `type="submit"` fixo — reusa `isLoading`/`loadingText`, sem duplicar lógica     |
| `Input`                                                                    | `components/Input`         | HTML nativo + estado de erro                                                                 |
| `CurrencyInput`                                                            | `components/Input`         | `Input` + máscara de moeda pt-BR — estado do form continua `number`                          |
| `SearchInput`                                                              | `components/Input`         | `Input` + ícone de busca + botão de limpar condicional                                       |
| `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage` | `components/FormField`     | `react-hook-form` (`Controller`/`FormProvider`) — label/erro/aria associados automaticamente |
| `Card` (+ Header/Title/Description/Content/Footer)                         | `components/Card`          | Compound component                                                                           |
| `Loading`                                                                  | `components/Loading`       | `lucide-react` — spinner inline (botões, ações pontuais)                                     |
| `Skeleton`                                                                 | `components/Skeleton`      | Placeholder em bloco pulsante — listas/cards (usar `Loading` pra inline)                     |
| `ErrorState`                                                               | `components/Error`         | Slot `onRetry` (OCP)                                                                         |
| `QueryBoundary`                                                            | `components/QueryBoundary` | `react-error-boundary` + `Suspense`, compõe `Loading`/`ErrorState` — pra `useSuspenseQuery`  |
| `Modal` (+ Trigger/Content/Header/Title/Description/Footer)                | `components/Modal`         | `@radix-ui/react-dialog`                                                                     |
| `Toast` + `Toaster` + `useToast`/`toast()`                                 | `components/Toast`         | `@radix-ui/react-toast`, store em módulo (chamável fora da árvore React)                     |
| `Layout`                                                                   | `components/Layout`        | Landmark `<main>`, `fullWidth` opcional                                                      |
| `Header`                                                                   | `components/Header`        | Slots `logo`/`nav`/`actions` (sem estado de auth)                                            |
| `Sidebar`                                                                  | `components/Sidebar`       | Recebe `items` com `active` resolvido pelo app (sem `next/navigation`)                       |
| `Footer`                                                                   | `components/Footer`        | Landmark `<footer>`                                                                          |
| `Breadcrumb`                                                               | `components/Breadcrumb`    | Trilha de navegação, `items` resolvido pelo app                                              |
| `Avatar` (+ Fallback/Image)                                                | `components/Avatar`        | `@radix-ui/react-avatar`                                                                     |
| `DropdownMenu` (+ Content/Item/Label/Separator/Trigger)                    | `components/DropdownMenu`  | `@radix-ui/react-dropdown-menu`                                                              |
| `ThemeProvider`, `useTheme`, `ThemeToggle`                                 | `components/Theme`         | Tema light/dark via CSS variables                                                            |
| `Logo`                                                                     | `components/Logo`          | Framework-agnostic (nunca importa `next/link`); `href` gera `<a>` nativo                     |
| `Pagination`                                                               | `components/Pagination`    | Controlado; range de páginas calculado em função pura testável (`utils/getPaginationRange`)  |
| `FilterBar` (+ `.Field`/`.Actions`)                                        | `components/FilterBar`     | Shell de filtros de listagem — domínio-agnóstico, colapsável em mobile                       |

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
