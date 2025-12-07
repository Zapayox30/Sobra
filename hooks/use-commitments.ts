'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/browser'
import { Database } from '@/types/database.types'
import { toast } from 'sonner'

type MonthlyCommitment = Database['public']['Tables']['monthly_commitments']['Row']
type MonthlyCommitmentInsert = Database['public']['Tables']['monthly_commitments']['Insert']
type MonthlyCommitmentUpdate = Database['public']['Tables']['monthly_commitments']['Update']

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
  })
}

export function useCreateMonthlyCommitment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (commitment: MonthlyCommitmentInsert) => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')

      const { data, error } = await (supabase as any)
        .from('monthly_commitments')
        .insert({ ...commitment, user_id: user.id })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monthlyCommitments'] })
      toast.success('Compromiso mensual creado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al crear compromiso mensual: ' + error.message)
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
      const { data, error } = await (supabase as any)
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
      toast.success('Compromiso mensual actualizado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al actualizar compromiso mensual: ' + error.message)
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
      queryClient.invalidateQueries({ queryKey: ['monthlyCalculation'] })
      toast.success('Compromiso mensual eliminado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al eliminar compromiso mensual: ' + error.message)
    },
  })
}

