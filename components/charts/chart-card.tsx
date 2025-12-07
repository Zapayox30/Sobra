'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ReactNode } from 'react'

interface ChartCardProps {
    title: string
    description?: string
    children: ReactNode
    action?: ReactNode
    className?: string
}

export function ChartCard({
    title,
    description,
    children,
    action,
    className = '',
}: ChartCardProps) {
    return (
        <Card className={`border-border/70 ${className}`}>
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-semibold text-foreground">
                            {title}
                        </CardTitle>
                        {description && (
                            <p className="text-sm text-muted-foreground mt-1">
                                {description}
                            </p>
                        )}
                    </div>
                    {action && <div>{action}</div>}
                </div>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    )
}
