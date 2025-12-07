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
  cardDueTotal?: Money
}

export interface CalculationResult {
  incomeTotal: Money
  fixedTotal: Money
  commitmentsTotal: Money
  personalTotal: Money
  cardDueTotal: Money
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
  cardDueTotal = 0,
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
    (incomeTotal - fixedTotal - commitmentsTotal - cardDueTotal).toFixed(2)
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
    cardDueTotal: Number(cardDueTotal.toFixed(2)),
    leftoverBeforePersonal,
    leftoverAfterPersonal,
    dailySuggestion,
    daysInMonth,
    remainingDays,
  }
}

interface InstallmentInput {
  amount: Money
  installments: number
  annualEffectiveRate?: number
  monthlyFee?: Money
}

interface InstallmentResult {
  monthlyPayment: Money
  baseMonthlyPayment: Money
  totalPayment: Money
  totalInterest: Money
  feeCost: Money
  effectiveMonthlyCost: number
  effectiveAnnualCost: number
  isInterestFree: boolean
}

function roundMoney(value: number): Money {
  return Number(value.toFixed(2))
}

function presentValueFromPayment(payment: number, monthlyRate: number, installments: number) {
  if (monthlyRate === 0) return payment * installments
  return payment * (1 - Math.pow(1 + monthlyRate, -installments)) / monthlyRate
}

function solveMonthlyRateFromPayment(
  principal: number,
  payment: number,
  installments: number
): number {
  if (principal <= 0 || payment <= 0 || installments <= 0) return 0
  const zeroRatePayment = principal / installments
  if (payment <= zeroRatePayment) return 0

  let low = 0
  let high = 3 // up to 300% monthly

  for (let i = 0; i < 40; i++) {
    const mid = (low + high) / 2
    const pv = presentValueFromPayment(payment, mid, installments)
    if (pv > principal) {
      low = mid
    } else {
      high = mid
    }
  }

  return high
}

/**
 * Estimate monthly payment, total cost and effective annual cost (TCEA) for an installment plan.
 */
export function calculateInstallmentPlan({
  amount,
  installments,
  annualEffectiveRate = 0,
  monthlyFee = 0,
}: InstallmentInput): InstallmentResult {
  const cleanAmount = Math.max(0, amount)
  const cleanInstallments = Math.max(1, Math.floor(installments || 1))
  const cleanAnnualRate = Math.max(0, annualEffectiveRate)
  const cleanMonthlyFee = Math.max(0, monthlyFee)

  if (cleanAmount === 0) {
    return {
      monthlyPayment: 0,
      baseMonthlyPayment: 0,
      totalPayment: 0,
      totalInterest: 0,
      feeCost: 0,
      effectiveMonthlyCost: 0,
      effectiveAnnualCost: 0,
      isInterestFree: true,
    }
  }

  const monthlyRate = Math.pow(1 + cleanAnnualRate, 1 / 12) - 1
  const baseMonthlyPayment =
    monthlyRate === 0
      ? cleanAmount / cleanInstallments
      : cleanAmount * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -cleanInstallments)))

  const monthlyPayment = baseMonthlyPayment + cleanMonthlyFee
  const totalPayment = monthlyPayment * cleanInstallments
  const feeCost = cleanMonthlyFee * cleanInstallments
  const totalInterest = Math.max(totalPayment - cleanAmount - feeCost, 0)

  const effectiveMonthlyCost = solveMonthlyRateFromPayment(
    cleanAmount,
    monthlyPayment,
    cleanInstallments
  )
  const effectiveAnnualCost = Math.pow(1 + effectiveMonthlyCost, 12) - 1

  return {
    monthlyPayment: roundMoney(monthlyPayment),
    baseMonthlyPayment: roundMoney(baseMonthlyPayment),
    totalPayment: roundMoney(totalPayment),
    totalInterest: roundMoney(totalInterest),
    feeCost: roundMoney(feeCost),
    effectiveMonthlyCost,
    effectiveAnnualCost,
    isInterestFree: cleanAnnualRate === 0 && cleanMonthlyFee === 0,
  }
}

/**
 * Formatea un monto como moneda
 */
export function formatCurrency(amount: Money, currency = 'USD'): string {
  // Mapeo de locales según moneda para mejor formato
  const localeMap: Record<string, string> = {
    USD: 'en-US',
    EUR: 'es-ES',
    MXN: 'es-MX',
    ARS: 'es-AR',
    PEN: 'es-PE',
  }
  
  const locale = localeMap[currency] || 'es-ES'
  
  return new Intl.NumberFormat(locale, {
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

