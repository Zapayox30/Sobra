/**
 * Sobra Engine — Core Calculation
 *
 * Computes the monthly surplus ("sobra") with classification.
 * This is the heart of the Sobra product.
 *
 * Formula:
 *   gross_surplus = income - fixed_expenses - debts - savings - commitments - card_due
 *   net_surplus   = gross_surplus - personal_expenses
 *
 * Classification (configurable ratios):
 *   safe        = net_surplus × 50%  (investable)
 *   operative   = net_surplus × 30%  (operational buffer)
 *   unavailable = net_surplus × 20%  (emergency reserve)
 */
import { isActiveInMonth, getMonthPeriod, getRemainingDaysInMonth } from '@/lib/calc'
import type { SurplusInput, SurplusOutput, SurplusRatios } from './types'
import { DEFAULT_SURPLUS_RATIOS } from './types'

function sum(amounts: number[]): number {
    return Number(amounts.reduce((a, b) => a + b, 0).toFixed(2))
}

function round2(n: number): number {
    return Number(n.toFixed(2))
}

/**
 * Calculate full surplus breakdown for a given month.
 */
export function calculateSurplus(
    input: SurplusInput,
    ratios: SurplusRatios = DEFAULT_SURPLUS_RATIOS
): SurplusOutput {
    const period = getMonthPeriod(input.monthStart)
    const { daysInMonth, remainingDays } = getRemainingDaysInMonth(input.monthStart)

    // Income
    const incomeTotal = sum(
        input.incomes
            .filter((x) => x.is_active && isActiveInMonth(x.starts_on, x.ends_on, period))
            .map((x) => x.amount)
    )

    // Fixed expenses
    const fixedTotal = sum(
        input.fixedExpenses
            .filter((x) => x.is_active && isActiveInMonth(x.starts_on, x.ends_on, period))
            .map((x) => x.amount)
    )

    // Debts
    const debtsTotal = sum(
        input.debts
            .filter((x) => x.is_active && isActiveInMonth(x.starts_on, x.ends_on, period))
            .map((x) => x.monthly_payment)
    )

    // Savings goals
    const savingsCommitted = sum(
        input.savingsGoals
            .filter((x) => x.is_active)
            .map((x) => x.monthly_contribution)
    )

    // Personal expenses
    const personalTotal = sum(
        input.personalBudgets
            .filter((x) => x.is_active && isActiveInMonth(x.starts_on, x.ends_on, period))
            .map((x) => x.amount)
    )

    // Commitments
    const commitmentsTotal = sum(
        input.commitments
            .filter((c) => c.start_month <= period.start && (!c.end_month || c.end_month >= period.start))
            .map((c) => c.amount_per_month)
    )

    const cardDueTotal = round2(input.cardDueTotal ?? 0)

    // Gross surplus: before personal spending
    const grossSurplus = round2(
        incomeTotal - fixedTotal - debtsTotal - savingsCommitted - commitmentsTotal - cardDueTotal
    )

    // Net surplus: after all deductions
    const netSurplus = round2(grossSurplus - personalTotal)

    // Classification
    const classification = {
        safe: netSurplus > 0 ? round2(netSurplus * ratios.safe) : 0,
        operative: netSurplus > 0 ? round2(netSurplus * ratios.operative) : 0,
        unavailable: netSurplus > 0 ? round2(netSurplus * ratios.unavailable) : 0,
    }

    // Consolidated balance
    const consolidatedBalance = round2(
        sum(input.accountBalances ?? []) + sum(input.walletBalances ?? [])
    )

    // Daily suggestion
    const dailySuggestion = round2(
        Math.max(netSurplus, 0) / remainingDays
    )

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
