/**
 * SOBRA Engine — Mobile
 *
 * Pure calculation module. Same logic as web.
 * Formula:
 *   gross_surplus = income - fixed - debts - savings - commitments - card_due
 *   net_surplus   = gross_surplus - personal
 *
 * Classification:
 *   safe        = 50%  (investable)
 *   operative   = 30%  (buffer)
 *   unavailable = 20%  (emergency)
 */

import type { Money, Period, SurplusOutput } from '../types'

export interface SurplusInput {
  monthStart: Date
  incomes: { amount: Money; starts_on: Date; ends_on: Date | null; is_active: boolean }[]
  fixedExpenses: { amount: Money; starts_on: Date; ends_on: Date | null; is_active: boolean }[]
  personalBudgets: { amount: Money; starts_on: Date; ends_on: Date | null; is_active: boolean }[]
  commitments: { amount_per_month: Money; start_month: Date; end_month: Date | null }[]
  debts: { monthly_payment: Money; starts_on: Date; ends_on: Date | null; is_active: boolean }[]
  savingsGoals: { monthly_contribution: Money; is_active: boolean }[]
  cardDueTotal?: Money
  accountBalances?: Money[]
  walletBalances?: Money[]
}

export interface SurplusRatios {
  safe: number
  operative: number
  unavailable: number
}

export const DEFAULT_RATIOS: SurplusRatios = { safe: 0.50, operative: 0.30, unavailable: 0.20 }

// ── Helpers ──

function sum(arr: number[]): number {
  return Number(arr.reduce((a, b) => a + b, 0).toFixed(2))
}

function round2(n: number): number {
  return Number(n.toFixed(2))
}

export function getMonthPeriod(monthStart: Date): Period {
  const start = new Date(monthStart.getFullYear(), monthStart.getMonth(), 1)
  const end = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0)
  return { start, end }
}

export function getRemainingDays(monthStart: Date): { daysInMonth: number; remainingDays: number } {
  const period = getMonthPeriod(monthStart)
  const daysInMonth = period.end.getDate()
  const today = new Date()
  const isCurrent =
    today.getFullYear() === monthStart.getFullYear() &&
    today.getMonth() === monthStart.getMonth()
  const dayOfMonth = isCurrent ? today.getDate() : 1
  return { daysInMonth, remainingDays: Math.max(daysInMonth - dayOfMonth + 1, 1) }
}

function isActiveInMonth(start: Date, end: Date | null, period: Period): boolean {
  return start <= period.end && (!end || end >= period.start)
}

// ── Main calculation ──

export function calculateSurplus(
  input: SurplusInput,
  ratios: SurplusRatios = DEFAULT_RATIOS
): SurplusOutput {
  const period = getMonthPeriod(input.monthStart)
  const { daysInMonth, remainingDays } = getRemainingDays(input.monthStart)

  const incomeTotal = sum(
    input.incomes
      .filter((x) => x.is_active && isActiveInMonth(x.starts_on, x.ends_on, period))
      .map((x) => x.amount)
  )

  const fixedTotal = sum(
    input.fixedExpenses
      .filter((x) => x.is_active && isActiveInMonth(x.starts_on, x.ends_on, period))
      .map((x) => x.amount)
  )

  const debtsTotal = sum(
    input.debts
      .filter((x) => x.is_active && isActiveInMonth(x.starts_on, x.ends_on, period))
      .map((x) => x.monthly_payment)
  )

  const savingsCommitted = sum(
    input.savingsGoals.filter((x) => x.is_active).map((x) => x.monthly_contribution)
  )

  const personalTotal = sum(
    input.personalBudgets
      .filter((x) => x.is_active && isActiveInMonth(x.starts_on, x.ends_on, period))
      .map((x) => x.amount)
  )

  const commitmentsTotal = sum(
    input.commitments
      .filter((c) => c.start_month <= period.start && (!c.end_month || c.end_month >= period.start))
      .map((c) => c.amount_per_month)
  )

  const cardDueTotal = round2(input.cardDueTotal ?? 0)

  const grossSurplus = round2(incomeTotal - fixedTotal - debtsTotal - savingsCommitted - commitmentsTotal - cardDueTotal)
  const netSurplus = round2(grossSurplus - personalTotal)

  const classification = {
    safe: netSurplus > 0 ? round2(netSurplus * ratios.safe) : 0,
    operative: netSurplus > 0 ? round2(netSurplus * ratios.operative) : 0,
    unavailable: netSurplus > 0 ? round2(netSurplus * ratios.unavailable) : 0,
  }

  const consolidatedBalance = round2(sum(input.accountBalances ?? []) + sum(input.walletBalances ?? []))
  const dailySuggestion = round2(Math.max(netSurplus, 0) / remainingDays)

  return {
    incomeTotal,
    fixedTotal,
    debtsTotal,
    savingsCommitted,
    personalTotal,
    commitmentsTotal,
    cardDueTotal,
    grossSurplus,
    netSurplus,
    classification,
    consolidatedBalance,
    dailySuggestion,
    daysInMonth,
    remainingDays,
  }
}
