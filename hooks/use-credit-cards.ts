'use client'

import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/browser'
import { Database } from '@/types/database.types'
import { toast } from 'sonner'
import { getMonthPeriod } from '@/lib/finance/calc'

type CreditCard = Database['public']['Tables']['credit_cards']['Row']
type CreditCardInsert = Database['public']['Tables']['credit_cards']['Insert']
type CreditCardUpdate = Database['public']['Tables']['credit_cards']['Update']

type CardStatement = Database['public']['Tables']['card_statements']['Row']
type CardStatementInsert = Database['public']['Tables']['card_statements']['Insert']

type CardPayment = Database['public']['Tables']['card_payments']['Row']
type CardPaymentInsert = Database['public']['Tables']['card_payments']['Insert']
type CardTransaction = Database['public']['Tables']['card_transactions']['Row']
type CardTransactionInsert = Database['public']['Tables']['card_transactions']['Insert']

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
  })
}

export function useCreateCreditCard() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (card: CreditCardInsert) => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')

      const { data, error } = await (supabase as any)
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
    onError: (error) => toast.error(error.message),
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
    mutationFn: async (statement: CardStatementInsert) => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')

      const payload = { ...statement, user_id: user.id }
      const { data, error } = await (supabase as any)
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
    onError: (error) => toast.error(error.message),
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
    mutationFn: async (payment: CardPaymentInsert) => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')

      const payload = { ...payment, user_id: user.id }
      const { data, error } = await (supabase as any)
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
    onError: (error) => toast.error(error.message),
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

      const due = new Date(s.due_date)
      if (!nextDueDate || due < nextDueDate) nextDueDate = due
      if (due < today && dueLeft > 0) overdue = true
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
    mutationFn: async (transaction: CardTransactionInsert) => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')

      const payload = { ...transaction, user_id: user.id }
      const { data, error } = await (supabase as any)
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
    onError: (error) => toast.error(error.message),
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
