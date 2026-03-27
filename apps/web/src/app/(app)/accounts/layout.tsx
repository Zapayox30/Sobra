import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cuentas y billeteras',
  description:
    'Administra tus cuentas bancarias y billeteras digitales. Visualiza tu saldo consolidado.',
}

export default function AccountsLayout({ children }: { children: React.ReactNode }) {
  return children
}
