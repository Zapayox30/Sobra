import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { CreditCard, CardStatement, CardPayment } from '../types'
import type { TablesInsert } from '../types/database.types'
import { useMemo } from 'react'
import { Alert } from 'react-native'

export function useCreditCards() {
  return useQuery({
    queryKey: ['credit_cards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('credit_cards')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as CreditCard[]
    },
    staleTime: 2 * 60_000,
  })
}

export function useCreateCreditCard() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (card: Omit<TablesInsert<'credit_cards'>, 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')
      const { data, error } = await supabase
        .from('credit_cards')
        .insert({ ...card, user_id: user.id })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['credit_cards'] }),
    onError: () => Alert.alert('Error', 'No se pudo guardar'),
  })
}

export function useDeleteCreditCard() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('credit_cards').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['credit_cards'] }),
  })
}

export function useCardStatements(monthStart?: Date) {
  const start = monthStart ?? new Date()
  const from = new Date(start.getFullYear(), start.getMonth(), 1)
  const to = new Date(start.getFullYear(), start.getMonth() + 1, 0)

  return useQuery({
    queryKey: ['card_statements', from.toISOString()],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('card_statements')
        .select('*')
        .gte('due_date', from.toISOString().split('T')[0])
        .lte('due_date', to.toISOString().split('T')[0])
        .order('due_date', { ascending: true })
      if (error) throw error
      return data as CardStatement[]
    },
  })
}

export function useCardPayments(monthStart?: Date) {
  const start = monthStart ?? new Date()
  const from = new Date(start.getFullYear(), start.getMonth(), 1)
  const to = new Date(start.getFullYear(), start.getMonth() + 1, 0)

  return useQuery({
    queryKey: ['card_payments', from.toISOString()],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('card_payments')
        .select('*')
        .gte('paid_at', from.toISOString().split('T')[0])
        .lte('paid_at', to.toISOString().split('T')[0])
        .order('paid_at', { ascending: false })
      if (error) throw error
      return data as CardPayment[]
    },
  })
}

export function useCardDues(monthStart: Date = new Date()) {
  const { data: statements = [], isLoading: statementsLoading } = useCardStatements(monthStart)
  const { data: payments = [], isLoading: paymentsLoading } = useCardPayments(monthStart)

  const result = useMemo(() => {
    const paymentByStatement = payments.reduce<Record<string, number>>((acc, p) => {
      if (p.statement_id) {
        acc[p.statement_id] = (acc[p.statement_id] || 0) + Number(p.amount)
      }
      return acc
    }, {})

    let cardDueTotal = 0
    let cardMinimumDue = 0
    let nextDueDate: Date | null = null
    let overdue = false
    const today = new Date()

    statements.forEach((s) => {
      const paid = paymentByStatement[s.id] || 0
      const dueLeft = Math.max(Number(s.total_due) - paid, 0)
      const minLeft = Math.max(Number(s.minimum_due) - paid, 0)
      cardDueTotal += dueLeft
      cardMinimumDue += minLeft
      const due = s.due_date ? new Date(s.due_date) : null
      if (due && (!nextDueDate || due < nextDueDate)) nextDueDate = due
      if (due && due < today && dueLeft > 0) overdue = true
    })

    return {
      cardDueTotal: Number(cardDueTotal.toFixed(2)),
      cardMinimumDue: Number(cardMinimumDue.toFixed(2)),
      nextDueDate,
      overdue,
    }
  }, [payments, statements])

  return { ...result, isLoading: statementsLoading || paymentsLoading }
}
