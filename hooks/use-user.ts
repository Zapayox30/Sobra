'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/browser'

export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const supabase = createClient()
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      if (error) throw error
      return user
    },
  })
}

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return null

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      return data
    },
  })
}

export function useUserPlan() {
  return useQuery({
    queryKey: ['userPlan'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('user_plans')
        .select('*, plans(*)')
        .eq('status', 'active')
        .limit(1)
        .maybeSingle()

      if (error) throw error
      return data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useIsPlusUser() {
  const { data: userPlan } = useUserPlan()
  return (userPlan as any)?.plan_code === 'plus'
}

