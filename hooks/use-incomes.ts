'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/browser'
import { Database } from '@/types/database.types'
import { toast } from 'sonner'

type Income = Database['public']['Tables']['incomes']['Row']
type IncomeInsert = Database['public']['Tables']['incomes']['Insert']
type IncomeUpdate = Database['public']['Tables']['incomes']['Update']

export function useIncomes() {
  return useQuery({
    queryKey: ['incomes'],
    queryFn: async () => {
      const supabase = createClient()
      // Optimized: Select only needed fields instead of SELECT *
      const { data, error } = await supabase
        .from('incomes')
        .select('id, name, amount, income_type, starts_on, ends_on, is_active, created_at')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Income[]
    },
    // Performance optimization: Cache for 2 minutes
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}

export function useCreateIncome() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (income: IncomeInsert) => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')

      const { data, error } = await (supabase as any)
        .from('incomes')
        .insert({ ...income, user_id: user.id })
        .select('id, name, amount, income_type, starts_on, ends_on, is_active, created_at')
        .single()

      if (error) throw error
      return data
    },
    // Optimistic update for instant UI feedback
    onMutate: async (newIncome) => {
      await queryClient.cancelQueries({ queryKey: ['incomes'] })
      const previousIncomes = queryClient.getQueryData(['incomes'])

      queryClient.setQueryData(['incomes'], (old: Income[] | undefined) => {
        const optimisticIncome = {
          id: 'temp-' + Date.now(),
          ...newIncome,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Income
        return old ? [optimisticIncome, ...old] : [optimisticIncome]
      })

      return { previousIncomes }
    },
    onError: (error, _, context) => {
      if (context?.previousIncomes) {
        queryClient.setQueryData(['incomes'], context.previousIncomes)
      }
      toast.error('Error al crear ingreso: ' + error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] })
      toast.success('Ingreso creado exitosamente')
    },
  })
}

export function useUpdateIncome() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: IncomeUpdate & { id: string }) => {
      const supabase = createClient()
      const { data, error } = await (supabase as any)
        .from('incomes')
        .update(updates)
        .eq('id', id)
        .select('id, name, amount, income_type, starts_on, ends_on, is_active, created_at')
        .single()

      if (error) throw error
      return data
    },
    // Optimistic update
    onMutate: async (updatedIncome) => {
      await queryClient.cancelQueries({ queryKey: ['incomes'] })
      const previousIncomes = queryClient.getQueryData(['incomes'])

      queryClient.setQueryData(['incomes'], (old: Income[] | undefined) => {
        if (!old) return old
        return old.map((income) =>
          income.id === updatedIncome.id ? { ...income, ...updatedIncome } : income
        )
      })

      return { previousIncomes }
    },
    onError: (error, _, context) => {
      if (context?.previousIncomes) {
        queryClient.setQueryData(['incomes'], context.previousIncomes)
      }
      toast.error('Error al actualizar ingreso: ' + error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] })
      toast.success('Ingreso actualizado exitosamente')
    },
  })
}

export function useDeleteIncome() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('incomes').delete().eq('id', id)

      if (error) throw error
      return id
    },
    // Optimistic delete
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['incomes'] })
      const previousIncomes = queryClient.getQueryData(['incomes'])

      queryClient.setQueryData(['incomes'], (old: Income[] | undefined) => {
        if (!old) return old
        return old.filter((income) => income.id !== id)
      })

      return { previousIncomes }
    },
    onError: (error, _, context) => {
      if (context?.previousIncomes) {
        queryClient.setQueryData(['incomes'], context.previousIncomes)
      }
      toast.error('Error al eliminar ingreso: ' + error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] })
      queryClient.invalidateQueries({ queryKey: ['monthlyCalculation'] })
      toast.success('Ingreso eliminado exitosamente')
    },
  })
}

