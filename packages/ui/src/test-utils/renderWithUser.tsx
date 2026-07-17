import { type RenderOptions, type RenderResult, render } from '@testing-library/react'
import userEvent, { type UserEvent } from '@testing-library/user-event'
import type { ReactElement } from 'react'

interface RenderWithUserResult extends RenderResult {
  user: UserEvent
}

// Evita repetir `userEvent.setup()` + `render()` em todo teste que simula interação.
// React 19 faz ReactElement's props default pra `unknown`, não `any` — o `any`
// aqui é o fix oficial do codemod do próprio React pra bater com a assinatura
// genérica do render() do RTL.
export function renderWithUser(
  // biome-ignore lint/suspicious/noExplicitAny: fix oficial do codemod do React 19 pra bater com a assinatura genérica do render() do RTL
  ui: ReactElement<any>,
  options?: RenderOptions,
): RenderWithUserResult {
  const user = userEvent.setup()
  return { user, ...render(ui, options) }
}
