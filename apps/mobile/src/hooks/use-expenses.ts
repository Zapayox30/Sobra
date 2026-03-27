import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { FixedExpense, PersonalExpense } from '../types'
import type { TablesInsert, TablesUpdate } from '../types/database.types'
import { Alert } from 'react-native'

// ── Fixed Expenses ──

export function useFixedExpenses() {
  return useQuery({
    queryKey: ['fixedExpenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fixed_expenses')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as FixedExpense[]
    },
    staleTime: 2 * 60_000,
  })
}

export function useCreateFixedExpense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (expense: Omit<TablesInsert<'fixed_expenses'>, 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')
      const { data, error } = await supabase
        .from('fixed_expenses')
        .insert({ ...expense, user_id: user.id })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['fixedExpenses'] })
      qc.invalidateQueries({ queryKey: ['surplus'] })
    },
    onError: () => Alert.alert('Error', 'No se pudo crear el gasto fijo'),
  })
}

export function useUpdateFixedExpense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'fixed_expenses'> & { id: string }) => {
      const { data, error } = await supabase
        .from('fixed_expenses')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['fixedExpenses'] })
      qc.invalidateQueries({ queryKey: ['surplus'] })
    },
  })
}

export function useDeleteFixedExpense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('fixed_expenses').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['fixedExpenses'] })
      qc.invalidateQueries({ queryKey: ['surplus'] })
    },
  })
}

// ── Personal Expenses ──

export function usePersonalExpenses() {
  return useQuery({
    queryKey: ['personalExpenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('personal_expenses')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as PersonalExpense[]
    },
    staleTime: 2 * 60_000,
  })
}

export function useCreatePersonalExpense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (expense: Omit<TablesInsert<'personal_expenses'>, 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')
      const { data, error } = await supabase
        .from('personal_expenses')
        .insert({ ...expense, user_id: user.id })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['personalExpenses'] })
      qc.invalidateQueries({ queryKey: ['surplus'] })
    },
    onError: () => Alert.alert('Error', 'No se pudo crear'),
  })
}

export function useUpdatePersonalExpense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'personal_expenses'> & { id: string }) => {
      const { data, error } = await supabase
        .from('personal_expenses')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['personalExpenses'] })
      qc.invalidateQueries({ queryKey: ['surplus'] })
    },
  })
}

export function useDeletePersonalExpense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('personal_expenses').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['personalExpenses'] })
      qc.invalidateQueries({ queryKey: ['surplus'] })
    },
  })
}
