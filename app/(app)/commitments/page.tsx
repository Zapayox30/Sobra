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
import { CommitmentForm } from '@/components/forms/commitment-form'
import {
  useMonthlyCommitments,
  useDeleteMonthlyCommitment,
} from '@/hooks/use-commitments'
import { useProfile } from '@/hooks/use-user'
import { formatCurrency } from '@/lib/finance/calc'
import { Target, Plus, Trash2, Edit, Calendar } from 'lucide-react'
import { Database } from '@/types/database.types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

type MonthlyCommitment =
  Database['public']['Tables']['monthly_commitments']['Row']

export default function CommitmentsPage() {
  const { data: commitments, isLoading } = useMonthlyCommitments()
  const { data: profile } = useProfile()
  const deleteCommitment = useDeleteMonthlyCommitment()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCommitment, setEditingCommitment] = useState<
    MonthlyCommitment | undefined
  >()

  const currency = (profile as any)?.currency || 'USD'

  const handleEdit = (commitment: MonthlyCommitment) => {
    setEditingCommitment(commitment)
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingCommitment(undefined)
    setIsDialogOpen(true)
  }

  const handleSuccess = () => {
    setIsDialogOpen(false)
    setEditingCommitment(undefined)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Compromisos Mensuales</h1>
          <p className="text-muted-foreground">
            Gestiona tus compromisos financieros de duración limitada
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Compromiso
        </Button>
      </div>

      {!commitments || commitments.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No tienes compromisos mensuales"
          description="Agrega compromisos como ahorros programados o pagos por tiempo limitado"
          action={{
            label: 'Agregar Compromiso',
            onClick: handleCreate,
          }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {commitments.map((commitment) => {
            const startDate = new Date(commitment.start_month)
            const endDate = new Date(commitment.end_month)
            const totalAmount =
              Number(commitment.amount_per_month) * commitment.months_total

            return (
              <Card key={commitment.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {commitment.label}
                  </CardTitle>
                  <Target className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {formatCurrency(
                      Number(commitment.amount_per_month),
                      currency
                    )}
                    <span className="text-sm text-muted-foreground">
                      {' '}
                      / mes
                    </span>
                  </div>
                  <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {format(startDate, 'MMM yyyy', { locale: es })} -{' '}
                        {format(endDate, 'MMM yyyy', { locale: es })}
                      </span>
                    </div>
                    <div>
                      {commitment.months_total} meses • Total:{' '}
                      {formatCurrency(totalAmount, currency)}
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(commitment)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (
                          confirm(
                            '¿Estás seguro de eliminar este compromiso?'
                          )
                        ) {
                          deleteCommitment.mutate(commitment.id)
                        }
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
            <DialogTitle>
              {editingCommitment
                ? 'Editar Compromiso'
                : 'Nuevo Compromiso'}
            </DialogTitle>
          </DialogHeader>
          <CommitmentForm
            commitment={editingCommitment}
            onSuccess={handleSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

