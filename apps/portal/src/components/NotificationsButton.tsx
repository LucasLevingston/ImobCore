'use client'

import { Button, toast } from '@microfrontends/ui'
import { Bell } from 'lucide-react'

// Placeholder (docs/ARCHITECTURE.md seção 05a) — sem contagem real de
// notificações nem backend próprio ainda
export function NotificationsButton() {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Notificações"
      onClick={() => toast({ title: 'Nenhuma notificação nova', description: 'Você está em dia.' })}
    >
      <Bell className="h-4 w-4" aria-hidden="true" />
    </Button>
  )
}
