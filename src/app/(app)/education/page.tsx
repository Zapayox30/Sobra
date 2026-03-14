'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useFilteredTips, useDismissTip, useRateTip, useUndismissTip, useResetAllDismissed, useFinancialTips } from '@/hooks/use-financial-tips'
import { useSurplus, useSurplusHistory } from '@/hooks/use-surplus'
import { useCreditCards } from '@/hooks/use-credit-cards'
import { useI18n } from '@/components/providers/i18n-provider'
import type { TipEvaluationContext } from '@/lib/tip-evaluator'
import { GraduationCap, Filter, Lightbulb, CheckCircle, EyeOff, RotateCcw, Undo2 } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

const CATEGORY_KEYS = ['all', 'savings', 'debt', 'investment', 'emergency', 'spending', 'general'] as const

export default function EducationPage() {
  const { t, locale } = useI18n()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showDismissed, setShowDismissed] = useState(false)

  const { surplus, debts, savingsGoals } = useSurplus()
  const { data: surplusHistory = [] } = useSurplusHistory(6)
  const { data: creditCards = [] } = useCreditCards()
  const { isLoading } = useFinancialTips()

  const tipContext = useMemo<TipEvaluationContext>(() => ({
    savingsGoals,
    debts,
    creditCards,
    surplusHistory,
    currentNetSurplus: surplus?.netSurplus ?? 0,
  }), [savingsGoals, debts, creditCards, surplusHistory, surplus?.netSurplus])

  const { all, eligible, active, dismissed, ratedTipIds, dismissedTipIds } = useFilteredTips(tipContext)
  const dismissTip = useDismissTip()
  const rateTip = useRateTip()
  const undismissTip = useUndismissTip()
  const resetAllDismissed = useResetAllDismissed()

  const displayTips = useMemo(() => {
    const source = showDismissed ? all : active
    if (selectedCategory === 'all') return source
    return source.filter((t) => t.category === selectedCategory)
  }, [showDismissed, active, all, selectedCategory])

  const categoryColors: Record<string, string> = {
    savings: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    debt: 'bg-red-500/20 text-red-400 border-red-500/30',
    investment: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    emergency: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    spending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    general: 'bg-muted text-muted-foreground border-border',
  }

  const categoryLabel = (key: string) => {
    const map: Record<string, string> = {
      all: t.educationPage.allCategories,
      savings: t.educationPage.savings,
      debt: t.educationPage.debt,
      investment: t.educationPage.investment,
      emergency: t.educationPage.emergency,
      spending: t.educationPage.spending,
      general: t.educationPage.general,
    }
    return map[key] ?? key
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-semibold text-foreground">{t.educationPage.title}</h1>
        </div>
        <p className="text-muted-foreground">
          {t.educationPage.subtitle}
          {eligible.length < all.length && (
            <span className="text-primary ml-1">
              ({eligible.length} de {all.length} {t.educationPage.relevantCount})
            </span>
          )}
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/70 bg-card">
          <CardContent className="pt-5 flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{active.length}</p>
              <p className="text-xs text-muted-foreground">{t.educationPage.activeTips}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-card">
          <CardContent className="pt-5 flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{ratedTipIds.size}</p>
              <p className="text-xs text-muted-foreground">{t.educationPage.ratedTips}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-card">
          <CardContent className="pt-5 flex items-center gap-3">
            <div className="p-2 bg-muted text-muted-foreground rounded-lg">
              <EyeOff className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{dismissed.length}</p>
              <p className="text-xs text-muted-foreground">{t.educationPage.dismissedTips}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {CATEGORY_KEYS.map((key) => (
          <Button
            key={key}
            variant={selectedCategory === key ? 'default' : 'outline'}
            size="sm"
            className="text-xs"
            onClick={() => setSelectedCategory(key)}
          >
            {categoryLabel(key)}
          </Button>
        ))}
        <div className="flex-1" />
        {dismissed.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-primary"
            onClick={() => resetAllDismissed.mutate()}
            disabled={resetAllDismissed.isPending}
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            {t.educationPage.resetAll}
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground"
          onClick={() => setShowDismissed(!showDismissed)}
        >
          <EyeOff className="h-3 w-3 mr-1" />
          {showDismissed ? t.educationPage.hideDismissed : t.educationPage.showDismissed}
        </Button>
      </div>

      {/* Tips grid */}
      {displayTips.length === 0 ? (
        <Card className="border-border/70">
          <CardContent className="py-12 text-center">
            <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="font-semibold text-foreground">
              {selectedCategory === 'all'
                ? t.educationPage.noTips
                : t.educationPage.noTipsCategory}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {showDismissed
                ? t.educationPage.tryOtherCategory
                : t.educationPage.tryShowDismissed}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {displayTips.map((tip) => {
            const isDismissed = dismissedTipIds.has(tip.id)
            const rating = ratedTipIds.get(tip.id)
            const title = locale === 'es' ? tip.title_es : tip.title_en
            const body = locale === 'es' ? tip.body_es : tip.body_en
            const catColor = categoryColors[tip.category] ?? categoryColors.general

            return (
              <Card
                key={tip.id}
                className={`border-border/70 transition-all ${isDismissed ? 'opacity-50' : ''}`}
              >
                <CardContent className="pt-5">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/15 text-primary rounded-lg shrink-0">
                      <Lightbulb className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium border ${catColor}`}>
                          {categoryLabel(tip.category)}
                        </span>
                        {rating === true && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                            👍 {t.educationPage.useful}
                          </span>
                        )}
                        {rating === false && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400">
                            👎
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                      {isDismissed ? (
                        <div className="flex items-center gap-2 mt-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-primary hover:bg-primary/10"
                            onClick={() => undismissTip.mutate(tip.id)}
                            disabled={undismissTip.isPending}
                          >
                            <Undo2 className="h-3 w-3 mr-1" />
                            {t.educationPage.restore}
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mt-3">
                          <span className="text-xs text-muted-foreground">{t.educationPage.isUseful}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs hover:bg-emerald-500/20 hover:text-emerald-400"
                            onClick={() => rateTip.mutate({ tipId: tip.id, helpful: true })}
                          >
                            👍
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs hover:bg-red-500/20 hover:text-red-400"
                            onClick={() => rateTip.mutate({ tipId: tip.id, helpful: false })}
                          >
                            👎
                          </Button>
                          <div className="flex-1" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-muted-foreground"
                            onClick={() => dismissTip.mutate(tip.id)}
                          >
                            {t.educationPage.dismiss}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
