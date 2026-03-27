import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Iniciar sesión',
  description:
    'Inicia sesión en SOBRA para gestionar tus finanzas personales. Accede a tu dashboard, ingresos, gastos y calcula cuánto te sobra.',
  openGraph: {
    title: 'Iniciar sesión | SOBRA',
    description: 'Accede a tu cuenta SOBRA y gestiona tus finanzas personales de forma simple.',
  },
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
