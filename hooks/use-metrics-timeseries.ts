'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePerformanceMetrics } from './use-performance-metrics'

export interface TimeSeriesDataPoint {
  timestamp: number
  timestampLabel: string
  // Web Vitals
  LCP?: number
  FID?: number
  CLS?: number
  FCP?: number
  TTFB?: number
  INP?: number
  // React Query
  cacheHitRate: number
  cacheSize: number
  queries: number
  mutations: number
  // Network
  networkLatency: number
  networkFailures: number
  dataTransferred: number
}

const MAX_DATA_POINTS = 50 // Keep last 50 measurements

/**
 * Hook to maintain time series data for charts
 */
export function useMetricsTimeSeries() {
  const { metrics, isCollecting } = usePerformanceMetrics()
  const [timeSeries, setTimeSeries] = useState<TimeSeriesDataPoint[]>([])

  // Add current metrics to time series
  const addDataPoint = useCallback(() => {
    const now = Date.now()
    const label = new Date(now).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })

    const dataPoint: TimeSeriesDataPoint = {
      timestamp: now,
      timestampLabel: label,
      // Web Vitals (from averages)
      LCP: metrics.webVitals.averages.LCP?.avg,
      FID: metrics.webVitals.averages.FID?.avg,
      CLS: metrics.webVitals.averages.CLS?.avg,
      FCP: metrics.webVitals.averages.FCP?.avg,
      TTFB: metrics.webVitals.averages.TTFB?.avg,
      INP: metrics.webVitals.averages.INP?.avg,
      // React Query
      cacheHitRate: metrics.reactQuery.cacheHitRate * 100, // Convert to percentage
      cacheSize: metrics.reactQuery.cacheSize,
      queries: metrics.reactQuery.queries,
      mutations: metrics.reactQuery.mutations,
      // Network
      networkLatency: metrics.network.averageLatency,
      networkFailures: metrics.network.failedRequests,
      dataTransferred: metrics.network.dataTransferred,
    }

    setTimeSeries((prev) => {
      const updated = [...prev, dataPoint]
      // Keep only last MAX_DATA_POINTS
      if (updated.length > MAX_DATA_POINTS) {
        return updated.slice(updated.length - MAX_DATA_POINTS)
      }
      return updated
    })
  }, [metrics])

  // Auto-add data points when collecting
  useEffect(() => {
    if (!isCollecting) return

    // Add initial data point
    addDataPoint()

    // Add data point every 5 seconds
    const interval = setInterval(addDataPoint, 5000)

    return () => clearInterval(interval)
  }, [isCollecting, addDataPoint])

  // Clear time series
  const clear = useCallback(() => {
    setTimeSeries([])
  }, [])

  // Get data for specific metric
  const getMetricData = useCallback(
    (metricName: keyof TimeSeriesDataPoint) => {
      return timeSeries.map((point) => ({
        time: point.timestampLabel,
        value: point[metricName],
      }))
    },
    [timeSeries]
  )

  return {
    timeSeries,
    addDataPoint,
    clear,
    getMetricData,
    hasData: timeSeries.length > 0,
    dataPointsCount: timeSeries.length,
  }
}
