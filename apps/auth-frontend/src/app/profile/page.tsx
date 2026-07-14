'use client'

import { LogoutButton } from '@/features/auth/logout'
import { ProfileCard } from '@/features/auth/profile'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const router = useRouter()

  return (
    <div className="mx-auto max-w-md space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Meu perfil</h1>
        <LogoutButton onLoggedOut={() => router.push('/login')} />
      </div>
      <ProfileCard />
    </div>
  )
}
