/**
 * Performance Thresholds Configuration
 * Define limits for automated alerts
 */

export interface Threshold {
  metric: string
  warning: number
  critical: number
  unit: string
  direction: 'above' | 'below' // Alert when value goes above or below
  description: string
}

export const PERFORMANCE_THRESHOLDS: Threshold[] = [
  // Web Vitals
  {
    metric: 'LCP',
    warning: 2500,
    critical: 4000,
    unit: 'ms',
    direction: 'above',
    description: 'Largest Contentful Paint - Loading performance',
  },
  {
    metric: 'FID',
    warning: 100,
    critical: 300,
    unit: 'ms',
    direction: 'above',
    description: 'First Input Delay - Interactivity',
  },
  {
    metric: 'CLS',
    warning: 0.1,
    critical: 0.25,
    unit: '',
    direction: 'above',
    description: 'Cumulative Layout Shift - Visual stability',
  },
  {
    metric: 'FCP',
    warning: 1800,
    critical: 3000,
    unit: 'ms',
    direction: 'above',
    description: 'First Contentful Paint - Initial render',
  },
  {
    metric: 'TTFB',
    warning: 800,
    critical: 1800,
    unit: 'ms',
    direction: 'above',
    description: 'Time to First Byte - Server response',
  },
  {
    metric: 'INP',
    warning: 200,
    critical: 500,
    unit: 'ms',
    direction: 'above',
    description: 'Interaction to Next Paint - Responsiveness',
  },

  // React Query
  {
    metric: 'cacheHitRate',
    warning: 40,
    critical: 20,
    unit: '%',
    direction: 'below',
    description: 'Cache Hit Rate - Queries served from cache',
  },
  {
    metric: 'cacheSize',
    warning: 3000,
    critical: 5000,
    unit: 'KB',
    direction: 'above',
    description: 'Cache Size - Memory usage',
  },

  // Network
  {
    metric: 'networkLatency',
    warning: 200,
    critical: 300,
    unit: 'ms',
    direction: 'above',
    description: 'Network Latency - Average response time',
  },
  {
    metric: 'networkFailures',
    warning: 1,
    critical: 5,
    unit: '',
    direction: 'above',
    description: 'Network Failures - Failed requests',
  },
]

export type AlertSeverity = 'info' | 'warning' | 'critical'

export interface Alert {
  id: string
  timestamp: number
  metric: string
  value: number
  threshold: number
  severity: AlertSeverity
  message: string
  description: string
  acknowledged: boolean
}

/**
 * Get threshold config for a metric
 */
export function getThreshold(metric: string): Threshold | undefined {
  return PERFORMANCE_THRESHOLDS.find((t) => t.metric === metric)
}

/**
 * Check if value exceeds threshold
 */
export function checkThreshold(
  metric: string,
  value: number
): { exceeded: boolean; severity: AlertSeverity | null } {
  const threshold = getThreshold(metric)
  if (!threshold) return { exceeded: false, severity: null }

  const { warning, critical, direction } = threshold

  if (direction === 'above') {
    if (value >= critical) return { exceeded: true, severity: 'critical' }
    if (value >= warning) return { exceeded: true, severity: 'warning' }
  } else {
    // below
    if (value <= critical) return { exceeded: true, severity: 'critical' }
    if (value <= warning) return { exceeded: true, severity: 'warning' }
  }

  return { exceeded: false, severity: null }
}

/**
 * Create alert object
 */
export function createAlert(
  metric: string,
  value: number,
  severity: AlertSeverity
): Alert {
  const threshold = getThreshold(metric)
  const thresholdValue = severity === 'critical' ? threshold?.critical : threshold?.warning

  return {
    id: `${metric}-${Date.now()}`,
    timestamp: Date.now(),
    metric,
    value,
    threshold: thresholdValue || 0,
    severity,
    message: formatAlertMessage(metric, value, severity, threshold),
    description: threshold?.description || '',
    acknowledged: false,
  }
}

/**
 * Format alert message
 */
function formatAlertMessage(
  metric: string,
  value: number,
  severity: AlertSeverity,
  threshold?: Threshold
): string {
  if (!threshold) return `${metric} alert`

  const formattedValue =
    metric === 'CLS' ? value.toFixed(3) : Math.round(value)
  const unit = threshold.unit

  const severityText = severity === 'critical' ? '🔴 CRITICAL' : '⚠️ WARNING'

  return `${severityText}: ${metric} is ${formattedValue}${unit}`
}

/**
 * Get color for severity
 */
export function getSeverityColor(severity: AlertSeverity): string {
  switch (severity) {
    case 'critical':
      return 'text-red-500 bg-red-500/10 border-red-500/20'
    case 'warning':
      return 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    case 'info':
      return 'text-blue-500 bg-blue-500/10 border-blue-500/20'
  }
}
