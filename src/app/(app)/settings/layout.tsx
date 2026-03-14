import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Configuración',
  description:
    'Ajusta la configuración de SOBRA: idioma, moneda, notificaciones y preferencias de la aplicación.',
}

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children
}
