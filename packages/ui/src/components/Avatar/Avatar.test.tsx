import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Avatar, AvatarFallback, AvatarImage } from './Avatar'

describe('Avatar', () => {
  it('should render the fallback content (e.g. initials)', () => {
    render(
      <Avatar>
        <AvatarImage src="/broken.png" alt="Lucas Levingston" />
        <AvatarFallback>LL</AvatarFallback>
      </Avatar>,
    )
    // jsdom nunca dispara o load da imagem — Radix mantém o Fallback visível
    // até onLoadingStatusChange('loaded'), então este é o caminho real testável
    expect(screen.getByText('LL')).toBeInTheDocument()
  })

  it('should render without an image, only fallback', () => {
    render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>,
    )
    expect(screen.getByText('AB')).toBeInTheDocument()
  })

  it('should forward custom className to the root', () => {
    const { container } = render(
      <Avatar className="my-avatar">
        <AvatarFallback>LL</AvatarFallback>
      </Avatar>,
    )
    expect(container.querySelector('.my-avatar')).toBeInTheDocument()
  })
})
