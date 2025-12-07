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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EmptyState } from '@/components/ui/empty-state'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ExpenseForm } from '@/components/forms/expense-form'
import {
  useFixedExpenses,
  usePersonalExpenses,
  useDeleteFixedExpense,
  useDeletePersonalExpense,
} from '@/hooks/use-expenses'
import { useProfile } from '@/hooks/use-user'
import { formatCurrency } from '@/lib/finance/calc'
import { TrendingDown, Plus, Trash2, Edit } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { Database } from '@/types/database.types'

type FixedExpense = Database['public']['Tables']['fixed_expenses']['Row']
type PersonalExpense = Database['public']['Tables']['personal_expenses']['Row']

export default function ExpensesPage() {
  const { data: fixedExpenses, isLoading: fixedLoading } = useFixedExpenses()
  const { data: personalExpenses, isLoading: personalLoading } =
    usePersonalExpenses()
  const { data: profile } = useProfile()
  const deleteFixed = useDeleteFixedExpense()
  const deletePersonal = useDeletePersonalExpense()
  const { t } = useI18n()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<'fixed' | 'personal'>('fixed')
  const [editingExpense, setEditingExpense] = useState<
    FixedExpense | PersonalExpense | undefined
  >()

  const currency = (profile as any)?.currency || 'USD'

  const handleEdit = (
    expense: FixedExpense | PersonalExpense,
    type: 'fixed' | 'personal'
  ) => {
    setEditingExpense(expense)
    setDialogType(type)
    setIsDialogOpen(true)
  }

  const handleCreate = (type: 'fixed' | 'personal') => {
    setEditingExpense(undefined)
    setDialogType(type)
    setIsDialogOpen(true)
  }

  const handleSuccess = () => {
    setIsDialogOpen(false)
    setEditingExpense(undefined)
  }

  if (fixedLoading || personalLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">{t.expenses.title}</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {t.expenses.subtitle}
        </p>
      </div>

      <Tabs defaultValue="fixed" className="space-y-4">
        <TabsList>
          <TabsTrigger value="fixed">Gastos Fijos</TabsTrigger>
          <TabsTrigger value="personal">Presupuestos Personales</TabsTrigger>
        </TabsList>

        <TabsContent value="fixed" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => handleCreate('fixed')}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Gasto Fijo
            </Button>
          </div>

          {!fixedExpenses || fixedExpenses.length === 0 ? (
            <EmptyState
              icon={TrendingDown}
              title="No tienes gastos fijos registrados"
              description="Agrega tus gastos recurrentes como alquiler, servicios, suscripciones, etc."
              action={{
                label: 'Agregar Gasto Fijo',
                onClick: () => handleCreate('fixed'),
              }}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {fixedExpenses.map((expense) => (
                <Card key={expense.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {expense.label}
                    </CardTitle>
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {formatCurrency(Number(expense.amount), currency)}
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="capitalize">{expense.recurrence}</span>
                      {!expense.is_active && (
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
                        onClick={() => handleEdit(expense, 'fixed')}
                        disabled={deleteFixed.isPending}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={deleteFixed.isPending}
                        onClick={() => {
                          if (
                            confirm('¿Estás seguro de eliminar este gasto?')
                          ) {
                            deleteFixed.mutate(expense.id)
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
        </TabsContent>

        <TabsContent value="personal" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => handleCreate('personal')}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Presupuesto
            </Button>
          </div>

          {!personalExpenses || personalExpenses.length === 0 ? (
            <EmptyState
              icon={TrendingDown}
              title="No tienes presupuestos personales"
              description="Define presupuestos para categorías como amigos, pareja, familia, etc."
              action={{
                label: 'Agregar Presupuesto',
                onClick: () => handleCreate('personal'),
              }}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {personalExpenses.map((expense) => (
                <Card key={expense.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {expense.label || expense.category}
                    </CardTitle>
                    <TrendingDown className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(Number(expense.amount), currency)}
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="capitalize">{expense.category}</span>
                      <span>•</span>
                      <span className="capitalize">{expense.recurrence}</span>
                      {!expense.is_active && (
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
                        onClick={() => handleEdit(expense, 'personal')}
                        disabled={deletePersonal.isPending}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={deletePersonal.isPending}
                        onClick={() => {
                          if (
                            confirm(
                              '¿Estás seguro de eliminar este presupuesto?'
                            )
                          ) {
                            deletePersonal.mutate(expense.id)
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
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingExpense
                ? dialogType === 'fixed'
                  ? 'Editar Gasto Fijo'
                  : 'Editar Presupuesto Personal'
                : dialogType === 'fixed'
                  ? 'Nuevo Gasto Fijo'
                  : 'Nuevo Presupuesto Personal'}
            </DialogTitle>
          </DialogHeader>
          <ExpenseForm
            type={dialogType}
            expense={editingExpense}
            onSuccess={handleSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
