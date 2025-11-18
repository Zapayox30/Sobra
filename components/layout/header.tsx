'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/brand/logo'
import { createClient } from '@/lib/supabase/browser'
import { useUser } from '@/hooks/use-user'
import { toast } from 'sonner'
import { 
  LayoutDashboard, 
  TrendingUp, 
  CreditCard, 
  Calendar, 
  LogOut,
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18n } from '@/lib/i18n/context'

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { data: user } = useUser()
  const { t } = useI18n()

  const navItems = [
    { href: '/dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { href: '/incomes', label: t.nav.incomes, icon: TrendingUp },
    { href: '/expenses', label: t.nav.expenses, icon: CreditCard },
    { href: '/commitments', label: t.nav.commitments, icon: Calendar },
  ]

  // Detectar si estamos en settings (incluyendo /profile que redirige a settings)
  const isSettingsActive = pathname === '/settings' || pathname === '/profile' || pathname?.startsWith('/settings')

  const handleLogout = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error(t.common.error)
    } else {
      toast.success(t.common.success)
      router.push('/login')
      router.refresh()
    }
  }

  return (
    <header className="border-b border-border/60 bg-background/90 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo size="md" href="/dashboard" />

          {/* Navigation */}
          {user && (
            <nav className="flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group relative flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150",
                      isActive
                        ? "bg-card/70 text-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    )}
                  >
                    <Icon className={cn(
                      "h-4 w-4 transition-colors duration-150",
                      isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                    )} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}

              {/* Settings Link */}
              <Link
                href="/settings"
                className={cn(
                  "group relative ml-2 flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150",
                  isSettingsActive
                    ? "bg-card/70 text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                <Settings className={cn(
                  "h-4 w-4 transition-colors duration-150",
                  isSettingsActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                )} />
                <span>{t.nav.settings}</span>
              </Link>

              {/* Logout Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="ml-2"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t.nav.logout}
              </Button>
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}

