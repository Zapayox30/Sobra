'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useFinancialTrends } from '@/hooks/use-financial-trends'
import { IncomeExpenseTrendChart } from '@/components/charts/income-expense-trend-chart'
import { CategoryBreakdownChart } from '@/components/charts/category-breakdown-chart'
import { MonthlyComparisonChart } from '@/components/charts/monthly-comparison-chart'
import { Sparkline } from '@/components/charts/sparkline'
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Wallet,
  CreditCard,
  Calendar,
} from 'lucide-react'

export default function TrendsPage() {
  const [monthsToShow, setMonthsToShow] = useState(6)
  const trends = useFinancialTrends(monthsToShow)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Extract data for sparklines
  const incomeSparkline = trends.monthlyTrends.map((m) => m.income)
  const expenseSparkline = trends.monthlyTrends.map(
    (m) => m.expenses + m.commitments
  )
  const savingsSparkline = trends.monthlyTrends.map((m) => m.savings)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Financial Trends</h1>
        <p className="text-muted-foreground mt-1">
          Analyze your financial performance over time
        </p>
      </div>

      {/* Time Range Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 flex-wrap">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground mr-2">Time Range:</span>
            {[3, 6, 12].map((months) => (
              <Button
                key={months}
                variant={monthsToShow === months ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMonthsToShow(months)}
              >
                Last {months} Months
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards with Sparklines */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Avg Income */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Monthly Income
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {formatCurrency(trends.averageMonthlyIncome)}
            </div>
            <div className="mt-3">
              <Sparkline
                data={incomeSparkline}
                color="rgb(34, 197, 94)"
                height={40}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Last {monthsToShow} months trend
            </p>
          </CardContent>
        </Card>

        {/* Avg Expenses */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Monthly Expenses
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {formatCurrency(trends.averageMonthlyExpenses)}
            </div>
            <div className="mt-3">
              <Sparkline
                data={expenseSparkline}
                color="rgb(239, 68, 68)"
                height={40}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Last {monthsToShow} months trend
            </p>
          </CardContent>
        </Card>

        {/* Savings Rate */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Savings Rate
              </CardTitle>
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">
                {trends.savingsRate.toFixed(1)}%
              </div>
              {trends.savingsRate >= 20 ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : trends.savingsRate >= 10 ? (
                <TrendingUp className="h-5 w-5 text-amber-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="mt-3">
              <Sparkline
                data={savingsSparkline}
                color="rgb(59, 130, 246)"
                height={40}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {trends.savingsRate >= 20
                ? 'Excellent! 🎉'
                : trends.savingsRate >= 10
                ? 'Good progress'
                : 'Consider saving more'}
            </p>
          </CardContent>
        </Card>

        {/* Total Savings */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Savings
              </CardTitle>
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {formatCurrency(
                trends.monthlyTrends.reduce((sum, m) => sum + m.savings, 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Last {monthsToShow} months
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Avg: {formatCurrency(
                trends.monthlyTrends.reduce((sum, m) => sum + m.savings, 0) /
                  monthsToShow
              )}/month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Trend Chart */}
      <IncomeExpenseTrendChart data={trends.monthlyTrends} currency="USD" />

      {/* Secondary Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryBreakdownChart
          data={trends.categoryBreakdown}
          currency="USD"
        />
        <MonthlyComparisonChart data={trends.monthlyTrends} currency="USD" />
      </div>

      {/* Financial Health Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Financial Health Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Savings Rate Insight */}
            {trends.savingsRate >= 20 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-500">
                    Excellent Savings Rate!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    You're saving {trends.savingsRate.toFixed(1)}% of your income.
                    This is above the recommended 20% threshold. Keep it up!
                  </p>
                </div>
              </div>
            )}

            {trends.savingsRate < 10 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <TrendingDown className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-500">
                    Low Savings Rate
                  </p>
                  <p className="text-sm text-muted-foreground">
                    You're saving {trends.savingsRate.toFixed(1)}% of your income.
                    Try to aim for at least 10-20% to build financial stability.
                  </p>
                </div>
              </div>
            )}

            {/* Expense Trend */}
            {trends.monthlyTrends.length >= 2 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold mt-0.5">
                  i
                </div>
                <div>
                  <p className="text-sm font-semibold">Expense Trend</p>
                  <p className="text-sm text-muted-foreground">
                    Your average monthly expenses are{' '}
                    {formatCurrency(trends.averageMonthlyExpenses)}. This
                    represents{' '}
                    {(
                      (trends.averageMonthlyExpenses /
                        trends.averageMonthlyIncome) *
                      100
                    ).toFixed(1)}
                    % of your average income.
                  </p>
                </div>
              </div>
            )}

            {/* Category Recommendation */}
            {trends.categoryBreakdown.length > 0 &&
              trends.categoryBreakdown[0].percentage > 50 && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold mt-0.5">
                    !
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Expense Concentration</p>
                    <p className="text-sm text-muted-foreground">
                      {trends.categoryBreakdown[0].name} accounts for{' '}
                      {trends.categoryBreakdown[0].percentage.toFixed(1)}% of your
                      total expenses. Consider diversifying or reviewing this
                      category.
                    </p>
                  </div>
                </div>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
