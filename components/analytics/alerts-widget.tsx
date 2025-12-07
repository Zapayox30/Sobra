'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  useFinancialAlerts,
  useUnreadAlertCount,
  useMarkAlertAsRead,
  useGenerateAlerts,
} from '@/hooks/use-anomaly-detector'
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Info,
  X,
  Bell,
  BellOff,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/finance/calc'

const getSeverityConfig = (severity: string) => {
  switch (severity) {
    case 'critical':
      return {
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-400/50',
        textColor: 'text-red-500',
        icon: AlertTriangle,
      }
    case 'warning':
      return {
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-400/50',
        textColor: 'text-amber-500',
        icon: TrendingUp,
      }
    case 'success':
      return {
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-400/50',
        textColor: 'text-green-500',
        icon: CheckCircle2,
      }
    default:
      return {
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-400/50',
        textColor: 'text-blue-500',
        icon: Info,
      }
  }
}

export function AlertsWidget() {
  const { data: alerts = [], isLoading } = useFinancialAlerts()
  const { data: unreadCount = 0 } = useUnreadAlertCount()
  const markAsRead = useMarkAlertAsRead()
  const { generateAlerts, isGenerating } = useGenerateAlerts()

  // Auto-generate alerts on mount (only once per day)
  useEffect(() => {
    generateAlerts()
  }, [])

  // Show only unread alerts, max 3
  const displayAlerts = alerts.filter((a) => !a.is_read).slice(0, 3)

  if (isLoading) {
    return (
      <Card className="border-white/10 bg-gradient-to-br from-card/50 to-card shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="h-5 w-5 text-muted-foreground" />
              Financial Alerts
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-16 bg-white/5 rounded-lg" />
            <div className="h-16 bg-white/5 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (displayAlerts.length === 0) {
    return (
      <Card className="border-white/10 bg-gradient-to-br from-card/50 to-card shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BellOff className="h-5 w-5 text-muted-foreground" />
              Financial Alerts
            </CardTitle>
            {unreadCount > 0 && (
              <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-3 bg-green-500/10 rounded-full mb-3">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-sm text-muted-foreground">
              No anomalies detected! Your spending is on track.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-white/10 bg-gradient-to-br from-card/50 to-card shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5 text-muted-foreground" />
            Financial Alerts
            {unreadCount > 0 && (
              <span className="text-xs px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full">
                {unreadCount}
              </span>
            )}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayAlerts.map((alert) => {
            const config = getSeverityConfig(alert.severity)
            const Icon = config.icon

            return (
              <div
                key={alert.id}
                className={cn(
                  'group relative rounded-xl border p-3 transition-all',
                  config.bgColor,
                  config.borderColor,
                  'hover:shadow-md'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn('p-2 rounded-lg bg-black/10', config.textColor)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground">
                      {alert.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {alert.message}
                    </p>
                    {alert.percentage_diff && (
                      <div className="flex items-center gap-2 mt-2">
                        {alert.percentage_diff > 0 ? (
                          <TrendingUp className={cn('h-3 w-3', config.textColor)} />
                        ) : (
                          <TrendingDown className={cn('h-3 w-3', config.textColor)} />
                        )}
                        <span className={cn('text-xs font-semibold', config.textColor)}>
                          {Math.abs(alert.percentage_diff).toFixed(0)}%{' '}
                          {alert.percentage_diff > 0 ? 'more' : 'less'}
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => markAsRead.mutate(alert.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-black/10 rounded-lg transition-opacity"
                    aria-label="Dismiss alert"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {alerts.length > 3 && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-3 text-xs text-muted-foreground hover:text-foreground"
            asChild
          >
            <a href="/alerts">View all {alerts.length} alerts</a>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
