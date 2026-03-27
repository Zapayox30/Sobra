import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Income } from '../types'
import type { TablesInsert, TablesUpdate } from '../types/database.types'
import { Alert } from 'react-native'

export function useIncomes() {
  return useQuery({
    queryKey: ['incomes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('incomes')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Income[]
    },
    staleTime: 2 * 60_000,
  })
}

export function useCreateIncome() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (income: Omit<TablesInsert<'incomes'>, 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')
      const { data, error } = await supabase
        .from('incomes')
        .insert({ ...income, user_id: user.id })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['incomes'] })
      qc.invalidateQueries({ queryKey: ['surplus'] })
    },
    onError: () => Alert.alert('Error', 'No se pudo crear el ingreso'),
  })
}

export function useUpdateIncome() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'incomes'> & { id: string }) => {
      const { data, error } = await supabase
        .from('incomes')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['incomes'] })
      qc.invalidateQueries({ queryKey: ['surplus'] })
    },
    onError: () => Alert.alert('Error', 'No se pudo actualizar'),
  })
}

export function useDeleteIncome() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('incomes').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['incomes'] })
      qc.invalidateQueries({ queryKey: ['surplus'] })
    },
    onError: () => Alert.alert('Error', 'No se pudo eliminar'),
  })
}
