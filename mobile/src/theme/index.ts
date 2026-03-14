/**
 * SOBRA — Design tokens for mobile
 * Dark theme matching the web's gray-950 palette
 */

export const colors = {
  // Base
  background: '#030712',    // gray-950
  surface: '#0a0f1a',       // slightly lighter
  card: '#111827',           // gray-900
  border: '#1f2937',         // gray-800
  borderLight: '#374151',    // gray-700

  // Text
  text: '#ffffff',
  textSecondary: '#9ca3af',  // gray-400
  textTertiary: '#6b7280',   // gray-500
  textMuted: '#4b5563',      // gray-600

  // Brand
  primary: '#ffffff',
  primaryForeground: '#030712',

  // Accents
  emerald: '#34d399',
  emeraldDark: '#059669',
  red: '#f87171',
  redDark: '#dc2626',
  amber: '#fbbf24',
  blue: '#60a5fa',
  purple: '#a78bfa',
  violet: '#8b5cf6',
  cyan: '#22d3ee',

  // Surplus classification
  surplusSafe: '#34d399',
  surplusOperative: '#60a5fa',
  surplusUnavailable: '#fbbf24',

  // Specific
  income: '#34d399',
  expense: '#f87171',
  positive: '#34d399',
  negative: '#f87171',
} as const

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
} as const

export const fontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  lg: 17,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  full: 999,
} as const
