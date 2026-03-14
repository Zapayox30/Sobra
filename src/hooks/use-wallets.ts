'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/browser'
import type { Wallet, WalletInsert, WalletUpdate } from '@/types'
import { toast } from 'sonner'

export function useWallets() {
    return useQuery({
        queryKey: ['wallets'],
        queryFn: async () => {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('wallets')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            return data as Wallet[]
        },
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    })
}

export function useCreateWallet() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (wallet: Omit<WalletInsert, 'user_id'>) => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No user')

            const { data, error } = await supabase
                .from('wallets')
                .insert({ ...wallet, user_id: user.id })
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wallets'] })
            queryClient.invalidateQueries({ queryKey: ['surplus'] })
            toast.success('Billetera creada exitosamente')
        },
        onError: (error: Error) => {
            toast.error('Error al crear billetera')
        },
    })
}

export function useUpdateWallet() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, ...updates }: WalletUpdate & { id: string }) => {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('wallets')
                .update(updates)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wallets'] })
            queryClient.invalidateQueries({ queryKey: ['surplus'] })
            toast.success('Billetera actualizada exitosamente')
        },
        onError: (error: Error) => {
            toast.error('Error al actualizar billetera')
        },
    })
}

export function useDeleteWallet() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            const supabase = createClient()
            const { error } = await supabase.from('wallets').delete().eq('id', id)
            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wallets'] })
            queryClient.invalidateQueries({ queryKey: ['surplus'] })
            toast.success('Billetera eliminada exitosamente')
        },
        onError: (error: Error) => {
            toast.error('Error al eliminar billetera')
        },
    })
}
