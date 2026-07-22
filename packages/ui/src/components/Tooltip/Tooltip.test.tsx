import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithUser } from '../../test-utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip'

function renderTooltip() {
  return renderWithUser(
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger>Ícone</TooltipTrigger>
        <TooltipContent>Configurações</TooltipContent>
      </Tooltip>
    </TooltipProvider>,
  )
}

describe('Tooltip', () => {
  it('should not render the tooltip content until the trigger is hovered', () => {
    renderTooltip()
    expect(screen.queryByText('Configurações')).not.toBeInTheDocument()
  })

  it('should render the tooltip content after hovering the trigger', async () => {
    const { user } = renderTooltip()
    await user.hover(screen.getByText('Ícone'))
    expect(await screen.findByText('Configurações', { selector: 'div' })).toBeInTheDocument()
  })

  it('should forward custom className to the tooltip content', async () => {
    const { user } = renderWithUser(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>Ícone</TooltipTrigger>
          <TooltipContent className="my-custom-class">Configurações</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )
    await user.hover(screen.getByText('Ícone'))
    expect(await screen.findByText('Configurações', { selector: 'div' })).toHaveClass(
      'my-custom-class',
    )
  })
})
