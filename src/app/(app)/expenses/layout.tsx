import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gastos',
  description:
    'Controla tus gastos fijos y variables mensuales. Categoriza y analiza en qué se va tu dinero cada mes.',
}

export default function ExpensesLayout({ children }: { children: React.ReactNode }) {
  return children
}
