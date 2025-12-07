'use client'

import { memo } from 'react'
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { TimeSeriesDataPoint } from '@/hooks/use-metrics-timeseries'

interface ComposedMetricsChartProps {
  data: TimeSeriesDataPoint[]
}

export const ComposedMetricsChart = memo(function ComposedMetricsChart({
  data,
}: ComposedMetricsChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">React Query Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
            Start auto-refresh to see real-time data
          </div>
        </CardContent>
      </Card>
    )
  }

  const latestData = data[data.length - 1]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">React Query Metrics</CardTitle>
        <p className="text-sm text-muted-foreground">
          Queries, mutations, and cache size over time
        </p>
        <div className="grid grid-cols-3 gap-2 mt-2">
          <div className="bg-muted/50 rounded p-2">
            <div className="text-xs text-muted-foreground">Queries</div>
            <div className="text-lg font-bold">{latestData?.queries || 0}</div>
          </div>
          <div className="bg-muted/50 rounded p-2">
            <div className="text-xs text-muted-foreground">Mutations</div>
            <div className="text-lg font-bold">{latestData?.mutations || 0}</div>
          </div>
          <div className="bg-muted/50 rounded p-2">
            <div className="text-xs text-muted-foreground">Cache</div>
            <div className="text-lg font-bold">
              {Math.round(latestData?.cacheSize || 0)}KB
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
            <XAxis
              dataKey="timestampLabel"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              interval="preserveStartEnd"
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              label={{
                value: 'Count',
                angle: -90,
                position: 'insideLeft',
                style: { fill: 'hsl(var(--muted-foreground))', fontSize: 11 },
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              label={{
                value: 'Cache Size (KB)',
                angle: 90,
                position: 'insideRight',
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
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />

            {/* Bars for queries and mutations */}
            <Bar
              yAxisId="left"
              dataKey="queries"
              name="Queries"
              fill="hsl(var(--chart-1))"
              radius={[4, 4, 0, 0]}
              animationDuration={300}
            />
            <Bar
              yAxisId="left"
              dataKey="mutations"
              name="Mutations"
              fill="hsl(var(--chart-2))"
              radius={[4, 4, 0, 0]}
              animationDuration={300}
            />

            {/* Line for cache size */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="cacheSize"
              name="Cache Size (KB)"
              stroke="hsl(var(--chart-3))"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              animationDuration={300}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
})
