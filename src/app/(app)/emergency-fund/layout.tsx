import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fondo de emergencia',
  description:
    'Crea y gestiona tu fondo de emergencia. Calcula cuántos meses tienes cubiertos y registra aportes.',
}

export default function EmergencyFundLayout({ children }: { children: React.ReactNode }) {
  return children
}
