'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/browser'
import type { Account, AccountInsert, AccountUpdate } from '@/types'
import { toast } from 'sonner'

export function useAccounts() {
    return useQuery({
        queryKey: ['accounts'],
        queryFn: async () => {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('accounts')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            return data as Account[]
        },
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    })
}

export function useCreateAccount() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (account: Omit<AccountInsert, 'user_id'>) => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No user')

            const { data, error } = await supabase
                .from('accounts')
                .insert({ ...account, user_id: user.id })
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] })
            queryClient.invalidateQueries({ queryKey: ['surplus'] })
            toast.success('Cuenta creada exitosamente')
        },
        onError: (error: Error) => {
            toast.error('Error al crear cuenta')
        },
    })
}

export function useUpdateAccount() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, ...updates }: AccountUpdate & { id: string }) => {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('accounts')
                .update(updates)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] })
            queryClient.invalidateQueries({ queryKey: ['surplus'] })
            toast.success('Cuenta actualizada exitosamente')
        },
        onError: (error: Error) => {
            toast.error('Error al actualizar cuenta')
        },
    })
}

export function useDeleteAccount() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            const supabase = createClient()
            const { error } = await supabase.from('accounts').delete().eq('id', id)
            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] })
            queryClient.invalidateQueries({ queryKey: ['surplus'] })
            toast.success('Cuenta eliminada exitosamente')
        },
        onError: (error: Error) => {
            toast.error('Error al eliminar cuenta')
        },
    })
}
