import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FormError } from './FormError'

describe('FormError', () => {
  it('should render nothing when there is no message', () => {
    const { container } = render(<FormError />)
    expect(container).toBeEmptyDOMElement()
  })

  it('should render the message with an alert role', () => {
    render(<FormError message="E-mail já cadastrado." />)
    expect(screen.getByRole('alert')).toHaveTextContent('E-mail já cadastrado.')
  })

  it('should forward custom className', () => {
    render(<FormError message="Falhou." className="my-custom-class" />)
    expect(screen.getByRole('alert')).toHaveClass('my-custom-class')
  })
})
