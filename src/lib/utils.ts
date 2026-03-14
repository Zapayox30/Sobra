import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Serializes Date values in an object to ISO date strings (YYYY-MM-DD).
 * Used to bridge Zod (which produces Date) and Supabase (which expects string).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializeDates<T extends Record<string, any>>(data: T) {
  return Object.fromEntries(
    Object.entries(data).map(([k, v]) => [
      k,
      v instanceof Date ? v.toISOString().split('T')[0] : v,
    ])
  ) as { [K in keyof T]: T[K] extends Date ? string : T[K] extends Date | null ? string | null : T[K] extends Date | null | undefined ? string | null | undefined : T[K] }
}
