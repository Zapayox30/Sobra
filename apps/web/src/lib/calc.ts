/**
 * Calc — Re-exports from @sobra/shared
 *
 * The canonical implementations live in packages/shared/src/engine/calc.ts.
 * This re-export ensures existing `from '@/lib/calc'` imports continue working.
 */
export {
  isActiveInMonth,
  getMonthPeriod,
  getRemainingDaysInMonth,
  calculateInstallmentPlan,
  formatCurrency,
  isValidAmount,
} from '@sobra/shared/engine'
