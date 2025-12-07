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
import { IncomeForm } from '@/components/forms/income-form'
import { useIncomes, useDeleteIncome } from '@/hooks/use-incomes'
import { useProfile } from '@/hooks/use-user'
import { useMonthlyCalculation } from '@/hooks/use-calculation'
import { formatCurrency } from '@/lib/finance/calc'
import { useI18n } from '@/lib/i18n/context'
import { DollarSign, Plus, Trash2, Edit, TrendingUp, AlertTriangle } from 'lucide-react'
import { Database } from '@/types/database.types'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

type Income = Database['public']['Tables']['incomes']['Row']

export default function IncomesPage() {
  const { data: incomes, isLoading } = useIncomes()
  const { data: profile } = useProfile()
  const { calculation, isLoading: isLoadingCalc } = useMonthlyCalculation()
  const deleteIncome = useDeleteIncome()
  const { t } = useI18n()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingIncome, setEditingIncome] = useState<Income | undefined>()

  const currency = (profile as any)?.currency || 'USD'

  // Calcular total de ingresos activos
  const totalIncomeActive = incomes
    ?.filter(i => i.is_active)
    .reduce((sum, income) => sum + Number(income.amount), 0) || 0

  // Verificar si está en negativo
  const isNegativeBalance = calculation && calculation.leftoverAfterPersonal < 0

  const handleEdit = (income: Income) => {
    setEditingIncome(income)
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingIncome(undefined)
    setIsDialogOpen(true)
  }

  const handleSuccess = () => {
    setIsDialogOpen(false)
    setEditingIncome(undefined)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">{t.incomes.title}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {t.incomes.manageIncome}
          </p>
        </div>
        <Button onClick={handleCreate} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          {t.incomes.newIncome}
        </Button>
      </div>

      {/* Resumen de Ingresos y Balance */}
      {incomes && incomes.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {/* Card: Total de Ingresos */}
          <Card className="border-border/70 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t.incomes.totalActive}
              </CardTitle>
              <div className="p-1.5 bg-accent/20 text-accent rounded-md">
                <TrendingUp className="h-3.5 w-3.5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-foreground">
                {formatCurrency(totalIncomeActive, currency)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {incomes.filter(i => i.is_active).length} {t.incomes.activeSources}
              </p>
            </CardContent>
          </Card>

          {/* Card: Balance Final / Alerta */}
          {calculation && (
            <Card className={`border-border/70 hover:shadow-md transition-shadow ${isNegativeBalance
                ? 'border-destructive/60'
                : 'border-border/70'
              }`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t.incomes.balance}
                </CardTitle>
                <div className={`p-1.5 rounded-md ${isNegativeBalance ? 'bg-destructive/25 text-destructive-foreground' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                  {isNegativeBalance ? (
                    <AlertTriangle className="h-3.5 w-3.5" />
                  ) : (
                    <TrendingUp className="h-3.5 w-3.5" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-semibold ${isNegativeBalance ? 'text-red-600' : 'text-foreground'
                  }`}>
                  {formatCurrency(calculation.leftoverAfterPersonal, currency)}
                </div>
                <p className={`text-xs mt-2 ${isNegativeBalance ? 'text-red-600' : 'text-muted-foreground'
                  }`}>
                  {isNegativeBalance
                    ? t.incomes.negativeBalance
                    : t.incomes.positiveBalance}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Alerta si está en negativo */}
      {isNegativeBalance && calculation && (
        <Alert variant="destructive" className="border border-destructive/60">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="text-lg font-semibold">{t.incomes.negativeAlertTitle}</AlertTitle>
          <AlertDescription className="text-sm">
            {t.incomes.negativeAlertMessage
              .replace('{totalExpenses}', formatCurrency(calculation.fixedTotal + calculation.personalTotal, currency))
              .replace('{totalIncome}', formatCurrency(totalIncomeActive, currency))
              .replace('{deficit}', formatCurrency(Math.abs(calculation.leftoverAfterPersonal), currency))}
            <br />
            <span className="text-xs mt-2 block">
              💡 {t.incomes.suggestion}
            </span>
          </AlertDescription>
        </Alert>
      )}

      {!incomes || incomes.length === 0 ? (
        <EmptyState
          icon={DollarSign}
          title={t.incomes.noIncomes}
          description={t.incomes.noIncomesDescription}
          action={{
            label: t.incomes.addIncome,
            onClick: handleCreate,
          }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {incomes.map((income) => (
            <Card key={income.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {income.label}
                </CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(Number(income.amount), currency)}
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="capitalize">{income.kind}</span>
                  <span>•</span>
                  <span className="capitalize">{income.recurrence}</span>
                  {!income.is_active && (
                    <>
                      <span>•</span>
                      <span className="text-red-600">Inactivo</span>
                    </>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(income)}
                    disabled={deleteIncome.isPending}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={deleteIncome.isPending}
                    onClick={() => {
                      if (
                        confirm('¿Estás seguro de eliminar este ingreso?')
                      ) {
                        deleteIncome.mutate(income.id)
                      }
                    }}
                  >
                    <Trash2 className="h-3 w-3 text-red-600" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingIncome ? `${t.common.edit} ${t.incomes.title}` : t.incomes.newIncome}
            </DialogTitle>
          </DialogHeader>
          <IncomeForm income={editingIncome} onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

