'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { walletSchema } from '@/lib/validators'
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
import { useCreateWallet, useUpdateWallet } from '@/hooks/use-wallets'
import type { Wallet } from '@/types'
import { serializeDates } from '@/lib/utils'

interface WalletFormProps {
  wallet?: Wallet
  onSuccess?: () => void
}

export function WalletForm({ wallet, onSuccess }: WalletFormProps) {
  const createWallet = useCreateWallet()
  const updateWallet = useUpdateWallet()
  const isEditing = !!wallet

  const form = useForm({
    resolver: zodResolver(walletSchema),
    defaultValues: {
      name: wallet?.name ?? '',
      wallet_type: (wallet?.wallet_type ?? 'cash') as 'yape' | 'plin' | 'cash' | 'other',
      currency: (wallet?.currency ?? 'PEN') as 'PEN' | 'USD' | 'EUR',
      current_balance: wallet ? Number(wallet.current_balance) : 0,
      icon: wallet?.icon ?? '',
      is_active: wallet?.is_active ?? true,
    },
  })

  const onSubmit = async (data: Record<string, unknown>) => {
    const payload = serializeDates(data)
    if (isEditing) {
      await updateWallet.mutateAsync({ id: wallet.id, ...payload } as Parameters<typeof updateWallet.mutateAsync>[0])
    } else {
      await createWallet.mutateAsync(payload as Parameters<typeof createWallet.mutateAsync>[0])
    }
    onSuccess?.()
  }

  const isPending = createWallet.isPending || updateWallet.isPending

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
                <Input placeholder="Ej: Yape personal, Efectivo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="wallet_type"
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
                    <SelectItem value="yape">📱 Yape</SelectItem>
                    <SelectItem value="plin">📲 Plin</SelectItem>
                    <SelectItem value="cash">💵 Efectivo</SelectItem>
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
          {isPending ? 'Guardando...' : isEditing ? 'Actualizar billetera' : 'Crear billetera'}
        </Button>
      </form>
    </Form>
  )
}
