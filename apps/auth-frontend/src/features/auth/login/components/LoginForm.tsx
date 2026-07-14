'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@microfrontends/ui'
import { useForm } from 'react-hook-form'
import { useLogin } from '../hooks/useLogin'
import { loginSchema, type LoginFormValues } from '../schemas/login.schema'

export interface LoginFormProps {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess = () => {} }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })
  const { mutate, isPending, error } = useLogin()

  function onSubmit(data: LoginFormValues) {
    mutate(data, { onSuccess })
  }

  return (
    <form onSubmit={(event) => void handleSubmit(onSubmit)(event)} className="space-y-4" noValidate>
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium">
          E-mail
        </label>
        <Input
          id="email"
          type="email"
          placeholder="voce@email.com"
          {...register('email')}
          error={errors.email?.message}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium">
          Senha
        </label>
        <Input
          id="password"
          type="password"
          placeholder="********"
          {...register('password')}
          error={errors.password?.message}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error.message}
        </p>
      )}

      <Button type="submit" isLoading={isPending} className="w-full">
        Entrar
      </Button>
    </form>
  )
}
