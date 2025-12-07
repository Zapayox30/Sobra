/**
 * Web Vitals Monitoring
 * Tracks Core Web Vitals and sends to analytics
 */

import type { Metric } from 'web-vitals'

/**
 * Report Web Vitals to console (development) or analytics (production)
 */
export function reportWebVitals(metric: Metric) {
  const { name, value, rating, id } = metric

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${name}:`, {
      value: Math.round(value),
      rating,
      id,
    })
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === 'production') {
    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', name, {
        value: Math.round(value),
        metric_id: id,
        metric_value: value,
        metric_rating: rating,
      })
    }

    // Vercel Analytics (if using Vercel)
    if (typeof window !== 'undefined' && (window as any).va) {
      (window as any).va('event', {
        name,
        data: {
          value: Math.round(value),
          rating,
          id,
        },
      })
    }

    // Custom analytics endpoint (optional)
    sendToAnalytics(metric)
  }
}

/**
 * Send metrics to custom analytics endpoint
 */
async function sendToAnalytics(metric: Metric) {
  try {
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
      navigationType: metric.navigationType,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    })

    // Uncomment and configure your analytics endpoint
    // await fetch('/api/analytics/web-vitals', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body,
    //   keepalive: true,
    // })

    // Store locally for debugging
    if (typeof window !== 'undefined') {
      const metrics = JSON.parse(
        localStorage.getItem('web-vitals') || '[]'
      ) as Metric[]
      metrics.push(metric)
      // Keep only last 50 metrics
      if (metrics.length > 50) {
        metrics.shift()
      }
      localStorage.setItem('web-vitals', JSON.stringify(metrics))
    }
  } catch (error) {
    console.error('Error sending web vitals:', error)
  }
}

/**
 * Performance thresholds for Core Web Vitals
 */
export const VITALS_THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint
  FID: { good: 100, needsImprovement: 300 }, // First Input Delay
  CLS: { good: 0.1, needsImprovement: 0.25 }, // Cumulative Layout Shift
  FCP: { good: 1800, needsImprovement: 3000 }, // First Contentful Paint
  TTFB: { good: 800, needsImprovement: 1800 }, // Time to First Byte
  INP: { good: 200, needsImprovement: 500 }, // Interaction to Next Paint
}

/**
 * Get rating for a metric value
 */
export function getMetricRating(
  name: string,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = VITALS_THRESHOLDS[name as keyof typeof VITALS_THRESHOLDS]
  if (!thresholds) return 'good'

  if (value <= thresholds.good) return 'good'
  if (value <= thresholds.needsImprovement) return 'needs-improvement'
  return 'poor'
}

/**
 * Get stored web vitals from localStorage
 */
export function getStoredMetrics(): Metric[] {
  if (typeof window === 'undefined') return []

  try {
    const metrics = localStorage.getItem('web-vitals')
    return metrics ? JSON.parse(metrics) : []
  } catch {
    return []
  }
}

/**
 * Clear stored metrics
 */
export function clearStoredMetrics() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('web-vitals')
  }
}

/**
 * Get average metrics
 */
export function getAverageMetrics() {
  const metrics = getStoredMetrics()
  const grouped: Record<string, number[]> = {}

  metrics.forEach((metric) => {
    if (!grouped[metric.name]) {
      grouped[metric.name] = []
    }
    grouped[metric.name].push(metric.value)
  })

  const averages: Record<string, { avg: number; rating: string }> = {}

  Object.entries(grouped).forEach(([name, values]) => {
    const avg = values.reduce((a, b) => a + b, 0) / values.length
    averages[name] = {
      avg: Math.round(avg),
      rating: getMetricRating(name, avg),
    }
  })

  return averages
}
