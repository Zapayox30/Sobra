import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard — Tu resumen financiero',
  description:
    'Visualiza tu sobra mensual, gastos fijos, deudas y sugerencia de gasto diario. Panel financiero completo con alertas inteligentes.',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children
}
