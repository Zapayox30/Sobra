import { Money, Period } from '@/types'

export interface IncomeInput {
  amount: Money
  starts_on: Date
  ends_on: Date | null
  is_active: boolean
}

export interface ExpenseInput {
  amount: Money
  starts_on: Date
  ends_on: Date | null
  is_active: boolean
}

export interface CommitmentInput {
  amount_per_month: Money
  start_month: Date
  end_month: Date
}

export interface CalculationInput {
  monthStart: Date
  incomes: IncomeInput[]
  fixedExpenses: ExpenseInput[]
  personalBudgets: ExpenseInput[]
  commitments: CommitmentInput[]
}

export interface CalculationResult {
  incomeTotal: Money
  fixedTotal: Money
  commitmentsTotal: Money
  personalTotal: Money
  leftoverBeforePersonal: Money
  leftoverAfterPersonal: Money
  dailySuggestion: Money
  daysInMonth: number
  remainingDays: number
}

/**
 * Verifica si un registro está activo en un período dado
 */
export function isActiveInMonth(
  startDate: Date,
  endDate: Date | null,
  period: Period
): boolean {
  const start = startDate <= period.end
  const end = !endDate || endDate >= period.start
  return start && end
}

/**
 * Suma un array de números con precisión de 2 decimales
 */
function sum(amounts: Money[]): Money {
  return Number(amounts.reduce((a, b) => a + b, 0).toFixed(2))
}

/**
 * Obtiene el primer y último día de un mes
 */
export function getMonthPeriod(monthStart: Date): Period {
  const start = new Date(monthStart.getFullYear(), monthStart.getMonth(), 1)
  const end = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0)
  return { start, end }
}

/**
 * Calcula cuántos días quedan en el mes actual
 */
export function getRemainingDaysInMonth(monthStart: Date): {
  daysInMonth: number
  remainingDays: number
} {
  const period = getMonthPeriod(monthStart)
  const daysInMonth = period.end.getDate()
  const today = new Date()

  const isCurrentMonth =
    today.getFullYear() === monthStart.getFullYear() &&
    today.getMonth() === monthStart.getMonth()

  const dayOfMonth = isCurrentMonth ? today.getDate() : 1
  const remainingDays = Math.max(daysInMonth - dayOfMonth + 1, 1)

  return { daysInMonth, remainingDays }
}

/**
 * Calcula el resumen financiero mensual (SOBRA)
 */
export function calculateMonthlySobra({
  monthStart,
  incomes,
  fixedExpenses,
  personalBudgets,
  commitments,
}: CalculationInput): CalculationResult {
  const period = getMonthPeriod(monthStart)
  const { daysInMonth, remainingDays } = getRemainingDaysInMonth(monthStart)

  // Filtrar y sumar ingresos activos del mes
  const incomeTotal = sum(
    incomes
      .filter((x) => x.is_active && isActiveInMonth(x.starts_on, x.ends_on, period))
      .map((x) => x.amount)
  )

  // Filtrar y sumar gastos fijos activos del mes
  const fixedTotal = sum(
    fixedExpenses
      .filter((x) => x.is_active && isActiveInMonth(x.starts_on, x.ends_on, period))
      .map((x) => x.amount)
  )

  // Filtrar y sumar presupuestos personales activos del mes
  const personalTotal = sum(
    personalBudgets
      .filter((x) => x.is_active && isActiveInMonth(x.starts_on, x.ends_on, period))
      .map((x) => x.amount)
  )

  // Filtrar y sumar compromisos activos del mes
  const commitmentsTotal = sum(
    commitments
      .filter(
        (c) => c.start_month <= period.start && c.end_month >= period.start
      )
      .map((c) => c.amount_per_month)
  )

  // Calcular sobrantes
  const leftoverBeforePersonal = Number(
    (incomeTotal - fixedTotal - commitmentsTotal).toFixed(2)
  )
  const leftoverAfterPersonal = Number(
    (leftoverBeforePersonal - personalTotal).toFixed(2)
  )

  // Calcular sugerencia diaria
  const dailySuggestion = Number(
    (Math.max(leftoverAfterPersonal, 0) / remainingDays).toFixed(2)
  )

  return {
    incomeTotal,
    fixedTotal,
    commitmentsTotal,
    personalTotal,
    leftoverBeforePersonal,
    leftoverAfterPersonal,
    dailySuggestion,
    daysInMonth,
    remainingDays,
  }
}

/**
 * Formatea un monto como moneda
 */
export function formatCurrency(amount: Money, currency = 'USD'): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Valida que un monto sea válido (>= 0 y con máximo 2 decimales)
 */
export function isValidAmount(amount: number): boolean {
  if (amount < 0) return false
  const decimals = amount.toString().split('.')[1]
  return !decimals || decimals.length <= 2
}

