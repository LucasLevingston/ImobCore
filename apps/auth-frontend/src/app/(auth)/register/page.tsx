'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { RegisterForm } from '@/features/auth/register'

export default function RegisterPage() {
  const router = useRouter()

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Criar conta</h1>
        <p className="text-sm text-muted-foreground">Leva menos de um minuto.</p>
      </div>
      <RegisterForm onSuccess={() => router.push('/login')} />
      <p className="text-center text-sm text-muted-foreground">
        Já tem conta?{' '}
        <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  )
}
