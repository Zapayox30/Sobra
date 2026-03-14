'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useSurplus, useSurplusHistory } from '@/hooks/use-surplus'
import { useEmergencyFund } from '@/hooks/use-emergency-fund'
import { useProfile } from '@/hooks/use-user'
import { useI18n } from '@/components/providers/i18n-provider'
import { formatCurrency } from '@/lib/calc'
import {
  PERU_INVESTMENT_PRODUCTS,
  PRODUCT_CATEGORIES,
  RISK_COLORS,
  LIQUIDITY_COLORS,
  simulateInvestment,
} from '@/lib/investment-data'
import {
  TrendingUp,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Landmark,
  Calculator,
  Filter,
  ArrowRight,
  Info,
} from 'lucide-react'
import Link from 'next/link'

export default function InvestmentsPage() {
  const { surplus, isLoading: surplusLoading } = useSurplus()
  const { data: surplusHistory = [], isLoading: historyLoading } = useSurplusHistory(6)
  const { data: profile } = useProfile()
  const currency = useMemo(() => profile?.currency || 'PEN', [profile])
  const fund = useEmergencyFund(surplus?.netSurplus ?? 0)
  const { t } = useI18n()

  const [selectedCategory, setSelectedCategory] = useState('all')
  const [simAmount, setSimAmount] = useState('500')
  const [simMonthly, setSimMonthly] = useState('200')
  const [simRate, setSimRate] = useState('7')
  const [simYears, setSimYears] = useState('3')

  const isLoading = surplusLoading || historyLoading

  const simulation = useMemo(() => {
    return simulateInvestment({
      initialAmount: parseFloat(simAmount || '0'),
      monthlyContribution: parseFloat(simMonthly || '0'),
      annualRate: parseFloat(simRate || '0') / 100,
      years: parseInt(simYears || '1'),
    })
  }, [simAmount, simMonthly, simRate, simYears])

  // Readiness check
  const consecutivePositive = useMemo(() => {
    const sorted = [...surplusHistory].sort((a, b) => b.month.localeCompare(a.month))
    let count = 0
    for (const h of sorted) {
      if (Number(h.net_surplus) > 0) count++
      else break
    }
    return count
  }, [surplusHistory])

  const tp = t.investmentsPage

  const readinessChecks = [
    {
      label: tp.checkPositiveSurplus,
      done: (surplus?.netSurplus ?? 0) > 0,
      tip: tp.tipPositive,
    },
    {
      label: tp.checkEmergencyStarted,
      done: fund.hasGoal,
      tip: tp.tipEmergency,
    },
    {
      label: tp.checkOneMonth,
      done: fund.monthsCovered >= 1,
      tip: tp.tipOneMonth,
    },
    {
      label: tp.checkThreeMonths,
      done: consecutivePositive >= 3,
      tip: `${consecutivePositive} ${tp.tipThreeMonths}`,
    },
    {
      label: tp.checkDebtsControlled,
      done: !fund.hasActiveDebts,
      tip: tp.tipDebts,
    },
  ]

  const readinessScore = readinessChecks.filter((c) => c.done).length
  const isReady = readinessScore >= 3

  const investableAmount = useMemo(() => {
    if (!surplus || surplus.netSurplus <= 0) return 0
    return Math.round(surplus.classification.safe)
  }, [surplus])

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return PERU_INVESTMENT_PRODUCTS
    return PERU_INVESTMENT_PRODUCTS.filter((p) => p.category === selectedCategory)
  }, [selectedCategory])

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="rounded-lg bg-purple-500/10 p-2.5 text-purple-400">
            <TrendingUp className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-semibold text-foreground">{tp.title}</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          {tp.subtitle}
        </p>
      </div>

      {/* Readiness check */}
      <Card className={`border-border/70 ${isReady ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-amber-500/5 border-amber-500/20'}`}>
        <CardHeader>
          <div className="flex items-center gap-2">
            {isReady ? (
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
            ) : (
              <ShieldAlert className="h-5 w-5 text-amber-400" />
            )}
            <CardTitle className="text-lg">
              {isReady ? tp.readyTitle : tp.notReadyTitle}
            </CardTitle>
          </div>
          <CardDescription>
            {isReady
              ? `${readinessScore}/${readinessChecks.length} ${tp.readyDesc} ${formatCurrency(investableAmount, currency)}.`
              : `${readinessScore}/${readinessChecks.length} ${tp.notReadyDesc}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {readinessChecks.map((check, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm p-2.5 rounded-lg bg-card/50">
                {check.done ? (
                  <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                )}
                <div>
                  <p className={check.done ? 'text-emerald-400 font-medium' : 'text-foreground font-medium'}>{check.label}</p>
                  {!check.done && <p className="text-xs text-muted-foreground mt-0.5">{check.tip}</p>}
                </div>
              </div>
            ))}
          </div>
          {!fund.hasGoal && (
            <div className="mt-4">
              <Button asChild variant="outline" size="sm" className="gap-1.5">
                <Link href="/emergency-fund">
                  {tp.goToEmergency} <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Key metrics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/70 bg-card hover:shadow-md transition-shadow">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/15 text-purple-400 rounded-lg">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{tp.investableAmount}</p>
                <p className="text-2xl font-semibold">{formatCurrency(investableAmount, currency)}</p>
                <p className="text-[10px] text-muted-foreground">{tp.investableDesc}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-card hover:shadow-md transition-shadow">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/15 text-blue-400 rounded-lg">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{tp.positiveMonths}</p>
                <p className="text-2xl font-semibold">{consecutivePositive}</p>
                <p className="text-[10px] text-muted-foreground">{tp.consecutive}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-card hover:shadow-md transition-shadow">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/15 text-amber-400 rounded-lg">
                <Landmark className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{tp.availableProducts}</p>
                <p className="text-2xl font-semibold">{PERU_INVESTMENT_PRODUCTS.length}</p>
                <p className="text-[10px] text-muted-foreground">{tp.referenceForPeru}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Investment simulator */}
      <Card className="border-border/70">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/15 text-primary rounded-md">
              <Calculator className="h-4 w-4" />
            </div>
            <CardTitle>{tp.simulatorTitle}</CardTitle>
          </div>
          <CardDescription>
            {tp.simulatorDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>{tp.initialAmount}</Label>
                  <Input type="number" value={simAmount} onChange={(e) => setSimAmount(e.target.value)} />
                </div>
                <div>
                  <Label>{tp.monthlyContribution}</Label>
                  <Input type="number" value={simMonthly} onChange={(e) => setSimMonthly(e.target.value)} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>{tp.annualRate}</Label>
                  <Input type="number" step="0.1" value={simRate} onChange={(e) => setSimRate(e.target.value)} />
                </div>
                <div>
                  <Label>{tp.years}</Label>
                  <Input type="number" min={1} max={30} value={simYears} onChange={(e) => setSimYears(e.target.value)} />
                </div>
              </div>
              {investableAmount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs gap-1.5"
                  onClick={() => setSimMonthly(String(investableAmount))}
                >
                  <ArrowRight className="h-3 w-3" />
                  {tp.useMyAmount} ({formatCurrency(investableAmount, currency)})
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-border/70 bg-card/80 p-3">
                  <p className="text-xs text-muted-foreground">{tp.totalAccumulated}</p>
                  <p className="text-xl font-bold text-foreground">{formatCurrency(simulation.finalAmount, currency)}</p>
                </div>
                <div className="rounded-lg border border-border/70 bg-card/80 p-3">
                  <p className="text-xs text-muted-foreground">{tp.totalContributed}</p>
                  <p className="text-xl font-semibold text-muted-foreground">{formatCurrency(simulation.totalContributed, currency)}</p>
                </div>
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                  <p className="text-xs text-emerald-400">{tp.interestEarned}</p>
                  <p className="text-xl font-bold text-emerald-400">{formatCurrency(simulation.totalInterest, currency)}</p>
                </div>
              </div>

              {/* Mini chart */}
              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground">{tp.quarterlyEvolution}</p>
                <div className="flex items-end gap-0.5 h-20">
                  {simulation.monthlyData.map((d, i) => {
                    const max = simulation.finalAmount || 1
                    const height = (d.balance / max) * 100
                    return (
                      <div key={i} className="flex-1 flex flex-col items-stretch justify-end" title={`${tp.years} ${d.month}: ${formatCurrency(d.balance, currency)}`}>
                        <div className="bg-primary/30 hover:bg-primary/50 transition-colors rounded-t-sm" style={{ height: `${height}%` }} />
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products catalog */}
      <div>
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {PRODUCT_CATEGORIES.map((cat) => (
            <Button
              key={cat.key}
              variant={selectedCategory === cat.key ? 'default' : 'outline'}
              size="sm"
              className="text-xs"
              onClick={() => setSelectedCategory(cat.key)}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="border-border/70 hover:border-primary/30 hover:shadow-md transition-all">
              <CardContent className="pt-5 space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{product.name}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">{product.provider}</p>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>

                <div className="flex flex-wrap gap-1.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${RISK_COLORS[product.risk]}`}>
                    {tp.riskLabel} {product.risk}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${LIQUIDITY_COLORS[product.liquidity]}`}>
                    {tp.liquidityLabel} {product.liquidity}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-purple-500/20 text-purple-400">
                    {(product.estimatedReturnMin * 100).toFixed(0)}-{(product.estimatedReturnMax * 100).toFixed(0)}% {tp.annual}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
                  <span>{tp.minimum}: {formatCurrency(product.minAmount, product.currency)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7 px-3 hover:bg-primary/10"
                    onClick={() => {
                      setSimRate(String((product.estimatedReturnMin + product.estimatedReturnMax) / 2 * 100))
                      setSimAmount(String(product.minAmount))
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                  >
                    {tp.simulate}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <Card className="border-border/70 bg-muted/30">
        <CardContent className="pt-5 flex items-start gap-3">
          <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">{tp.disclaimerTitle}</p>
            <p className="leading-relaxed">{tp.disclaimerText}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
