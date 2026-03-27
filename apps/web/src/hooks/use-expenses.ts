'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/browser'
import type {
  FixedExpense, FixedExpenseInsert, FixedExpenseUpdate,
  PersonalExpense, PersonalExpenseInsert, PersonalExpenseUpdate,
} from '@/types'
import { toast } from 'sonner'

// =============================================
// FIXED EXPENSES
// =============================================
export function useFixedExpenses() {
  return useQuery({
    queryKey: ['fixedExpenses'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('fixed_expenses')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as FixedExpense[]
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}

export function useCreateFixedExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (expense: Omit<FixedExpenseInsert, 'user_id'>) => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')

      const { data, error } = await supabase
        .from('fixed_expenses')
        .insert({ ...expense, user_id: user.id })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixedExpenses'] })
      queryClient.invalidateQueries({ queryKey: ['surplus'] })
      toast.success('Gasto fijo creado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al crear gasto fijo')
    },
  })
}

export function useUpdateFixedExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: FixedExpenseUpdate & { id: string }) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('fixed_expenses')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixedExpenses'] })
      queryClient.invalidateQueries({ queryKey: ['surplus'] })
      toast.success('Gasto fijo actualizado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al actualizar gasto fijo')
    },
  })
}

export function useDeleteFixedExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('fixed_expenses').delete().eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixedExpenses'] })
      queryClient.invalidateQueries({ queryKey: ['surplus'] })
      toast.success('Gasto fijo eliminado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al eliminar gasto fijo')
    },
  })
}

// =============================================
// PERSONAL EXPENSES
// =============================================
export function usePersonalExpenses() {
  return useQuery({
    queryKey: ['personalExpenses'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('personal_expenses')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as PersonalExpense[]
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}

export function useCreatePersonalExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (expense: Omit<PersonalExpenseInsert, 'user_id'>) => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')

      const { data, error } = await supabase
        .from('personal_expenses')
        .insert({ ...expense, user_id: user.id })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personalExpenses'] })
      queryClient.invalidateQueries({ queryKey: ['surplus'] })
      toast.success('Presupuesto personal creado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al crear presupuesto personal')
    },
  })
}

export function useUpdatePersonalExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: PersonalExpenseUpdate & { id: string }) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('personal_expenses')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personalExpenses'] })
      queryClient.invalidateQueries({ queryKey: ['surplus'] })
      toast.success('Presupuesto personal actualizado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al actualizar presupuesto personal')
    },
  })
}

export function useDeletePersonalExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('personal_expenses').delete().eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personalExpenses'] })
      queryClient.invalidateQueries({ queryKey: ['surplus'] })
      toast.success('Presupuesto personal eliminado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al eliminar presupuesto personal')
    },
  })
}

