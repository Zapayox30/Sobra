'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  fixedExpenseSchema,
  personalExpenseSchema,
  type FixedExpenseInput,
  type PersonalExpenseInput,
} from '@/lib/validators'
import { EXPENSE_CATEGORIES, FIXED_EXPENSE_CATEGORIES } from '@/lib/constants/categories'
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
import {
  useCreateFixedExpense,
  useUpdateFixedExpense,
  useCreatePersonalExpense,
  useUpdatePersonalExpense,
} from '@/hooks/use-expenses'
import { Database } from '@/types/database.types'

type FixedExpense = Database['public']['Tables']['fixed_expenses']['Row']
type PersonalExpense = Database['public']['Tables']['personal_expenses']['Row']

interface ExpenseFormProps {
  type: 'fixed' | 'personal'
  expense?: FixedExpense | PersonalExpense
  onSuccess?: () => void
}

export function ExpenseForm({ type, expense, onSuccess }: ExpenseFormProps) {
  const createFixed = useCreateFixedExpense()
  const updateFixed = useUpdateFixedExpense()
  const createPersonal = useCreatePersonalExpense()
  const updatePersonal = useUpdatePersonalExpense()

  const isPersonal = type === 'personal'
  const schema = isPersonal ? personalExpenseSchema : fixedExpenseSchema
  
  const [showCustomCategory, setShowCustomCategory] = useState(false)

  const form = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: expense
      ? {
          category: (expense as any).category || 'otros',
          label: expense.label || '',
          amount: Number(expense.amount),
          recurrence: expense.recurrence as 'monthly' | 'one_off',
          starts_on: new Date(expense.starts_on),
          ends_on: expense.ends_on ? new Date(expense.ends_on) : undefined,
          is_active: expense.is_active,
        }
      : {
          category: 'otros',
          label: '',
          amount: 0,
          recurrence: 'monthly',
          starts_on: new Date(),
          is_active: true,
        },
  })

  const onSubmit = async (data: FixedExpenseInput | PersonalExpenseInput) => {
    if (expense) {
      if (isPersonal) {
        await updatePersonal.mutateAsync({
          id: expense.id,
          ...(data as PersonalExpenseInput),
        } as any)
      } else {
        await updateFixed.mutateAsync({
          id: expense.id,
          ...(data as FixedExpenseInput),
        } as any)
      }
    } else {
      if (isPersonal) {
        await createPersonal.mutateAsync(data as any)
      } else {
        await createFixed.mutateAsync(data as any)
      }
    }
    onSuccess?.()
  }

  const isPending =
    createFixed.isPending ||
    updateFixed.isPending ||
    createPersonal.isPending ||
    updatePersonal.isPending

  const categories = isPersonal ? EXPENSE_CATEGORIES : FIXED_EXPENSE_CATEGORIES
  const selectedCategory = form.watch('category')

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value)
                  setShowCustomCategory(value === 'custom')
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">✏️ Otra (personalizada)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {showCustomCategory && (
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de la categoría personalizada</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: Gimnasio, Streaming, etc."
                    value={field.value === 'custom' ? '' : field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Etiqueta</FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    isPersonal ? 'Ej: Salidas' : 'Ej: Alquiler, Luz, Internet'
                  }
                  {...field}
                />
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
          <Button type="submit" disabled={isPending}>
            {expense ? 'Actualizar' : 'Crear'} Gasto
          </Button>
        </div>
      </form>
    </Form>
  )
}

