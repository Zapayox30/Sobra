'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Lightbulb, ThumbsUp, ThumbsDown, X } from 'lucide-react'
import type { FinancialTip } from '@/types'
import { useI18n } from '@/components/providers/i18n-provider'

interface FinancialTipCardProps {
    tip: FinancialTip
    onDismiss: (tipId: string) => void
    onRate: (tipId: string, helpful: boolean) => void
}

export function FinancialTipCard({ tip, onDismiss, onRate }: FinancialTipCardProps) {
    const { locale } = useI18n()

    const title = locale === 'es' ? tip.title_es : tip.title_en
    const body = locale === 'es' ? tip.body_es : tip.body_en

    const categoryColors: Record<string, string> = {
        savings: 'bg-emerald-500/20 text-emerald-400',
        debt: 'bg-red-500/20 text-red-400',
        investment: 'bg-purple-500/20 text-purple-400',
        emergency: 'bg-blue-500/20 text-blue-400',
        spending: 'bg-amber-500/20 text-amber-400',
        general: 'bg-muted text-muted-foreground',
    }

    const categoryColor = categoryColors[tip.category] ?? categoryColors.general

    return (
        <Card className="border-border/70 bg-gradient-to-br from-card to-primary/5 overflow-hidden">
            <CardContent className="pt-5">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/15 text-primary rounded-lg shrink-0">
                        <Lightbulb className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-semibold text-foreground">{title}</h4>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${categoryColor}`}>
                                {tip.category}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                        <div className="flex items-center gap-2 mt-3">
                            <span className="text-xs text-muted-foreground mr-1">¿Te fue útil?</span>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className="h-7 w-7 hover:bg-emerald-500/20 hover:text-emerald-400"
                                onClick={() => onRate(tip.id, true)}
                                title="Útil"
                            >
                                <ThumbsUp className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className="h-7 w-7 hover:bg-red-500/20 hover:text-red-400"
                                onClick={() => onRate(tip.id, false)}
                                title="No útil"
                            >
                                <ThumbsDown className="h-3.5 w-3.5" />
                            </Button>
                            <div className="flex-1" />
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-muted-foreground hover:text-foreground"
                                onClick={() => onDismiss(tip.id)}
                            >
                                <X className="h-3 w-3 mr-1" />
                                No mostrar más
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
