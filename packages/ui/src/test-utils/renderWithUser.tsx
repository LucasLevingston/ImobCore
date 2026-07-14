import { render, type RenderOptions, type RenderResult } from '@testing-library/react'
import userEvent, { type UserEvent } from '@testing-library/user-event'
import type { ReactElement } from 'react'

interface RenderWithUserResult extends RenderResult {
  user: UserEvent
}

// Evita repetir `userEvent.setup()` + `render()` em todo teste que simula interação
export function renderWithUser(ui: ReactElement, options?: RenderOptions): RenderWithUserResult {
  const user = userEvent.setup()
  return { user, ...render(ui, options) }
}
