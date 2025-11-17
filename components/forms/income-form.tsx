'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { incomeSchema, type IncomeInput } from '@/lib/validators'
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
import { useCreateIncome, useUpdateIncome } from '@/hooks/use-incomes'
import { Database } from '@/types/database.types'

type Income = Database['public']['Tables']['incomes']['Row']

interface IncomeFormProps {
  income?: Income
  onSuccess?: () => void
}

export function IncomeForm({ income, onSuccess }: IncomeFormProps) {
  const createIncome = useCreateIncome()
  const updateIncome = useUpdateIncome()

  const form = useForm<any>({
    resolver: zodResolver(incomeSchema),
    defaultValues: income
      ? {
          label: income.label,
          amount: Number(income.amount),
          kind: income.kind as 'salary' | 'extra' | 'other',
          recurrence: income.recurrence as 'monthly' | 'one_off',
          starts_on: new Date(income.starts_on),
          ends_on: income.ends_on ? new Date(income.ends_on) : undefined,
          is_active: income.is_active,
        }
      : {
          label: '',
          amount: 0,
          kind: 'salary',
          recurrence: 'monthly',
          starts_on: new Date(),
          is_active: true,
        },
  })

  const onSubmit = async (data: IncomeInput) => {
    if (income) {
      await updateIncome.mutateAsync({ id: income.id, ...data } as any)
    } else {
      await createIncome.mutateAsync(data as any)
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
                <Input placeholder="Ej: Sueldo mensual" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monto</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="kind"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="salary">Sueldo</SelectItem>
                  <SelectItem value="extra">Extra</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recurrence"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recurrencia</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona recurrencia" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="monthly">Mensual</SelectItem>
                  <SelectItem value="one_off">Una vez</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  value={
                    field.value instanceof Date
                      ? field.value.toISOString().split('T')[0]
                      : ''
                  }
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 pt-4">
          <Button
            type="submit"
            disabled={createIncome.isPending || updateIncome.isPending}
          >
            {income ? 'Actualizar' : 'Crear'} Ingreso
          </Button>
        </div>
      </form>
    </Form>
  )
}

