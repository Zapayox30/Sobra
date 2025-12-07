'use client'

import { memo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { TimeSeriesDataPoint } from '@/hooks/use-metrics-timeseries'

interface CacheChartProps {
  data: TimeSeriesDataPoint[]
}

export const CacheChart = memo(function CacheChart({ data }: CacheChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cache Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
            Start auto-refresh to see real-time data
          </div>
        </CardContent>
      </Card>
    )
  }

  const latestHitRate = data[data.length - 1]?.cacheHitRate || 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Cache Performance</span>
          <span className="text-2xl font-bold">
            {Math.round(latestHitRate)}%
          </span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Cache hit rate over time (target: &gt;60%)
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="cacheGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--chart-3))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--chart-3))"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
            <XAxis
              dataKey="timestampLabel"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              label={{
                value: 'Hit Rate (%)',
                angle: -90,
                position: 'insideLeft',
                style: { fill: 'hsl(var(--muted-foreground))', fontSize: 11 },
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`${Math.round(value)}%`, 'Hit Rate']}
            />
            {/* Reference line at 60% (target) */}
            <ReferenceLine
              y={60}
              stroke="hsl(var(--chart-5))"
              strokeDasharray="5 5"
              label={{
                value: 'Target: 60%',
                position: 'right',
                fill: 'hsl(var(--muted-foreground))',
                fontSize: 11,
              }}
            />
            <Area
              type="monotone"
              dataKey="cacheHitRate"
              stroke="hsl(var(--chart-3))"
              strokeWidth={2}
              fill="url(#cacheGradient)"
              animationDuration={300}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
})
