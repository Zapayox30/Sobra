import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Account, Wallet } from '../types'

export function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Account[]
    },
    staleTime: 2 * 60_000,
  })
}

export function useWallets() {
  return useQuery({
    queryKey: ['wallets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Wallet[]
    },
    staleTime: 2 * 60_000,
  })
}
