'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { VITALS_THRESHOLDS } from '@/lib/analytics/web-vitals'

interface WebVitalsDisplayProps {
  averages: Record<string, { avg: number; rating: string }>
}

export function WebVitalsDisplay({ averages }: WebVitalsDisplayProps) {
  const vitalsOrder = ['LCP', 'FID', 'CLS', 'FCP', 'TTFB', 'INP']

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good':
        return 'bg-green-500'
      case 'needs-improvement':
        return 'bg-amber-500'
      case 'poor':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getProgressPercentage = (metric: string, value: number) => {
    const thresholds = VITALS_THRESHOLDS[metric as keyof typeof VITALS_THRESHOLDS]
    if (!thresholds) return 50

    const max = thresholds.needsImprovement * 1.5
    return Math.min((value / max) * 100, 100)
  }

  const vitalsInfo = {
    LCP: { name: 'Largest Contentful Paint', unit: 'ms', description: 'Loading performance' },
    FID: { name: 'First Input Delay', unit: 'ms', description: 'Interactivity' },
    CLS: { name: 'Cumulative Layout Shift', unit: '', description: 'Visual stability' },
    FCP: { name: 'First Contentful Paint', unit: 'ms', description: 'Initial render' },
    TTFB: { name: 'Time to First Byte', unit: 'ms', description: 'Server response' },
    INP: { name: 'Interaction to Next Paint', unit: 'ms', description: 'Responsiveness' },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Core Web Vitals</CardTitle>
        <p className="text-sm text-muted-foreground">
          Real user performance metrics
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {vitalsOrder.map((metric) => {
            const data = averages[metric]
            if (!data) return null

            const info = vitalsInfo[metric as keyof typeof vitalsInfo]
            const percentage = getProgressPercentage(metric, data.avg)

            return (
              <div key={metric} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold">{metric}</span>
                      <span className="text-xs text-muted-foreground">
                        {info.description}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{info.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {metric === 'CLS'
                        ? data.avg.toFixed(3)
                        : Math.round(data.avg)}
                      {info.unit}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        data.rating === 'good'
                          ? 'text-green-500'
                          : data.rating === 'needs-improvement'
                          ? 'text-amber-500'
                          : 'text-red-500'
                      }`}
                    >
                      {data.rating.replace('-', ' ')}
                    </span>
                  </div>
                </div>
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 h-full transition-all duration-500 ${getRatingColor(
                      data.rating
                    )}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-muted-foreground">Good</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-muted-foreground">Needs Improvement</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-muted-foreground">Poor</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
