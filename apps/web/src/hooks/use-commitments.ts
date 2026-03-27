'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/browser'
import type { MonthlyCommitment, MonthlyCommitmentInsert, MonthlyCommitmentUpdate } from '@/types'
import { toast } from 'sonner'

export function useMonthlyCommitments() {
  return useQuery({
    queryKey: ['monthlyCommitments'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('monthly_commitments')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as MonthlyCommitment[]
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}

export function useCreateMonthlyCommitment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (commitment: Omit<MonthlyCommitmentInsert, 'user_id'>) => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')

      const { data, error } = await supabase
        .from('monthly_commitments')
        .insert({ ...commitment, user_id: user.id })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monthlyCommitments'] })
      queryClient.invalidateQueries({ queryKey: ['surplus'] })
      toast.success('Compromiso mensual creado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al crear compromiso mensual')
    },
  })
}

export function useUpdateMonthlyCommitment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: MonthlyCommitmentUpdate & { id: string }) => {
      const supabase = createClient()
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
      queryClient.invalidateQueries({ queryKey: ['monthlyCommitments'] })
      queryClient.invalidateQueries({ queryKey: ['surplus'] })
      toast.success('Compromiso mensual actualizado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al actualizar compromiso mensual')
    },
  })
}

export function useDeleteMonthlyCommitment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase
        .from('monthly_commitments')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monthlyCommitments'] })
      queryClient.invalidateQueries({ queryKey: ['surplus'] })
      toast.success('Compromiso mensual eliminado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al eliminar compromiso mensual')
    },
  })
}

