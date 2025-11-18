import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Autenticación',
    template: '%s | SOBRA',
  },
  description:
    'Inicia sesión o crea tu cuenta gratuita en SOBRA para gestionar tus finanzas personales. Calcula cuánto te sobra mensualmente después de tus ingresos y gastos.',
  keywords: [
    'login SOBRA',
    'registro SOBRA',
    'crear cuenta finanzas',
    'iniciar sesión presupuesto',
    'autenticación gestión financiera',
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'SOBRA',
    description:
      'Inicia sesión o crea tu cuenta gratuita en SOBRA para gestionar tus finanzas personales.',
  },
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

