'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { savingsGoalSchema } from '@/lib/validators'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCreateSavingsGoal, useUpdateSavingsGoal } from '@/hooks/use-savings-goals'
import type { SavingsGoal } from '@/types'
import { serializeDates } from '@/lib/utils'

interface SavingsGoalFormProps {
  goal?: SavingsGoal
  onSuccess?: () => void
}

export function SavingsGoalForm({ goal, onSuccess }: SavingsGoalFormProps) {
  const createGoal = useCreateSavingsGoal()
  const updateGoal = useUpdateSavingsGoal()
  const isEditing = !!goal

  const form = useForm({
    resolver: zodResolver(savingsGoalSchema),
    defaultValues: {
      label: goal?.label ?? '',
      goal_type: (goal?.goal_type ?? 'savings') as 'emergency_fund' | 'savings' | 'investment' | 'other',
      target_amount: goal ? Number(goal.target_amount) : 0,
      current_amount: goal ? Number(goal.current_amount) : 0,
      monthly_contribution: goal ? Number(goal.monthly_contribution) : 0,
      target_date: goal?.target_date ? new Date(goal.target_date) : undefined,
      is_active: goal?.is_active ?? true,
    },
  })

  const onSubmit = async (data: Record<string, unknown>) => {
    const payload = serializeDates(data)
    if (isEditing) {
      await updateGoal.mutateAsync({ id: goal.id, ...payload } as Parameters<typeof updateGoal.mutateAsync>[0])
    } else {
      await createGoal.mutateAsync(payload as Parameters<typeof createGoal.mutateAsync>[0])
    }
    onSuccess?.()
  }

  const isPending = createGoal.isPending || updateGoal.isPending

  // Calculate progress percentage
  const targetAmount = form.watch('target_amount')
  const currentAmount = form.watch('current_amount')
  const progress = targetAmount && targetAmount > 0 ? Math.min(((currentAmount ?? 0) / targetAmount) * 100, 100) : 0

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la meta</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Fondo de emergencia, Viaje a Europa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="goal_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de meta</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="emergency_fund">🛡️ Fondo de emergencia</SelectItem>
                  <SelectItem value="savings">💰 Ahorro</SelectItem>
                  <SelectItem value="investment">📈 Inversión</SelectItem>
                  <SelectItem value="other">📦 Otro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="target_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta total</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="current_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ahorrado hasta hoy</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Progress bar */}
        {targetAmount > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progreso</span>
              <span>{progress.toFixed(1)}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="monthly_contribution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aporte mensual</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="target_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha objetivo (opcional)</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                  onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Guardando...' : isEditing ? 'Actualizar meta' : 'Crear meta'}
        </Button>
      </form>
    </Form>
  )
}
