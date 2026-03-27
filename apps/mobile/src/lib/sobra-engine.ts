/**
 * SOBRA Engine — Re-exports from @sobra/shared
 *
 * The canonical implementation lives in packages/shared/src/engine/
 */
export { calculateSurplus } from '@sobra/shared/engine'
export {
  isActiveInMonth,
  getMonthPeriod,
  getRemainingDaysInMonth,
  formatCurrency,
  isValidAmount,
} from '@sobra/shared/engine'
export {
  DEFAULT_SURPLUS_RATIOS,
  type SurplusInput,
  type SurplusOutput,
  type SurplusClassification,
  type SurplusRatios,
} from '@sobra/shared/types'
