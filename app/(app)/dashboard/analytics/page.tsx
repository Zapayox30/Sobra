'use client'

import { useMemo, useState, type ReactNode, Suspense } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { format } from 'date-fns'
import { startOfMonth, subMonths } from 'date-fns'
import { ChartCard } from '@/components/charts/chart-card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useMonthlyCalculation } from '@/hooks/use-calculation'
import { useProfile } from '@/hooks/use-user'
import { calculateExpenseDistribution } from '@/lib/finance/chart-utils'
import { calculateMonthlySobra } from '@/lib/finance/calc'
import { ArrowLeft, TrendingUp, BarChart3, Bell, DownloadCloud } from 'lucide-react'

// Lazy load chart components to improve initial load time
const ExpenseDistributionChart = dynamic(
  () => import('@/components/charts/expense-distribution-chart').then(mod => ({ default: mod.ExpenseDistributionChart })),
  { loading: () => <LoadingSpinner /> }
)

const FinancialBreakdownChart = dynamic(
  () => import('@/components/charts/financial-breakdown-chart').then(mod => ({ default: mod.FinancialBreakdownChart })),
  { loading: () => <LoadingSpinner /> }
)

const MonthlyTrendChart = dynamic(
  () => import('@/components/charts/monthly-trend-chart').then(mod => ({ default: mod.MonthlyTrendChart })),
  { loading: () => <LoadingSpinner /> }
)

type TrendPoint = {
  month: string
  income: number
  expenses: number
  leftover: number
}

const demoTrend: TrendPoint[] = [
  { month: 'Ago', income: 2200, expenses: 1900, leftover: 300 },
  { month: 'Sep', income: 2300, expenses: 1850, leftover: 450 },
  { month: 'Oct', income: 2450, expenses: 1950, leftover: 500 },
  { month: 'Nov', income: 2600, expenses: 2100, leftover: 500 },
  { month: 'Dic', income: 2650, expenses: 2050, leftover: 600 },
  { month: 'Ene', income: 2700, expenses: 2150, leftover: 550 },
]

const demoCalculation = {
  incomeTotal: 2700,
  fixedTotal: 1200,
  commitmentsTotal: 300,
  personalTotal: 500,
  cardDueTotal: 200,
  leftoverBeforePersonal: 1000,
  leftoverAfterPersonal: 500,
  dailySuggestion: 17,
  daysInMonth: 30,
  remainingDays: 30,
}

export default function AnalyticsPage() {
  const { data: profile } = useProfile()
  const [selectedMonth, setSelectedMonth] = useState<Date>(startOfMonth(new Date()))
  const [showDemo, setShowDemo] = useState(false)

  const monthOptions = useMemo(() => {
    const current = startOfMonth(new Date())
    return Array.from({ length: 6 }, (_, index) => {
      const date = subMonths(current, index)
      return {
        value: date.toISOString(),
        label: format(date, 'MMM yyyy'),
        date,
      }
    }).reverse()
  }, [])

  const { calculation, isLoading, incomes, fixedExpenses, personalExpenses, commitments, cardDueTotal } =
    useMonthlyCalculation(selectedMonth)

  const currency = useMemo(() => (profile as any)?.currency || 'USD', [profile])

  // Memoize data transformations to prevent unnecessary recalculations
  const mappedIncomes = useMemo(
    () =>
      incomes?.map((i) => ({
        amount: Number(i.amount),
        starts_on: new Date(i.starts_on),
        ends_on: i.ends_on ? new Date(i.ends_on) : null,
        is_active: i.is_active,
      })) || [],
    [incomes]
  )

  const mappedFixed = useMemo(
    () =>
      fixedExpenses?.map((e) => ({
        amount: Number(e.amount),
        starts_on: new Date(e.starts_on),
        ends_on: e.ends_on ? new Date(e.ends_on) : null,
        is_active: e.is_active,
      })) || [],
    [fixedExpenses]
  )

  const mappedPersonal = useMemo(
    () =>
      personalExpenses?.map((e) => ({
        amount: Number(e.amount),
        starts_on: new Date(e.starts_on),
        ends_on: e.ends_on ? new Date(e.ends_on) : null,
        is_active: e.is_active,
      })) || [],
    [personalExpenses]
  )

  const mappedCommitments = useMemo(
    () =>
      commitments?.map((c) => ({
        amount_per_month: Number(c.amount_per_month),
        start_month: new Date(c.start_month),
        end_month: new Date(c.end_month),
      })) || [],
    [commitments]
  )

  const trendData: TrendPoint[] = useMemo(() => {
    if (!mappedIncomes.length && !mappedFixed.length && !mappedPersonal.length && !mappedCommitments.length) {
      return []
    }

    return monthOptions.map((option) => {
      const result = calculateMonthlySobra({
        monthStart: option.date,
        incomes: mappedIncomes,
        fixedExpenses: mappedFixed,
        personalBudgets: mappedPersonal,
        commitments: mappedCommitments,
        cardDueTotal: option.date.getTime() === startOfMonth(selectedMonth).getTime() ? cardDueTotal : 0,
      })

      return {
        month: option.label,
        income: result.incomeTotal,
        expenses: result.fixedTotal + result.commitmentsTotal + result.personalTotal + result.cardDueTotal,
        leftover: result.leftoverAfterPersonal,
      }
    })
  }, [
    cardDueTotal,
    mappedCommitments,
    mappedFixed,
    mappedIncomes,
    mappedPersonal,
    monthOptions,
    selectedMonth,
  ])

  const isEmpty =
    calculation &&
    calculation.incomeTotal === 0 &&
    calculation.fixedTotal === 0 &&
    calculation.personalTotal === 0 &&
    calculation.commitmentsTotal === 0 &&
    cardDueTotal === 0

  const displayCalculation = showDemo ? demoCalculation : calculation
  const displayTrend = showDemo ? demoTrend : trendData

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-4 flex-wrap">
        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al Dashboard
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <Select
            onValueChange={(value) => setSelectedMonth(startOfMonth(new Date(value)))}
            defaultValue={startOfMonth(selectedMonth).toISOString()}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Mes" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isEmpty && (
            <Button variant="outline" size="sm" onClick={() => setShowDemo((prev) => !prev)}>
              {showDemo ? 'Ocultar demo' : 'Ver datos de demo'}
            </Button>
          )}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <TrendingUp className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-semibold text-foreground">Analytics</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Analiza tus ingresos, gastos y sobrante por mes. Usa el selector para navegar meses y ver tendencias.
        </p>
      </div>

      {isEmpty && !showDemo ? (
        <div className="border border-border/70 rounded-lg p-6 bg-card/50">
          <p className="font-semibold text-foreground">Aún no tienes datos suficientes</p>
          <p className="text-sm text-muted-foreground mt-1">
            Agrega ingresos o gastos para ver tus tendencias. También puedes previsualizar con datos de demo.
          </p>
          <div className="mt-4 flex gap-2">
            <Button size="sm" asChild>
              <Link href="/incomes">Agregar ingresos</Link>
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowDemo(true)}>
              Ver datos de demo
            </Button>
          </div>
        </div>
      ) : (
        <>
          {displayTrend.length > 0 && (
            <ChartCard
              title="Tendencia mensual"
              description="Ingresos, gastos y sobrante en los últimos meses"
              action={
                <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
                  <BarChart3 className="h-4 w-4" />
                  <span>Actualiza con el selector de mes</span>
                </div>
              }
            >
              <MonthlyTrendChart data={displayTrend} currency={currency} />
            </ChartCard>
          )}

          {displayCalculation && (
            <div className="grid gap-6 lg:grid-cols-2">
              <ChartCard
                title="Distribución de gastos"
                description="Cómo se reparten tus gastos del mes seleccionado"
              >
                <ExpenseDistributionChart
                  data={calculateExpenseDistribution(displayCalculation)}
                  currency={currency}
                />
              </ChartCard>

              <ChartCard
                title="Resumen financiero"
                description="Comparación de ingresos vs gastos del mes seleccionado"
              >
                <FinancialBreakdownChart
                  incomeTotal={displayCalculation.incomeTotal}
                  fixedTotal={displayCalculation.fixedTotal}
                  commitmentsTotal={displayCalculation.commitmentsTotal}
                  personalTotal={displayCalculation.personalTotal}
                  currency={currency}
                />
              </ChartCard>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-3">
            <RoadmapHighlight
              icon={<Bell className="h-4 w-4" />}
              title="Alertas inteligentes"
              description="Próximamente: avisos por vencimientos y saldo en negativo."
            />
            <RoadmapHighlight
              icon={<DownloadCloud className="h-4 w-4" />}
              title="Exportar CSV/Excel"
              description="Exporta tus datos y crea respaldos mensuales."
            />
            <RoadmapHighlight
              icon={<BarChart3 className="h-4 w-4" />}
              title="Histórico completo"
              description="Explora 24 meses de tendencias y compara periodos."
            />
          </div>
        </>
      )}
    </div>
  )
}

function RoadmapHighlight({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-lg border border-border/70 bg-card/50 p-4">
      <div className="mb-2 flex items-center gap-2 text-primary">
        {icon}
        <span className="text-sm font-semibold text-foreground">{title}</span>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
