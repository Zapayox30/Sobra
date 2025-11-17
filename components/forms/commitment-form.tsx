'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  monthlyCommitmentSchema,
  type MonthlyCommitmentInput,
} from '@/lib/validators'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  useCreateMonthlyCommitment,
  useUpdateMonthlyCommitment,
} from '@/hooks/use-commitments'
import { Database } from '@/types/database.types'

type MonthlyCommitment =
  Database['public']['Tables']['monthly_commitments']['Row']

interface CommitmentFormProps {
  commitment?: MonthlyCommitment
  onSuccess?: () => void
}

export function CommitmentForm({
  commitment,
  onSuccess,
}: CommitmentFormProps) {
  const createCommitment = useCreateMonthlyCommitment()
  const updateCommitment = useUpdateMonthlyCommitment()

  const form = useForm<any>({
    resolver: zodResolver(monthlyCommitmentSchema),
    defaultValues: commitment
      ? {
          label: commitment.label,
          amount_per_month: Number(commitment.amount_per_month),
          months_total: commitment.months_total,
          start_month: new Date(commitment.start_month),
        }
      : {
          label: '',
          amount_per_month: 0,
          months_total: 1,
          start_month: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
          ),
        },
  })

  const onSubmit = async (data: MonthlyCommitmentInput) => {
    // Ensure start_month is first day of month
    const startMonth = new Date(data.start_month)
    startMonth.setDate(1)

    const payload = {
      ...data,
      start_month: startMonth,
    }

    if (commitment) {
      await updateCommitment.mutateAsync({ id: commitment.id, ...payload } as any)
    } else {
      await createCommitment.mutateAsync(payload as any)
    }
    onSuccess?.()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Etiqueta</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Ahorrar para vacaciones" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount_per_month"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monto mensual</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Cantidad que destinarás cada mes
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="months_total"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duración (meses)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  max="120"
                  placeholder="1"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Por cuántos meses mantendrás este compromiso
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="start_month"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mes de inicio</FormLabel>
              <FormControl>
                <Input
                  type="month"
                  {...field}
                  value={
                    field.value instanceof Date
                      ? `${field.value.getFullYear()}-${String(
                          field.value.getMonth() + 1
                        ).padStart(2, '0')}`
                      : ''
                  }
                  onChange={(e) => {
                    const [year, month] = e.target.value.split('-')
                    field.onChange(new Date(parseInt(year), parseInt(month) - 1, 1))
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 pt-4">
          <Button
            type="submit"
            disabled={
              createCommitment.isPending || updateCommitment.isPending
            }
          >
            {commitment ? 'Actualizar' : 'Crear'} Compromiso
          </Button>
        </div>
      </form>
    </Form>
  )
}

