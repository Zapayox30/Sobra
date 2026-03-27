'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { accountSchema } from '@/lib/validators'
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
import { useCreateAccount, useUpdateAccount } from '@/hooks/use-accounts'
import type { Account } from '@/types'
import { serializeDates } from '@/lib/utils'

interface AccountFormProps {
  account?: Account
  onSuccess?: () => void
}

export function AccountForm({ account, onSuccess }: AccountFormProps) {
  const createAccount = useCreateAccount()
  const updateAccount = useUpdateAccount()
  const isEditing = !!account

  const form = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: account?.name ?? '',
      institution: account?.institution ?? '',
      account_type: (account?.account_type ?? 'bank') as 'bank' | 'savings' | 'investment' | 'other',
      currency: (account?.currency ?? 'PEN') as 'PEN' | 'USD' | 'EUR',
      current_balance: account ? Number(account.current_balance) : 0,
      is_active: account?.is_active ?? true,
    },
  })

  const onSubmit = async (data: Record<string, unknown>) => {
    const payload = serializeDates(data)
    if (isEditing) {
      await updateAccount.mutateAsync({ id: account.id, ...payload } as Parameters<typeof updateAccount.mutateAsync>[0])
    } else {
      await createAccount.mutateAsync(payload as Parameters<typeof createAccount.mutateAsync>[0])
    }
    onSuccess?.()
  }

  const isPending = createAccount.isPending || updateAccount.isPending

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Cuenta BCP, Ahorro Interbank" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="institution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Institución</FormLabel>
              <FormControl>
                <Input placeholder="Ej: BCP, Interbank, BBVA" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="account_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="bank">🏦 Banco</SelectItem>
                    <SelectItem value="savings">💰 Ahorro</SelectItem>
                    <SelectItem value="investment">📈 Inversión</SelectItem>
                    <SelectItem value="other">📦 Otro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Moneda</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PEN">🇵🇪 PEN</SelectItem>
                    <SelectItem value="USD">🇺🇸 USD</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="current_balance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Saldo actual</FormLabel>
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

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Guardando...' : isEditing ? 'Actualizar cuenta' : 'Crear cuenta'}
        </Button>
      </form>
    </Form>
  )
}
