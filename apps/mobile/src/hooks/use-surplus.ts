import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useIncomes } from './use-incomes'
import { useFixedExpenses, usePersonalExpenses } from './use-expenses'
import { useCommitments } from './use-commitments'
import { useCardDues } from './use-credit-cards'
import { useDebts } from './use-debts'
import { useSavingsGoals } from './use-savings-goals'
import { useAccounts, useWallets } from './use-accounts'
import { calculateSurplus } from '../lib/sobra-engine'
import { supabase } from '../lib/supabase'
import type { SurplusHistory, SurplusOutput } from '../types'
import type { TablesInsert } from '../types/database.types'

/**
 * Main Sobra hook. Aggregates all financial data and computes surplus.
 */
export function useSurplus(monthStart: Date = new Date()) {
  const { data: incomes = [], isLoading: l1 } = useIncomes()
  const { data: fixedExpenses = [], isLoading: l2 } = useFixedExpenses()
  const { data: personalExpenses = [], isLoading: l3 } = usePersonalExpenses()
  const { data: commitments = [], isLoading: l4 } = useCommitments()
  const { data: debts = [], isLoading: l5 } = useDebts()
  const { data: savingsGoals = [], isLoading: l6 } = useSavingsGoals()
  const { data: accounts = [], isLoading: l7 } = useAccounts()
  const { data: wallets = [], isLoading: l8 } = useWallets()
  const { cardDueTotal = 0, cardMinimumDue = 0, nextDueDate, overdue, isLoading: l9 } = useCardDues(monthStart)

  const isLoading = l1 || l2 || l3 || l4 || l5 || l6 || l7 || l8 || l9

  const surplus = useMemo(() => {
    if (isLoading) return null

    return calculateSurplus({
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
        end_month: c.end_month ? new Date(c.end_month) : null,
      })),
      debts: debts.map((d) => ({
        monthly_payment: Number(d.monthly_payment),
        starts_on: new Date(d.starts_on),
        ends_on: d.ends_on ? new Date(d.ends_on) : null,
        is_active: d.is_active,
      })),
      savingsGoals: savingsGoals.map((s) => ({
        monthly_contribution: Number(s.monthly_contribution),
        is_active: s.is_active,
      })),
      cardDueTotal,
      accountBalances: accounts.filter((a) => a.is_active).map((a) => Number(a.current_balance)),
      walletBalances: wallets.filter((w) => w.is_active).map((w) => Number(w.current_balance)),
    })
  }, [incomes, fixedExpenses, personalExpenses, commitments, debts, savingsGoals, accounts, wallets, monthStart, cardDueTotal, isLoading])

  return { surplus, isLoading, accounts, wallets, debts, savingsGoals, cardDueTotal, cardMinimumDue, nextDueDate, overdue }
}

export function useSurplusHistory(months = 6) {
  return useQuery({
    queryKey: ['surplusHistory', months],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('surplus_history')
        .select('*')
        .order('month', { ascending: false })
        .limit(months)
      if (error) throw error
      return (data as SurplusHistory[]).reverse()
    },
    staleTime: 5 * 60_000,
  })
}

export function useSaveSurplus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ surplus, month }: { surplus: SurplusOutput; month: string }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')

      const record: TablesInsert<'surplus_history'> = {
        user_id: user.id,
        month,
        income_total: surplus.incomeTotal,
        fixed_expenses_total: surplus.fixedTotal,
        debts_total: surplus.debtsTotal,
        savings_committed: surplus.savingsCommitted,
        personal_expenses_total: surplus.personalTotal,
        commitments_total: surplus.commitmentsTotal,
        card_payments_total: surplus.cardDueTotal,
        gross_surplus: surplus.grossSurplus,
        net_surplus: surplus.netSurplus,
        surplus_safe: surplus.classification.safe,
        surplus_operative: surplus.classification.operative,
        surplus_unavailable: surplus.classification.unavailable,
        consolidated_balance: surplus.consolidatedBalance,
        daily_suggestion: surplus.dailySuggestion,
        generated_at: new Date().toISOString(),
      }

      const { data: existing } = await supabase
        .from('surplus_history')
        .select('id')
        .eq('user_id', user.id)
        .eq('month', month)
        .maybeSingle()

      if (existing) {
        const { error } = await supabase.from('surplus_history').update(record).eq('id', existing.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('surplus_history').insert(record)
        if (error) throw error
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['surplusHistory'] }),
  })
}
