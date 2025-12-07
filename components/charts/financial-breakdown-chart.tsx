'use client'

import { memo } from 'react'
import { formatCurrency } from '@/lib/finance/calc'
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'

interface FinancialBreakdownData {
    name: string
    Ingresos: number
    'Gastos Fijos': number
    Compromisos: number
    Personal: number
}

interface FinancialBreakdownChartProps {
    incomeTotal: number
    fixedTotal: number
    commitmentsTotal: number
    personalTotal: number
    currency?: string
}

export const FinancialBreakdownChart = memo(function FinancialBreakdownChart({
    incomeTotal,
    fixedTotal,
    commitmentsTotal,
    personalTotal,
    currency = 'USD',
}: FinancialBreakdownChartProps) {
    const data: FinancialBreakdownData[] = [
        {
            name: 'Este Mes',
            Ingresos: incomeTotal,
            'Gastos Fijos': fixedTotal,
            Compromisos: commitmentsTotal,
            Personal: personalTotal,
        },
    ]

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                <XAxis
                    dataKey="name"
                    className="text-xs text-muted-foreground"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis
                    className="text-xs text-muted-foreground"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    tickFormatter={(value) => formatCurrency(value, currency)}
                />
                <Tooltip
                    content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                            return (
                                <div className="bg-card border border-border rounded-lg shadow-lg p-3">
                                    {payload.map((entry, index) => (
                                        <div key={index} className="flex items-center gap-2 mb-1">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: entry.color }}
                                            />
                                            <span className="text-sm text-foreground font-medium">
                                                {entry.name}:
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                {formatCurrency(entry.value as number, currency)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )
                        }
                        return null
                    }}
                />
                <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                    formatter={(value) => (
                        <span className="text-sm text-foreground">{value}</span>
                    )}
                />
                <Bar
                    dataKey="Ingresos"
                    fill="hsl(var(--chart-3))"
                    radius={[8, 8, 0, 0]}
                />
                <Bar
                    dataKey="Gastos Fijos"
                    fill="hsl(var(--chart-1))"
                    radius={[8, 8, 0, 0]}
                />
                <Bar
                    dataKey="Compromisos"
                    fill="hsl(var(--chart-2))"
                    radius={[8, 8, 0, 0]}
                />
                <Bar
                    dataKey="Personal"
                    fill="hsl(var(--chart-5))"
                    radius={[8, 8, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    )
})
