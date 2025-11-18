import type { Metadata } from 'next'
import { Sidebar } from '@/components/layout/sidebar'

export const metadata: Metadata = {
  title: {
    default: 'Dashboard',
    template: '%s | SOBRA',
  },
  description: 'Gestiona tus finanzas personales en SOBRA. Visualiza tus ingresos, gastos y descubre cuánto te sobra mensualmente.',
  robots: {
    index: false, // No indexar páginas protegidas
    follow: false,
  },
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-background">
      <div className="sticky top-0 h-screen">
        <Sidebar />
      </div>
      <main className="flex-1 h-screen overflow-y-auto bg-background">
        <div className="px-4 py-6 md:px-10 md:py-10 min-h-full">{children}</div>
      </main>
    </div>
  )
}

