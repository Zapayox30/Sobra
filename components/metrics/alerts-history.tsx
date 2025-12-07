'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, AlertCircle, Trash2, Clock } from 'lucide-react'
import { getSeverityColor, type Alert } from '@/lib/metrics/thresholds'
import { formatDistanceToNow } from 'date-fns'

interface AlertsHistoryProps {
  alerts: Alert[]
  onClear: () => void
}

export function AlertsHistory({ alerts, onClear }: AlertsHistoryProps) {
  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Alerts History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <p className="text-sm">No alerts in history</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Group alerts by severity
  const criticalAlerts = alerts.filter((a) => a.severity === 'critical')
  const warningAlerts = alerts.filter((a) => a.severity === 'warning')

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Alerts History ({alerts.length})
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            disabled={alerts.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear History
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="mt-3 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-muted-foreground">
              Critical: <span className="font-semibold text-red-500">{criticalAlerts.length}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-muted-foreground">
              Warning: <span className="font-semibold text-amber-500">{warningAlerts.length}</span>
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {alerts.map((alert) => {
            const severityColor = getSeverityColor(alert.severity)
            const Icon =
              alert.severity === 'critical' ? AlertTriangle : AlertCircle

            return (
              <div
                key={alert.id}
                className={`flex items-start gap-3 p-3 rounded-lg border ${severityColor} transition-opacity ${
                  alert.acknowledged ? 'opacity-60' : 'opacity-100'
                }`}
              >
                <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium break-words">
                      {alert.message}
                    </p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {alert.description}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs">
                    <span className="text-muted-foreground">
                      Value: <span className="font-medium">{alert.value.toFixed(2)}{alert.metric === 'CLS' ? '' : alert.metric.includes('Rate') ? '%' : 'ms'}</span>
                    </span>
                    <span className="text-muted-foreground">
                      Threshold: <span className="font-medium">{alert.threshold}{alert.metric === 'CLS' ? '' : alert.metric.includes('Rate') ? '%' : 'ms'}</span>
                    </span>
                    {alert.acknowledged && (
                      <span className="text-green-500">✓ Acknowledged</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {alerts.length >= 100 && (
          <div className="mt-4 p-2 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-500">
            <p>History limit reached (100 alerts). Older alerts are automatically removed.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
