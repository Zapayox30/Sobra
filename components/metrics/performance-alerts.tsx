'use client'

import { AlertTriangle, AlertCircle, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Alert {
  severity: 'low' | 'medium' | 'high'
  message: string
}

interface PerformanceAlertsProps {
  alerts: Alert[]
}

export function PerformanceAlerts({ alerts }: PerformanceAlertsProps) {
  if (alerts.length === 0) {
    return (
      <Card className="border-green-500/20 bg-green-500/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-green-500">
            <Info className="h-5 w-5" />
            <p className="text-sm font-medium">No performance issues detected</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const severityConfig = {
    high: {
      icon: AlertTriangle,
      color: 'text-red-500',
      bg: 'bg-red-500/5',
      border: 'border-red-500/20',
    },
    medium: {
      icon: AlertCircle,
      color: 'text-amber-500',
      bg: 'bg-amber-500/5',
      border: 'border-amber-500/20',
    },
    low: {
      icon: Info,
      color: 'text-blue-500',
      bg: 'bg-blue-500/5',
      border: 'border-blue-500/20',
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Performance Alerts ({alerts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {alerts.map((alert, index) => {
            const config = severityConfig[alert.severity]
            const Icon = config.icon

            return (
              <div
                key={index}
                className={`flex items-start gap-3 p-3 rounded-lg border ${config.border} ${config.bg}`}
              >
                <Icon className={`h-4 w-4 mt-0.5 ${config.color}`} />
                <div className="flex-1">
                  <p className={`text-sm font-medium ${config.color}`}>
                    {alert.severity.toUpperCase()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {alert.message}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
