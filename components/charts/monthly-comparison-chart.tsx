'use client'

import { memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { type MonthlyData } from '@/hooks/use-financial-trends'

interface MonthlyComparisonChartProps {
  data: MonthlyData[]
  currency?: string
}

export const MonthlyComparisonChart = memo(function MonthlyComparisonChart({
  data,
  currency = 'USD',
}: MonthlyComparisonChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">No data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const totalExpenses = data.expenses + data.commitments
      const balance = data.income - totalExpenses

      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-green-500">
              Income: {formatCurrency(data.income)}
            </p>
            <p className="text-sm text-blue-500">
              Fixed: {formatCurrency(data.expenses)}
            </p>
            <p className="text-sm text-orange-500">
              Commitments: {formatCurrency(data.commitments)}
            </p>
            <div className="border-t border-border pt-1 mt-1">
              <p className="text-sm font-semibold">
                Total Expenses: {formatCurrency(totalExpenses)}
              </p>
              <p
                className={`text-sm font-semibold ${
                  balance >= 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                Balance: {formatCurrency(balance)}
              </p>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  // Find best and worst months
  const monthsWithBalance = data.map((m) => ({
    ...m,
    totalBalance: m.income - (m.expenses + m.commitments),
  }))
  const bestMonth = monthsWithBalance.reduce((best, current) =>
    current.totalBalance > best.totalBalance ? current : best
  )
  const worstMonth = monthsWithBalance.reduce((worst, current) =>
    current.totalBalance < worst.totalBalance ? current : worst
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Monthly Financial Comparison</CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          Income and expenses breakdown by month
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}
            />
            <Bar
              dataKey="income"
              fill="hsl(var(--chart-1))"
              name="Income"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="expenses"
              fill="hsl(var(--chart-2))"
              name="Fixed Expenses"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="commitments"
              fill="hsl(var(--chart-3))"
              name="Commitments"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

        {/* Month Analysis */}
        <div className="grid md:grid-cols-2 gap-4 mt-6 pt-6 border-t">
          {/* Best Month */}
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-green-500">Best Month</p>
              <p className="text-xs text-muted-foreground">{bestMonth.month}</p>
            </div>
            <p className="text-2xl font-bold text-green-500">
              {formatCurrency(bestMonth.totalBalance)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Balance (Income - Expenses)
            </p>
          </div>

          {/* Worst Month */}
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-amber-500">
                Lowest Balance
              </p>
              <p className="text-xs text-muted-foreground">{worstMonth.month}</p>
            </div>
            <p className="text-2xl font-bold text-amber-500">
              {formatCurrency(worstMonth.totalBalance)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {worstMonth.totalBalance >= 0
                ? 'Still positive!'
                : 'Consider budgeting adjustments'}
            </p>
          </div>
        </div>

        {/* Insights */}
        <div className="mt-4 p-4 rounded-lg bg-muted/50">
          <h4 className="text-sm font-semibold mb-2">Key Insights</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
              <p>
                Difference between best and worst month:{' '}
                <span className="font-semibold text-foreground">
                  {formatCurrency(
                    Math.abs(bestMonth.totalBalance - worstMonth.totalBalance)
                  )}
                </span>
              </p>
            </div>
            {data.length >= 2 && (
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                <p>
                  {data[data.length - 1].totalBalance >
                  data[data.length - 2].totalBalance
                    ? '📈 Your balance improved last month!'
                    : '📉 Your balance decreased last month - review expenses'}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
})
