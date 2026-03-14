'use client'

import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useIncomes } from './use-incomes'
import { useFixedExpenses, usePersonalExpenses } from './use-expenses'
import { useMonthlyCommitments } from './use-commitments'
import { useCardDues } from './use-credit-cards'
import { useDebts } from './use-debts'
import { useSavingsGoals } from './use-savings-goals'
import { useAccounts } from './use-accounts'
import { useWallets } from './use-wallets'
import { calculateSurplus } from '@/lib/sobra-engine'
import { createClient } from '@/lib/supabase/browser'
import type { SurplusHistory } from '@/types'
import type { SurplusOutput } from '@/lib/sobra-engine'
import { toast } from 'sonner'

/**
 * Main Sobra hook: computes the full surplus breakdown for the current month.
 * Combines data from all financial sources and runs through the Sobra Engine.
 */
export function useSurplus(monthStart: Date = new Date()) {
    const { data: incomes = [], isLoading: incomesLoading } = useIncomes()
    const { data: fixedExpenses = [], isLoading: fixedLoading } = useFixedExpenses()
    const { data: personalExpenses = [], isLoading: personalLoading } = usePersonalExpenses()
    const { data: commitments = [], isLoading: commitmentsLoading } = useMonthlyCommitments()
    const { data: debts = [], isLoading: debtsLoading } = useDebts()
    const { data: savingsGoals = [], isLoading: savingsLoading } = useSavingsGoals()
    const { data: accounts = [], isLoading: accountsLoading } = useAccounts()
    const { data: wallets = [], isLoading: walletsLoading } = useWallets()
    const {
        cardDueTotal = 0,
        cardMinimumDue = 0,
        nextDueDate,
        overdue,
        isLoading: cardLoading,
    } = useCardDues(monthStart)

    const isLoading =
        incomesLoading ||
        fixedLoading ||
        personalLoading ||
        commitmentsLoading ||
        debtsLoading ||
        savingsLoading ||
        accountsLoading ||
        walletsLoading ||
        cardLoading

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
            accountBalances: accounts
                .filter((a) => a.is_active)
                .map((a) => Number(a.current_balance)),
            walletBalances: wallets
                .filter((w) => w.is_active)
                .map((w) => Number(w.current_balance)),
        })
    }, [
        incomes,
        fixedExpenses,
        personalExpenses,
        commitments,
        debts,
        savingsGoals,
        accounts,
        wallets,
        monthStart,
        cardDueTotal,
        isLoading,
    ])

    return {
        surplus,
        isLoading,
        // Raw data for components that need it
        accounts,
        wallets,
        debts,
        savingsGoals,
        cardDueTotal,
        cardMinimumDue,
        nextDueDate,
        overdue,
    }
}

/**
 * Fetch surplus history for the last N months.
 */
export function useSurplusHistory(months = 6) {
    return useQuery({
        queryKey: ['surplusHistory', months],
        queryFn: async () => {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('surplus_history')
                .select('*')
                .order('month', { ascending: false })
                .limit(months)

            if (error) throw error
            return (data as SurplusHistory[]).reverse()
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    })
}

/**
 * Save the current month's surplus snapshot to surplus_history.
 * Uses upsert on (user_id, month) to avoid duplicates — updates if already exists.
 */
export function useSaveSurplus() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ surplus, month }: { surplus: SurplusOutput; month: string }) => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No user')

            const record = {
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

            // Check if a record for this month already exists
            const { data: existing } = await supabase
                .from('surplus_history')
                .select('id')
                .eq('user_id', user.id)
                .eq('month', month)
                .maybeSingle()

            if (existing) {
                const { error } = await supabase
                    .from('surplus_history')
                    .update(record)
                    .eq('id', existing.id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('surplus_history')
                    .insert(record)
                if (error) throw error
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['surplusHistory'] })
            toast.success('Sobra del mes guardada en historial')
        },
        onError: (error: Error) => {
            toast.error('Error al guardar sobra')
        },
    })
}
