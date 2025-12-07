'use client'

import { memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'
import { type CategoryData } from '@/hooks/use-financial-trends'

interface CategoryBreakdownChartProps {
  data: CategoryData[]
  currency?: string
}

export const CategoryBreakdownChart = memo(function CategoryBreakdownChart({
  data,
  currency = 'USD',
}: CategoryBreakdownChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">No expense data available</p>
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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold mb-1">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(data.value)}
          </p>
          <p className="text-xs text-muted-foreground">
            {data.percentage.toFixed(1)}% of total
          </p>
        </div>
      )
    }
    return null
  }

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    if (percentage < 5) return null // Don't show label for small slices

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${percentage.toFixed(0)}%`}
      </text>
    )
  }

  const totalValue = data.reduce((sum, cat) => sum + cat.value, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Expense Breakdown by Category</CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          Total: {formatCurrency(totalValue)}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={CustomLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend with values */}
          <div className="flex flex-col justify-center space-y-3">
            {data.map((category, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: category.color }}
                  />
                  <div>
                    <p className="text-sm font-medium">{category.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {category.percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold">
                  {formatCurrency(category.value)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Category Insights */}
        <div className="mt-6 pt-6 border-t">
          <h4 className="text-sm font-semibold mb-3">Insights</h4>
          <div className="space-y-2">
            {data.length > 0 && (
              <div className="flex items-start gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {data[0].name}
                  </span>{' '}
                  is your largest expense category at{' '}
                  {data[0].percentage.toFixed(1)}%
                </p>
              </div>
            )}
            {data.length >= 2 && data[0].percentage > 50 && (
              <div className="flex items-start gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5" />
                <p className="text-muted-foreground">
                  Consider balancing your expenses - {data[0].name} accounts for
                  more than half of your spending
                </p>
              </div>
            )}
            {data.length >= 3 && (
              <div className="flex items-start gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
                <p className="text-muted-foreground">
                  You're spreading expenses across {data.length} categories
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
})
