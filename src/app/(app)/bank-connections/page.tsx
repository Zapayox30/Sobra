'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useI18n } from '@/components/providers/i18n-provider'
import {
    useBankConnections,
    useDeleteBankConnection,
    useUpdateBankConnection,
} from '@/hooks/use-bank-connections'
import {
    Link2,
    LinkIcon,
    Trash2,
    RefreshCw,
    Building2,
    CheckCircle,
    AlertTriangle,
    XCircle,
    ExternalLink,
} from 'lucide-react'

const PERUVIAN_BANKS = [
    { name: 'BCP', code: 'bcp_pe', color: 'bg-blue-600' },
    { name: 'Interbank', code: 'interbank_pe', color: 'bg-green-600' },
    { name: 'BBVA', code: 'bbva_pe', color: 'bg-blue-800' },
    { name: 'Scotiabank', code: 'scotiabank_pe', color: 'bg-red-600' },
    { name: 'BanBif', code: 'banbif_pe', color: 'bg-orange-600' },
    { name: 'Mibanco', code: 'mibanco_pe', color: 'bg-purple-600' },
]

const statusConfig = {
    active: {
        icon: CheckCircle,
        labelKey: 'statusActive' as const,
        color: 'text-emerald-500',
        badge: 'bg-emerald-500/20 text-emerald-400',
    },
    needs_reauth: {
        icon: AlertTriangle,
        labelKey: 'statusReauth' as const,
        color: 'text-amber-500',
        badge: 'bg-amber-500/20 text-amber-400',
    },
    revoked: {
        icon: XCircle,
        labelKey: 'statusRevoked' as const,
        color: 'text-red-500',
        badge: 'bg-red-500/20 text-red-400',
    },
}

export default function BankConnectionsPage() {
    const { data: connections, isLoading } = useBankConnections()
    const deleteConnection = useDeleteBankConnection()
    const updateConnection = useUpdateBankConnection()
    const { t } = useI18n()
    const tb = t.bankPage

    if (isLoading) return <LoadingSpinner />

    const handleSync = (id: string) => {
        updateConnection.mutate({
            id,
            last_synced_at: new Date().toISOString(),
        })
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="rounded-lg bg-blue-500/10 p-2.5 text-blue-400">
                        <Link2 className="h-6 w-6" />
                    </div>
                    <h1 className="text-3xl font-semibold text-foreground">{tb.title}</h1>
                </div>
                <p className="text-muted-foreground mt-1 text-sm">
                    {tb.subtitle}
                </p>
            </div>

            {/* Provider info */}
            <Card className="border-border/70 bg-gradient-to-br from-card to-blue-500/5">
                <CardContent className="pt-5">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-500/15 text-blue-400 rounded-lg">
                            <Link2 className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-base font-semibold text-foreground mb-1">
                                {tb.poweredBy}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {tb.poweredByDesc}
                            </p>
                            <div className="flex items-center gap-2 mt-3">
                                <span className="text-xs text-muted-foreground/60 bg-muted/50 px-2.5 py-1 rounded-md">
                                    {tb.encrypted}
                                </span>
                                <span className="text-xs text-muted-foreground/60 bg-muted/50 px-2.5 py-1 rounded-md">
                                    {tb.regulated}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Available banks */}
            <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">{tb.availableBanks}</h2>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {PERUVIAN_BANKS.map((bank) => {
                        const isConnected = connections?.some(
                            (c) => c.institution_code === bank.code && c.status === 'active'
                        )

                        return (
                            <Card
                                key={bank.code}
                                className={`border-border/70 transition-all ${isConnected ? 'ring-1 ring-emerald-500/30 bg-emerald-500/5' : 'hover:shadow-md'
                                    }`}
                            >
                                <CardContent className="pt-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`h-10 w-10 rounded-lg ${bank.color} flex items-center justify-center text-white font-bold text-xs shadow-sm`}
                                            >
                                                {bank.name.slice(0, 2)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground text-sm">{bank.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {isConnected ? `✅ ${tb.connected}` : tb.available}
                                                </p>
                                            </div>
                                        </div>
                                        {!isConnected && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled
                                                className="text-xs"
                                                title={tb.comingSoon}
                                            >
                                                <LinkIcon className="h-3 w-3 mr-1" />
                                                {tb.connect}
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
                <p className="text-xs text-muted-foreground/60 mt-3">
                    {tb.comingSoonDesc}
                </p>
            </div>

            {/* Active connections */}
            <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">{tb.yourConnections}</h2>
                {!connections || connections.length === 0 ? (
                    <EmptyState
                        icon={Building2}
                        title={tb.noConnections}
                        description={tb.noConnectionsDesc}
                        action={{
                            label: tb.goToAccounts,
                            onClick: () => {
                                window.location.href = '/accounts'
                            },
                        }}
                    />
                ) : (
                    <div className="space-y-3">
                        {connections.map((conn) => {
                            const config =
                                statusConfig[conn.status as keyof typeof statusConfig] ??
                                statusConfig.active
                            const StatusIcon = config.icon

                            return (
                                <Card key={conn.id} className="border-border/70 hover:shadow-sm transition-shadow">
                                    <CardContent className="pt-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                                                    <Building2 className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground text-sm">
                                                        {conn.institution_name}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <StatusIcon className={`h-3 w-3 ${config.color}`} />
                                                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${config.badge}`}>
                                                            {tb[config.labelKey]}
                                                        </span>
                                                        {conn.last_synced_at && (
                                                            <span className="text-[10px] text-muted-foreground/60">
                                                                {tb.lastSync}: {new Date(conn.last_synced_at).toLocaleDateString('es-PE')}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleSync(conn.id)}
                                                    disabled={updateConnection.isPending}
                                                >
                                                    <RefreshCw className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        if (confirm(tb.disconnectConfirm))
                                                            deleteConnection.mutate(conn.id)
                                                    }}
                                                    disabled={deleteConnection.isPending}
                                                >
                                                    <Trash2 className="h-3 w-3 text-red-600" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Belvo documentation link */}
            <Card className="border-border/70">
                <CardContent className="pt-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-foreground">{tb.docsTitle}</p>
                            <p className="text-xs text-muted-foreground">
                                {tb.docsDesc}
                            </p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <a
                                href="https://developers.belvo.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Belvo Docs
                            </a>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
