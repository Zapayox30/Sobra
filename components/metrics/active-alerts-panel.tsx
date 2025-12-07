'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, AlertCircle, CheckCircle, Bell, BellOff, X } from 'lucide-react'
import { getSeverityColor, type Alert } from '@/lib/metrics/thresholds'
import { formatDistanceToNow } from 'date-fns'

interface ActiveAlertsPanelProps {
  alerts: Alert[]
  onAcknowledge: (id: string) => void
  onClearAll: () => void
  soundEnabled: boolean
  onToggleSound: () => void
}

export function ActiveAlertsPanel({
  alerts,
  onAcknowledge,
  onClearAll,
  soundEnabled,
  onToggleSound,
}: ActiveAlertsPanelProps) {
  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged)
  const criticalAlerts = alerts.filter((a) => a.severity === 'critical')

  if (alerts.length === 0) {
    return (
      <Card className="border-green-500/20 bg-green-500/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-green-500">
            <CheckCircle className="h-5 w-5" />
            <p className="text-sm font-medium">
              All metrics within normal ranges
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <div
              className={`p-1.5 rounded-lg ${
                criticalAlerts.length > 0
                  ? 'bg-red-500/20 text-red-500'
                  : 'bg-amber-500/20 text-amber-500'
              }`}
            >
              <AlertTriangle className="h-4 w-4 animate-pulse" />
            </div>
            Active Alerts ({unacknowledgedAlerts.length})
          </CardTitle>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSound}
              title={soundEnabled ? 'Disable sound' : 'Enable sound'}
            >
              {soundEnabled ? (
                <Bell className="h-4 w-4" />
              ) : (
                <BellOff className="h-4 w-4" />
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={onClearAll}>
              <X className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        {criticalAlerts.length > 0 && (
          <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-500 font-medium">
            ⚠️ {criticalAlerts.length} critical alert
            {criticalAlerts.length > 1 ? 's' : ''} require immediate attention
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          {alerts.map((alert) => {
            const severityColor = getSeverityColor(alert.severity)
            const Icon =
              alert.severity === 'critical' ? AlertTriangle : AlertCircle

            return (
              <div
                key={alert.id}
                className={`flex items-start justify-between gap-3 p-3 rounded-lg border ${severityColor} ${
                  alert.acknowledged ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium break-words">
                      {alert.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {alert.description}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                      <span>
                        {formatDistanceToNow(alert.timestamp, {
                          addSuffix: true,
                        })}
                      </span>
                      {alert.acknowledged && (
                        <span className="text-green-500">✓ Acknowledged</span>
                      )}
                    </div>
                  </div>
                </div>

                {!alert.acknowledged && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onAcknowledge(alert.id)}
                    className="flex-shrink-0"
                  >
                    Acknowledge
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
