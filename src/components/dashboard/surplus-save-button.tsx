'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Save, History } from 'lucide-react'
import { useSaveSurplus } from '@/hooks/use-surplus'
import { useI18n } from '@/components/providers/i18n-provider'
import type { SurplusOutput } from '@/lib/sobra-engine'
import { formatCurrency } from '@/lib/calc'

interface SurplusSaveButtonProps {
    surplus: SurplusOutput
    currency: string
}

export function SurplusSaveButton({ surplus, currency }: SurplusSaveButtonProps) {
    const saveSurplus = useSaveSurplus()
    const { t } = useI18n()

    const handleSave = () => {
        const now = new Date()
        const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
        saveSurplus.mutate({ surplus, month })
    }

    return (
        <Card className="border-border/70 bg-gradient-to-br from-card to-emerald-500/5">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <History className="h-4 w-4" />
                    {t.surplusSave.title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-xs text-muted-foreground">
                            {formatCurrency(surplus.netSurplus, currency)} {t.surplusSave.description}
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">
                            {t.surplusSave.updateNote}
                        </p>
                    </div>
                    <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={saveSurplus.isPending}
                        className="shrink-0 gap-2"
                    >
                        <Save className="h-4 w-4" />
                        {saveSurplus.isPending ? t.surplusSave.saving : t.surplusSave.save}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
