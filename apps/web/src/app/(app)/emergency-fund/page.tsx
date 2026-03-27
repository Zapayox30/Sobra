'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useEmergencyFund } from '@/hooks/use-emergency-fund'
import { useSurplus } from '@/hooks/use-surplus'
import { useProfile } from '@/hooks/use-user'
import { useCreateSavingsGoal, useUpdateSavingsGoal, useSavingsGoals } from '@/hooks/use-savings-goals'
import { useI18n } from '@/components/providers/i18n-provider'
import { formatCurrency } from '@/lib/calc'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  CheckCircle,
  Target,
  ArrowRight,
  Banknote,
  Calendar,
  Plus,
  PiggyBank,
} from 'lucide-react'
import { toast } from 'sonner'

export default function EmergencyFundPage() {
  const { t } = useI18n()
  const { surplus } = useSurplus()
  const { data: profile } = useProfile()
  const { isLoading: goalsLoading } = useSavingsGoals()
  const currency = useMemo(() => profile?.currency || 'PEN', [profile])

  const fund = useEmergencyFund(surplus?.netSurplus ?? 0)
  const createGoal = useCreateSavingsGoal()
  const updateGoal = useUpdateSavingsGoal()

  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showContribDialog, setShowContribDialog] = useState(false)
  const [createTarget, setCreateTarget] = useState('')
  const [createContribution, setCreateContribution] = useState('')
  const [contribAmount, setContribAmount] = useState('')

  const healthConfig = {
    none: { color: 'text-muted-foreground', bg: 'bg-muted', icon: ShieldAlert, barColor: 'bg-muted-foreground' },
    critical: { color: 'text-red-400', bg: 'bg-red-500/10', icon: ShieldAlert, barColor: 'bg-red-500' },
    building: { color: 'text-amber-400', bg: 'bg-amber-500/10', icon: Shield, barColor: 'bg-amber-500' },
    healthy: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: ShieldCheck, barColor: 'bg-emerald-500' },
    strong: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: ShieldCheck, barColor: 'bg-emerald-500' },
  }

  const config = healthConfig[fund.health]
  const HealthIcon = config.icon
  const healthLabel = t.emergencyPage[fund.healthKey]

  // Steps for the guided setup
  const steps = [
    {
      done: fund.hasGoal,
      label: t.emergencyPage.stepCreate,
      description: t.emergencyPage.stepCreateDesc,
      hasAction: true,
    },
    {
      done: fund.monthsCovered >= 1,
      label: t.emergencyPage.stepOneMonth,
      description: `${t.emergencyPage.goal}: ${formatCurrency(fund.monthlyFixedExpenses, currency)}`,
    },
    {
      done: fund.monthsCovered >= 3,
      label: t.emergencyPage.stepThreeMonths,
      description: `${t.emergencyPage.goal}: ${formatCurrency(fund.targetMin, currency)}`,
    },
    {
      done: fund.monthsCovered >= 6,
      label: t.emergencyPage.stepSixMonths,
      description: `${t.emergencyPage.goal}: ${formatCurrency(fund.targetMax, currency)}`,
    },
  ]

  const handleCreateFund = () => {
    const target = Number(createTarget) || fund.suggestedTarget
    const contribution = Number(createContribution) || fund.suggestedContribution
    createGoal.mutate(
      {
        label: t.emergencyPage.fundName,
        goal_type: 'emergency_fund',
        target_amount: target,
        monthly_contribution: contribution,
        current_amount: 0,
        is_active: true,
      },
      {
        onSuccess: () => {
          setShowCreateDialog(false)
          setCreateTarget('')
          setCreateContribution('')
          toast.success(t.emergencyPage.fundName + ' ✅')
        },
      },
    )
  }

  const handleAddContribution = () => {
    if (!fund.goal) return
    const amount = Number(contribAmount)
    if (amount <= 0) return

    updateGoal.mutate(
      {
        id: fund.goal.id,
        current_amount: fund.currentAmount + amount,
      },
      {
        onSuccess: () => {
          setShowContribDialog(false)
          setContribAmount('')
          toast.success(`+${formatCurrency(amount, currency)} ✅`)
        },
      },
    )
  }

  if (goalsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className={`rounded-lg p-2 ${config.bg} ${config.color}`}>
              <HealthIcon className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-semibold text-foreground">{t.emergencyPage.title}</h1>
          </div>
          <p className="text-muted-foreground">{t.emergencyPage.subtitle}</p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 shrink-0">
          {!fund.hasGoal ? (
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  {t.emergencyPage.create}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t.emergencyPage.createFund}</DialogTitle>
                  <DialogDescription>{t.emergencyPage.createFundDesc}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label>{t.emergencyPage.targetAmount}</Label>
                    <Input
                      type="number"
                      placeholder={String(fund.suggestedTarget)}
                      value={createTarget}
                      onChange={(e) => setCreateTarget(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      {t.emergencyPage.suggestedRange}: {formatCurrency(fund.targetMin, currency)} — {formatCurrency(fund.targetMax, currency)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>{t.emergencyPage.monthlyContribution}</Label>
                    <Input
                      type="number"
                      placeholder={String(fund.suggestedContribution)}
                      value={createContribution}
                      onChange={(e) => setCreateContribution(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">{t.emergencyPage.ofYourSurplus}</p>
                  </div>
                  <Button
                    className="w-full"
                    onClick={handleCreateFund}
                    disabled={createGoal.isPending}
                  >
                    {createGoal.isPending ? t.emergencyPage.creating : t.emergencyPage.create}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <Dialog open={showContribDialog} onOpenChange={setShowContribDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <PiggyBank className="h-4 w-4" />
                  {t.emergencyPage.addContribution}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t.emergencyPage.addContribution}</DialogTitle>
                  <DialogDescription>{t.emergencyPage.addContributionDesc}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">{t.emergencyPage.currentAmount}</p>
                    <p className="text-2xl font-bold">{formatCurrency(fund.currentAmount, currency)}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>{t.emergencyPage.addAmount}</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={contribAmount}
                      onChange={(e) => setContribAmount(e.target.value)}
                      autoFocus
                    />
                    {Number(contribAmount) > 0 && (
                      <p className="text-xs text-emerald-400">
                        → {formatCurrency(fund.currentAmount + Number(contribAmount), currency)}
                      </p>
                    )}
                  </div>
                  <Button
                    className="w-full"
                    onClick={handleAddContribution}
                    disabled={updateGoal.isPending || Number(contribAmount) <= 0}
                  >
                    {updateGoal.isPending ? t.emergencyPage.saving : t.emergencyPage.save}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Hero status */}
      <Card className={`border-border/70 ${config.bg}`}>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <HealthIcon className={`h-5 w-5 ${config.color}`} />
                <span className={`text-sm font-semibold ${config.color}`}>{healthLabel}</span>
              </div>
              <p className="text-4xl font-bold text-foreground">
                {fund.monthsCovered}{' '}
                <span className="text-lg font-normal text-muted-foreground">{t.emergencyPage.monthsCovered}</span>
              </p>
              <p className="text-muted-foreground">
                {t.emergencyPage.saved}{' '}
                <strong className="text-foreground">{formatCurrency(fund.currentAmount, currency)}</strong>
                {fund.monthlyFixedExpenses > 0 && (
                  <>
                    {' '}de{' '}
                    <strong className="text-foreground">{formatCurrency(fund.suggestedTarget, currency)}</strong>{' '}
                    {t.emergencyPage.ofSuggested}
                  </>
                )}
              </p>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{fund.progressPercent}%</span>
                  <span>
                    {t.emergencyPage.goal}:{' '}
                    {fund.goal
                      ? formatCurrency(Number(fund.goal.target_amount), currency)
                      : formatCurrency(fund.suggestedTarget, currency)}
                  </span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${config.barColor}`}
                    style={{ width: `${Math.min(fund.progressPercent, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Months gauge */}
            <div className="flex gap-1.5 md:gap-2 items-end">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-8 md:w-10 rounded-t-lg transition-all ${
                      i < Math.floor(fund.monthsCovered)
                        ? config.barColor
                        : i < fund.monthsCovered
                          ? `${config.barColor} opacity-50`
                          : 'bg-muted'
                    }`}
                    style={{ height: `${(i + 1) * 12 + 20}px` }}
                  />
                  <span className="text-[10px] text-muted-foreground">{i + 1}m</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/70 bg-card">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <Banknote className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">{t.emergencyPage.monthlyFixed}</p>
                <p className="text-lg font-semibold">{formatCurrency(fund.monthlyFixedExpenses, currency)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">{t.emergencyPage.suggestedRange}</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(fund.targetMin, currency)} — {formatCurrency(fund.targetMax, currency)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">{t.emergencyPage.suggestedContribution}</p>
                <p className="text-lg font-semibold">
                  {fund.suggestedContribution > 0
                    ? formatCurrency(fund.suggestedContribution, currency)
                    : '—'}
                </p>
                <p className="text-[10px] text-muted-foreground">{t.emergencyPage.ofYourSurplus}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">{t.emergencyPage.monthsToComplete}</p>
                <p className="text-lg font-semibold">
                  {fund.suggestedContribution > 0 && fund.suggestedTarget > fund.currentAmount
                    ? `${Math.ceil((fund.suggestedTarget - fund.currentAmount) / fund.suggestedContribution)} ${t.emergencyPage.months}`
                    : fund.monthsCovered >= 6
                      ? t.emergencyPage.completed
                      : '—'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Guided steps */}
      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>{t.emergencyPage.stepsTitle}</CardTitle>
          <CardDescription>{t.emergencyPage.stepsSubtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className={`mt-0.5 rounded-full p-1 ${
                    step.done ? 'bg-emerald-500/20 text-emerald-400' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step.done ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <span className="flex h-4 w-4 items-center justify-center text-xs font-bold">{i + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${step.done ? 'text-emerald-400 line-through' : 'text-foreground'}`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
                {!step.done && step.hasAction && !fund.hasGoal && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1"
                    onClick={() => {
                      setCreateTarget(String(fund.suggestedTarget))
                      setCreateContribution(String(fund.suggestedContribution))
                      setShowCreateDialog(true)
                    }}
                  >
                    {t.emergencyPage.create} <ArrowRight className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Advice cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/70 bg-gradient-to-br from-card to-blue-500/5">
          <CardHeader>
            <CardTitle className="text-base">{t.emergencyPage.whereToKeep}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>{t.emergencyPage.whereToKeepDesc}</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>{t.emergencyPage.whereItem1}</li>
              <li>{t.emergencyPage.whereItem2}</li>
              <li>{t.emergencyPage.whereItem3}</li>
            </ul>
            <p className="text-xs italic">{t.emergencyPage.whereNote}</p>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-gradient-to-br from-card to-amber-500/5">
          <CardHeader>
            <CardTitle className="text-base">{t.emergencyPage.whenToUse}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>{t.emergencyPage.whenToUseDesc}</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>{t.emergencyPage.whenItem1}</li>
              <li>{t.emergencyPage.whenItem2}</li>
              <li>{t.emergencyPage.whenItem3}</li>
            </ul>
            <p className="text-xs italic">
              {fund.hasActiveDebts ? t.emergencyPage.debtWarning : t.emergencyPage.noDebtMessage}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
