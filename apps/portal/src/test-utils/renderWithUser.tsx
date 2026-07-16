import { type RenderOptions, type RenderResult, render } from '@testing-library/react'
import userEvent, { type UserEvent } from '@testing-library/user-event'
import type { ReactElement } from 'react'

interface RenderWithUserResult extends RenderResult {
  user: UserEvent
}

// Evita repetir `userEvent.setup()` + `render()` em todo teste que simula
// interação e não precisa de QueryClientProvider (mesmo padrão de packages/ui)
export function renderWithUser(ui: ReactElement, options?: RenderOptions): RenderWithUserResult {
  const user = userEvent.setup()
  return { user, ...render(ui, options) }
}
