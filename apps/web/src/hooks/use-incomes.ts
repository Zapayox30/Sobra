'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/browser'
import type { Income, IncomeInsert, IncomeUpdate } from '@/types'
import { toast } from 'sonner'

export function useIncomes() {
  return useQuery({
    queryKey: ['incomes'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('incomes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Income[]
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}

export function useCreateIncome() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (income: Omit<IncomeInsert, 'user_id'>) => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')

      const { data, error } = await supabase
        .from('incomes')
        .insert({ ...income, user_id: user.id })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onMutate: async (newIncome) => {
      await queryClient.cancelQueries({ queryKey: ['incomes'] })
      const previousIncomes = queryClient.getQueryData(['incomes'])

      queryClient.setQueryData(['incomes'], (old: Income[] | undefined) => {
        const optimisticIncome = {
          id: 'temp-' + Date.now(),
          user_id: '',
          ...newIncome,
          is_active: newIncome.is_active ?? true,
          kind: newIncome.kind ?? 'salary',
          recurrence: newIncome.recurrence ?? 'monthly',
          starts_on: newIncome.starts_on ?? new Date().toISOString(),
          ends_on: newIncome.ends_on ?? null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } satisfies Income
        return old ? [optimisticIncome, ...old] : [optimisticIncome]
      })

      return { previousIncomes }
    },
    onError: (error, _, context) => {
      if (context?.previousIncomes) {
        queryClient.setQueryData(['incomes'], context.previousIncomes)
      }
      toast.error('Error al crear ingreso')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] })
      queryClient.invalidateQueries({ queryKey: ['surplus'] })
      toast.success('Ingreso creado exitosamente')
    },
  })
}

export function useUpdateIncome() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: IncomeUpdate & { id: string }) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('incomes')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
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
      toast.error('Error al actualizar ingreso')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] })
      queryClient.invalidateQueries({ queryKey: ['surplus'] })
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
      toast.error('Error al eliminar ingreso')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] })
      queryClient.invalidateQueries({ queryKey: ['surplus'] })
      toast.success('Ingreso eliminado exitosamente')
    },
  })
}

