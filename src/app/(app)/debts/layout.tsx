import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Deudas',
  description:
    'Registra y controla tus deudas: préstamos, tarjetas y financiamientos. Visualiza tasas de interés y saldos pendientes.',
}

export default function DebtsLayout({ children }: { children: React.ReactNode }) {
  return children
}
