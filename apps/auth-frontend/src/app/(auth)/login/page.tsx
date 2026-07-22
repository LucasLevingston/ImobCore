'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@microfrontends/ui'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LoginForm } from '@/features/auth/login'

export default function LoginPage() {
  const router = useRouter()

  return (
    <div className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Entrar</CardTitle>
          <CardDescription>Acesse sua conta pra continuar.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm onSuccess={() => router.push('/profile')} />
        </CardContent>
      </Card>
      <p className="text-center text-sm text-muted-foreground">
        Não tem conta?{' '}
        <Link
          href="/register"
          className="font-medium text-brand underline-offset-4 hover:underline"
        >
          Criar conta
        </Link>
      </p>
    </div>
  )
}
