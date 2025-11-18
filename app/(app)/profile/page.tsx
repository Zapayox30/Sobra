'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirigir a settings con el tab de profile
    router.replace('/settings?tab=profile')
  }, [router])

  return null
}

