import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Crear cuenta gratis',
  description:
    'Crea tu cuenta gratuita en SOBRA y toma el control de tus finanzas personales. Registra ingresos, gastos y descubre cuánto te sobra cada mes.',
  openGraph: {
    title: 'Crear cuenta gratis | SOBRA',
    description: 'Regístrate gratis en SOBRA. Gestiona tus finanzas personales en minutos.',
  },
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children
}
