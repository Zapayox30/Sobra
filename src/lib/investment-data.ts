/**
 * Peru Investment Products — Reference Data
 *
 * Static reference data for Peruvian financial products.
 * Used by the investment advice page and simulator.
 */

export interface InvestmentProduct {
  id: string
  name: string
  category: 'deposito_plazo' | 'fondo_mutuo' | 'afp_voluntaria' | 'cts' | 'fintech'
  categoryLabel: string
  provider: string
  minAmount: number
  currency: 'PEN' | 'USD'
  estimatedReturnMin: number // annual % (e.g., 0.04 = 4%)
  estimatedReturnMax: number
  risk: 'bajo' | 'moderado' | 'alto'
  liquidity: 'alta' | 'media' | 'baja'
  description: string
  url?: string
}

/**
 * Curated list of Peruvian investment products (reference only).
 * These are approximate values for educational purposes.
 */
export const PERU_INVESTMENT_PRODUCTS: InvestmentProduct[] = [
  // Depósitos a plazo
  {
    id: 'bcp-deposito',
    name: 'Depósito a Plazo BCP',
    category: 'deposito_plazo',
    categoryLabel: 'Depósito a plazo',
    provider: 'BCP',
    minAmount: 1000,
    currency: 'PEN',
    estimatedReturnMin: 0.035,
    estimatedReturnMax: 0.055,
    risk: 'bajo',
    liquidity: 'baja',
    description: 'Depósito a plazo fijo con tasa garantizada. Plazo mínimo 30 días.',
  },
  {
    id: 'interbank-deposito',
    name: 'Depósito a Plazo Interbank',
    category: 'deposito_plazo',
    categoryLabel: 'Depósito a plazo',
    provider: 'Interbank',
    minAmount: 500,
    currency: 'PEN',
    estimatedReturnMin: 0.04,
    estimatedReturnMax: 0.06,
    risk: 'bajo',
    liquidity: 'baja',
    description: 'Depósito con tasas competitivas. Puedes elegir plazo desde 30 días.',
  },
  {
    id: 'scotiabank-deposito',
    name: 'Depósito a Plazo Scotiabank',
    category: 'deposito_plazo',
    categoryLabel: 'Depósito a plazo',
    provider: 'Scotiabank',
    minAmount: 1000,
    currency: 'PEN',
    estimatedReturnMin: 0.03,
    estimatedReturnMax: 0.05,
    risk: 'bajo',
    liquidity: 'baja',
    description: 'Depósito a plazo fijo con capital protegido.',
  },

  // Fondos mutuos
  {
    id: 'credicorp-conservador',
    name: 'Fondo Mutuo Conservador',
    category: 'fondo_mutuo',
    categoryLabel: 'Fondo mutuo',
    provider: 'Credicorp Capital',
    minAmount: 500,
    currency: 'PEN',
    estimatedReturnMin: 0.04,
    estimatedReturnMax: 0.07,
    risk: 'bajo',
    liquidity: 'media',
    description: 'Fondo de renta fija, ideal para perfiles conservadores. Retiros en 48-72h.',
  },
  {
    id: 'credicorp-moderado',
    name: 'Fondo Mutuo Balanceado',
    category: 'fondo_mutuo',
    categoryLabel: 'Fondo mutuo',
    provider: 'Credicorp Capital',
    minAmount: 1000,
    currency: 'PEN',
    estimatedReturnMin: 0.06,
    estimatedReturnMax: 0.12,
    risk: 'moderado',
    liquidity: 'media',
    description: 'Combinación de renta fija y variable. Mayor rentabilidad con riesgo moderado.',
  },
  {
    id: 'sura-equilibrado',
    name: 'SURA Fondo Equilibrado',
    category: 'fondo_mutuo',
    categoryLabel: 'Fondo mutuo',
    provider: 'SURA',
    minAmount: 500,
    currency: 'PEN',
    estimatedReturnMin: 0.05,
    estimatedReturnMax: 0.10,
    risk: 'moderado',
    liquidity: 'media',
    description: 'Fondo diversificado con mix de renta fija y acciones. Desde S/ 500.',
  },

  // AFP Voluntaria
  {
    id: 'afp-habitat',
    name: 'AFP Voluntaria con Fin',
    category: 'afp_voluntaria',
    categoryLabel: 'AFP Voluntaria',
    provider: 'AFP Habitat / Integra / Prima / Profuturo',
    minAmount: 100,
    currency: 'PEN',
    estimatedReturnMin: 0.06,
    estimatedReturnMax: 0.14,
    risk: 'moderado',
    liquidity: 'baja',
    description: 'Aportes voluntarios con beneficio tributario. Puedes deducir hasta 12 UIT al año.',
  },

  // CTS
  {
    id: 'cts-general',
    name: 'CTS — Compensación por Tiempo de Servicios',
    category: 'cts',
    categoryLabel: 'CTS',
    provider: 'Tu banco elegido',
    minAmount: 0,
    currency: 'PEN',
    estimatedReturnMin: 0.03,
    estimatedReturnMax: 0.07,
    risk: 'bajo',
    liquidity: 'baja',
    description: 'Depósito semestral del empleador (mayo y noviembre). Genera intereses. Solo retirable al dejar de trabajar.',
  },

  // Fintech
  {
    id: 'tyba',
    name: 'Tyba — Inversión digital',
    category: 'fintech',
    categoryLabel: 'Fintech',
    provider: 'Tyba (Credicorp)',
    minAmount: 100,
    currency: 'PEN',
    estimatedReturnMin: 0.04,
    estimatedReturnMax: 0.10,
    risk: 'moderado',
    liquidity: 'media',
    description: 'App de inversión digital respaldada por Credicorp. Fondos desde S/ 100.',
  },
]

export const PRODUCT_CATEGORIES = [
  { key: 'all', label: 'Todos' },
  { key: 'deposito_plazo', label: 'Depósitos a plazo' },
  { key: 'fondo_mutuo', label: 'Fondos mutuos' },
  { key: 'afp_voluntaria', label: 'AFP Voluntaria' },
  { key: 'cts', label: 'CTS' },
  { key: 'fintech', label: 'Fintech' },
]

export const RISK_COLORS = {
  bajo: 'bg-emerald-500/20 text-emerald-400',
  moderado: 'bg-amber-500/20 text-amber-400',
  alto: 'bg-red-500/20 text-red-400',
}

export const LIQUIDITY_COLORS = {
  alta: 'bg-blue-500/20 text-blue-400',
  media: 'bg-amber-500/20 text-amber-400',
  baja: 'bg-muted text-muted-foreground',
}

/**
 * Simulate compound interest growth.
 */
export function simulateInvestment(params: {
  initialAmount: number
  monthlyContribution: number
  annualRate: number
  years: number
}): {
  finalAmount: number
  totalContributed: number
  totalInterest: number
  monthlyData: { month: number; balance: number; contributed: number }[]
} {
  const { initialAmount, monthlyContribution, annualRate, years } = params
  const monthlyRate = annualRate / 12
  const totalMonths = years * 12

  let balance = initialAmount
  let totalContributed = initialAmount
  const monthlyData: { month: number; balance: number; contributed: number }[] = []

  for (let m = 1; m <= totalMonths; m++) {
    balance = balance * (1 + monthlyRate) + monthlyContribution
    totalContributed += monthlyContribution
    if (m % 3 === 0 || m === totalMonths) {
      monthlyData.push({ month: m, balance: Math.round(balance), contributed: Math.round(totalContributed) })
    }
  }

  return {
    finalAmount: Math.round(balance),
    totalContributed: Math.round(totalContributed),
    totalInterest: Math.round(balance - totalContributed),
    monthlyData,
  }
}
