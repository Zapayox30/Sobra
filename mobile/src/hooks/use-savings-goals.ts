import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { SavingsGoal } from '../types'
import type { TablesInsert, TablesUpdate } from '../types/database.types'
import { Alert } from 'react-native'

export function useSavingsGoals() {
  return useQuery({
    queryKey: ['savingsGoals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('savings_goals')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as SavingsGoal[]
    },
    staleTime: 2 * 60_000,
  })
}

export function useCreateSavingsGoal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (g: Omit<TablesInsert<'savings_goals'>, 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')
      const { data, error } = await supabase
        .from('savings_goals')
        .insert({ ...g, user_id: user.id })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['savingsGoals'] })
      qc.invalidateQueries({ queryKey: ['surplus'] })
    },
    onError: () => Alert.alert('Error', 'No se pudo crear'),
  })
}

export function useUpdateSavingsGoal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'savings_goals'> & { id: string }) => {
      const { data, error } = await supabase
        .from('savings_goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['savingsGoals'] })
      qc.invalidateQueries({ queryKey: ['surplus'] })
    },
  })
}

export function useDeleteSavingsGoal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('savings_goals').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['savingsGoals'] })
      qc.invalidateQueries({ queryKey: ['surplus'] })
    },
  })
}
