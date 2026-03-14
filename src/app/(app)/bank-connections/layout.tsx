import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conexiones bancarias',
  description:
    'Conecta tus bancos peruanos vía Open Banking con Belvo. Sincroniza transacciones de BCP, Interbank, BBVA y más.',
}

export default function BankConnectionsLayout({ children }: { children: React.ReactNode }) {
  return children
}
