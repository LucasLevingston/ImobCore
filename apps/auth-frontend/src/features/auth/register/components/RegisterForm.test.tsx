import { screen, waitFor } from '@testing-library/react'
import { delay, http, HttpResponse } from 'msw'
import { describe, expect, it, vi } from 'vitest'
import { env } from '../../../../lib/env'
import { server } from '../../../../mocks/server'
import { renderWithProviders } from '../../../../test-utils/renderWithProviders'
import { RegisterForm } from './RegisterForm'

const BASE = env.NEXT_PUBLIC_API_GATEWAY_URL

describe('RegisterForm', () => {
  it('should render name, email and password fields', () => {
    renderWithProviders(<RegisterForm />)

    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
  })

  it('should show validation errors when submitting empty', async () => {
    const { user } = renderWithProviders(<RegisterForm />)

    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    expect(await screen.findByText('Nome deve ter ao menos 2 caracteres')).toBeInTheDocument()
    expect(screen.getByText('E-mail inválido')).toBeInTheDocument()
    expect(screen.getByText('Senha deve ter ao menos 8 caracteres')).toBeInTheDocument()
  })

  it('should call onSuccess after a successful registration', async () => {
    const onSuccess = vi.fn()
    const { user } = renderWithProviders(<RegisterForm onSuccess={onSuccess} />)

    await user.type(screen.getByLabelText('Nome'), 'Lucas Levingston')
    await user.type(screen.getByLabelText('E-mail'), 'lucas@email.com')
    await user.type(screen.getByLabelText('Senha'), 'super-secret-1')
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1))
  })

  it('should show an alert with the API error message on failure', async () => {
    server.use(
      http.post(`${BASE}/api/auth/register`, () =>
        HttpResponse.json({ message: 'E-mail já cadastrado.' }, { status: 409 }),
      ),
    )
    const { user } = renderWithProviders(<RegisterForm />)

    await user.type(screen.getByLabelText('Nome'), 'Lucas Levingston')
    await user.type(screen.getByLabelText('E-mail'), 'lucas@email.com')
    await user.type(screen.getByLabelText('Senha'), 'super-secret-1')
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('E-mail já cadastrado.')
  })

  it('should disable the submit button while the request is pending', async () => {
    server.use(
      http.post(`${BASE}/api/auth/register`, async () => {
        await delay(50)
        return HttpResponse.json({ id: 'user-1' }, { status: 201 })
      }),
    )
    const { user } = renderWithProviders(<RegisterForm />)

    await user.type(screen.getByLabelText('Nome'), 'Lucas Levingston')
    await user.type(screen.getByLabelText('E-mail'), 'lucas@email.com')
    await user.type(screen.getByLabelText('Senha'), 'super-secret-1')
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    expect(screen.getByRole('button')).toBeDisabled()
    await waitFor(() => expect(screen.getByRole('button')).not.toBeDisabled())
  })
})
