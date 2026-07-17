'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@microfrontends/ui'
import { useForm } from 'react-hook-form'
import { useRegister } from '../hooks/useRegister'
import { type RegisterFormValues, registerSchema } from '../schemas/register.schema'
import type { RegisterFormProps } from './RegisterForm.types'

export function RegisterForm({ onSuccess = () => {} }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  })
  const { mutate, isPending, error } = useRegister()

  function onSubmit(data: RegisterFormValues) {
    mutate(data, { onSuccess })
  }

  return (
    <form onSubmit={(event) => void handleSubmit(onSubmit)(event)} className="space-y-4" noValidate>
      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium">
          Nome
        </label>
        <Input
          id="name"
          placeholder="Seu nome"
          {...register('name')}
          error={errors.name?.message}
        />
      </div>

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
        Criar conta
      </Button>
    </form>
  )
}
