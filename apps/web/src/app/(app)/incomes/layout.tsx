import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ingresos',
  description:
    'Registra y gestiona todos tus ingresos mensuales. Clasifica por tipo: salario, freelance, inversiones y más.',
}

export default function IncomesLayout({ children }: { children: React.ReactNode }) {
  return children
}
