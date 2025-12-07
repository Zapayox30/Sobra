'use client'

import { useMemo } from 'react'
import { useFixedExpenses, usePersonalExpenses } from './use-expenses'
import { useIncomes } from './use-incomes'
import { useMonthlyCommitments } from './use-commitments'
import { startOfMonth, format, subMonths, parseISO } from 'date-fns'

export interface MonthlyData {
  month: string // "Jan 2024"
  monthKey: string // "2024-01"
  income: number
  expenses: number
  commitments: number
  balance: number
  savings: number
}

export interface CategoryData {
  name: string
  value: number
  percentage: number
  color: string
}

export interface TrendData {
  monthlyTrends: MonthlyData[]
  categoryBreakdown: CategoryData[]
  totalIncome: number
  totalExpenses: number
  averageMonthlyIncome: number
  averageMonthlyExpenses: number
  savingsRate: number
}

const CATEGORY_COLORS: Record<string, string> = {
  fixed: 'hsl(var(--chart-1))',
  personal: 'hsl(var(--chart-2))',
  commitments: 'hsl(var(--chart-3))',
  other: 'hsl(var(--chart-4))',
}

/**
 * Hook to calculate financial trends over time
 */
export function useFinancialTrends(monthsToShow: number = 6): TrendData {
  const { data: fixedExpenses = [] } = useFixedExpenses()
  const { data: personalExpenses = [] } = usePersonalExpenses()
  const { data: incomes = [] } = useIncomes()
  const { data: commitments = [] } = useMonthlyCommitments()

  // Combine both expense types
  const expenses = useMemo(() => {
    return [
      ...fixedExpenses.map((exp) => ({ ...exp, expense_type: 'fixed' as const })),
      ...personalExpenses.map((exp) => ({ ...exp, expense_type: 'personal' as const })),
    ]
  }, [fixedExpenses, personalExpenses])

  const trends = useMemo(() => {
    const now = new Date()
    const months: MonthlyData[] = []

    // Generate last N months
    for (let i = monthsToShow - 1; i >= 0; i--) {
      const monthDate = subMonths(now, i)
      const monthStart = startOfMonth(monthDate)
      const monthKey = format(monthStart, 'yyyy-MM')
      const monthLabel = format(monthStart, 'MMM yyyy')

      months.push({
        month: monthLabel,
        monthKey,
        income: 0,
        expenses: 0,
        commitments: 0,
        balance: 0,
        savings: 0,
      })
    }

    // Aggregate incomes by month
    incomes.forEach((income) => {
      if (!income.is_active) return

      const startDate = income.starts_on ? parseISO(income.starts_on) : null
      const endDate = income.ends_on ? parseISO(income.ends_on) : null

      months.forEach((month) => {
        const monthDate = parseISO(month.monthKey + '-01')

        // Check if income is active for this month
        const isActiveInMonth =
          (!startDate || monthDate >= startDate) &&
          (!endDate || monthDate <= endDate)

        if (isActiveInMonth) {
          month.income += income.amount
        }
      })
    })

    // Aggregate expenses by month
    expenses.forEach((expense) => {
      if (!expense.is_active) return

      const startDate = expense.starts_on ? parseISO(expense.starts_on) : null
      const endDate = expense.ends_on ? parseISO(expense.ends_on) : null

      months.forEach((month) => {
        const monthDate = parseISO(month.monthKey + '-01')

        const isActiveInMonth =
          (!startDate || monthDate >= startDate) &&
          (!endDate || monthDate <= endDate)

        if (isActiveInMonth) {
          month.expenses += expense.amount
        }
      })
    })

    // Aggregate commitments by month
    commitments.forEach((commitment) => {
      if (!commitment.is_active) return

      const startDate = commitment.starts_on
        ? parseISO(commitment.starts_on)
        : null
      const endDate = commitment.ends_on ? parseISO(commitment.ends_on) : null

      months.forEach((month) => {
        const monthDate = parseISO(month.monthKey + '-01')

        const isActiveInMonth =
          (!startDate || monthDate >= startDate) &&
          (!endDate || monthDate <= endDate)

        if (isActiveInMonth) {
          month.commitments += commitment.amount
        }
      })
    })

    // Calculate balance and savings for each month
    months.forEach((month) => {
      const totalExpenses = month.expenses + month.commitments
      month.balance = month.income - totalExpenses
      month.savings = month.balance > 0 ? month.balance : 0
    })

    // Calculate category breakdown (for pie chart)
    const categoryTotals = {
      fixed: 0,
      personal: 0,
      commitments: 0,
    }

    expenses.forEach((expense) => {
      if (!expense.is_active) return
      if (expense.expense_type === 'fixed') {
        categoryTotals.fixed += expense.amount * monthsToShow
      } else {
        categoryTotals.personal += expense.amount * monthsToShow
      }
    })

    commitments.forEach((commitment) => {
      if (!commitment.is_active) return
      categoryTotals.commitments += commitment.amount * monthsToShow
    })

    const total =
      categoryTotals.fixed +
      categoryTotals.personal +
      categoryTotals.commitments

    const categoryBreakdown: CategoryData[] = [
      {
        name: 'Fixed Expenses',
        value: categoryTotals.fixed,
        percentage: total > 0 ? (categoryTotals.fixed / total) * 100 : 0,
        color: CATEGORY_COLORS.fixed,
      },
      {
        name: 'Personal Expenses',
        value: categoryTotals.personal,
        percentage: total > 0 ? (categoryTotals.personal / total) * 100 : 0,
        color: CATEGORY_COLORS.personal,
      },
      {
        name: 'Commitments',
        value: categoryTotals.commitments,
        percentage: total > 0 ? (categoryTotals.commitments / total) * 100 : 0,
        color: CATEGORY_COLORS.commitments,
      },
    ].filter((cat) => cat.value > 0) // Only show categories with values

    // Calculate totals and averages
    const totalIncome = months.reduce((sum, m) => sum + m.income, 0)
    const totalExpenses = months.reduce(
      (sum, m) => sum + m.expenses + m.commitments,
      0
    )
    const averageMonthlyIncome = totalIncome / monthsToShow
    const averageMonthlyExpenses = totalExpenses / monthsToShow
    const savingsRate =
      totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0

    return {
      monthlyTrends: months,
      categoryBreakdown,
      totalIncome,
      totalExpenses,
      averageMonthlyIncome,
      averageMonthlyExpenses,
      savingsRate,
    }
  }, [expenses, incomes, commitments, monthsToShow, fixedExpenses, personalExpenses])

  return trends
}
