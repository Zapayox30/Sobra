'use client'

import { useMemo } from 'react'
import { useFixedExpenses } from './use-expenses'
import { useSavingsGoals } from './use-savings-goals'
import { useDebts } from './use-debts'
import type { SavingsGoal } from '@/types'

export interface EmergencyFundStatus {
  /** The user's active emergency fund goal, if any */
  goal: SavingsGoal | null
  /** Whether the user has an active emergency fund goal */
  hasGoal: boolean
  /** Total monthly fixed expenses (used to compute target) */
  monthlyFixedExpenses: number
  /** Recommended target: 3 months of fixed expenses */
  targetMin: number
  /** Recommended target: 6 months of fixed expenses */
  targetMax: number
  /** Suggested target (average of min/max) */
  suggestedTarget: number
  /** Current amount saved toward emergency fund */
  currentAmount: number
  /** How many months of expenses are currently covered */
  monthsCovered: number
  /** Progress percentage toward the goal's target (0-100+) */
  progressPercent: number
  /** Health classification */
  health: 'none' | 'critical' | 'building' | 'healthy' | 'strong'
  /** Health key for i18n lookup (e.g. healthNone, healthCritical) */
  healthKey: 'healthNone' | 'healthCritical' | 'healthBuilding' | 'healthHealthy' | 'healthStrong'
  /** Recommended monthly contribution based on surplus */
  suggestedContribution: number
  /** Total active debts (for readiness check) */
  hasActiveDebts: boolean
}

/**
 * Emergency Fund hook — computes the full emergency fund status
 * based on user's savings goals, fixed expenses, and debts.
 */
export function useEmergencyFund(netSurplus = 0): EmergencyFundStatus {
  const { data: savingsGoals = [] } = useSavingsGoals()
  const { data: fixedExpenses = [] } = useFixedExpenses()
  const { data: debts = [] } = useDebts()

  return useMemo(() => {
    // Find the emergency fund goal
    const goal = savingsGoals.find(
      (g) => g.goal_type === 'emergency_fund' && g.is_active
    ) ?? null

    // Calculate total monthly fixed expenses (active only)
    const monthlyFixedExpenses = fixedExpenses
      .filter((e) => e.is_active)
      .reduce((sum, e) => sum + Number(e.amount), 0)

    // Targets: 3-6 months of fixed expenses
    const targetMin = monthlyFixedExpenses * 3
    const targetMax = monthlyFixedExpenses * 6
    const suggestedTarget = Math.round((targetMin + targetMax) / 2)

    // Current amount from the goal
    const currentAmount = goal ? Number(goal.current_amount) : 0

    // Months covered
    const monthsCovered = monthlyFixedExpenses > 0
      ? Number((currentAmount / monthlyFixedExpenses).toFixed(1))
      : 0

    // Progress toward the goal's own target, or toward suggestedTarget
    const goalTarget = goal ? Number(goal.target_amount) : suggestedTarget
    const progressPercent = goalTarget > 0
      ? Math.round((currentAmount / goalTarget) * 100)
      : 0

    // Health classification
    let health: EmergencyFundStatus['health']
    let healthKey: EmergencyFundStatus['healthKey']

    if (!goal) {
      health = 'none'
      healthKey = 'healthNone'
    } else if (monthsCovered < 1) {
      health = 'critical'
      healthKey = 'healthCritical'
    } else if (monthsCovered < 3) {
      health = 'building'
      healthKey = 'healthBuilding'
    } else if (monthsCovered < 6) {
      health = 'healthy'
      healthKey = 'healthHealthy'
    } else {
      health = 'strong'
      healthKey = 'healthStrong'
    }

    // Suggested contribution: 20% of net surplus
    const suggestedContribution = netSurplus > 0
      ? Math.round(netSurplus * 0.2)
      : 0

    const hasActiveDebts = debts.some((d) => d.is_active)

    return {
      goal,
      hasGoal: !!goal,
      monthlyFixedExpenses,
      targetMin,
      targetMax,
      suggestedTarget,
      currentAmount,
      monthsCovered,
      progressPercent,
      health,
      healthKey,
      suggestedContribution,
      hasActiveDebts,
    }
  }, [savingsGoals, fixedExpenses, debts, netSurplus])
}
