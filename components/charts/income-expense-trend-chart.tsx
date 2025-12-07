'use client'

import { memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { type MonthlyData } from '@/hooks/use-financial-trends'

interface IncomeExpenseTrendChartProps {
  data: MonthlyData[]
  currency?: string
}

export const IncomeExpenseTrendChart = memo(function IncomeExpenseTrendChart({
  data,
  currency = 'USD',
}: IncomeExpenseTrendChartProps) {
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

  // Calculate trend
  const firstMonth = data[0]
  const lastMonth = data[data.length - 1]
  const incomeTrend = lastMonth.income - firstMonth.income
  const expenseTrend =
    lastMonth.expenses + lastMonth.commitments - (firstMonth.expenses + firstMonth.commitments)

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
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p
              key={index}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
          <div className="border-t border-border mt-2 pt-2">
            <p className="text-xs text-muted-foreground">
              Balance:{' '}
              <span
                className={
                  payload[0].payload.balance >= 0
                    ? 'text-green-500 font-semibold'
                    : 'text-red-500 font-semibold'
                }
              >
                {formatCurrency(payload[0].payload.balance)}
              </span>
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Income vs Expenses Trend</CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              {incomeTrend >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={incomeTrend >= 0 ? 'text-green-500' : 'text-red-500'}>
                Income {incomeTrend >= 0 ? '+' : ''}
                {formatCurrency(incomeTrend)}
              </span>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Last {data.length} months financial overview
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1} />
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              iconType="line"
            />
            <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="income"
              stroke="hsl(var(--chart-1))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--chart-1))', r: 4 }}
              activeDot={{ r: 6 }}
              name="Income"
            />
            <Line
              type="monotone"
              dataKey={(data) => data.expenses + data.commitments}
              stroke="hsl(var(--chart-2))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--chart-2))', r: 4 }}
              activeDot={{ r: 6 }}
              name="Total Expenses"
            />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="hsl(var(--chart-3))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Balance"
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Avg Income</p>
            <p className="text-lg font-semibold text-green-500">
              {formatCurrency(
                data.reduce((sum, m) => sum + m.income, 0) / data.length
              )}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Avg Expenses</p>
            <p className="text-lg font-semibold text-red-500">
              {formatCurrency(
                data.reduce((sum, m) => sum + m.expenses + m.commitments, 0) /
                  data.length
              )}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Avg Savings</p>
            <p className="text-lg font-semibold text-blue-500">
              {formatCurrency(
                data.reduce((sum, m) => sum + m.savings, 0) / data.length
              )}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Savings Rate</p>
            <p className="text-lg font-semibold">
              {(
                (data.reduce((sum, m) => sum + m.savings, 0) /
                  data.reduce((sum, m) => sum + m.income, 0)) *
                100
              ).toFixed(1)}
              %
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})
