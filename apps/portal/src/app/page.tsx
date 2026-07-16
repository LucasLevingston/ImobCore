import { ModuleCard } from '../components/ModuleCard'
import { PortalGreeting } from '../components/PortalGreeting'
import { MODULES } from '../routes/modules'

// Dashboard Inicial (docs/ARCHITECTURE.md seção 05a) — cards de acesso aos
// módulos, sem nenhuma regra de negócio própria
export default function HomePage() {
  return (
    <div className="space-y-6">
      <PortalGreeting />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {MODULES.map((module) => (
          <ModuleCard key={module.key} module={module} />
        ))}
      </div>
    </div>
  )
}
