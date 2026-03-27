'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/browser'
import type { Debt, DebtInsert, DebtUpdate } from '@/types'
import { toast } from 'sonner'

export function useDebts() {
    return useQuery({
        queryKey: ['debts'],
        queryFn: async () => {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('debts')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            return data as Debt[]
        },
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    })
}

export function useActiveDebtsTotal() {
    const { data: debts = [] } = useDebts()

    const total = debts
        .filter((d) => d.is_active)
        .reduce((sum, d) => sum + Number(d.monthly_payment), 0)

    const remainingTotal = debts
        .filter((d) => d.is_active)
        .reduce((sum, d) => sum + Number(d.remaining_amount), 0)

    return { monthlyTotal: total, remainingTotal, count: debts.filter((d) => d.is_active).length }
}

export function useCreateDebt() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (debt: Omit<DebtInsert, 'user_id'>) => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No user')

            const { data, error } = await supabase
                .from('debts')
                .insert({ ...debt, user_id: user.id })
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['debts'] })
            queryClient.invalidateQueries({ queryKey: ['surplus'] })
            toast.success('Deuda registrada exitosamente')
        },
        onError: (error: Error) => {
            toast.error('Error al registrar deuda')
        },
    })
}

export function useUpdateDebt() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, ...updates }: DebtUpdate & { id: string }) => {
            const supabase = createClient()
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
            queryClient.invalidateQueries({ queryKey: ['debts'] })
            queryClient.invalidateQueries({ queryKey: ['surplus'] })
            toast.success('Deuda actualizada exitosamente')
        },
        onError: (error: Error) => {
            toast.error('Error al actualizar deuda')
        },
    })
}

export function useDeleteDebt() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            const supabase = createClient()
            const { error } = await supabase.from('debts').delete().eq('id', id)
            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['debts'] })
            queryClient.invalidateQueries({ queryKey: ['surplus'] })
            toast.success('Deuda eliminada exitosamente')
        },
        onError: (error: Error) => {
            toast.error('Error al eliminar deuda')
        },
    })
}
