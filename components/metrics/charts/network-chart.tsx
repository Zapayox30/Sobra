'use client'

import { memo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { TimeSeriesDataPoint } from '@/hooks/use-metrics-timeseries'

interface NetworkChartProps {
  data: TimeSeriesDataPoint[]
}

export const NetworkChart = memo(function NetworkChart({
  data,
}: NetworkChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Network Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
            Start auto-refresh to see real-time data
          </div>
        </CardContent>
      </Card>
    )
  }

  // Get last 10 data points for better visibility
  const recentData = data.slice(-10)

  // Calculate average latency
  const avgLatency =
    recentData.reduce((sum, point) => sum + point.networkLatency, 0) /
    recentData.length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Network Performance</span>
          <span className="text-xl font-bold">
            {Math.round(avgLatency)}ms
          </span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Average latency and failures (last 10 measurements)
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={recentData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
            <XAxis
              dataKey="timestampLabel"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              angle={-45}
              textAnchor="end"
              height={70}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              label={{
                value: 'Latency (ms)',
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
                value: 'Failures',
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
            <Bar
              yAxisId="left"
              dataKey="networkLatency"
              name="Latency (ms)"
              fill="hsl(var(--chart-1))"
              radius={[8, 8, 0, 0]}
              animationDuration={300}
            >
              {recentData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.networkLatency > 300
                      ? 'hsl(var(--destructive))'
                      : entry.networkLatency > 200
                      ? 'hsl(var(--chart-2))'
                      : 'hsl(var(--chart-3))'
                  }
                />
              ))}
            </Bar>
            <Bar
              yAxisId="right"
              dataKey="networkFailures"
              name="Failures"
              fill="hsl(var(--destructive))"
              radius={[8, 8, 0, 0]}
              animationDuration={300}
            />
          </BarChart>
        </ResponsiveContainer>

        {/* Legend for latency colors */}
        <div className="mt-4 flex items-center gap-4 text-xs justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[hsl(var(--chart-3))]" />
            <span className="text-muted-foreground">&lt;200ms Good</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[hsl(var(--chart-2))]" />
            <span className="text-muted-foreground">200-300ms OK</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[hsl(var(--destructive))]" />
            <span className="text-muted-foreground">&gt;300ms Slow</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})
