'use client'

import { useMemo } from 'react'
import { useMetricsTimeSeries } from './use-metrics-timeseries'

export type ComparisonPeriod =
  | 'today-yesterday'
  | 'this-week-last-week'
  | 'last-hour-previous-hour'
  | 'last-30min-previous-30min'

export interface MetricComparison {
  metric: string
  current: number
  previous: number
  change: number
  changePercent: number
  improved: boolean
  unit: string
}

export interface PeriodComparison {
  period: ComparisonPeriod
  periodLabel: {
    current: string
    previous: string
  }
  metrics: {
    LCP: MetricComparison
    FCP: MetricComparison
    TTFB: MetricComparison
    CLS: MetricComparison
    FID: MetricComparison
    INP: MetricComparison
    cacheHitRate: MetricComparison
    cacheSize: MetricComparison
    networkLatency: MetricComparison
    networkFailures: MetricComparison
  }
  hasData: boolean
}

/**
 * Hook to compare metrics between different time periods
 */
export function useMetricsComparison(period: ComparisonPeriod): PeriodComparison {
  const { timeSeries } = useMetricsTimeSeries()

  const comparison = useMemo(() => {
    if (timeSeries.length === 0) {
      return createEmptyComparison(period)
    }

    const now = Date.now()
    const { currentStart, currentEnd, previousStart, previousEnd } =
      getPeriodBounds(period, now)

    // Filter data points for each period
    const currentData = timeSeries.filter(
      (d) => d.timestamp >= currentStart && d.timestamp <= currentEnd
    )
    const previousData = timeSeries.filter(
      (d) => d.timestamp >= previousStart && d.timestamp <= previousEnd
    )

    if (currentData.length === 0 && previousData.length === 0) {
      return createEmptyComparison(period)
    }

    // Calculate averages for each metric
    const metrics = {
      LCP: compareMetric('LCP', currentData, previousData, 'ms', 'lower'),
      FCP: compareMetric('FCP', currentData, previousData, 'ms', 'lower'),
      TTFB: compareMetric('TTFB', currentData, previousData, 'ms', 'lower'),
      CLS: compareMetric('CLS', currentData, previousData, '', 'lower'),
      FID: compareMetric('FID', currentData, previousData, 'ms', 'lower'),
      INP: compareMetric('INP', currentData, previousData, 'ms', 'lower'),
      cacheHitRate: compareMetric(
        'cacheHitRate',
        currentData,
        previousData,
        '%',
        'higher'
      ),
      cacheSize: compareMetric('cacheSize', currentData, previousData, 'KB', 'lower'),
      networkLatency: compareMetric(
        'networkLatency',
        currentData,
        previousData,
        'ms',
        'lower'
      ),
      networkFailures: compareMetric(
        'networkFailures',
        currentData,
        previousData,
        '',
        'lower'
      ),
    }

    return {
      period,
      periodLabel: getPeriodLabels(period),
      metrics,
      hasData: currentData.length > 0 || previousData.length > 0,
    }
  }, [timeSeries, period])

  return comparison
}

/**
 * Calculate average of a metric from data points
 */
function calculateAverage(
  data: any[],
  metricKey: string
): number {
  const validValues = data
    .map((d) => d[metricKey])
    .filter((v) => v !== undefined && v !== null && !isNaN(v))

  if (validValues.length === 0) return 0

  const sum = validValues.reduce((acc, val) => acc + val, 0)
  return sum / validValues.length
}

/**
 * Compare a metric between current and previous period
 */
function compareMetric(
  metricKey: string,
  currentData: any[],
  previousData: any[],
  unit: string,
  betterDirection: 'higher' | 'lower'
): MetricComparison {
  const current = calculateAverage(currentData, metricKey)
  const previous = calculateAverage(previousData, metricKey)

  const change = current - previous
  const changePercent = previous !== 0 ? (change / previous) * 100 : 0

  // Determine if improved based on direction
  let improved = false
  if (betterDirection === 'lower') {
    improved = change < 0 // Lower is better
  } else {
    improved = change > 0 // Higher is better
  }

  return {
    metric: metricKey,
    current,
    previous,
    change,
    changePercent,
    improved,
    unit,
  }
}

/**
 * Get time bounds for current and previous periods
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

/**
 * Get start of week (Monday)
 */
function getWeekStart(timestamp: number): number {
  const date = new Date(timestamp)
  const day = date.getDay()
  const diff = day === 0 ? 6 : day - 1 // Monday = 0
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() - diff)
  return date.getTime()
}

/**
 * Get human-readable labels for periods
 */
function getPeriodLabels(period: ComparisonPeriod): {
  current: string
  previous: string
} {
  switch (period) {
    case 'last-30min-previous-30min':
      return {
        current: 'Last 30 minutes',
        previous: 'Previous 30 minutes',
      }

    case 'last-hour-previous-hour':
      return {
        current: 'Last hour',
        previous: 'Previous hour',
      }

    case 'today-yesterday':
      return {
        current: 'Today',
        previous: 'Yesterday',
      }

    case 'this-week-last-week':
      return {
        current: 'This week',
        previous: 'Last week',
      }

    default:
      return {
        current: 'Current period',
        previous: 'Previous period',
      }
  }
}

/**
 * Create empty comparison when no data
 */
function createEmptyComparison(period: ComparisonPeriod): PeriodComparison {
  const emptyMetric = (metricKey: string, unit: string): MetricComparison => ({
    metric: metricKey,
    current: 0,
    previous: 0,
    change: 0,
    changePercent: 0,
    improved: false,
    unit,
  })

  return {
    period,
    periodLabel: getPeriodLabels(period),
    metrics: {
      LCP: emptyMetric('LCP', 'ms'),
      FCP: emptyMetric('FCP', 'ms'),
      TTFB: emptyMetric('TTFB', 'ms'),
      CLS: emptyMetric('CLS', ''),
      FID: emptyMetric('FID', 'ms'),
      INP: emptyMetric('INP', 'ms'),
      cacheHitRate: emptyMetric('cacheHitRate', '%'),
      cacheSize: emptyMetric('cacheSize', 'KB'),
      networkLatency: emptyMetric('networkLatency', 'ms'),
      networkFailures: emptyMetric('networkFailures', ''),
    },
    hasData: false,
  }
}
