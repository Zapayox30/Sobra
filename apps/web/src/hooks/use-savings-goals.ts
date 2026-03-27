'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/browser'
import type { SavingsGoal, SavingsGoalInsert, SavingsGoalUpdate } from '@/types'
import { toast } from 'sonner'

export function useSavingsGoals() {
    return useQuery({
        queryKey: ['savingsGoals'],
        queryFn: async () => {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('savings_goals')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            return data as SavingsGoal[]
        },
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    })
}

export function useCreateSavingsGoal() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (goal: Omit<SavingsGoalInsert, 'user_id'>) => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No user')

            const { data, error } = await supabase
                .from('savings_goals')
                .insert({ ...goal, user_id: user.id })
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['savingsGoals'] })
            queryClient.invalidateQueries({ queryKey: ['surplus'] })
            toast.success('Meta de ahorro creada exitosamente')
        },
        onError: (error: Error) => {
            toast.error('Error al crear meta de ahorro')
        },
    })
}

export function useUpdateSavingsGoal() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, ...updates }: SavingsGoalUpdate & { id: string }) => {
            const supabase = createClient()
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
            queryClient.invalidateQueries({ queryKey: ['savingsGoals'] })
            queryClient.invalidateQueries({ queryKey: ['surplus'] })
            toast.success('Meta de ahorro actualizada exitosamente')
        },
        onError: (error: Error) => {
            toast.error('Error al actualizar meta de ahorro')
        },
    })
}

export function useDeleteSavingsGoal() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            const supabase = createClient()
            const { error } = await supabase.from('savings_goals').delete().eq('id', id)
            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['savingsGoals'] })
            queryClient.invalidateQueries({ queryKey: ['surplus'] })
            toast.success('Meta de ahorro eliminada exitosamente')
        },
        onError: (error: Error) => {
            toast.error('Error al eliminar meta de ahorro')
        },
    })
}
