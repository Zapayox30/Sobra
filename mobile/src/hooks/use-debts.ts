import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Debt } from '../types'
import type { TablesInsert, TablesUpdate } from '../types/database.types'
import { Alert } from 'react-native'

export function useDebts() {
  return useQuery({
    queryKey: ['debts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('debts')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Debt[]
    },
    staleTime: 2 * 60_000,
  })
}

export function useCreateDebt() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (d: Omit<TablesInsert<'debts'>, 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')
      const { data, error } = await supabase
        .from('debts')
        .insert({ ...d, user_id: user.id })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['debts'] })
      qc.invalidateQueries({ queryKey: ['surplus'] })
    },
    onError: () => Alert.alert('Error', 'No se pudo crear'),
  })
}

export function useUpdateDebt() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'debts'> & { id: string }) => {
      const { data, error } = await supabase
        .from('debts')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['debts'] })
      qc.invalidateQueries({ queryKey: ['surplus'] })
    },
  })
}

export function useDeleteDebt() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('debts').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['debts'] })
      qc.invalidateQueries({ queryKey: ['surplus'] })
    },
  })
}
