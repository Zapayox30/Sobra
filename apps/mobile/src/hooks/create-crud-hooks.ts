/**
 * SOBRA — CRUD Hooks Factory
 *
 * Genera hooks de TanStack Query para operaciones CRUD de Supabase.
 * Elimina código repetido: cada entidad nueva = 3 líneas.
 *
 * @example
 * const { useIncomes, useCreateIncome, useUpdateIncome, useDeleteIncome } =
 *   createCrudHooks('incomes', ['incomes', 'surplus'])
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Alert } from 'react-native'
import { supabase } from '../lib/supabase'
import type { Database } from '../types/database.types'

type Tables = Database['public']['Tables']
type TableName = keyof Tables

type Row<T extends TableName> = Tables[T]['Row']
type Insert<T extends TableName> = Tables[T]['Insert']
type Update<T extends TableName> = Tables[T]['Update']

interface CrudHooksConfig {
  /** Mostrar Alert en error de mutación */
  showAlertOnError?: boolean
  /** Tiempo en ms antes de considerar datos stale */
  staleTime?: number
  /** Ordenar por este campo */
  orderBy?: string
  /** Orden ascendente o descendente */
  ascending?: boolean
}

const DEFAULT_CONFIG: CrudHooksConfig = {
  showAlertOnError: true,
  staleTime: 2 * 60_000,
  orderBy: 'created_at',
  ascending: false,
}

/**
 * Crea hooks CRUD para una tabla de Supabase.
 *
 * @param tableName - Nombre de la tabla en Supabase
 * @param invalidateKeys - Query keys a invalidar después de mutaciones (incluye la tabla automáticamente)
 * @param config - Configuración opcional
 */
export function createCrudHooks<T extends TableName>(
  tableName: T,
  invalidateKeys: string[] = [],
  config: CrudHooksConfig = {}
) {
  const opts = { ...DEFAULT_CONFIG, ...config }
  const allInvalidateKeys = [tableName, ...invalidateKeys]

  // Capitaliza para nombres de hooks legibles en devtools
  const singular = tableName.replace(/_/g, ' ').replace(/s$/, '')

  function useList() {
    return useQuery({
      queryKey: [tableName],
      queryFn: async () => {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .order(opts.orderBy!, { ascending: opts.ascending })
        if (error) throw error
        return data as any as Row<T>[]
      },
      staleTime: opts.staleTime,
    })
  }

  function useCreate() {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: async (input: Omit<Insert<T>, 'user_id'>) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('No user authenticated')

        const { data, error } = await supabase
          .from(tableName)
          .insert({ ...input, user_id: user.id } as any)
          .select()
          .single()
        if (error) throw error
        return data as any as Row<T>
      },
      onSuccess: () => {
        allInvalidateKeys.forEach(key => qc.invalidateQueries({ queryKey: [key] }))
      },
      onError: (err) => {
        if (opts.showAlertOnError) {
          Alert.alert('Error', `No se pudo crear ${singular}`)
        }
        console.error(`[createCrudHooks] Error creating ${tableName}:`, err)
      },
    })
  }

  function useUpdate() {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, ...updates }: Update<T> & { id: string }) => {
        const { data, error } = await supabase
          .from(tableName)
          .update(updates as any)
          .eq('id' as any, id)
          .select()
          .single()
        if (error) throw error
        return data as any as Row<T>
      },
      onSuccess: () => {
        allInvalidateKeys.forEach(key => qc.invalidateQueries({ queryKey: [key] }))
      },
      onError: (err) => {
        if (opts.showAlertOnError) {
          Alert.alert('Error', `No se pudo actualizar ${singular}`)
        }
        console.error(`[createCrudHooks] Error updating ${tableName}:`, err)
      },
    })
  }

  function useDelete() {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: async (id: string) => {
        const { error } = await supabase.from(tableName).delete().eq('id' as any, id)
        if (error) throw error
      },
      onSuccess: () => {
        allInvalidateKeys.forEach(key => qc.invalidateQueries({ queryKey: [key] }))
      },
      onError: (err) => {
        if (opts.showAlertOnError) {
          Alert.alert('Error', `No se pudo eliminar ${singular}`)
        }
        console.error(`[createCrudHooks] Error deleting ${tableName}:`, err)
      },
    })
  }

  return {
    useList,
    useCreate,
    useUpdate,
    useDelete,
  }
}
