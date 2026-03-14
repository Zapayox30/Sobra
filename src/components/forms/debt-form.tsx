'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { debtSchema } from '@/lib/validators'
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
import { useCreateDebt, useUpdateDebt } from '@/hooks/use-debts'
import type { Debt } from '@/types'
import { serializeDates } from '@/lib/utils'

interface DebtFormProps {
  debt?: Debt
  onSuccess?: () => void
}

export function DebtForm({ debt, onSuccess }: DebtFormProps) {
  const createDebt = useCreateDebt()
  const updateDebt = useUpdateDebt()
  const isEditing = !!debt

  const form = useForm({
    resolver: zodResolver(debtSchema),
    defaultValues: {
      label: debt?.label ?? '',
      creditor: debt?.creditor ?? '',
      original_amount: debt ? Number(debt.original_amount) : 0,
      remaining_amount: debt ? Number(debt.remaining_amount) : 0,
      monthly_payment: debt ? Number(debt.monthly_payment) : 0,
      interest_rate: debt?.interest_rate ? Number(debt.interest_rate) : undefined,
      due_day: debt?.due_day ?? undefined,
      starts_on: debt?.starts_on ? new Date(debt.starts_on) : new Date(),
      ends_on: debt?.ends_on ? new Date(debt.ends_on) : undefined,
      is_active: debt?.is_active ?? true,
    },
  })

  const onSubmit = async (data: Record<string, unknown>) => {
    const payload = serializeDates(data)
    if (isEditing) {
      await updateDebt.mutateAsync({ id: debt.id, ...payload } as Parameters<typeof updateDebt.mutateAsync>[0])
    } else {
      await createDebt.mutateAsync(payload as Parameters<typeof createDebt.mutateAsync>[0])
    }
    onSuccess?.()
  }

  const isPending = createDebt.isPending || updateDebt.isPending

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la deuda</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Préstamo personal, Crédito vehicular" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="creditor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Acreedor</FormLabel>
              <FormControl>
                <Input placeholder="Ej: BCP, Interbank, Familiar" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="original_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monto original</FormLabel>
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
            name="remaining_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Saldo pendiente</FormLabel>
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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="monthly_payment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cuota mensual</FormLabel>
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
            name="interest_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tasa de interés (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Ej: 12.5"
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="starts_on"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de inicio</FormLabel>
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
          {isPending ? 'Guardando...' : isEditing ? 'Actualizar deuda' : 'Registrar deuda'}
        </Button>
      </form>
    </Form>
  )
}
