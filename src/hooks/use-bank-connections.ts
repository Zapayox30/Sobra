'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/browser'
import type { BankConnection } from '@/types'
import { toast } from 'sonner'

export function useBankConnections() {
    return useQuery({
        queryKey: ['bank-connections'],
        queryFn: async () => {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('bank_connections')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            return data as BankConnection[]
        },
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    })
}

export function useCreateBankConnection() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (connection: {
            institution_name: string
            institution_code?: string | null
            provider?: string
            external_link_id?: string | null
            status?: string
        }) => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No user')

            const { data, error } = await supabase
                .from('bank_connections')
                .insert({
                    ...connection,
                    user_id: user.id,
                    provider: connection.provider ?? 'belvo',
                    status: connection.status ?? 'active',
                })
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bank-connections'] })
            toast.success('Conexión bancaria creada')
        },
        onError: (error: Error) => {
            toast.error('Error al conectar banco')
        },
    })
}

export function useUpdateBankConnection() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, ...updates }: { id: string; status?: string; last_synced_at?: string }) => {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('bank_connections')
                .update(updates)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bank-connections'] })
            toast.success('Conexión actualizada')
        },
        onError: (error: Error) => {
            toast.error('Error al actualizar conexión')
        },
    })
}

export function useDeleteBankConnection() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            const supabase = createClient()
            const { error } = await supabase.from('bank_connections').delete().eq('id', id)
            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bank-connections'] })
            toast.success('Conexión eliminada')
        },
        onError: (error: Error) => {
            toast.error('Error al eliminar conexión')
        },
    })
}
