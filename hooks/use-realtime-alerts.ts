'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { toast } from 'sonner'
import { useMetricsTimeSeries } from './use-metrics-timeseries'
import {
  checkThreshold,
  createAlert,
  type Alert,
  type AlertSeverity,
} from '@/lib/metrics/thresholds'

const MAX_ALERTS_HISTORY = 100

/**
 * Hook to detect and manage real-time alerts
 */
export function useRealtimeAlerts() {
  const { timeSeries } = useMetricsTimeSeries()
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([])
  const [alertsHistory, setAlertsHistory] = useState<Alert[]>([])
  const [soundEnabled, setSoundEnabled] = useState(true)
  const previousValues = useRef<Record<string, number>>({})
  const notifiedAlerts = useRef<Set<string>>(new Set())

  // Check metrics and trigger alerts
  const checkMetrics = useCallback(
    (dataPoint: typeof timeSeries[0]) => {
      const metricsToCheck = [
        { key: 'LCP', value: dataPoint.LCP },
        { key: 'FID', value: dataPoint.FID },
        { key: 'CLS', value: dataPoint.CLS },
        { key: 'FCP', value: dataPoint.FCP },
        { key: 'TTFB', value: dataPoint.TTFB },
        { key: 'INP', value: dataPoint.INP },
        { key: 'cacheHitRate', value: dataPoint.cacheHitRate },
        { key: 'cacheSize', value: dataPoint.cacheSize },
        { key: 'networkLatency', value: dataPoint.networkLatency },
        { key: 'networkFailures', value: dataPoint.networkFailures },
      ]

      const newAlerts: Alert[] = []

      metricsToCheck.forEach(({ key, value }) => {
        if (value === undefined || value === null) return

        const { exceeded, severity } = checkThreshold(key, value)

        if (exceeded && severity) {
          const previousValue = previousValues.current[key]
          const alertKey = `${key}-${severity}`

          // Only alert if:
          // 1. First time seeing this metric
          // 2. Value crossed threshold (wasn't exceeding before)
          // 3. Severity increased
          const shouldAlert =
            previousValue === undefined ||
            !checkThreshold(key, previousValue).exceeded ||
            !notifiedAlerts.current.has(alertKey)

          if (shouldAlert) {
            const alert = createAlert(key, value, severity)
            newAlerts.push(alert)
            notifiedAlerts.current.add(alertKey)

            // Show toast notification
            showToastNotification(alert)
          }
        } else {
          // Reset notification if metric is back to normal
          const alertKey = `${key}-warning`
          const criticalKey = `${key}-critical`
          notifiedAlerts.current.delete(alertKey)
          notifiedAlerts.current.delete(criticalKey)
        }

        // Store current value for next comparison
        previousValues.current[key] = value
      })

      if (newAlerts.length > 0) {
        setActiveAlerts((prev) => {
          // Remove old alerts for same metric
          const filtered = prev.filter(
            (a) => !newAlerts.some((n) => n.metric === a.metric)
          )
          return [...filtered, ...newAlerts]
        })

        setAlertsHistory((prev) => {
          const updated = [...newAlerts, ...prev]
          if (updated.length > MAX_ALERTS_HISTORY) {
            return updated.slice(0, MAX_ALERTS_HISTORY)
          }
          return updated
        })
      }
    },
    []
  )

  // Monitor time series for new data points
  useEffect(() => {
    if (timeSeries.length === 0) return

    const latestDataPoint = timeSeries[timeSeries.length - 1]
    checkMetrics(latestDataPoint)
  }, [timeSeries, checkMetrics])

  // Show toast notification
  const showToastNotification = useCallback(
    (alert: Alert) => {
      const toastFn = alert.severity === 'critical' ? toast.error : toast.warning

      toastFn(alert.message, {
        description: alert.description,
        duration: alert.severity === 'critical' ? 10000 : 5000,
        action: {
          label: 'Dismiss',
          onClick: () => acknowledgeAlert(alert.id),
        },
      })

      // Play sound if enabled
      if (soundEnabled) {
        playAlertSound(alert.severity)
      }
    },
    [soundEnabled]
  )

  // Play alert sound
  const playAlertSound = useCallback((severity: AlertSeverity) => {
    if (typeof window === 'undefined') return

    try {
      const audio = new Audio(
        severity === 'critical'
          ? 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApMn+DyvmwhBjGH0fPTgjMGHm7A7+OZURE' // Beep sound
          : 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApMn+DyvmwhBjGH0fPTgjMGHm7A7+OZURE'
      )
      audio.volume = 0.3
      audio.play().catch(() => {
        // Ignore errors (user interaction required)
      })
    } catch (error) {
      // Silently fail
    }
  }, [])

  // Acknowledge alert
  const acknowledgeAlert = useCallback((alertId: string) => {
    setActiveAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    )
  }, [])

  // Clear all active alerts
  const clearActiveAlerts = useCallback(() => {
    setActiveAlerts([])
  }, [])

  // Clear alerts history
  const clearHistory = useCallback(() => {
    setAlertsHistory([])
  }, [])

  // Toggle sound
  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev)
  }, [])

  // Get unacknowledged alerts count
  const unacknowledgedCount = activeAlerts.filter((a) => !a.acknowledged).length

  return {
    activeAlerts,
    alertsHistory,
    soundEnabled,
    unacknowledgedCount,
    acknowledgeAlert,
    clearActiveAlerts,
    clearHistory,
    toggleSound,
  }
}
