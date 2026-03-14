import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tarjetas de crédito',
  description:
    'Controla tus tarjetas de crédito, fechas de corte, montos por pagar y alertas de vencimiento.',
}

export default function CreditCardsLayout({ children }: { children: React.ReactNode }) {
  return children
}
