'use client'

import { useEffect } from 'react'
import { reportWebVitals } from '@/lib/analytics/web-vitals'

/**
 * Web Vitals Reporter Component
 * Automatically tracks and reports Core Web Vitals
 */
export function WebVitalsReporter() {
  useEffect(() => {
    // Dynamically import web-vitals to reduce initial bundle
    import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
      onCLS(reportWebVitals)
      onFCP(reportWebVitals)
      onLCP(reportWebVitals)
      onTTFB(reportWebVitals)
      onINP(reportWebVitals)
    })
  }, [])

  // This component doesn't render anything
  return null
}
