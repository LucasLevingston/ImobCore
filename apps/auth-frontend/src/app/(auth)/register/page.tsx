'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@microfrontends/ui'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { RegisterForm } from '@/features/auth/register'

export default function RegisterPage() {
  const router = useRouter()

  return (
    <div className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Criar conta</CardTitle>
          <CardDescription>Leva menos de um minuto.</CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm onSuccess={() => router.push('/login')} />
        </CardContent>
      </Card>
      <p className="text-center text-sm text-muted-foreground">
        Já tem conta?{' '}
        <Link href="/login" className="font-medium text-brand underline-offset-4 hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  )
}
