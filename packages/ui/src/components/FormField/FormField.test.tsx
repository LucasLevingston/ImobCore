import { zodResolver } from '@hookform/resolvers/zod'
import { screen, waitFor } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { renderWithUser } from '../../test-utils'
import { Input } from '../Input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '.'

const schema = z.object({
  email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
})

type FormValues = z.infer<typeof schema>

function TestForm({ onSubmit }: { onSubmit: (data: FormValues) => void }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  })

  return (
    <Form {...form}>
      <form onSubmit={(event) => void form.handleSubmit(onSubmit)(event)} noValidate>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit">Salvar</button>
      </form>
    </Form>
  )
}

describe('FormField', () => {
  it('should render label and control with no error message on initial state', () => {
    renderWithUser(<TestForm onSubmit={vi.fn()} />)

    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.queryByText('Email é obrigatório')).not.toBeInTheDocument()
  })

  it('should show error message after invalid submit', async () => {
    const { user } = renderWithUser(<TestForm onSubmit={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(await screen.findByText('Email é obrigatório')).toBeInTheDocument()
  })

  it('should mark the control as aria-invalid when there is an error', async () => {
    const { user } = renderWithUser(<TestForm onSubmit={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
    })
  })

  it('should clear the error message after fixing the field and resubmitting', async () => {
    const onSubmit = vi.fn()
    const { user } = renderWithUser(<TestForm onSubmit={onSubmit} />)

    await user.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(await screen.findByText('Email é obrigatório')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Email'), 'lucas@email.com')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(screen.queryByText('Email é obrigatório')).not.toBeInTheDocument()
    })
    expect(onSubmit).toHaveBeenCalledWith({ email: 'lucas@email.com' }, expect.anything())
  })

  it('should throw when FormLabel is used outside of a FormItem', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => renderWithUser(<FormLabel>Email</FormLabel>)).toThrow(
      'FormLabel/FormControl/FormMessage precisam estar dentro de um <FormItem>',
    )

    consoleError.mockRestore()
  })

  it('should throw when FormLabel is used inside a FormItem but outside a FormField', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() =>
      renderWithUser(
        <FormItem>
          <FormLabel>Email</FormLabel>
        </FormItem>,
      ),
    ).toThrow('FormLabel/FormControl/FormMessage precisam estar dentro de um <FormField>')

    consoleError.mockRestore()
  })
})
