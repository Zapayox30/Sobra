/**
 * @sobra/shared — Main barrel export
 *
 * Usage:
 *   import { calculateSurplus, type Income, EXPENSE_CATEGORIES } from '@sobra/shared'
 *
 * Or use subpath imports:
 *   import type { Income } from '@sobra/shared/types'
 *   import { calculateSurplus } from '@sobra/shared/engine'
 *   import { EXPENSE_CATEGORIES } from '@sobra/shared/constants'
 */

// Types
export * from './types'

// Engine
export * from './engine'

// Constants
export {
  EXPENSE_CATEGORIES,
  FIXED_EXPENSE_CATEGORIES,
  getCategoryEmoji,
  getCategoryLabel,
} from './constants/categories'
export type { ExpenseCategory, FixedExpenseCategory } from './constants/categories'
