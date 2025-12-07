'use client'

import { useState, useEffect, useCallback } from 'react'
import { getStoredMetrics, getAverageMetrics } from '@/lib/analytics/web-vitals'
import type { Metric } from 'web-vitals'

export interface PerformanceMetrics {
  webVitals: {
    current: Metric[]
    averages: Record<string, { avg: number; rating: string }>
  }
  reactQuery: {
    queries: number
    mutations: number
    cacheSize: number
    cacheHitRate: number
  }
  render: {
    totalRenders: number
    slowRenders: number
    averageRenderTime: number
  }
  network: {
    totalRequests: number
    failedRequests: number
    averageLatency: number
    dataTransferred: number
  }
}

/**
 * Hook to collect and monitor performance metrics
 */
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    webVitals: {
      current: [],
      averages: {},
    },
    reactQuery: {
      queries: 0,
      mutations: 0,
      cacheSize: 0,
      cacheHitRate: 0,
    },
    render: {
      totalRenders: 0,
      slowRenders: 0,
      averageRenderTime: 0,
    },
    network: {
      totalRequests: 0,
      failedRequests: 0,
      averageLatency: 0,
      dataTransferred: 0,
    },
  })

  const [isCollecting, setIsCollecting] = useState(false)

  // Collect Web Vitals
  const collectWebVitals = useCallback(() => {
    const current = getStoredMetrics()
    const averages = getAverageMetrics()

    setMetrics((prev) => ({
      ...prev,
      webVitals: { current, averages },
    }))
  }, [])

  // Collect React Query Stats
  const collectReactQueryStats = useCallback(() => {
    if (typeof window === 'undefined') return

    // Access TanStack Query cache
    const queryClient = (window as any).__REACT_QUERY_CLIENT__
    if (!queryClient) return

    const cache = queryClient.getQueryCache()
    const queries = cache.getAll()

    const activeQueries = queries.filter((q: any) => q.state.status === 'success')
    const cacheSize = queries.reduce((acc: number, q: any) => {
      const dataSize = JSON.stringify(q.state.data || {}).length
      return acc + dataSize
    }, 0)

    setMetrics((prev) => ({
      ...prev,
      reactQuery: {
        queries: queries.length,
        mutations: queryClient.getMutationCache().getAll().length,
        cacheSize: Math.round(cacheSize / 1024), // KB
        cacheHitRate: activeQueries.length / Math.max(queries.length, 1),
      },
    }))
  }, [])

  // Collect Network Stats
  const collectNetworkStats = useCallback(() => {
    if (typeof window === 'undefined' || !window.performance) return

    const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]

    const totalRequests = entries.length
    const failedRequests = entries.filter((e) => {
      // Check if response is error status
      return (e as any).responseStatus >= 400
    }).length

    const latencies = entries.map((e) => e.duration)
    const averageLatency = latencies.length > 0
      ? latencies.reduce((a, b) => a + b, 0) / latencies.length
      : 0

    const dataTransferred = entries.reduce((acc, e) => {
      return acc + (e.transferSize || 0)
    }, 0)

    setMetrics((prev) => ({
      ...prev,
      network: {
        totalRequests,
        failedRequests,
        averageLatency: Math.round(averageLatency),
        dataTransferred: Math.round(dataTransferred / 1024), // KB
      },
    }))
  }, [])

  // Collect Render Stats
  const collectRenderStats = useCallback(() => {
    // Get from sessionStorage (set by React DevTools Profiler)
    const renderData = sessionStorage.getItem('react-render-stats')
    if (!renderData) return

    try {
      const stats = JSON.parse(renderData)
      setMetrics((prev) => ({
        ...prev,
        render: stats,
      }))
    } catch (error) {
      console.error('Error parsing render stats:', error)
    }
  }, [])

  // Collect all metrics
  const collectAll = useCallback(() => {
    collectWebVitals()
    collectReactQueryStats()
    collectNetworkStats()
    collectRenderStats()
  }, [collectWebVitals, collectReactQueryStats, collectNetworkStats, collectRenderStats])

  // Auto-collect on mount and interval
  useEffect(() => {
    if (!isCollecting) return

    collectAll()
    const interval = setInterval(collectAll, 5000) // Every 5 seconds

    return () => clearInterval(interval)
  }, [isCollecting, collectAll])

  // Initial collection
  useEffect(() => {
    collectAll()
  }, [collectAll])

  return {
    metrics,
    isCollecting,
    startCollecting: () => setIsCollecting(true),
    stopCollecting: () => setIsCollecting(false),
    refresh: collectAll,
  }
}

/**
 * Hook to detect performance issues
 */
export function usePerformanceAlerts() {
  const { metrics } = usePerformanceMetrics()
  const [alerts, setAlerts] = useState<Array<{ severity: 'low' | 'medium' | 'high'; message: string }>>([])

  useEffect(() => {
    const newAlerts: Array<{ severity: 'low' | 'medium' | 'high'; message: string }> = []

    // Check Web Vitals
    Object.entries(metrics.webVitals.averages).forEach(([metric, { avg, rating }]) => {
      if (rating === 'poor') {
        newAlerts.push({
          severity: 'high',
          message: `${metric} is poor (${Math.round(avg)}ms)`,
        })
      } else if (rating === 'needs-improvement') {
        newAlerts.push({
          severity: 'medium',
          message: `${metric} needs improvement (${Math.round(avg)}ms)`,
        })
      }
    })

    // Check cache hit rate
    if (metrics.reactQuery.cacheHitRate < 0.3) {
      newAlerts.push({
        severity: 'medium',
        message: `Low cache hit rate (${Math.round(metrics.reactQuery.cacheHitRate * 100)}%)`,
      })
    }

    // Check network failures
    const failureRate = metrics.network.failedRequests / Math.max(metrics.network.totalRequests, 1)
    if (failureRate > 0.1) {
      newAlerts.push({
        severity: 'high',
        message: `High network failure rate (${Math.round(failureRate * 100)}%)`,
      })
    }

    // Check cache size
    if (metrics.reactQuery.cacheSize > 5000) {
      newAlerts.push({
        severity: 'low',
        message: `Large cache size (${metrics.reactQuery.cacheSize}KB)`,
      })
    }

    setAlerts(newAlerts)
  }, [metrics])

  return alerts
}

/**
 * Export metrics to JSON
 */
export function exportMetrics(metrics: PerformanceMetrics): void {
  const data = {
    timestamp: new Date().toISOString(),
    metrics,
    userAgent: navigator.userAgent,
    url: window.location.href,
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `performance-metrics-${Date.now()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
