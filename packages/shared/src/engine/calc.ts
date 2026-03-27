/**
 * @sobra/shared — Calc Utilities
 *
 * Pure financial helper functions used by the Sobra Engine.
 * Zero framework dependencies.
 */

import type { Money, Period } from '../types'

// ── Date / Period helpers ──

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

// ── Financial helpers ──

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
  let high = 3

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
