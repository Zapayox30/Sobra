'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useMonthlyCalculation } from '@/hooks/use-calculation'
import { useProfile } from '@/hooks/use-user'
import { formatCurrency } from '@/lib/finance/calc'
import { useI18n } from '@/lib/i18n/context'
import {
  DollarSign,
  TrendingDown,
  Target,
  Wallet,
  Calendar,
} from 'lucide-react'

export default function DashboardPage() {
  const { data: profile } = useProfile()
  const { calculation, isLoading } = useMonthlyCalculation()
  const { t } = useI18n()

  if (isLoading) {
    return <LoadingSpinner />
  }

  const currency = (profile as any)?.currency || 'USD'

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">
          {t.dashboard.title}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {t.dashboard.subtitle}
        </p>
      </div>

      {calculation && (
        <>
          {/* Main SOBRA Card */}
          <Card className="border border-border/70 bg-card overflow-hidden relative">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2.5 font-semibold text-foreground">
                <div className="p-1.5 bg-primary/20 text-primary rounded-md">
                  <Wallet className="h-4 w-4" />
                </div>
                <span>{t.dashboard.leftover}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {t.dashboard.afterPersonal}
                  </p>
                  <p
                    className={`text-5xl font-semibold tracking-tight ${
                      calculation.leftoverAfterPersonal >= 0
                        ? 'text-foreground'
                        : 'text-red-600'
                    }`}
                  >
                    {formatCurrency(calculation.leftoverAfterPersonal, currency)}
                  </p>
                </div>

                <div className="pt-5 border-t border-border/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {t.dashboard.dailySuggestion}
                      </p>
                      <p className="text-2xl font-semibold text-foreground">
                        {formatCurrency(calculation.dailySuggestion, currency)}
                        <span className="text-base text-muted-foreground ml-2">{t.dashboard.perDay}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-1">
                        {t.dashboard.remainingDays}
                      </p>
                      <p className="text-2xl font-semibold text-foreground">
                        {calculation.remainingDays}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border/70 hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t.dashboard.incomeTotal}
                </CardTitle>
                <div className="p-1.5 bg-emerald-500/20 text-emerald-300 rounded-md">
                  <DollarSign className="h-3.5 w-3.5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-foreground">
                  {formatCurrency(calculation.incomeTotal, currency)}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  +100% base
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/70 hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t.dashboard.fixedExpenses}
                </CardTitle>
                <div className="p-1.5 bg-destructive/25 text-destructive-foreground rounded-md">
                  <TrendingDown className="h-3.5 w-3.5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-foreground">
                  {formatCurrency(calculation.fixedTotal, currency)}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  {calculation.incomeTotal > 0 
                    ? `${((calculation.fixedTotal / calculation.incomeTotal) * 100).toFixed(0)}${t.dashboard.percentageOfIncome}`
                    : t.dashboard.noIncome}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/70 hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t.dashboard.commitments}
                </CardTitle>
                <div className="p-1.5 bg-accent/20 text-accent rounded-md">
                  <Target className="h-3.5 w-3.5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-foreground">
                  {formatCurrency(calculation.commitmentsTotal, currency)}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  {t.dashboard.scheduledSavings}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/70 hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t.dashboard.personalBudget}
                </CardTitle>
                <div className="p-1.5 bg-muted rounded-md">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-foreground">
                  {formatCurrency(calculation.personalTotal, currency)}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  {t.dashboard.variableExpenses}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Breakdown */}
          <Card className="border-border/70">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-foreground">{t.dashboard.monthlyBreakdown}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-sm text-muted-foreground">{t.dashboard.totalIncomes}</span>
                  <span className="font-medium text-foreground">
                    + {formatCurrency(calculation.incomeTotal, currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-sm text-muted-foreground">{t.dashboard.fixedExpensesLabel}</span>
                  <span className="font-medium text-foreground">
                    - {formatCurrency(calculation.fixedTotal, currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-sm text-muted-foreground">{t.dashboard.monthlyCommitments}</span>
                  <span className="font-medium text-foreground">
                    - {formatCurrency(calculation.commitmentsTotal, currency)}
                  </span>
                </div>
                <div className="border-t border-border/60 pt-3 mt-2 flex justify-between items-center">
                  <span className="font-medium text-muted-foreground">{t.dashboard.leftoverBeforePersonal}</span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(calculation.leftoverBeforePersonal, currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-sm text-muted-foreground">{t.dashboard.personalBudgetLabel}</span>
                  <span className="font-medium text-foreground">
                    - {formatCurrency(calculation.personalTotal, currency)}
                  </span>
                </div>
                <div className="border-t border-border/60 pt-3 mt-2 flex justify-between items-center">
                  <span className="font-semibold text-foreground">
                    {t.dashboard.leftover}
                  </span>
                  <span
                    className={`font-bold text-xl ${
                      calculation.leftoverAfterPersonal >= 0
                        ? 'text-foreground'
                        : 'text-red-600'
                    }`}
                  >
                    {formatCurrency(calculation.leftoverAfterPersonal, currency)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

