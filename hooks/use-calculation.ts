'use client'

import { useMemo } from 'react'
import { useIncomes } from './use-incomes'
import { useFixedExpenses, usePersonalExpenses } from './use-expenses'
import { useMonthlyCommitments } from './use-commitments'
import { useCardDues } from './use-credit-cards'
import { calculateMonthlySobra } from '@/lib/finance/calc'

export function useMonthlyCalculation(monthStart: Date = new Date()) {
  const { data: incomes = [], isLoading: incomesLoading } = useIncomes()
  const { data: fixedExpenses = [], isLoading: fixedLoading } = useFixedExpenses()
  const { data: personalExpenses = [], isLoading: personalLoading } =
    usePersonalExpenses()
  const { data: commitments = [], isLoading: commitmentsLoading } =
    useMonthlyCommitments()
  const {
    cardDueTotal = 0,
    cardMinimumDue = 0,
    nextDueDate,
    overdue,
    isLoading: cardLoading,
    statements: cardStatements,
    payments: cardPayments,
  } = useCardDues(monthStart)

  const isLoading =
    incomesLoading || fixedLoading || personalLoading || commitmentsLoading || cardLoading

  const calculation = useMemo(() => {
    if (isLoading) return null

    return calculateMonthlySobra({
      monthStart,
      incomes: incomes.map((i) => ({
        amount: Number(i.amount),
        starts_on: new Date(i.starts_on),
        ends_on: i.ends_on ? new Date(i.ends_on) : null,
        is_active: i.is_active,
      })),
      fixedExpenses: fixedExpenses.map((e) => ({
        amount: Number(e.amount),
        starts_on: new Date(e.starts_on),
        ends_on: e.ends_on ? new Date(e.ends_on) : null,
        is_active: e.is_active,
      })),
      personalBudgets: personalExpenses.map((e) => ({
        amount: Number(e.amount),
        starts_on: new Date(e.starts_on),
        ends_on: e.ends_on ? new Date(e.ends_on) : null,
        is_active: e.is_active,
      })),
      commitments: commitments.map((c) => ({
        amount_per_month: Number(c.amount_per_month),
        start_month: new Date(c.start_month),
        end_month: new Date(c.end_month),
      })),
      cardDueTotal,
    })
  }, [
    incomes,
    fixedExpenses,
    personalExpenses,
    commitments,
    monthStart,
    cardDueTotal,
    isLoading,
  ])

  return {
    calculation,
    isLoading,
    incomes,
    fixedExpenses,
    personalExpenses,
    commitments,
    cardDueTotal,
    cardMinimumDue,
    nextDueDate,
    overdue,
    cardStatements,
    cardPayments,
  }
}

