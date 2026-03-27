import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Perfil',
  description:
    'Gestiona tu perfil de usuario, moneda preferida y preferencias de la aplicación.',
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children
}
