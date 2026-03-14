import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Configuración inicial',
  description: 'Completa tu perfil financiero en SOBRA: moneda, ingresos iniciales y preferencias.',
  robots: { index: false, follow: false },
}

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return children
}
