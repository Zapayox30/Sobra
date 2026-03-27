import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compromisos',
  description:
    'Gestiona tus compromisos financieros mensuales: suscripciones, membresías y pagos recurrentes.',
}

export default function CommitmentsLayout({ children }: { children: React.ReactNode }) {
  return children
}
