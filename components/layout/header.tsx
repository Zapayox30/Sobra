'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/brand/logo'
import { createClient } from '@/lib/supabase/browser'
import { useUser } from '@/hooks/use-user'
import { toast } from 'sonner'

export function Header() {
  const router = useRouter()
  const { data: user } = useUser()

  const handleLogout = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('Error al cerrar sesión')
    } else {
      toast.success('Sesión cerrada')
      router.push('/login')
      router.refresh()
    }
  }

  return (
    <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Logo size="md" href="/dashboard" />

        {user && (
          <nav className="flex items-center gap-6">
            <Link 
              href="/dashboard" 
              className="text-sm font-medium hover:text-primary transition-colors relative group"
            >
              Dashboard
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform" />
            </Link>
            <Link 
              href="/incomes" 
              className="text-sm font-medium hover:text-primary transition-colors relative group"
            >
              Ingresos
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform" />
            </Link>
            <Link 
              href="/expenses" 
              className="text-sm font-medium hover:text-primary transition-colors relative group"
            >
              Gastos
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform" />
            </Link>
            <Link 
              href="/commitments" 
              className="text-sm font-medium hover:text-primary transition-colors relative group"
            >
              Compromisos
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform" />
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="hover-lift"
            >
              Salir
            </Button>
          </nav>
        )}
      </div>
    </header>
  )
}

