'use client'

import { memo } from 'react'
import { formatCurrency } from '@/lib/finance/calc'
import { ExpenseDistribution, formatPercentage } from '@/lib/finance/chart-utils'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

interface ExpenseDistributionChartProps {
    data: ExpenseDistribution[]
    currency?: string
}

export const ExpenseDistributionChart = memo(function ExpenseDistributionChart({
    data,
    currency = 'USD',
}: ExpenseDistributionChartProps) {
    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <p>No hay datos de gastos para mostrar</p>
            </div>
        )
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => formatPercentage(entry.percentage)}
                    outerRadius={100}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={800}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip
                    content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                            const data = payload[0].payload as ExpenseDistribution
                            return (
                                <div className="bg-card border border-border rounded-lg shadow-lg p-3">
                                    <p className="font-semibold text-foreground">{data.name}</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {formatCurrency(data.value, currency)}
                                    </p>
                                    <p className="text-sm text-accent font-medium mt-0.5">
                                        {formatPercentage(data.percentage)}
                                    </p>
                                </div>
                            )
                        }
                        return null
                    }}
                />
                <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    formatter={(value) => (
                        <span className="text-sm text-foreground">{value}</span>
                    )}
                />
            </PieChart>
        </ResponsiveContainer>
    )
})
