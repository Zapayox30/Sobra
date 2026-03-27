'use client'

import { useMemo, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useSurplus, useSurplusHistory } from '@/hooks/use-surplus'
import { useProfile } from '@/hooks/use-user'
import { useFinancialAlerts, useMarkAlertRead, useMarkAllAlertsRead, useDeleteAlert, useCreateAlert } from '@/hooks/use-financial-alerts'
import { useNextTip, useDismissTip, useRateTip, useRecordTipShown } from '@/hooks/use-financial-tips'
import { useCreditCards } from '@/hooks/use-credit-cards'
import type { TipEvaluationContext } from '@/lib/tip-evaluator'
import { formatCurrency } from '@/lib/calc'
import { generateSmartAlerts } from '@/lib/smart-alerts'
import { useI18n } from '@/components/providers/i18n-provider'
import { FinancialAlertsPanel } from '@/components/dashboard/financial-alerts-panel'
import { FinancialTipCard } from '@/components/dashboard/financial-tip-card'
import { SurplusSaveButton } from '@/components/dashboard/surplus-save-button'
import {
  DollarSign,
  TrendingDown,
  Target,
  Wallet,
  Calendar,
  TrendingUp,
  CreditCard,
  AlertTriangle,
  Shield,
  Landmark,
  PiggyBank,
  ArrowUpRight,
  Banknote,
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { data: profile } = useProfile()
  const {
    surplus,
    isLoading: surplusLoading,
    accounts,
    wallets,
    debts,
    savingsGoals,
    cardDueTotal = 0,
    cardMinimumDue = 0,
    nextDueDate,
    overdue,
  } = useSurplus()

  const { data: surplusHistory = [] } = useSurplusHistory(6)
  const { data: creditCards = [] } = useCreditCards()
  const { t } = useI18n()

  // Financial alerts
  const { data: financialAlerts = [] } = useFinancialAlerts()
  const markAlertRead = useMarkAlertRead()
  const markAllRead = useMarkAllAlertsRead()
  const deleteAlert = useDeleteAlert()
  const createAlert = useCreateAlert()

  // Financial tips — with contextual condition evaluation
  const tipContext = useMemo<TipEvaluationContext>(() => ({
    savingsGoals,
    debts,
    creditCards,
    surplusHistory,
    currentNetSurplus: surplus?.netSurplus ?? 0,
  }), [savingsGoals, debts, creditCards, surplusHistory, surplus?.netSurplus])
  const nextTip = useNextTip(tipContext)
  const dismissTip = useDismissTip()
  const rateTip = useRateTip()
  const recordTipShown = useRecordTipShown()

  const isLoading = surplusLoading
  const currency = useMemo(() => profile?.currency || 'PEN', [profile])

  // Record tip as shown when it appears
  const tipShownRef = useRef<string | null>(null)
  useEffect(() => {
    if (nextTip && nextTip.id !== tipShownRef.current) {
      tipShownRef.current = nextTip.id
      recordTipShown.mutate(nextTip.id)
    }
  }, [nextTip]) // eslint-disable-line react-hooks/exhaustive-deps

  // Generate smart alerts when surplus changes
  const alertsGeneratedRef = useRef(false)
  useEffect(() => {
    if (!surplus || alertsGeneratedRef.current) return
    alertsGeneratedRef.current = true

    const candidates = generateSmartAlerts({
      surplus,
      debts: debts ?? [],
      savingsGoals: savingsGoals ?? [],
      cardDueTotal: cardDueTotal ?? 0,
      nextDueDate,
      overdue,
    })

    // Only create alerts that don't already exist (by alert_type + today)
    const todayStr = new Date().toISOString().split('T')[0]
    const existingTypes = new Set(
      financialAlerts
        .filter((a) => a.created_at.startsWith(todayStr))
        .map((a) => a.alert_type)
    )

    for (const candidate of candidates) {
      if (!existingTypes.has(candidate.alert_type)) {
        createAlert.mutate(candidate)
      }
    }
  }, [surplus]) // eslint-disable-line react-hooks/exhaustive-deps

  // Card due info
  const cardDueInfo = useMemo(() => {
    if (!nextDueDate) return { daysToDue: null, dueSoon: false }
    const today = new Date()
    const daysToDue = Math.ceil(
      (new Date(nextDueDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    )
    return { daysToDue, dueSoon: daysToDue >= 0 && daysToDue <= 5 }
  }, [nextDueDate])

  if (isLoading) {
    return <LoadingSpinner />
  }

  // Single source of truth: Sobra Engine
  const netSurplus = surplus?.netSurplus ?? 0
  const grossSurplus = surplus?.grossSurplus ?? 0
  const dailySuggestion = surplus?.dailySuggestion ?? 0
  const remainingDays = surplus?.remainingDays ?? 0
  const incomeTotal = surplus?.incomeTotal ?? 0
  const fixedTotal = surplus?.fixedTotal ?? 0
  const commitmentsTotal = surplus?.commitmentsTotal ?? 0
  const personalTotal = surplus?.personalTotal ?? 0
  const debtsTotal = surplus?.debtsTotal ?? 0
  const savingsCommitted = surplus?.savingsCommitted ?? 0
  const consolidatedBalance = surplus?.consolidatedBalance ?? 0
  const classification = surplus?.classification ?? { safe: 0, operative: 0, unavailable: 0 }

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

      {/* Card overdue/due soon alert */}
      {cardDueTotal > 0 && (overdue || cardDueInfo.dueSoon) && (
        <Card className={`border ${overdue ? 'border-red-400/50 bg-red-500/10' : 'border-amber-400/50 bg-amber-500/10'} shadow-sm`}>
          <CardContent className="py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-black/10 text-foreground">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  {overdue ? t.dashboard.cardOverdue : t.dashboard.cardDueSoon}
                </p>
                {nextDueDate && (
                  <p className="text-sm text-muted-foreground">
                    {t.dashboard.cardNextDue}: {new Date(nextDueDate).toLocaleDateString()} ({cardDueInfo.daysToDue} días)
                  </p>
                )}
              </div>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/credit-cards">{t.surplusSave.goToCards}</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Financial Alerts Panel */}
      <FinancialAlertsPanel
        alerts={financialAlerts}
        onMarkRead={(id) => markAlertRead.mutate(id)}
        onMarkAllRead={() => markAllRead.mutate()}
        onDelete={(id) => deleteAlert.mutate(id)}
      />

      {/* Financial Tip of the Day */}
      {nextTip && (
        <FinancialTipCard
          tip={nextTip}
          onDismiss={(tipId) => dismissTip.mutate(tipId)}
          onRate={(tipId, helpful) => rateTip.mutate({ tipId, helpful })}
        />
      )}

      {/* ============================================= */}
      {/* 1) HERO: SOBRA MENSUAL (Net Surplus)          */}
      {/* ============================================= */}
      <Card className="border border-border/70 bg-card overflow-hidden relative">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl flex items-center gap-2.5 font-semibold text-foreground">
            <div className="p-1.5 bg-primary/20 text-primary rounded-md">
              <Wallet className="h-4 w-4" />
            </div>
            <span>{t.dashboard.sobraMensual}</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t.dashboard.sobraSubtitle}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <p
                className={`text-5xl font-semibold tracking-tight ${netSurplus >= 0 ? 'text-foreground' : 'text-red-600'
                  }`}
              >
                {formatCurrency(netSurplus, currency)}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {t.dashboard.grossSurplus}: {formatCurrency(grossSurplus, currency)}
              </p>
            </div>

            <div className="pt-5 border-t border-border/60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {t.dashboard.dailySuggestion}
                  </p>
                  <p className="text-2xl font-semibold text-foreground">
                    {formatCurrency(dailySuggestion, currency)}
                    <span className="text-base text-muted-foreground ml-2">{t.dashboard.perDay}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">
                    {t.dashboard.remainingDays}
                  </p>
                  <p className="text-2xl font-semibold text-foreground">
                    {remainingDays}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ============================================= */}
      {/* 2) CONSOLIDATED BALANCE                       */}
      {/* ============================================= */}
      <Card className="border-border/70 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t.dashboard.consolidatedBalance}
          </CardTitle>
          <div className="p-1.5 bg-blue-500/20 text-blue-300 rounded-md">
            <Landmark className="h-3.5 w-3.5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold text-foreground">
            {formatCurrency(consolidatedBalance, currency)}
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            {accounts.filter(a => a.is_active).length} {t.surplusSave.accounts} · {wallets.filter(w => w.is_active).length} {t.surplusSave.wallets}
          </p>
        </CardContent>
      </Card>

      {/* ============================================= */}
      {/* 3) SURPLUS CLASSIFICATION                     */}
      {/* ============================================= */}
      {netSurplus > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border/70 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t.dashboard.investable}
              </CardTitle>
              <div className="p-1.5 bg-emerald-500/20 text-emerald-300 rounded-md">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-emerald-400">
                {formatCurrency(classification.safe, currency)}
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                {t.dashboard.surplusSafe} (50%)
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/70 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t.dashboard.operationalBuffer}
              </CardTitle>
              <div className="p-1.5 bg-amber-500/20 text-amber-300 rounded-md">
                <Banknote className="h-3.5 w-3.5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-amber-400">
                {formatCurrency(classification.operative, currency)}
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                {t.dashboard.surplusOperative} (30%)
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/70 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t.dashboard.emergencyReserve}
              </CardTitle>
              <div className="p-1.5 bg-purple-500/20 text-purple-300 rounded-md">
                <Shield className="h-3.5 w-3.5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-purple-400">
                {formatCurrency(classification.unavailable, currency)}
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                {t.dashboard.surplusUnavailable} (20%)
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ============================================= */}
      {/* 4) PROJECTION / TREND (surplus history)       */}
      {/* ============================================= */}
      {surplusHistory.length > 0 && (
        <Card className="border-border/70">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              {t.dashboard.surplusTrend}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{t.dashboard.surplusTrendSubtitle}</p>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {surplusHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="flex-shrink-0 text-center px-4 py-3 rounded-lg bg-muted/50 min-w-[100px]"
                >
                  <p className="text-xs text-muted-foreground mb-1">
                    {new Date(entry.month).toLocaleDateString(undefined, { month: 'short', year: '2-digit' })}
                  </p>
                  <p className={`text-sm font-semibold ${Number(entry.net_surplus) >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                    {formatCurrency(Number(entry.net_surplus), currency)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save surplus snapshot */}
      {surplus && (
        <SurplusSaveButton surplus={surplus} currency={currency} />
      )}

      {/* ============================================= */}
      {/* 5) SUMMARY CARDS (existing, repositioned)     */}
      {/* ============================================= */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
              {formatCurrency(incomeTotal, currency)}
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
              {formatCurrency(fixedTotal, currency)}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              {incomeTotal > 0
                ? `${((fixedTotal / incomeTotal) * 100).toFixed(0)}${t.dashboard.percentageOfIncome}`
                : t.dashboard.noIncome}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/70 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t.dashboard.debtsLabel}
            </CardTitle>
            <div className="p-1.5 bg-red-500/20 text-red-300 rounded-md">
              <CreditCard className="h-3.5 w-3.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">
              {formatCurrency(debtsTotal + cardDueTotal, currency)}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              {t.dashboard.cardMinimumDue}: {formatCurrency(cardMinimumDue, currency)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/70 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t.dashboard.savingsLabel}
            </CardTitle>
            <div className="p-1.5 bg-accent/20 text-accent rounded-md">
              <PiggyBank className="h-3.5 w-3.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">
              {formatCurrency(savingsCommitted + commitmentsTotal, currency)}
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
              {formatCurrency(personalTotal, currency)}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              {t.dashboard.variableExpenses}
            </p>
          </CardContent>
        </Card>
      </div>



      {/* Analytics Call-to-Action */}
      <Card className="border-border/70 bg-gradient-to-br from-card to-accent/5 hover:shadow-lg transition-all duration-300">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="p-3 bg-primary/10 text-primary rounded-lg">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {t.surplusSave.analyticsTitle}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t.surplusSave.analyticsDesc}
                </p>
              </div>
            </div>
            <Link href="/dashboard/analytics">
              <Button className="gap-2 whitespace-nowrap">
                <TrendingUp className="h-4 w-4" />
                {t.surplusSave.viewAnalytics}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* ============================================= */}
      {/* MONTHLY BREAKDOWN (existing, kept for detail)  */}
      {/* ============================================= */}
      <Card className="border-border/70">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-foreground">{t.dashboard.monthlyBreakdown}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-1.5">
              <span className="text-sm text-muted-foreground">{t.dashboard.totalIncomes}</span>
              <span className="font-medium text-foreground">
                + {formatCurrency(incomeTotal, currency)}
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-sm text-muted-foreground">{t.dashboard.fixedExpensesLabel}</span>
              <span className="font-medium text-foreground">
                - {formatCurrency(fixedTotal, currency)}
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-sm text-muted-foreground">{t.dashboard.debtsLabel}</span>
              <span className="font-medium text-foreground">
                - {formatCurrency(debtsTotal, currency)}
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-sm text-muted-foreground">{t.dashboard.cardDue}</span>
              <span className="font-medium text-foreground">
                - {formatCurrency(cardDueTotal, currency)}
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-sm text-muted-foreground">{t.dashboard.savingsLabel}</span>
              <span className="font-medium text-foreground">
                - {formatCurrency(savingsCommitted, currency)}
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-sm text-muted-foreground">{t.dashboard.monthlyCommitments}</span>
              <span className="font-medium text-foreground">
                - {formatCurrency(commitmentsTotal, currency)}
              </span>
            </div>
            <div className="border-t border-border/60 pt-3 mt-2 flex justify-between items-center">
              <span className="font-medium text-muted-foreground">{t.dashboard.grossSurplus}</span>
              <span className="font-semibold text-foreground">
                {formatCurrency(grossSurplus, currency)}
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-sm text-muted-foreground">{t.dashboard.personalBudgetLabel}</span>
              <span className="font-medium text-foreground">
                - {formatCurrency(personalTotal, currency)}
              </span>
            </div>
            <div className="border-t border-border/60 pt-3 mt-2 flex justify-between items-center">
              <span className="font-semibold text-foreground">
                {t.dashboard.sobraMensual}
              </span>
              <span
                className={`font-bold text-xl ${netSurplus >= 0 ? 'text-foreground' : 'text-red-600'
                  }`}
              >
                {formatCurrency(netSurplus, currency)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
