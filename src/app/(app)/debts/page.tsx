'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { DebtForm } from '@/components/forms/debt-form'
import { useDebts, useDeleteDebt, useActiveDebtsTotal } from '@/hooks/use-debts'
import { useProfile } from '@/hooks/use-user'
import { formatCurrency } from '@/lib/calc'
import { Receipt, Plus, Trash2, Edit, AlertTriangle, TrendingDown } from 'lucide-react'
import type { Debt } from '@/types'

export default function DebtsPage() {
  const { data: debts, isLoading } = useDebts()
  const { data: profile } = useProfile()
  const deleteDebt = useDeleteDebt()
  const { monthlyTotal, remainingTotal, count } = useActiveDebtsTotal()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDebt, setEditingDebt] = useState<Debt | undefined>()

  const currency = profile?.currency || 'PEN'

  const handleEdit = (debt: Debt) => {
    setEditingDebt(debt)
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingDebt(undefined)
    setIsDialogOpen(true)
  }

  const handleSuccess = () => {
    setIsDialogOpen(false)
    setEditingDebt(undefined)
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Deudas</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Controla tus préstamos y deudas pendientes
          </p>
        </div>
        <Button onClick={handleCreate} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Nueva deuda
        </Button>
      </div>

      {/* Resumen */}
      {debts && debts.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border/70">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Cuota mensual total</CardTitle>
              <TrendingDown className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-orange-600">{formatCurrency(monthlyTotal, currency)}</div>
              <p className="text-xs text-muted-foreground mt-1">{count} deudas activas</p>
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Saldo total pendiente</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-red-600">{formatCurrency(remainingTotal, currency)}</div>
              <p className="text-xs text-muted-foreground mt-1">Por pagar en total</p>
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Meses estimados</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">
                {monthlyTotal > 0 ? Math.ceil(remainingTotal / monthlyTotal) : '—'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Para quedar libre de deudas</p>
            </CardContent>
          </Card>
        </div>
      )}

      {!debts || debts.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="Sin deudas registradas"
          description="¡Excelente! O registra tus deudas para incluirlas en el cálculo de tu sobrante"
          action={{ label: 'Registrar deuda', onClick: handleCreate }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {debts.map((debt) => {
            const progress =
              Number(debt.original_amount) > 0
                ? ((Number(debt.original_amount) - Number(debt.remaining_amount)) / Number(debt.original_amount)) * 100
                : 0

            return (
              <Card key={debt.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{debt.label}</CardTitle>
                  <Receipt className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {formatCurrency(Number(debt.monthly_payment), currency)}
                    <span className="text-xs text-muted-foreground font-normal"> /mes</span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Pagado</span>
                      <span>{progress.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Pendiente: {formatCurrency(Number(debt.remaining_amount), currency)}</span>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    {debt.creditor && <span>{debt.creditor}</span>}
                    {debt.interest_rate && (
                      <>
                        {debt.creditor && <span>•</span>}
                        <span>{Number(debt.interest_rate)}% TEA</span>
                      </>
                    )}
                    {!debt.is_active && (
                      <>
                        <span>•</span>
                        <span className="text-red-600">Inactiva</span>
                      </>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(debt)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={deleteDebt.isPending}
                      onClick={() => {
                        if (confirm('¿Eliminar esta deuda?')) deleteDebt.mutate(debt.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3 text-red-600" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDebt ? 'Editar deuda' : 'Nueva deuda'}</DialogTitle>
          </DialogHeader>
          <DebtForm debt={editingDebt} onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
