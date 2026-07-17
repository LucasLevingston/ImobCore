import { screen, waitFor } from '@testing-library/react'
import { delay, HttpResponse, http } from 'msw'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { env } from '../../../../lib/env'
import { server } from '../../../../mocks/server'
import { useAuthStore } from '../../../../stores/auth-store'
import { renderWithProviders } from '../../../../test-utils/renderWithProviders'
import { LoginForm } from './LoginForm'

const BASE = env.NEXT_PUBLIC_API_GATEWAY_URL

describe('LoginForm', () => {
  afterEach(() => {
    useAuthStore.getState().clear()
  })

  it('should render email and password fields', () => {
    renderWithProviders(<LoginForm />)

    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
  })

  it('should show validation errors when submitting empty', async () => {
    const { user } = renderWithProviders(<LoginForm />)

    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByText('E-mail inválido')).toBeInTheDocument()
    expect(screen.getByText('Senha obrigatória')).toBeInTheDocument()
  })

  it('should call onSuccess and store the access token after a successful login', async () => {
    const onSuccess = vi.fn()
    const { user } = renderWithProviders(<LoginForm onSuccess={onSuccess} />)

    await user.type(screen.getByLabelText('E-mail'), 'lucas@email.com')
    await user.type(screen.getByLabelText('Senha'), 'super-secret-1')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1))
    expect(useAuthStore.getState().accessToken).not.toBeNull()
  })

  it('should show a generic alert on invalid credentials', async () => {
    server.use(
      http.post(`${BASE}/api/auth/login`, () =>
        HttpResponse.json({ message: 'E-mail ou senha inválidos.' }, { status: 401 }),
      ),
    )
    const { user } = renderWithProviders(<LoginForm />)

    await user.type(screen.getByLabelText('E-mail'), 'lucas@email.com')
    await user.type(screen.getByLabelText('Senha'), 'wrong-password')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('E-mail ou senha inválidos.')
  })

  it('should disable the submit button while the request is pending', async () => {
    server.use(
      http.post(`${BASE}/api/auth/login`, async () => {
        await delay(50)
        return HttpResponse.json({ accessToken: 'token' })
      }),
    )
    const { user } = renderWithProviders(<LoginForm />)

    await user.type(screen.getByLabelText('E-mail'), 'lucas@email.com')
    await user.type(screen.getByLabelText('Senha'), 'super-secret-1')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(screen.getByRole('button')).toBeDisabled()
    await waitFor(() => expect(screen.getByRole('button')).not.toBeDisabled())
  })
})
