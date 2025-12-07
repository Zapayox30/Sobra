'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ReactNode } from 'react'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  trend?: 'up' | 'down' | 'neutral'
  status?: 'good' | 'warning' | 'error'
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  status = 'good',
}: MetricCardProps) {
  const statusColors = {
    good: 'text-green-500 border-green-500/20 bg-green-500/5',
    warning: 'text-amber-500 border-amber-500/20 bg-amber-500/5',
    error: 'text-red-500 border-red-500/20 bg-red-500/5',
  }

  const trendIcons = {
    up: '↗',
    down: '↘',
    neutral: '→',
  }

  return (
    <Card className={`border ${statusColors[status]}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="text-3xl font-bold text-foreground">{value}</div>
          {trend && (
            <span className="text-sm text-muted-foreground">
              {trendIcons[trend]}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  )
}
