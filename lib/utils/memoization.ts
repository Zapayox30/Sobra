/**
 * Memoization Utilities
 * Advanced performance utilities for React components and hooks
 */

import { useRef, useEffect, useMemo, useState } from 'react'

/**
 * Deep comparison for arrays - checks if array contents actually changed
 * Useful for dependency arrays in useMemo/useCallback
 */
export function useDeepCompareArray<T>(value: T[]): T[] {
  const ref = useRef<T[]>(value)

  if (!arraysEqual(ref.current, value)) {
    ref.current = value
  }

  return ref.current
}

function arraysEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false
  return a.every((item, index) => item === b[index])
}

/**
 * Deep comparison for objects - prevents unnecessary re-renders
 */
export function useDeepCompareMemo<T>(factory: () => T, deps: any[]): T {
  const ref = useRef<any[]>(deps)

  if (!shallowEqual(ref.current, deps)) {
    ref.current = deps
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, ref.current)
}

function shallowEqual(objA: any, objB: any): boolean {
  if (objA === objB) return true
  if (!objA || !objB) return false

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) return false

  return keysA.every((key) => objA[key] === objB[key])
}

/**
 * Debounced value - useful for search inputs and expensive operations
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Previous value hook - useful for animations and transitions
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

/**
 * Memoize expensive calculations with custom equality check
 */
export function useMemoCompare<T>(
  factory: () => T,
  deps: any[],
  compare: (prev: any[], next: any[]) => boolean
): T {
  const ref = useRef<any[]>(deps)

  if (!compare(ref.current, deps)) {
    ref.current = deps
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, ref.current)
}

/**
 * Stable callback that doesn't change reference
 * Better than useCallback for event handlers
 */
export function useEventCallback<T extends (...args: any[]) => any>(fn: T): T {
  const ref = useRef<T>(fn)

  useEffect(() => {
    ref.current = fn
  })

  return useRef((...args: any[]) => ref.current(...args)).current as T
}

/**
 * Memoized array transformation
 * Prevents unnecessary array.map() calls
 */
export function useMemoizedArray<T, R>(
  array: T[] | undefined,
  transform: (item: T) => R
): R[] {
  return useMemo(() => {
    if (!array) return []
    return array.map(transform)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [array])
}

/**
 * Intersection Observer hook for lazy loading
 */
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options?: IntersectionObserverInit
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [elementRef, options])

  return isIntersecting
}

/**
 * Throttle hook - limits function execution rate
 */
export function useThrottle<T>(value: T, interval: number = 500): T {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const lastExecuted = useRef<number>(Date.now())

  useEffect(() => {
    if (Date.now() >= lastExecuted.current + interval) {
      lastExecuted.current = Date.now()
      setThrottledValue(value)
    } else {
      const timer = setTimeout(() => {
        lastExecuted.current = Date.now()
        setThrottledValue(value)
      }, interval)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [value, interval])

  return throttledValue
}
