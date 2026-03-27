import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Inversiones',
  description:
    'Explora productos de inversión para el mercado peruano. Simulador de interés compuesto, checklist de preparación y catálogo de opciones.',
}

export default function InvestmentsLayout({ children }: { children: React.ReactNode }) {
  return children
}
