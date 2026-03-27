import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Analytics — Análisis visual de finanzas',
  description:
    'Gráficos interactivos de tendencias mensuales, distribución de gastos y desglose financiero. Visualiza cómo evolucionan tus finanzas.',
}

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return children
}
