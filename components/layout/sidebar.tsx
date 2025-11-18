'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useI18n } from '@/lib/i18n/context'
import { useUser } from '@/hooks/use-user'
import { createClient } from '@/lib/supabase/browser'
import {
  DollarSign,
  TrendingDown,
  Target,
  LayoutDashboard,
  PlusCircle,
  LogOut,
  PanelLeftOpen,
  PanelLeftClose,
  ChevronDown,
  Settings,
  Globe,
  LifeBuoy,
  Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/brand/logo'
import { toast } from 'sonner'

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [accountOpen, setAccountOpen] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const { data: user } = useUser()
  const { t } = useI18n()

  const navigation = [
    { name: t.nav.dashboard, href: '/dashboard', icon: LayoutDashboard },
    { name: t.nav.incomes, href: '/incomes', icon: DollarSign },
    { name: t.nav.expenses, href: '/expenses', icon: TrendingDown },
    { name: t.nav.commitments, href: '/commitments', icon: Target },
  ]

  const isActive = (href: string) => pathname === href

  const handleLogout = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error(t.common.error)
      return
    }
    toast.success(t.common.success)
    router.push('/login')
    router.refresh()
  }

  const initials =
    user?.user_metadata?.full_name?.[0]?.toUpperCase() ??
    user?.email?.[0]?.toUpperCase() ??
    'S'

  const accountLinks = [
    {
      label: t.nav.settings,
      icon: Settings,
      href: '/settings',
    },
    {
      label: t.settings.language,
      icon: Globe,
      href: '/settings?tab=preferences',
    },
    {
      label: 'Obtener ayuda',
      icon: LifeBuoy,
      href: '/contact',
    },
    {
      label: 'Más información',
      icon: Info,
      href: '/',
    },
  ]

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r border-white/10 bg-gradient-to-b from-[#0f1115] via-[#08090c] to-[#050506] text-white/90 shadow-2xl transition-all duration-300',
        collapsed ? 'w-24' : 'w-72'
      )}
    >
      <div className="flex h-full flex-col">
        <div className="border-b border-white/5 px-3 pb-6 pt-6">
          <div className="flex items-center gap-2">
            <div className={cn('flex-1', collapsed && 'flex-0')}>
              <Logo size="md" href="/dashboard" showText={!collapsed} />
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              className={cn('text-muted-foreground hover:text-white', collapsed ? '' : 'ml-auto')}
              onClick={() => setCollapsed((prev) => !prev)}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </Button>
          </div>
          {!collapsed && (
            <>
              <p className="mt-3 text-sm text-muted-foreground">
                Controla tus ingresos, gastos y compromisos con claridad total.
              </p>
              <Button asChild size="sm" className="mt-5 w-full justify-center gap-2 bg-gradient-brand hover:opacity-90">
                <Link href="/incomes">
                  <PlusCircle className="h-4 w-4" />
                  {t.incomes.addIncome}
                </Link>
              </Button>
            </>
          )}
        </div>

        <nav className="flex-1 space-y-8 px-2 py-6">
          <div>
            <p
              className={cn(
                'px-4 text-xs uppercase tracking-wide text-white/50 transition-opacity',
                collapsed && 'opacity-0'
              )}
            >
              Panel
            </p>
            <div className="mt-3 space-y-1.5">
              {navigation.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'group flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-all',
                      collapsed ? 'justify-center' : 'gap-3',
                      active
                        ? 'bg-white/10 text-white shadow-inner'
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className={cn(collapsed && 'sr-only')}>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>

        </nav>

        <div className="border-t border-white/5 px-3 py-5">
          <div className="relative">
            <button
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-white/5',
                collapsed && 'flex-col gap-2 text-center'
              )}
              onClick={() => setAccountOpen((prev) => !prev)}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
                {initials}
              </div>
              {!collapsed && (
                <div className="flex flex-1 items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-foreground">
                      {user?.user_metadata?.full_name || 'SOBRA User'}
                    </p>
                    <p className="text-xs text-muted-foreground break-all">{user?.email}</p>
                  </div>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 text-muted-foreground transition-transform',
                      accountOpen && 'rotate-180'
                    )}
                  />
                </div>
              )}
            </button>

            {!collapsed && accountOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-4 text-sm">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 shadow-inner">
                  <div className="px-1 pb-2 text-xs text-white/70">
                    {user?.email}
                  </div>
                  <div className="space-y-1.5">
                    {accountLinks.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="flex items-center gap-2 rounded-xl px-2 py-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      )
                    })}
                    <button
                      className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      {t.nav.logout}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {collapsed && (
            <Button
              variant="ghost"
              className="mt-4 w-full justify-center text-muted-foreground hover:bg-white/5 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}

          {!collapsed && <div className="mt-5" />}
        </div>
      </div>
    </aside>
  )
}

