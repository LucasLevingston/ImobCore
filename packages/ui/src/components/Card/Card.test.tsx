import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './Card'

describe('Card', () => {
  it('should render children content', () => {
    render(<Card>conteúdo do card</Card>)
    expect(screen.getByText('conteúdo do card')).toBeInTheDocument()
  })

  it('should forward custom className', () => {
    render(<Card className="my-card">conteúdo</Card>)
    expect(screen.getByText('conteúdo')).toHaveClass('my-card')
  })

  it('should compose header, title, description, content and footer together', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Título do produto</CardTitle>
          <CardDescription>Descrição do produto</CardDescription>
        </CardHeader>
        <CardContent>Corpo do card</CardContent>
        <CardFooter>Rodapé do card</CardFooter>
      </Card>,
    )

    expect(screen.getByRole('heading', { name: 'Título do produto' })).toBeInTheDocument()
    expect(screen.getByText('Descrição do produto')).toBeInTheDocument()
    expect(screen.getByText('Corpo do card')).toBeInTheDocument()
    expect(screen.getByText('Rodapé do card')).toBeInTheDocument()
  })
})
