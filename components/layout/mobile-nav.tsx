'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, PlusCircle, LayoutDashboard, DollarSign, TrendingDown, Target, ChevronDown, LogOut } from 'lucide-react'
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
    { name: t.nav.incomes, href: '/incomes', icon: DollarSign },
    { name: t.nav.expenses, href: '/expenses', icon: TrendingDown },
    { name: t.nav.commitments, href: '/commitments', icon: Target },
  ]

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
    <div className="relative border-b border-white/10 bg-[#0f1115] text-white">
      <div className="flex items-center justify-between px-4 py-3">
        <Logo size="md" href="/dashboard" />
        <button
          className="rounded-full border border-white/20 p-2 text-white transition hover:bg-white/10"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Abrir menú"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="absolute inset-x-0 top-full z-50 space-y-4 border-b border-white/10 bg-[#050506] px-4 pb-6 pt-4 shadow-2xl">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium ${
                    active ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </div>

          <Link
            href="/incomes"
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-brand px-4 py-3 text-sm font-semibold text-white"
            onClick={() => setOpen(false)}
          >
            <PlusCircle className="h-4 w-4" />
            {t.incomes.addIncome}
          </Link>

          <details className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-white/80" open>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 rounded-lg px-1 py-1 text-left">
              <div>
                <p className="font-semibold text-white">{user?.user_metadata?.full_name || 'SOBRA User'}</p>
                <p className="text-xs text-white/60">{user?.email}</p>
              </div>
              <ChevronDown className="h-4 w-4" />
            </summary>
            <div className="mt-3 space-y-2">
              <Link
                href="/settings"
                className="flex items-center justify-between rounded-xl px-2 py-2 hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                <span>{t.nav.settings}</span>
                <span className="text-xs text-white/60">Ajustes</span>
              </Link>
              <button
                className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left hover:bg-white/10"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                {t.nav.logout}
              </button>
            </div>
          </details>
        </div>
      )}
    </div>
  )
}
