'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getStoredMetrics } from '@/lib/analytics/web-vitals'
import type { Metric } from 'web-vitals'

export function MetricsHistory() {
  const storedMetrics = useMemo(() => getStoredMetrics(), [])

  // Group by metric name
  const groupedMetrics = useMemo(() => {
    const groups: Record<string, Metric[]> = {}

    storedMetrics.forEach((metric) => {
      if (!groups[metric.name]) {
        groups[metric.name] = []
      }
      groups[metric.name].push(metric)
    })

    // Sort by timestamp (oldest first)
    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => (a.id < b.id ? -1 : 1))
    })

    return groups
  }, [storedMetrics])

  const getTrend = (metrics: Metric[]) => {
    if (metrics.length < 2) return 'neutral'

    const recent = metrics.slice(-5)
    const avg = recent.reduce((sum, m) => sum + m.value, 0) / recent.length
    const oldest = recent[0].value
    const newest = recent[recent.length - 1].value

    if (newest < oldest * 0.9) return 'improving'
    if (newest > oldest * 1.1) return 'degrading'
    return 'stable'
  }

  if (storedMetrics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Metrics History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No historical data available yet. Metrics will be collected as you use the app.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Metrics History</CardTitle>
        <p className="text-sm text-muted-foreground">
          Last {storedMetrics.length} measurements
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(groupedMetrics).map(([metricName, metrics]) => {
            const trend = getTrend(metrics)
            const latest = metrics[metrics.length - 1]
            const min = Math.min(...metrics.map((m) => m.value))
            const max = Math.max(...metrics.map((m) => m.value))
            const avg = metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length

            return (
              <div key={metricName} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-sm font-bold">{metricName}</span>
                    <span
                      className={`ml-2 text-xs ${
                        trend === 'improving'
                          ? 'text-green-500'
                          : trend === 'degrading'
                          ? 'text-red-500'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {trend === 'improving' && '↓ Improving'}
                      {trend === 'degrading' && '↑ Degrading'}
                      {trend === 'stable' && '→ Stable'}
                    </span>
                  </div>
                  <span className="text-sm font-semibold">
                    {metricName === 'CLS'
                      ? latest.value.toFixed(3)
                      : Math.round(latest.value)}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-muted/50 rounded p-2">
                    <div className="text-muted-foreground">Min</div>
                    <div className="font-semibold">
                      {metricName === 'CLS' ? min.toFixed(3) : Math.round(min)}
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded p-2">
                    <div className="text-muted-foreground">Avg</div>
                    <div className="font-semibold">
                      {metricName === 'CLS' ? avg.toFixed(3) : Math.round(avg)}
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded p-2">
                    <div className="text-muted-foreground">Max</div>
                    <div className="font-semibold">
                      {metricName === 'CLS' ? max.toFixed(3) : Math.round(max)}
                    </div>
                  </div>
                </div>

                {/* Mini sparkline */}
                <div className="relative h-8 bg-muted/30 rounded overflow-hidden">
                  <div className="absolute inset-0 flex items-end gap-px px-1 pb-1">
                    {metrics.slice(-20).map((metric, index) => {
                      const height = ((metric.value - min) / (max - min || 1)) * 100
                      return (
                        <div
                          key={index}
                          className="flex-1 bg-primary/60 rounded-t"
                          style={{ height: `${height}%` }}
                        />
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
