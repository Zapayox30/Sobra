import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { MonthlyCommitment } from '../types'
import type { TablesInsert, TablesUpdate } from '../types/database.types'
import { Alert } from 'react-native'

export function useCommitments() {
  return useQuery({
    queryKey: ['commitments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monthly_commitments')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as MonthlyCommitment[]
    },
    staleTime: 2 * 60_000,
  })
}

export function useCreateCommitment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (c: Omit<TablesInsert<'monthly_commitments'>, 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')
      const { data, error } = await supabase
        .from('monthly_commitments')
        .insert({ ...c, user_id: user.id })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['commitments'] })
      qc.invalidateQueries({ queryKey: ['surplus'] })
    },
    onError: () => Alert.alert('Error', 'No se pudo crear'),
  })
}

export function useUpdateCommitment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'monthly_commitments'> & { id: string }) => {
      const { data, error } = await supabase
        .from('monthly_commitments')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['commitments'] })
      qc.invalidateQueries({ queryKey: ['surplus'] })
    },
  })
}

export function useDeleteCommitment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('monthly_commitments').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['commitments'] })
      qc.invalidateQueries({ queryKey: ['surplus'] })
    },
  })
}
