'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, PlusCircle, LayoutDashboard, DollarSign, TrendingDown, Target, ChevronDown, LogOut, TrendingUp } from 'lucide-react'
import { Logo } from '@/components/brand/logo'
import { useI18n } from '@/lib/i18n/context'
import { useUser } from '@/hooks/use-user'
import { createClient } from '@/lib/supabase/browser'
import { toast } from 'sonner'

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { t } = useI18n()
  const { data: user } = useUser()

  const navigation = [
    { name: t.nav.dashboard, href: '/dashboard', icon: LayoutDashboard },
    { name: 'Trends', href: '/trends', icon: TrendingUp },
    { name: t.nav.incomes, href: '/incomes', icon: DollarSign },
    { name: t.nav.expenses, href: '/expenses', icon: TrendingDown },
    { name: t.nav.commitments, href: '/commitments', icon: Target },
  ]

  // Close menu on route change
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const handleLogout = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error(t.common.error)
      return
    }
    toast.success(t.common.success)
    window.location.href = '/login'
  }

  return (
    <div className="relative border-b border-white/10 bg-[#0f1115] text-white safe-area-inset-top">
      <div className="flex items-center justify-between px-4 py-3 mobile-padding-x">
        <Logo size="md" href="/dashboard" />
        <button
          className="touch-target-lg touch-optimized rounded-full border border-white/20 p-2 text-white transition-all hover:bg-white/10 active:bg-white/15 active:scale-95"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 top-[57px] z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Menu Panel */}
      <div className={`fixed inset-x-0 top-[57px] z-50 transform transition-all duration-300 ease-out ${open ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}>
        <div className="space-y-4 border-b border-white/10 bg-[#050506]/98 backdrop-blur-xl px-4 pb-6 pt-4 shadow-2xl mobile-padding-x safe-area-inset-bottom">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`touch-target touch-optimized flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${active
                      ? 'bg-white/10 text-white shadow-sm'
                      : 'text-white/70 hover:bg-white/5 hover:text-white active:bg-white/10'
                    }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </div>

          <Link
            href="/incomes"
            className="touch-target touch-optimized flex items-center justify-center gap-2 rounded-xl bg-gradient-brand px-4 py-3 text-sm font-semibold text-white shadow-lg active:shadow-inner active:scale-[0.98] transition-all"
            onClick={() => setOpen(false)}
            aria-label="Agregar nuevo ingreso"
          >
            <PlusCircle className="h-4 w-4" />
            {t.incomes.addIncome}
          </Link>

          <details className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-white/80" open>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 rounded-lg px-1 py-1 text-left touch-target touch-optimized">
              <div>
                <p className="font-semibold text-white">{user?.user_metadata?.full_name || 'SOBRA User'}</p>
                <p className="text-xs text-white/60 truncate">{user?.email}</p>
              </div>
              <ChevronDown className="h-4 w-4 transition-transform duration-200" />
            </summary>
            <div className="mt-3 space-y-2">
              <Link
                href="/settings"
                className="touch-target touch-optimized flex items-center justify-between rounded-xl px-2 py-2.5 hover:bg-white/10 active:bg-white/15 transition-colors"
                onClick={() => setOpen(false)}
                aria-label="Ir a configuración"
              >
                <span>{t.nav.settings}</span>
                <span className="text-xs text-white/60">Ajustes</span>
              </Link>
              <button
                className="touch-target touch-optimized flex w-full items-center gap-2 rounded-xl px-2 py-2.5 text-left hover:bg-white/10 active:bg-white/15 transition-colors"
                onClick={handleLogout}
                aria-label="Cerrar sesión"
              >
                <LogOut className="h-4 w-4" />
                {t.nav.logout}
              </button>
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}
