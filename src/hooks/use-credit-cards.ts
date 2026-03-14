'use client'

import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/browser'
import type {
  CreditCard, CreditCardInsert, CreditCardUpdate,
  CardStatement, CardStatementInsert, CardStatementUpdate,
  CardPayment, CardPaymentInsert, CardPaymentUpdate,
  CardTransaction, CardTransactionInsert, CardTransactionUpdate,
} from '@/types'
import { toast } from 'sonner'
import { getMonthPeriod } from '@/lib/calc'

export function useCreditCards() {
  return useQuery({
    queryKey: ['credit_cards'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('credit_cards')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as CreditCard[]
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}

export function useCreateCreditCard() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (card: Omit<CreditCardInsert, 'user_id'>) => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')

      const { data, error } = await supabase
        .from('credit_cards')
        .insert({ ...card, user_id: user.id })
        .select()
        .single()

      if (error) throw error
      return data as CreditCard
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit_cards'] })
      toast.success('Tarjeta guardada')
    },
    onError: () => toast.error('Error al guardar tarjeta'),
  })
}

export function useUpdateCreditCard() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...updates }: CreditCardUpdate & { id: string }) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('credit_cards')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as CreditCard
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit_cards'] })
      toast.success('Tarjeta actualizada')
    },
    onError: () => toast.error('Error al actualizar tarjeta'),
  })
}

export function useDeleteCreditCard() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('credit_cards').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit_cards'] })
      toast.success('Tarjeta eliminada')
    },
    onError: () => toast.error('Error al eliminar tarjeta'),
  })
}

export function useCardStatements(monthStart?: Date) {
  const start = monthStart ? new Date(monthStart) : new Date()
  const from = new Date(start.getFullYear(), start.getMonth(), 1)
  const to = new Date(start.getFullYear(), start.getMonth() + 1, 0)

  return useQuery({
    queryKey: ['card_statements', from.toISOString()],
    queryFn: async () => {
      const supabase = createClient()
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

export function useCreateCardStatement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (statement: Omit<CardStatementInsert, 'user_id'>) => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')

      const payload = { ...statement, user_id: user.id }
      const { data, error } = await supabase
        .from('card_statements')
        .insert(payload)
        .select()
        .single()

      if (error) throw error
      return data as CardStatement
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['card_statements'] })
      toast.success('Estado registrado')
    },
    onError: () => toast.error('Error al registrar estado'),
  })
}

export function useUpdateCardStatement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...updates }: CardStatementUpdate & { id: string }) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('card_statements')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as CardStatement
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['card_statements'] })
      queryClient.invalidateQueries({ queryKey: ['card_dues'] })
      toast.success('Estado actualizado')
    },
    onError: () => toast.error('Error al actualizar estado'),
  })
}

export function useDeleteCardStatement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('card_statements').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['card_statements'] })
      queryClient.invalidateQueries({ queryKey: ['card_dues'] })
      toast.success('Estado eliminado')
    },
    onError: () => toast.error('Error al eliminar estado'),
  })
}

export function useCardPayments(monthStart?: Date) {
  const start = monthStart ? new Date(monthStart) : new Date()
  const from = new Date(start.getFullYear(), start.getMonth(), 1)
  const to = new Date(start.getFullYear(), start.getMonth() + 1, 0)

  return useQuery({
    queryKey: ['card_payments', from.toISOString()],
    queryFn: async () => {
      const supabase = createClient()
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

export function useCreateCardPayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payment: Omit<CardPaymentInsert, 'user_id'>) => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')

      const payload = { ...payment, user_id: user.id }
      const { data, error } = await supabase
        .from('card_payments')
        .insert(payload)
        .select()
        .single()

      if (error) throw error
      return data as CardPayment
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['card_payments'] })
      queryClient.invalidateQueries({ queryKey: ['card_statements'] })
      queryClient.invalidateQueries({ queryKey: ['card_dues'] })
      toast.success('Pago registrado')
    },
    onError: () => toast.error('Error al registrar pago'),
  })
}

export function useUpdateCardPayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...updates }: CardPaymentUpdate & { id: string }) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('card_payments')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as CardPayment
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['card_payments'] })
      queryClient.invalidateQueries({ queryKey: ['card_statements'] })
      queryClient.invalidateQueries({ queryKey: ['card_dues'] })
      toast.success('Pago actualizado')
    },
    onError: () => toast.error('Error al actualizar pago'),
  })
}

export function useDeleteCardPayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('card_payments').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['card_payments'] })
      queryClient.invalidateQueries({ queryKey: ['card_statements'] })
      queryClient.invalidateQueries({ queryKey: ['card_dues'] })
      toast.success('Pago eliminado')
    },
    onError: () => toast.error('Error al eliminar pago'),
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

  return {
    ...result,
    statements,
    payments,
    isLoading: statementsLoading || paymentsLoading,
  }
}

export function useCardTransactions() {
  return useQuery({
    queryKey: ['card_transactions'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('card_transactions')
        .select('*')
        .order('purchased_at', { ascending: false })

      if (error) throw error
      return data as CardTransaction[]
    },
  })
}

export function useCreateCardTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (transaction: Omit<CardTransactionInsert, 'user_id'>) => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')

      const payload = { ...transaction, user_id: user.id }
      const { data, error } = await supabase
        .from('card_transactions')
        .insert(payload)
        .select()
        .single()

      if (error) throw error
      return data as CardTransaction
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['card_transactions'] })
      toast.success('Consumo registrado')
    },
    onError: () => toast.error('Error al registrar consumo'),
  })
}

export function useUpdateCardTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...updates }: CardTransactionUpdate & { id: string }) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('card_transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as CardTransaction
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['card_transactions'] })
      toast.success('Consumo actualizado')
    },
    onError: () => toast.error('Error al actualizar consumo'),
  })
}

export function useDeleteCardTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('card_transactions').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['card_transactions'] })
      toast.success('Consumo eliminado')
    },
    onError: () => toast.error('Error al eliminar consumo'),
  })
}

export function useCardSpending(monthStart: Date = new Date()) {
  const { data: transactions = [], isLoading } = useCardTransactions()

  const result = useMemo(() => {
    const period = getMonthPeriod(monthStart)
    const targetMonthStart = new Date(
      monthStart.getFullYear(),
      monthStart.getMonth(),
      1
    )

    let monthlySpend = 0
    let installmentsDue = 0

    transactions.forEach((t) => {
      const purchased = new Date(t.purchased_at)
      if (purchased >= period.start && purchased <= period.end) {
        monthlySpend += Number(t.amount)
      }

      const installmentsTotal = t.installments_total && t.installments_total > 0 ? t.installments_total : 1
      const purchaseMonth = new Date(purchased.getFullYear(), purchased.getMonth(), 1)
      const monthsDiff =
        (targetMonthStart.getFullYear() - purchaseMonth.getFullYear()) * 12 +
        (targetMonthStart.getMonth() - purchaseMonth.getMonth())

      if (monthsDiff >= 0 && monthsDiff < installmentsTotal) {
        installmentsDue += Number(t.amount) / installmentsTotal
      }
    })

    return {
      monthlySpend: Number(monthlySpend.toFixed(2)),
      installmentsDue: Number(installmentsDue.toFixed(2)),
    }
  }, [monthStart, transactions])

  return {
    ...result,
    transactions,
    isLoading,
  }
}
