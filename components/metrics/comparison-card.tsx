'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowDown, ArrowUp, Minus, TrendingDown, TrendingUp } from 'lucide-react'
import { MetricComparison } from '@/hooks/use-metrics-comparison'

interface ComparisonCardProps {
  comparison: MetricComparison
  title: string
  description?: string
  icon?: React.ReactNode
}

export function ComparisonCard({
  comparison,
  title,
  description,
  icon,
}: ComparisonCardProps) {
  const { current, previous, change, changePercent, improved, unit } = comparison

  // Format values
  const formatValue = (value: number) => {
    if (comparison.metric === 'CLS') {
      return value.toFixed(3)
    }
    if (unit === '%') {
      return Math.round(value)
    }
    return Math.round(value)
  }

  const currentFormatted = formatValue(current)
  const previousFormatted = formatValue(previous)
  const changeFormatted = Math.abs(change).toFixed(comparison.metric === 'CLS' ? 3 : 0)
  const changePercentFormatted = Math.abs(changePercent).toFixed(1)

  // Determine colors and icons
  const isPositiveChange = change > 0
  const isNegativeChange = change < 0
  const isNoChange = change === 0

  let changeColor = 'text-muted-foreground'
  let bgColor = 'bg-muted/10'
  let TrendIcon = Minus

  if (!isNoChange) {
    if (improved) {
      changeColor = 'text-green-500'
      bgColor = 'bg-green-500/10'
      TrendIcon = TrendingUp
    } else {
      changeColor = 'text-red-500'
      bgColor = 'bg-red-500/10'
      TrendIcon = TrendingDown
    }
  }

  const ArrowIcon = isPositiveChange ? ArrowUp : isNegativeChange ? ArrowDown : Minus

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
          <div className={`p-1.5 rounded-lg ${bgColor}`}>
            <TrendIcon className={`h-4 w-4 ${changeColor}`} />
          </div>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {/* Current Value */}
          <div>
            <p className="text-xs text-muted-foreground mb-1">Current</p>
            <p className="text-2xl font-bold">
              {currentFormatted}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                {unit}
              </span>
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Previous Value */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Previous</p>
              <p className="text-sm font-semibold text-muted-foreground">
                {previousFormatted}
                <span className="text-xs ml-1">{unit}</span>
              </p>
            </div>

            {/* Change Indicator */}
            <div className="text-right">
              <div className={`flex items-center gap-1 ${changeColor}`}>
                <ArrowIcon className="h-3.5 w-3.5" />
                <span className="text-sm font-semibold">
                  {changeFormatted}
                  {unit}
                </span>
              </div>
              <div className={`text-xs font-medium ${changeColor}`}>
                {isPositiveChange && '+'}
                {changePercentFormatted}%
              </div>
            </div>
          </div>

          {/* Improvement Badge */}
          {!isNoChange && (
            <div
              className={`text-xs font-medium text-center py-1 px-2 rounded ${
                improved
                  ? 'bg-green-500/10 text-green-500'
                  : 'bg-red-500/10 text-red-500'
              }`}
            >
              {improved ? '✓ Improved' : '⚠ Degraded'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
