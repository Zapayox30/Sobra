import type { Metadata } from 'next'
import { Sidebar } from '@/components/layout/sidebar'
import { MobileNav } from '@/components/layout/mobile-nav'

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
    <div className="min-h-screen bg-background">
      <div className="lg:hidden sticky top-0 z-50">
        <MobileNav />
      </div>
      <div className="flex">
        <div className="sticky top-0 hidden h-screen lg:block">
          <Sidebar />
        </div>
        <main className="flex-1 bg-background">
          <div className="px-4 py-6 pt-20 md:px-10 md:py-10 lg:pt-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

