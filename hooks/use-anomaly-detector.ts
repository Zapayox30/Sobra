'use client'

import { useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/browser'
import { Database } from '@/types/database.types'
import { useFixedExpenses, usePersonalExpenses } from './use-expenses'
import { startOfMonth, endOfMonth, subMonths, isWithinInterval, parseISO } from 'date-fns'

type FinancialAlert = Database['public']['Tables']['financial_alerts']['Row']
type FinancialAlertInsert = Database['public']['Tables']['financial_alerts']['Insert']

interface SpendingStats {
  category: string
  currentMonthTotal: number
  averageMonthlyTotal: number
  percentageDiff: number
  isAnomaly: boolean
}

interface AnomalyResult {
  alerts: SpendingStats[]
  achievements: SpendingStats[]
  totalAnomalies: number
}

const ANOMALY_THRESHOLD = 40 // Alert if spending is 40%+ different from average

/**
 * Calculate spending statistics for anomaly detection
 */
export function useSpendingStats(monthsToAnalyze: number = 3): AnomalyResult {
  const { data: fixedExpenses = [] } = useFixedExpenses()
  const { data: personalExpenses = [] } = usePersonalExpenses()

  return useMemo(() => {
    const now = new Date()
    const currentMonthStart = startOfMonth(now)
    const currentMonthEnd = endOfMonth(now)

    // Combine all expenses with their categories
    const allExpenses = [
      ...fixedExpenses.filter(e => e.is_active).map(e => ({
        category: e.category || 'Other',
        amount: e.amount,
        starts_on: e.starts_on,
        ends_on: e.ends_on,
      })),
      ...personalExpenses.filter(e => e.is_active).map(e => ({
        category: e.category || 'Other',
        amount: e.amount,
        starts_on: e.starts_on,
        ends_on: e.ends_on,
      })),
    ]

    // Group by category and calculate stats
    const categoryStats: Record<string, {
      currentMonth: number
      historicalMonths: number[]
    }> = {}

    allExpenses.forEach(expense => {
      const category = expense.category
      if (!categoryStats[category]) {
        categoryStats[category] = {
          currentMonth: 0,
          historicalMonths: [],
        }
      }

      const startDate = expense.starts_on ? parseISO(expense.starts_on) : null
      const endDate = expense.ends_on ? parseISO(expense.ends_on) : null

      // Check if active in current month
      const isActiveCurrentMonth =
        (!startDate || startDate <= currentMonthEnd) &&
        (!endDate || endDate >= currentMonthStart)

      if (isActiveCurrentMonth) {
        categoryStats[category].currentMonth += expense.amount
      }

      // Check historical months
      for (let i = 1; i <= monthsToAnalyze; i++) {
        const monthStart = startOfMonth(subMonths(now, i))
        const monthEnd = endOfMonth(subMonths(now, i))

        const isActiveInMonth =
          (!startDate || startDate <= monthEnd) &&
          (!endDate || endDate >= monthStart)

        if (isActiveInMonth) {
          if (!categoryStats[category].historicalMonths[i - 1]) {
            categoryStats[category].historicalMonths[i - 1] = 0
          }
          categoryStats[category].historicalMonths[i - 1] += expense.amount
        }
      }
    })

    // Calculate anomalies and achievements
    const alerts: SpendingStats[] = []
    const achievements: SpendingStats[] = []

    Object.entries(categoryStats).forEach(([category, stats]) => {
      const average =
        stats.historicalMonths.length > 0
          ? stats.historicalMonths.reduce((a, b) => a + b, 0) / stats.historicalMonths.length
          : stats.currentMonth

      // Avoid division by zero
      if (average === 0 && stats.currentMonth === 0) return

      const percentageDiff = average > 0
        ? ((stats.currentMonth - average) / average) * 100
        : stats.currentMonth > 0 ? 100 : 0

      const spending: SpendingStats = {
        category,
        currentMonthTotal: stats.currentMonth,
        averageMonthlyTotal: average,
        percentageDiff,
        isAnomaly: Math.abs(percentageDiff) >= ANOMALY_THRESHOLD,
      }

      // Categorize as alert or achievement
      if (percentageDiff >= ANOMALY_THRESHOLD) {
        // Overspending
        alerts.push(spending)
      } else if (percentageDiff <= -ANOMALY_THRESHOLD && average > 0) {
        // Under budget / saving
        achievements.push(spending)
      }
    })

    return {
      alerts: alerts.sort((a, b) => b.percentageDiff - a.percentageDiff),
      achievements: achievements.sort((a, b) => a.percentageDiff - b.percentageDiff),
      totalAnomalies: alerts.length + achievements.length,
    }
  }, [fixedExpenses, personalExpenses, monthsToAnalyze])
}

/**
 * Fetch financial alerts from database
 */
export function useFinancialAlerts() {
  return useQuery({
    queryKey: ['financialAlerts'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('financial_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      return data as FinancialAlert[]
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

/**
 * Get unread alert count
 */
export function useUnreadAlertCount() {
  return useQuery({
    queryKey: ['unreadAlertCount'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase.rpc('get_unread_alert_count')

      if (error) throw error
      return data as number
    },
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Create a new financial alert
 */
export function useCreateAlert() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (alert: Omit<FinancialAlertInsert, 'user_id'>) => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')

      const { data, error } = await supabase
        .from('financial_alerts')
        .insert({ ...alert, user_id: user.id })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialAlerts'] })
      queryClient.invalidateQueries({ queryKey: ['unreadAlertCount'] })
    },
  })
}

/**
 * Mark alert as read
 */
export function useMarkAlertAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (alertId: string) => {
      const supabase = createClient()
      const { data, error } = await supabase.rpc('mark_alert_as_read', {
        alert_id: alertId,
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialAlerts'] })
      queryClient.invalidateQueries({ queryKey: ['unreadAlertCount'] })
    },
  })
}

/**
 * Mark all alerts as read
 */
export function useMarkAllAlertsAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase.rpc('mark_all_alerts_as_read')

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialAlerts'] })
      queryClient.invalidateQueries({ queryKey: ['unreadAlertCount'] })
    },
  })
}

/**
 * Auto-generate alerts based on spending anomalies
 * Call this function periodically or when user visits dashboard
 */
export function useGenerateAlerts() {
  const stats = useSpendingStats()
  const createAlert = useCreateAlert()
  const { data: existingAlerts = [] } = useFinancialAlerts()

  const generateAlerts = async () => {
    const now = new Date()
    const todayStr = now.toISOString().split('T')[0]

    // Check if we already generated alerts today
    const hasAlertsToday = existingAlerts.some(
      alert => alert.created_at.startsWith(todayStr)
    )

    if (hasAlertsToday) {
      return // Don't generate duplicate alerts
    }

    // Generate overspending alerts
    for (const alert of stats.alerts) {
      await createAlert.mutateAsync({
        alert_type: 'overspending',
        severity: alert.percentageDiff > 60 ? 'critical' : 'warning',
        title: `${alert.category} overspending detected`,
        message: `You've spent $${alert.currentMonthTotal.toFixed(0)} in ${alert.category} this month, ${alert.percentageDiff.toFixed(0)}% more than your average of $${alert.averageMonthlyTotal.toFixed(0)}.`,
        category: alert.category,
        amount_spent: alert.currentMonthTotal,
        amount_average: alert.averageMonthlyTotal,
        percentage_diff: alert.percentageDiff,
      })
    }

    // Generate achievement alerts
    for (const achievement of stats.achievements.slice(0, 3)) {
      await createAlert.mutateAsync({
        alert_type: 'achievement',
        severity: 'success',
        title: `Great job on ${achievement.category}!`,
        message: `You've spent $${achievement.currentMonthTotal.toFixed(0)} in ${achievement.category}, ${Math.abs(achievement.percentageDiff).toFixed(0)}% less than usual. Keep it up!`,
        category: achievement.category,
        amount_spent: achievement.currentMonthTotal,
        amount_average: achievement.averageMonthlyTotal,
        percentage_diff: achievement.percentageDiff,
      })
    }
  }

  return {
    generateAlerts,
    isGenerating: createAlert.isPending,
  }
}
