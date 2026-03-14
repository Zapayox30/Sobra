/**
 * Tip Condition Rule Evaluator
 *
 * Evaluates the `condition_rule` JSON stored in financial_tips
 * against the user's actual financial state to determine which tips
 * are contextually relevant.
 *
 * Supported condition rules:
 * - { "no_emergency_fund": true }
 * - { "has_high_interest_debt": true }
 * - { "consecutive_positive_months": N }
 * - { "has_credit_cards": true }
 * - { "surplus_negative": true }
 * - { "has_debts": true }
 * - { "no_savings_goals": true }
 */

import type { FinancialTip, SavingsGoal, Debt, CreditCard, SurplusHistory } from '@/types'

export interface TipEvaluationContext {
  savingsGoals: SavingsGoal[]
  debts: Debt[]
  creditCards: CreditCard[]
  surplusHistory: SurplusHistory[]
  currentNetSurplus: number
}

/**
 * Evaluate whether a single condition rule is satisfied.
 */
export function evaluateConditionRule(
  rule: Record<string, unknown> | null | undefined,
  ctx: TipEvaluationContext
): boolean {
  // No condition = always show
  if (!rule || Object.keys(rule).length === 0) return true

  // no_emergency_fund: true → show if user has no active emergency fund goal
  if (rule.no_emergency_fund === true) {
    const hasEmergency = ctx.savingsGoals.some(
      (g) => g.goal_type === 'emergency_fund' && g.is_active
    )
    if (hasEmergency) return false
  }

  // has_high_interest_debt: true → show if user has debts (proxy — we don't store rates)
  if (rule.has_high_interest_debt === true) {
    const hasActiveDebts = ctx.debts.some((d) => d.is_active)
    if (!hasActiveDebts) return false
  }

  // consecutive_positive_months: N → show if last N months had positive surplus
  if (typeof rule.consecutive_positive_months === 'number') {
    const required = rule.consecutive_positive_months
    const sorted = [...ctx.surplusHistory]
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, required)
    if (sorted.length < required) return false
    const allPositive = sorted.every((h) => Number(h.net_surplus) > 0)
    if (!allPositive) return false
  }

  // has_credit_cards: true → show if user has any credit cards
  if (rule.has_credit_cards === true) {
    if (ctx.creditCards.length === 0) return false
  }

  // surplus_negative: true → show if current surplus is negative
  if (rule.surplus_negative === true) {
    if (ctx.currentNetSurplus >= 0) return false
  }

  // has_debts: true → show if user has active debts
  if (rule.has_debts === true) {
    const hasActiveDebts = ctx.debts.some((d) => d.is_active)
    if (!hasActiveDebts) return false
  }

  // no_savings_goals: true → show if user has no active savings goals
  if (rule.no_savings_goals === true) {
    const hasActiveGoals = ctx.savingsGoals.some((g) => g.is_active)
    if (hasActiveGoals) return false
  }

  return true
}

/**
 * Filter tips by their condition rules, given the user's financial context.
 * Returns only tips whose conditions are met (or have no condition).
 */
export function filterTipsByCondition(
  tips: FinancialTip[],
  ctx: TipEvaluationContext
): FinancialTip[] {
  return tips.filter((tip) =>
    evaluateConditionRule(tip.condition_rule as Record<string, unknown> | null, ctx)
  )
}
