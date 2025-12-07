'use client'

import { memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { useMetricsTimeSeries } from '@/hooks/use-metrics-timeseries'
import { ComparisonPeriod } from '@/hooks/use-metrics-comparison'
import { Activity, Database, Network } from 'lucide-react'

interface ComparisonChartsProps {
  period: ComparisonPeriod
  periodLabels: {
    current: string
    previous: string
  }
}

export const ComparisonCharts = memo(function ComparisonCharts({
  period,
  periodLabels,
}: ComparisonChartsProps) {
  const { timeSeries } = useMetricsTimeSeries()

  if (timeSeries.length === 0) {
    return null
  }

  const now = Date.now()
  const { currentData, previousData } = splitDataByPeriod(timeSeries, period, now)

  if (currentData.length === 0 && previousData.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Web Vitals Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Web Vitals Timeline Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Current Period */}
            <div>
              <div className="mb-2 text-center">
                <p className="text-sm font-semibold text-primary">
                  {periodLabels.current}
                </p>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="timestampLabel"
                    tick={{ fontSize: 10 }}
                    className="text-muted-foreground"
                  />
                  <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line
                    type="monotone"
                    dataKey="LCP"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={false}
                    name="LCP (ms)"
                  />
                  <Line
                    type="monotone"
                    dataKey="FCP"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={false}
                    name="FCP (ms)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Previous Period */}
            <div>
              <div className="mb-2 text-center">
                <p className="text-sm font-semibold text-muted-foreground">
                  {periodLabels.previous}
                </p>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={previousData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="timestampLabel"
                    tick={{ fontSize: 10 }}
                    className="text-muted-foreground"
                  />
                  <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line
                    type="monotone"
                    dataKey="LCP"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={false}
                    name="LCP (ms)"
                    strokeDasharray="5 5"
                  />
                  <Line
                    type="monotone"
                    dataKey="FCP"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={false}
                    name="FCP (ms)"
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cache Hit Rate Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Database className="h-5 w-5" />
            Cache Hit Rate Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Current Period */}
            <div>
              <div className="mb-2 text-center">
                <p className="text-sm font-semibold text-primary">
                  {periodLabels.current}
                </p>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={currentData}>
                  <defs>
                    <linearGradient id="cacheGradientCurrent" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--chart-5))"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--chart-5))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="timestampLabel"
                    tick={{ fontSize: 10 }}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 10 }}
                    className="text-muted-foreground"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                  <ReferenceLine
                    y={60}
                    stroke="hsl(var(--chart-5))"
                    strokeDasharray="5 5"
                    label={{ value: 'Target', fontSize: 10 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="cacheHitRate"
                    stroke="hsl(var(--chart-5))"
                    strokeWidth={2}
                    fill="url(#cacheGradientCurrent)"
                    name="Cache Hit Rate (%)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Previous Period */}
            <div>
              <div className="mb-2 text-center">
                <p className="text-sm font-semibold text-muted-foreground">
                  {periodLabels.previous}
                </p>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={previousData}>
                  <defs>
                    <linearGradient id="cacheGradientPrevious" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--muted-foreground))"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--muted-foreground))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="timestampLabel"
                    tick={{ fontSize: 10 }}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 10 }}
                    className="text-muted-foreground"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                  <ReferenceLine
                    y={60}
                    stroke="hsl(var(--muted-foreground))"
                    strokeDasharray="5 5"
                    label={{ value: 'Target', fontSize: 10 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="cacheHitRate"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={2}
                    fill="url(#cacheGradientPrevious)"
                    name="Cache Hit Rate (%)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Network Latency Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Network className="h-5 w-5" />
            Network Latency Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Current Period */}
            <div>
              <div className="mb-2 text-center">
                <p className="text-sm font-semibold text-primary">
                  {periodLabels.current}
                </p>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="timestampLabel"
                    tick={{ fontSize: 10 }}
                    className="text-muted-foreground"
                  />
                  <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="networkLatency"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={2}
                    dot={false}
                    name="Latency (ms)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Previous Period */}
            <div>
              <div className="mb-2 text-center">
                <p className="text-sm font-semibold text-muted-foreground">
                  {periodLabels.previous}
                </p>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={previousData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="timestampLabel"
                    tick={{ fontSize: 10 }}
                    className="text-muted-foreground"
                  />
                  <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="networkLatency"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={2}
                    dot={false}
                    name="Latency (ms)"
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
})

/**
 * Split time series data into current and previous periods
 */
function splitDataByPeriod(
  timeSeries: any[],
  period: ComparisonPeriod,
  now: number
): {
  currentData: any[]
  previousData: any[]
} {
  const { currentStart, currentEnd, previousStart, previousEnd } =
    getPeriodBounds(period, now)

  const currentData = timeSeries.filter(
    (d) => d.timestamp >= currentStart && d.timestamp <= currentEnd
  )

  const previousData = timeSeries
    .filter((d) => d.timestamp >= previousStart && d.timestamp <= previousEnd)
    .map((d, index) => ({
      ...d,
      // Adjust timestamp labels for alignment
      timestampLabel: currentData[index]?.timestampLabel || d.timestampLabel,
    }))

  return { currentData, previousData }
}

/**
 * Get time bounds for periods (copied from hook)
 */
function getPeriodBounds(
  period: ComparisonPeriod,
  now: number
): {
  currentStart: number
  currentEnd: number
  previousStart: number
  previousEnd: number
} {
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day

  switch (period) {
    case 'last-30min-previous-30min':
      return {
        currentStart: now - 30 * minute,
        currentEnd: now,
        previousStart: now - 60 * minute,
        previousEnd: now - 30 * minute,
      }

    case 'last-hour-previous-hour':
      return {
        currentStart: now - hour,
        currentEnd: now,
        previousStart: now - 2 * hour,
        previousEnd: now - hour,
      }

    case 'today-yesterday':
      const todayStart = new Date(now).setHours(0, 0, 0, 0)
      const yesterdayStart = todayStart - day
      return {
        currentStart: todayStart,
        currentEnd: now,
        previousStart: yesterdayStart,
        previousEnd: todayStart,
      }

    case 'this-week-last-week':
      const thisWeekStart = getWeekStart(now)
      const lastWeekStart = thisWeekStart - week
      return {
        currentStart: thisWeekStart,
        currentEnd: now,
        previousStart: lastWeekStart,
        previousEnd: thisWeekStart,
      }

    default:
      return {
        currentStart: now - hour,
        currentEnd: now,
        previousStart: now - 2 * hour,
        previousEnd: now - hour,
      }
  }
}

function getWeekStart(timestamp: number): number {
  const date = new Date(timestamp)
  const day = date.getDay()
  const diff = day === 0 ? 6 : day - 1
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() - diff)
  return date.getTime()
}
