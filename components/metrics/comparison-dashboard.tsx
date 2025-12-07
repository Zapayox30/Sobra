'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ComparisonCard } from './comparison-card'
import { PeriodComparison } from '@/hooks/use-metrics-comparison'
import {
  Activity,
  Database,
  Gauge,
  Network,
  Zap,
  TrendingUp,
  TrendingDown,
  Award,
} from 'lucide-react'

interface ComparisonDashboardProps {
  comparison: PeriodComparison
}

export function ComparisonDashboard({ comparison }: ComparisonDashboardProps) {
  const { periodLabel, metrics, hasData } = comparison

  if (!hasData) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">
              Not enough data for comparison. Keep auto-refresh active to collect more
              data.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate overall performance score
  const improvementCount = Object.values(metrics).filter((m) => m.improved).length
  const degradationCount = Object.values(metrics).filter((m) => !m.improved && m.change !== 0).length
  const noChangeCount = Object.values(metrics).filter((m) => m.change === 0).length
  const totalMetrics = Object.keys(metrics).length

  const overallScore = Math.round((improvementCount / totalMetrics) * 100)

  return (
    <div className="space-y-6">
      {/* Header with Period Labels */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Performance Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Current Period */}
            <div className="text-center p-4 bg-background rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Current Period</p>
              <p className="text-lg font-bold text-primary">{periodLabel.current}</p>
            </div>

            {/* VS Divider */}
            <div className="flex items-center justify-center">
              <div className="text-2xl font-bold text-muted-foreground">VS</div>
            </div>

            {/* Previous Period */}
            <div className="text-center p-4 bg-background rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Previous Period</p>
              <p className="text-lg font-bold text-muted-foreground">
                {periodLabel.previous}
              </p>
            </div>
          </div>

          {/* Overall Stats */}
          <div className="mt-4 grid grid-cols-4 gap-2 text-center">
            <div className="p-2 bg-background rounded">
              <p className="text-xs text-muted-foreground">Score</p>
              <p className={`text-lg font-bold ${
                overallScore >= 60 ? 'text-green-500' :
                overallScore >= 40 ? 'text-amber-500' : 'text-red-500'
              }`}>
                {overallScore}%
              </p>
            </div>
            <div className="p-2 bg-green-500/10 rounded">
              <p className="text-xs text-green-500">Improved</p>
              <p className="text-lg font-bold text-green-500">{improvementCount}</p>
            </div>
            <div className="p-2 bg-red-500/10 rounded">
              <p className="text-xs text-red-500">Degraded</p>
              <p className="text-lg font-bold text-red-500">{degradationCount}</p>
            </div>
            <div className="p-2 bg-muted/50 rounded">
              <p className="text-xs text-muted-foreground">Unchanged</p>
              <p className="text-lg font-bold text-muted-foreground">{noChangeCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Web Vitals Comparison */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Gauge className="h-5 w-5" />
          Web Vitals Comparison
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ComparisonCard
            comparison={metrics.LCP}
            title="LCP"
            description="Largest Contentful Paint"
            icon={<Activity className="h-4 w-4" />}
          />
          <ComparisonCard
            comparison={metrics.FCP}
            title="FCP"
            description="First Contentful Paint"
            icon={<Activity className="h-4 w-4" />}
          />
          <ComparisonCard
            comparison={metrics.TTFB}
            title="TTFB"
            description="Time to First Byte"
            icon={<Activity className="h-4 w-4" />}
          />
          <ComparisonCard
            comparison={metrics.CLS}
            title="CLS"
            description="Cumulative Layout Shift"
            icon={<Activity className="h-4 w-4" />}
          />
          <ComparisonCard
            comparison={metrics.FID}
            title="FID"
            description="First Input Delay"
            icon={<Activity className="h-4 w-4" />}
          />
          <ComparisonCard
            comparison={metrics.INP}
            title="INP"
            description="Interaction to Next Paint"
            icon={<Activity className="h-4 w-4" />}
          />
        </div>
      </div>

      {/* Cache & React Query Comparison */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Database className="h-5 w-5" />
          Cache Performance Comparison
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <ComparisonCard
            comparison={metrics.cacheHitRate}
            title="Cache Hit Rate"
            description="Queries served from cache"
            icon={<Zap className="h-4 w-4" />}
          />
          <ComparisonCard
            comparison={metrics.cacheSize}
            title="Cache Size"
            description="Memory used by cache"
            icon={<Database className="h-4 w-4" />}
          />
        </div>
      </div>

      {/* Network Comparison */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Network className="h-5 w-5" />
          Network Performance Comparison
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <ComparisonCard
            comparison={metrics.networkLatency}
            title="Network Latency"
            description="Average response time"
            icon={<Network className="h-4 w-4" />}
          />
          <ComparisonCard
            comparison={metrics.networkFailures}
            title="Network Failures"
            description="Failed requests"
            icon={<Network className="h-4 w-4" />}
          />
        </div>
      </div>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            {overallScore >= 60 ? (
              <TrendingUp className="h-5 w-5 text-green-500" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-500" />
            )}
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {improvementCount > 0 && (
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
                <p className="text-muted-foreground">
                  <span className="font-semibold text-green-500">
                    {improvementCount} metric{improvementCount > 1 ? 's' : ''}
                  </span>{' '}
                  improved compared to the previous period
                </p>
              </div>
            )}

            {degradationCount > 0 && (
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                <p className="text-muted-foreground">
                  <span className="font-semibold text-red-500">
                    {degradationCount} metric{degradationCount > 1 ? 's' : ''}
                  </span>{' '}
                  degraded - consider investigating
                </p>
              </div>
            )}

            {/* Specific recommendations */}
            {metrics.LCP.changePercent > 20 && !metrics.LCP.improved && (
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5" />
                <p className="text-muted-foreground">
                  LCP increased significantly (+{metrics.LCP.changePercent.toFixed(1)}%) -
                  check for heavy resources or slow API calls
                </p>
              </div>
            )}

            {metrics.cacheHitRate.changePercent < -10 && !metrics.cacheHitRate.improved && (
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5" />
                <p className="text-muted-foreground">
                  Cache hit rate dropped - consider increasing staleTime in React Query
                </p>
              </div>
            )}

            {metrics.networkFailures.current > metrics.networkFailures.previous && (
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                <p className="text-muted-foreground">
                  Network failures increased - check API endpoints and error handling
                </p>
              </div>
            )}

            {overallScore >= 80 && (
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
                <p className="text-muted-foreground">
                  <span className="font-semibold text-green-500">Excellent!</span> Most
                  metrics are improving. Keep up the good work!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
