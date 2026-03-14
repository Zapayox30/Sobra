import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Metas de ahorro',
  description:
    'Define metas de ahorro con montos objetivo y fechas límite. Registra aportes y visualiza tu progreso.',
}

export default function SavingsLayout({ children }: { children: React.ReactNode }) {
  return children
}
