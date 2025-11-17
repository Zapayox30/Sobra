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
      const { data, error } = await supabase
        .from('incomes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Income[]
    },
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
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] })
      toast.success('Ingreso creado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al crear ingreso: ' + error.message)
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
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] })
      toast.success('Ingreso actualizado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al actualizar ingreso: ' + error.message)
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] })
      toast.success('Ingreso eliminado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al eliminar ingreso: ' + error.message)
    },
  })
}

