'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MetricCard } from '@/components/metrics/metric-card'
import { PerformanceAlerts } from '@/components/metrics/performance-alerts'
import { WebVitalsDisplay } from '@/components/metrics/web-vitals-display'
import { MetricsHistory } from '@/components/metrics/metrics-history'
import { WebVitalsChart } from '@/components/metrics/charts/web-vitals-chart'
import { CacheChart } from '@/components/metrics/charts/cache-chart'
import { NetworkChart } from '@/components/metrics/charts/network-chart'
import { ComposedMetricsChart } from '@/components/metrics/charts/composed-metrics-chart'
import { ActiveAlertsPanel } from '@/components/metrics/active-alerts-panel'
import { AlertsHistory } from '@/components/metrics/alerts-history'
import { PeriodSelector } from '@/components/metrics/period-selector'
import { ComparisonDashboard } from '@/components/metrics/comparison-dashboard'
import { ComparisonCharts } from '@/components/metrics/comparison-charts'
import {
  usePerformanceMetrics,
  usePerformanceAlerts,
  exportMetrics,
} from '@/hooks/use-performance-metrics'
import { useMetricsTimeSeries } from '@/hooks/use-metrics-timeseries'
import { useRealtimeAlerts } from '@/hooks/use-realtime-alerts'
import { useMetricsComparison, type ComparisonPeriod } from '@/hooks/use-metrics-comparison'
import {
  Activity,
  Database,
  Network,
  Zap,
  Download,
  RefreshCw,
  Play,
  Pause,
  BarChart3,
} from 'lucide-react'

export default function MetricsPage() {
  const { metrics, isCollecting, startCollecting, stopCollecting, refresh } =
    usePerformanceMetrics()
  const alerts = usePerformanceAlerts()
  const { timeSeries, clear: clearTimeSeries } = useMetricsTimeSeries()
  const {
    activeAlerts,
    alertsHistory,
    soundEnabled,
    unacknowledgedCount,
    acknowledgeAlert,
    clearActiveAlerts,
    clearHistory,
    toggleSound,
  } = useRealtimeAlerts()
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [comparisonPeriod, setComparisonPeriod] = useState<ComparisonPeriod>('last-hour-previous-hour')
  const comparison = useMetricsComparison(comparisonPeriod)
  const [currentTime, setCurrentTime] = useState('')

  // Update time on client only
  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString())
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleExport = () => {
    exportMetrics(metrics)
  }

  const toggleAutoRefresh = () => {
    if (autoRefresh) {
      stopCollecting()
    } else {
      startCollecting()
    }
    setAutoRefresh(!autoRefresh)
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <BarChart3 className="h-6 w-6" />
            </div>
            Performance Metrics Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time monitoring of application performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAutoRefresh}
            className={autoRefresh ? 'bg-green-500/10 text-green-500' : ''}
          >
            {autoRefresh ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Stop Auto-Refresh
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Auto-Refresh
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={refresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Status Indicator */}
      {autoRefresh && (
        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="py-3">
            <div className="flex items-center gap-2 text-green-500">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium">
                Auto-refreshing every 5 seconds
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Real-time Alerts System */}
      <ActiveAlertsPanel
        alerts={activeAlerts}
        onAcknowledge={acknowledgeAlert}
        onClearAll={clearActiveAlerts}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />

      {/* Legacy Alerts (can be removed if not needed) */}
      {alerts.length > 0 && <PerformanceAlerts alerts={alerts} />}

      {/* Period Comparison Section */}
      {timeSeries.length > 0 && (
        <>
          <div className="border-t border-border my-8" />

          {/* Period Selector */}
          <PeriodSelector
            selected={comparisonPeriod}
            onChange={setComparisonPeriod}
          />

          {/* Comparison Dashboard */}
          <ComparisonDashboard comparison={comparison} />

          {/* Comparison Charts */}
          <ComparisonCharts
            period={comparisonPeriod}
            periodLabels={comparison.periodLabel}
          />

          <div className="border-t border-border my-8" />
        </>
      )}

      {/* Real-time Charts */}
      {timeSeries.length > 0 && (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <WebVitalsChart data={timeSeries} />
            <CacheChart data={timeSeries} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <NetworkChart data={timeSeries} />
            <ComposedMetricsChart data={timeSeries} />
          </div>
        </>
      )}

      {/* Web Vitals */}
      <WebVitalsDisplay averages={metrics.webVitals.averages} />

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Queries"
          value={metrics.reactQuery.queries}
          subtitle="Active React Query caches"
          icon={<Database className="h-4 w-4" />}
          status="good"
        />
        <MetricCard
          title="Cache Hit Rate"
          value={`${Math.round(metrics.reactQuery.cacheHitRate * 100)}%`}
          subtitle="Queries served from cache"
          icon={<Zap className="h-4 w-4" />}
          status={
            metrics.reactQuery.cacheHitRate > 0.6
              ? 'good'
              : metrics.reactQuery.cacheHitRate > 0.3
              ? 'warning'
              : 'error'
          }
        />
        <MetricCard
          title="Cache Size"
          value={`${metrics.reactQuery.cacheSize}KB`}
          subtitle="Memory used by cache"
          icon={<Database className="h-4 w-4" />}
          status={
            metrics.reactQuery.cacheSize < 3000
              ? 'good'
              : metrics.reactQuery.cacheSize < 5000
              ? 'warning'
              : 'error'
          }
        />
        <MetricCard
          title="Network Requests"
          value={metrics.network.totalRequests}
          subtitle={`${metrics.network.failedRequests} failed`}
          icon={<Network className="h-4 w-4" />}
          status={
            metrics.network.failedRequests === 0
              ? 'good'
              : metrics.network.failedRequests < 5
              ? 'warning'
              : 'error'
          }
        />
      </div>

      {/* Detailed Metrics */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* React Query Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="h-5 w-5" />
              React Query Cache
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Queries</span>
                <span className="font-semibold">{metrics.reactQuery.queries}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Mutations</span>
                <span className="font-semibold">{metrics.reactQuery.mutations}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Cache Size</span>
                <span className="font-semibold">{metrics.reactQuery.cacheSize}KB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Hit Rate</span>
                <span className="font-semibold">
                  {Math.round(metrics.reactQuery.cacheHitRate * 100)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Network Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Network className="h-5 w-5" />
              Network Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Requests</span>
                <span className="font-semibold">{metrics.network.totalRequests}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Failed Requests</span>
                <span
                  className={`font-semibold ${
                    metrics.network.failedRequests > 0
                      ? 'text-red-500'
                      : 'text-green-500'
                  }`}
                >
                  {metrics.network.failedRequests}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Avg Latency</span>
                <span className="font-semibold">{metrics.network.averageLatency}ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Data Transferred</span>
                <span className="font-semibold">{metrics.network.dataTransferred}KB</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metrics History */}
      <MetricsHistory />

      {/* Alerts History */}
      <AlertsHistory alerts={alertsHistory} onClear={clearHistory} />

      {/* Performance Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Performance Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
              <div>
                <p className="font-medium text-foreground">Cache Hit Rate</p>
                <p className="text-muted-foreground">
                  Target: &gt;60%. Increase staleTime if lower.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
              <div>
                <p className="font-medium text-foreground">LCP Score</p>
                <p className="text-muted-foreground">
                  Target: &lt;2.5s. Use lazy loading and image optimization.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
              <div>
                <p className="font-medium text-foreground">CLS Score</p>
                <p className="text-muted-foreground">
                  Target: &lt;0.1. Reserve space for dynamic content.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
              <div>
                <p className="font-medium text-foreground">Network Failures</p>
                <p className="text-muted-foreground">
                  Target: 0. Check API endpoints and retry logic.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Debug Info */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground font-mono space-y-1">
            <p>Last Updated: {currentTime || 'Loading...'}</p>
            <p>Auto-Refresh: {autoRefresh ? 'ON' : 'OFF'}</p>
            <p>Collection Status: {isCollecting ? 'Active' : 'Idle'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
