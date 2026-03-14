'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    AlertTriangle,
    AlertCircle,
    Info,
    CheckCheck,
    Bell,
    X,
} from 'lucide-react'
import type { FinancialAlert } from '@/types'

interface FinancialAlertsPanelProps {
    alerts: FinancialAlert[]
    onMarkRead: (id: string) => void
    onMarkAllRead: () => void
    onDelete: (id: string) => void
}

const severityConfig = {
    critical: {
        icon: AlertTriangle,
        bg: 'bg-red-500/10 border-red-500/30',
        iconColor: 'text-red-500',
        badge: 'bg-red-500/20 text-red-400',
    },
    warning: {
        icon: AlertCircle,
        bg: 'bg-amber-500/10 border-amber-500/30',
        iconColor: 'text-amber-500',
        badge: 'bg-amber-500/20 text-amber-400',
    },
    info: {
        icon: Info,
        bg: 'bg-blue-500/10 border-blue-500/30',
        iconColor: 'text-blue-500',
        badge: 'bg-blue-500/20 text-blue-400',
    },
}

export function FinancialAlertsPanel({
    alerts,
    onMarkRead,
    onMarkAllRead,
    onDelete,
}: FinancialAlertsPanelProps) {
    const unreadCount = alerts.filter((a) => !a.is_read).length

    if (alerts.length === 0) {
        return null
    }

    return (
        <Card className="border-border/70">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-md">
                            <Bell className="h-4 w-4" />
                        </div>
                        Alertas Financieras
                        {unreadCount > 0 && (
                            <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 text-xs font-semibold rounded-full bg-red-500 text-white">
                                {unreadCount}
                            </span>
                        )}
                    </CardTitle>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={onMarkAllRead}>
                            <CheckCheck className="h-4 w-4 mr-1" />
                            Marcar todas leídas
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {alerts.slice(0, 10).map((alert) => {
                        const config =
                            severityConfig[alert.severity as keyof typeof severityConfig] ??
                            severityConfig.info
                        const Icon = config.icon

                        return (
                            <div
                                key={alert.id}
                                className={`flex items-start gap-3 p-3 rounded-lg border transition-opacity ${config.bg} ${alert.is_read ? 'opacity-60' : ''
                                    }`}
                            >
                                <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${config.iconColor}`} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <p className="text-sm font-medium text-foreground">
                                            {alert.title}
                                        </p>
                                        <span
                                            className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${config.badge}`}
                                        >
                                            {alert.severity}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {alert.message}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground/60 mt-1">
                                        {new Date(alert.created_at).toLocaleDateString('es-PE', {
                                            day: 'numeric',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                                <div className="flex gap-1 shrink-0">
                                    {!alert.is_read && (
                                        <Button
                                            variant="ghost"
                                            size="icon-sm"
                                            className="h-6 w-6"
                                            onClick={() => onMarkRead(alert.id)}
                                            title="Marcar como leída"
                                        >
                                            <CheckCheck className="h-3 w-3" />
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        className="h-6 w-6 text-muted-foreground hover:text-red-500"
                                        onClick={() => onDelete(alert.id)}
                                        title="Eliminar"
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
