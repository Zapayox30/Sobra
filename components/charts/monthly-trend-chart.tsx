'use client'

import { memo } from 'react'
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { formatCurrency } from '@/lib/finance/calc'

type TrendPoint = {
  month: string
  income: number
  expenses: number
  leftover: number
}

export const MonthlyTrendChart = memo(function MonthlyTrendChart({ data, currency = 'USD' }: { data: TrendPoint[]; currency?: string }) {
  if (!data.length) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
        No hay datos para mostrar
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 20, right: 24, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
        <XAxis
          dataKey="month"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          axisLine={{ stroke: 'hsl(var(--border))' }}
          tickLine={{ stroke: 'hsl(var(--border))' }}
        />
        <YAxis
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          axisLine={{ stroke: 'hsl(var(--border))' }}
          tickLine={{ stroke: 'hsl(var(--border))' }}
          tickFormatter={(value) => formatCurrency(value, currency)}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
                  {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-foreground font-medium">{entry.name}:</span>
                      <span className="text-muted-foreground">
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
          iconType="circle"
          formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
        />
        <Line
          type="monotone"
          dataKey="income"
          name="Ingresos"
          stroke="hsl(var(--chart-3))"
          strokeWidth={2.4}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="expenses"
          name="Gastos"
          stroke="hsl(var(--chart-1))"
          strokeWidth={2.4}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="leftover"
          name="Sobrante"
          stroke="hsl(var(--chart-5))"
          strokeWidth={2.4}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
})
