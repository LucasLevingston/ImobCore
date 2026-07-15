import { Loading } from '@microfrontends/ui'

export default function LoadingPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loading label="Carregando..." size="lg" />
    </div>
  )
}
