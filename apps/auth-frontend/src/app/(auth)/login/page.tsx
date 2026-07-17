'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LoginForm } from '@/features/auth/login'

export default function LoginPage() {
  const router = useRouter()

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Entrar</h1>
        <p className="text-sm text-muted-foreground">Acesse sua conta pra continuar.</p>
      </div>
      <LoginForm onSuccess={() => router.push('/profile')} />
      <p className="text-center text-sm text-muted-foreground">
        Não tem conta?{' '}
        <Link
          href="/register"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Criar conta
        </Link>
      </p>
    </div>
  )
}
