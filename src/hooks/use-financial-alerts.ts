'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/browser'
import type { FinancialAlert } from '@/types'
import { toast } from 'sonner'

export function useFinancialAlerts() {
    return useQuery({
        queryKey: ['financial-alerts'],
        queryFn: async () => {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('financial_alerts')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            return data as FinancialAlert[]
        },
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
    })
}

export function useUnreadAlerts() {
    return useQuery({
        queryKey: ['financial-alerts', 'unread'],
        queryFn: async () => {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('financial_alerts')
                .select('*')
                .eq('is_read', false)
                .order('created_at', { ascending: false })

            if (error) throw error
            return data as FinancialAlert[]
        },
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
    })
}

export function useMarkAlertRead() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            const supabase = createClient()
            const { error } = await supabase
                .from('financial_alerts')
                .update({ is_read: true })
                .eq('id', id)

            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['financial-alerts'] })
        },
    })
}

export function useMarkAllAlertsRead() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No user')

            const { error } = await supabase
                .from('financial_alerts')
                .update({ is_read: true })
                .eq('user_id', user.id)
                .eq('is_read', false)

            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['financial-alerts'] })
            toast.success('Alertas marcadas como leídas')
        },
    })
}

export function useCreateAlert() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (alert: {
            title: string
            message: string
            alert_type: string
            severity?: string
            metadata?: Record<string, string | number | boolean | null>
        }) => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No user')

            const { data, error } = await supabase
                .from('financial_alerts')
                .insert({
                    ...alert,
                    user_id: user.id,
                    severity: alert.severity ?? 'info',
                })
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['financial-alerts'] })
        },
    })
}

export function useDeleteAlert() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            const supabase = createClient()
            const { error } = await supabase.from('financial_alerts').delete().eq('id', id)
            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['financial-alerts'] })
        },
    })
}
