/**
 * Sobra Engine — Types
 *
 * Interfaces for the surplus calculation engine.
 */
import type { Money } from '@/types'

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

export interface SurplusClassification {
    safe: Money
    operative: Money
    unavailable: Money
}

export interface SurplusOutput {
    incomeTotal: Money
    fixedTotal: Money
    debtsTotal: Money
    savingsCommitted: Money
    personalTotal: Money
    commitmentsTotal: Money
    cardDueTotal: Money
    grossSurplus: Money
    netSurplus: Money
    classification: SurplusClassification
    consolidatedBalance: Money
    dailySuggestion: Money
    daysInMonth: number
    remainingDays: number
}

/** Ratios for surplus classification – must sum to 1.0 */
export interface SurplusRatios {
    safe: number
    operative: number
    unavailable: number
}

export const DEFAULT_SURPLUS_RATIOS: SurplusRatios = {
    safe: 0.50,
    operative: 0.30,
    unavailable: 0.20,
}
