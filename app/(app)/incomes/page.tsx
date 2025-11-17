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
import { DollarSign, Plus, Trash2, Edit, TrendingUp, AlertTriangle } from 'lucide-react'
import { Database } from '@/types/database.types'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

type Income = Database['public']['Tables']['incomes']['Row']

export default function IncomesPage() {
  const { data: incomes, isLoading } = useIncomes()
  const { data: profile } = useProfile()
  const { calculation, isLoading: isLoadingCalc } = useMonthlyCalculation()
  const deleteIncome = useDeleteIncome()
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ingresos</h1>
          <p className="text-muted-foreground">
            Gestiona tus fuentes de ingreso
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Ingreso
        </Button>
      </div>

      {/* Resumen de Ingresos y Balance */}
      {incomes && incomes.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {/* Card: Total de Ingresos */}
          <Card className="hover-lift border-gray-200 bg-gradient-to-br from-gray-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">
                Ingresos Mensuales Totales
              </CardTitle>
              <div className="p-2 bg-gray-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-gray-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900">
                {formatCurrency(totalIncomeActive, currency)}
              </div>
              <p className="text-xs text-gray-600 mt-2 font-medium">
                {incomes.filter(i => i.is_active).length} fuente(s) activa(s)
              </p>
            </CardContent>
          </Card>

          {/* Card: Balance Final / Alerta */}
          {calculation && (
            <Card className={`hover-lift border-2 ${
              isNegativeBalance 
                ? 'border-red-200 bg-gradient-to-br from-red-50 to-white' 
                : 'border-purple-200 bg-gradient-to-br from-purple-50 to-white'
            }`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${
                  isNegativeBalance ? 'text-red-900' : 'text-purple-900'
                }`}>
                  Balance Después de Gastos
                </CardTitle>
                <div className={`p-2 rounded-lg ${
                  isNegativeBalance ? 'bg-red-100' : 'bg-purple-100'
                }`}>
                  {isNegativeBalance ? (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  ) : (
                    <DollarSign className="h-4 w-4 text-purple-600" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-4xl font-bold ${
                  isNegativeBalance ? 'text-red-700' : 'text-purple-700'
                }`}>
                  {formatCurrency(calculation.leftoverAfterPersonal, currency)}
                </div>
                <p className={`text-xs mt-2 font-medium ${
                  isNegativeBalance ? 'text-red-600' : 'text-purple-600'
                }`}>
                  {isNegativeBalance 
                    ? '⚠️ Gastas más de lo que ganas' 
                    : '✅ Tu presupuesto está equilibrado'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Alerta si está en negativo */}
      {isNegativeBalance && calculation && (
        <Alert variant="destructive" className="border-2">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="text-lg font-bold">¡Atención! Presupuesto en Negativo</AlertTitle>
          <AlertDescription className="text-base">
            Tus gastos totales ({formatCurrency(calculation.fixedTotal + calculation.personalTotal, currency)}) 
            superan tus ingresos ({formatCurrency(totalIncomeActive, currency)}). 
            <br />
            <strong>Déficit: {formatCurrency(Math.abs(calculation.leftoverAfterPersonal), currency)}</strong>
            <br />
            <span className="text-sm mt-2 block">
              💡 Considera reducir gastos o buscar ingresos adicionales para equilibrar tu presupuesto.
            </span>
          </AlertDescription>
        </Alert>
      )}

      {!incomes || incomes.length === 0 ? (
        <EmptyState
          icon={DollarSign}
          title="No tienes ingresos registrados"
          description="Comienza agregando tu sueldo o cualquier otra fuente de ingreso"
          action={{
            label: 'Agregar Ingreso',
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
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
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
              {editingIncome ? 'Editar Ingreso' : 'Nuevo Ingreso'}
            </DialogTitle>
          </DialogHeader>
          <IncomeForm income={editingIncome} onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

