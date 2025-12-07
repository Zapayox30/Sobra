'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Clock } from 'lucide-react'
import { ComparisonPeriod } from '@/hooks/use-metrics-comparison'

interface PeriodSelectorProps {
  selected: ComparisonPeriod
  onChange: (period: ComparisonPeriod) => void
}

const periods: { value: ComparisonPeriod; label: string; icon: any }[] = [
  {
    value: 'last-30min-previous-30min',
    label: 'Last 30 min vs Previous',
    icon: Clock,
  },
  {
    value: 'last-hour-previous-hour',
    label: 'Last Hour vs Previous',
    icon: Clock,
  },
  {
    value: 'today-yesterday',
    label: 'Today vs Yesterday',
    icon: Calendar,
  },
  {
    value: 'this-week-last-week',
    label: 'This Week vs Last Week',
    icon: Calendar,
  },
]

export function PeriodSelector({ selected, onChange }: PeriodSelectorProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground mr-2">Compare:</span>
          {periods.map((period) => {
            const Icon = period.icon
            const isSelected = selected === period.value

            return (
              <Button
                key={period.value}
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange(period.value)}
                className={isSelected ? '' : 'hover:bg-accent'}
              >
                <Icon className="h-3.5 w-3.5 mr-2" />
                {period.label}
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
