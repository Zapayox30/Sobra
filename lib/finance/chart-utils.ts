import { CalculationResult } from './calc'

export interface ExpenseDistribution {
    name: string
    value: number
    percentage: number
    color: string
}

export interface MonthlyTrend {
    month: string
    income: number
    expenses: number
    leftover: number
}

/**
 * Calcula la distribución de gastos para gráficos de pastel
 */
export function calculateExpenseDistribution(
    calculation: CalculationResult
): ExpenseDistribution[] {
    const total =
        calculation.fixedTotal +
        calculation.commitmentsTotal +
        calculation.personalTotal

    if (total === 0) {
        return []
    }

    const distribution: ExpenseDistribution[] = [
        {
            name: 'Gastos Fijos',
            value: calculation.fixedTotal,
            percentage: (calculation.fixedTotal / total) * 100,
            color: 'hsl(var(--chart-1))', // Red tones
        },
        {
            name: 'Compromisos',
            value: calculation.commitmentsTotal,
            percentage: (calculation.commitmentsTotal / total) * 100,
            color: 'hsl(var(--chart-2))', // Blue tones
        },
        {
            name: 'Presupuesto Personal',
            value: calculation.personalTotal,
            percentage: (calculation.personalTotal / total) * 100,
            color: 'hsl(var(--chart-3))', // Purple tones
        },
    ]

    // Filter out zero values
    return distribution.filter((item) => item.value > 0)
}

/**
 * Formatea el valor para mostrar en tooltips de gráficos
 */
export function formatChartValue(value: number, currency = 'USD'): string {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value)
}

/**
 * Formatea porcentaje para gráficos
 */
export function formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`
}

/**
 * Colores para gráficos (usaremos CSS variables)
 */
export const CHART_COLORS = {
    primary: 'hsl(var(--primary))',
    secondary: 'hsl(var(--secondary))',
    accent: 'hsl(var(--accent))',
    muted: 'hsl(var(--muted))',
    chart1: 'hsl(var(--chart-1))',
    chart2: 'hsl(var(--chart-2))',
    chart3: 'hsl(var(--chart-3))',
    chart4: 'hsl(var(--chart-4))',
    chart5: 'hsl(var(--chart-5))',
}
