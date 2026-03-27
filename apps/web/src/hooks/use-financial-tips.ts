'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/browser'
import type { FinancialTip, UserTip } from '@/types'
import { filterTipsByCondition, type TipEvaluationContext } from '@/lib/tip-evaluator'

/**
 * Fetch all active financial tips (global, no auth needed for read).
 */
export function useFinancialTips() {
    return useQuery({
        queryKey: ['financial-tips'],
        queryFn: async () => {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('financial_tips')
                .select('*')
                .eq('is_active', true)
                .order('priority', { ascending: true })

            if (error) throw error
            return data as FinancialTip[]
        },
        staleTime: 30 * 60 * 1000, // Tips don't change often
        gcTime: 60 * 60 * 1000,
    })
}

/**
 * Fetch user's interaction history with tips (which have been shown, dismissed, rated).
 */
export function useUserTips() {
    return useQuery({
        queryKey: ['user-tips'],
        queryFn: async () => {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('user_tips')
                .select('*')
                .order('shown_at', { ascending: false })

            if (error) throw error
            return data as UserTip[]
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    })
}

/**
 * Get the next tip to show the user — one they haven't dismissed yet,
 * filtered by condition rules against the user's financial context.
 */
export function useNextTip(ctx?: TipEvaluationContext) {
    const { data: tips = [] } = useFinancialTips()
    const { data: userTips = [] } = useUserTips()

    const dismissedTipIds = new Set(
        userTips.filter((ut) => ut.dismissed).map((ut) => ut.tip_id)
    )

    // Filter by condition rules if context provided
    const eligibleTips = ctx ? filterTipsByCondition(tips, ctx) : tips

    const nextTip = eligibleTips.find((tip) => !dismissedTipIds.has(tip.id))
    return nextTip ?? null
}

/**
 * Get all tips filtered by conditions and excluding dismissed ones.
 * Used by the tips browse page.
 */
export function useFilteredTips(ctx?: TipEvaluationContext) {
    const { data: tips = [] } = useFinancialTips()
    const { data: userTips = [] } = useUserTips()

    const dismissedTipIds = new Set(
        userTips.filter((ut) => ut.dismissed).map((ut) => ut.tip_id)
    )

    const ratedTipIds = new Map(
        userTips.filter((ut) => ut.helpful !== null).map((ut) => [ut.tip_id, ut.helpful])
    )

    const eligible = ctx ? filterTipsByCondition(tips, ctx) : tips

    return {
        all: tips,
        eligible,
        active: eligible.filter((t) => !dismissedTipIds.has(t.id)),
        dismissed: tips.filter((t) => dismissedTipIds.has(t.id)),
        ratedTipIds,
        dismissedTipIds,
    }
}

/**
 * Record that a tip was shown to the user.
 */
export function useRecordTipShown() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (tipId: string) => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No user')

            // Check if already exists
            const { data: existing } = await supabase
                .from('user_tips')
                .select('id')
                .eq('user_id', user.id)
                .eq('tip_id', tipId)
                .maybeSingle()

            if (existing) return existing

            const { data, error } = await supabase
                .from('user_tips')
                .insert({ user_id: user.id, tip_id: tipId })
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-tips'] })
        },
    })
}

/**
 * Dismiss a tip (user doesn't want to see it again).
 */
export function useDismissTip() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (tipId: string) => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No user')

            // Upsert: create or update
            const { error } = await supabase
                .from('user_tips')
                .upsert(
                    { user_id: user.id, tip_id: tipId, dismissed: true },
                    { onConflict: 'user_id,tip_id' }
                )

            if (error) {
                // Fallback: try update if upsert fails (no unique constraint on those cols)
                const { data: existing } = await supabase
                    .from('user_tips')
                    .select('id')
                    .eq('user_id', user.id)
                    .eq('tip_id', tipId)
                    .maybeSingle()

                if (existing) {
                    await supabase
                        .from('user_tips')
                        .update({ dismissed: true })
                        .eq('id', existing.id)
                } else {
                    await supabase
                        .from('user_tips')
                        .insert({ user_id: user.id, tip_id: tipId, dismissed: true })
                }
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-tips'] })
        },
    })
}

/**
 * Rate a tip as helpful or not.
 */
export function useRateTip() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ tipId, helpful }: { tipId: string; helpful: boolean }) => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No user')

            const { data: existing } = await supabase
                .from('user_tips')
                .select('id')
                .eq('user_id', user.id)
                .eq('tip_id', tipId)
                .maybeSingle()

            if (existing) {
                await supabase
                    .from('user_tips')
                    .update({ helpful })
                    .eq('id', existing.id)
            } else {
                await supabase
                    .from('user_tips')
                    .insert({ user_id: user.id, tip_id: tipId, helpful })
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-tips'] })
        },
    })
}

/**
 * Undismiss a single tip so it shows again.
 */
export function useUndismissTip() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (tipId: string) => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No user')

            const { error } = await supabase
                .from('user_tips')
                .update({ dismissed: false })
                .eq('user_id', user.id)
                .eq('tip_id', tipId)

            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-tips'] })
        },
    })
}

/**
 * Reset ALL dismissed tips so they all show again.
 */
export function useResetAllDismissed() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No user')

            const { error } = await supabase
                .from('user_tips')
                .update({ dismissed: false })
                .eq('user_id', user.id)
                .eq('dismissed', true)

            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-tips'] })
        },
    })
}
