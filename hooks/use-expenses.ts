'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/browser'
import { Database } from '@/types/database.types'
import { toast } from 'sonner'

type FixedExpense = Database['public']['Tables']['fixed_expenses']['Row']
type FixedExpenseInsert = Database['public']['Tables']['fixed_expenses']['Insert']
type FixedExpenseUpdate = Database['public']['Tables']['fixed_expenses']['Update']

type PersonalExpense = Database['public']['Tables']['personal_expenses']['Row']
type PersonalExpenseInsert = Database['public']['Tables']['personal_expenses']['Insert']
type PersonalExpenseUpdate = Database['public']['Tables']['personal_expenses']['Update']

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
  })
}

export function useCreateFixedExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (expense: FixedExpenseInsert) => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')

      const { data, error } = await (supabase as any)
        .from('fixed_expenses')
        .insert({ ...expense, user_id: user.id })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixedExpenses'] })
      toast.success('Gasto fijo creado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al crear gasto fijo: ' + error.message)
    },
  })
}

export function useUpdateFixedExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: FixedExpenseUpdate & { id: string }) => {
      const supabase = createClient()
      const { data, error } = await (supabase as any)
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
      toast.success('Gasto fijo actualizado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al actualizar gasto fijo: ' + error.message)
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
      queryClient.invalidateQueries({ queryKey: ['monthlyCalculation'] })
      toast.success('Gasto fijo eliminado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al eliminar gasto fijo: ' + error.message)
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
  })
}

export function useCreatePersonalExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (expense: PersonalExpenseInsert) => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')

      const { data, error } = await (supabase as any)
        .from('personal_expenses')
        .insert({ ...expense, user_id: user.id })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personalExpenses'] })
      toast.success('Presupuesto personal creado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al crear presupuesto personal: ' + error.message)
    },
  })
}

export function useUpdatePersonalExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: PersonalExpenseUpdate & { id: string }) => {
      const supabase = createClient()
      const { data, error } = await (supabase as any)
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
      toast.success('Presupuesto personal actualizado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al actualizar presupuesto personal: ' + error.message)
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
      queryClient.invalidateQueries({ queryKey: ['monthlyCalculation'] })
      toast.success('Presupuesto personal eliminado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al eliminar presupuesto personal: ' + error.message)
    },
  })
}

