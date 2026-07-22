import { ErrorState } from '@microfrontends/ui'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-sm flex-col items-center justify-center gap-4 p-6">
      <ErrorState title="Página não encontrada" message="O endereço acessado não existe." />
      <Link
        href="/dashboard"
        className="text-sm font-medium text-brand underline-offset-4 hover:underline"
      >
        Voltar ao início
      </Link>
    </div>
  )
}
