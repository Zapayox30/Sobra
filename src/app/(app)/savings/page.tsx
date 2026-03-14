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
import { SavingsGoalForm } from '@/components/forms/savings-goal-form'
import { useSavingsGoals, useDeleteSavingsGoal } from '@/hooks/use-savings-goals'
import { useProfile } from '@/hooks/use-user'
import { formatCurrency } from '@/lib/calc'
import { PiggyBank, Plus, Trash2, Edit, Shield, TrendingUp } from 'lucide-react'
import type { SavingsGoal } from '@/types'

export default function SavingsPage() {
  const { data: goals, isLoading } = useSavingsGoals()
  const { data: profile } = useProfile()
  const deleteGoal = useDeleteSavingsGoal()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | undefined>()

  const currency = profile?.currency || 'PEN'

  const activeGoals = goals?.filter((g) => g.is_active) ?? []
  const totalSaved = activeGoals.reduce((sum, g) => sum + Number(g.current_amount), 0)
  const totalTarget = activeGoals.reduce((sum, g) => sum + Number(g.target_amount), 0)
  const totalMonthlyContribution = activeGoals.reduce((sum, g) => sum + Number(g.monthly_contribution), 0)

  const handleEdit = (goal: SavingsGoal) => {
    setEditingGoal(goal)
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingGoal(undefined)
    setIsDialogOpen(true)
  }

  const handleSuccess = () => {
    setIsDialogOpen(false)
    setEditingGoal(undefined)
  }

  if (isLoading) return <LoadingSpinner />

  const goalTypeConfig: Record<string, { icon: typeof PiggyBank; color: string; label: string }> = {
    emergency_fund: { icon: Shield, color: 'text-blue-500', label: '🛡️ Fondo de emergencia' },
    savings: { icon: PiggyBank, color: 'text-emerald-500', label: '💰 Ahorro' },
    investment: { icon: TrendingUp, color: 'text-purple-500', label: '📈 Inversión' },
    other: { icon: PiggyBank, color: 'text-muted-foreground', label: '📦 Otro' },
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Metas de Ahorro</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Define tus metas financieras y haz seguimiento de tu progreso
          </p>
        </div>
        <Button onClick={handleCreate} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Nueva meta
        </Button>
      </div>

      {/* Resumen */}
      {goals && goals.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border/70">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total ahorrado</CardTitle>
              <PiggyBank className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-emerald-600">{formatCurrency(totalSaved, currency)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                de {formatCurrency(totalTarget, currency)} objetivo
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Aporte mensual</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{formatCurrency(totalMonthlyContribution, currency)}</div>
              <p className="text-xs text-muted-foreground mt-1">Se descuenta del sobrante</p>
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Progreso global</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">
                {totalTarget > 0 ? `${((totalSaved / totalTarget) * 100).toFixed(1)}%` : '—'}
              </div>
              <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${totalTarget > 0 ? Math.min((totalSaved / totalTarget) * 100, 100) : 0}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!goals || goals.length === 0 ? (
        <EmptyState
          icon={PiggyBank}
          title="Sin metas de ahorro"
          description="Crea tu primera meta. Te recomendamos empezar con un fondo de emergencia de 3-6 meses de gastos"
          action={{ label: 'Crear meta', onClick: handleCreate }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => {
            const progress =
              Number(goal.target_amount) > 0
                ? (Number(goal.current_amount) / Number(goal.target_amount)) * 100
                : 0
            const config = goalTypeConfig[goal.goal_type ?? 'other'] ?? goalTypeConfig.other
            const GoalIcon = config.icon

            return (
              <Card key={goal.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{goal.label}</CardTitle>
                  <GoalIcon className={`h-4 w-4 ${config.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-600">
                    {formatCurrency(Number(goal.current_amount), currency)}
                    <span className="text-sm text-muted-foreground font-normal">
                      {' '}/ {formatCurrency(Number(goal.target_amount), currency)}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{config.label}</span>
                      <span>{Math.min(progress, 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>

                  {Number(goal.monthly_contribution) > 0 && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Aporte: {formatCurrency(Number(goal.monthly_contribution), currency)}/mes
                    </p>
                  )}

                  {goal.target_date && (
                    <p className="text-xs text-muted-foreground">
                      Fecha objetivo: {new Date(goal.target_date).toLocaleDateString('es-PE')}
                    </p>
                  )}

                  {!goal.is_active && (
                    <p className="text-xs text-red-600 mt-1">Inactiva</p>
                  )}

                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(goal)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={deleteGoal.isPending}
                      onClick={() => {
                        if (confirm('¿Eliminar esta meta?')) deleteGoal.mutate(goal.id)
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
            <DialogTitle>{editingGoal ? 'Editar meta' : 'Nueva meta de ahorro'}</DialogTitle>
          </DialogHeader>
          <SavingsGoalForm goal={editingGoal} onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
