'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema, type ProfileInput } from '@/lib/validators'
import { createClient } from '@/lib/supabase/browser'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useProfile, useUserPlan } from '@/hooks/use-user'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { User, CreditCard } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function ProfileTab() {
  const { data: profile, isLoading } = useProfile()
  const { data: userPlan } = useUserPlan()
  const queryClient = useQueryClient()
  const { t } = useI18n()

  const form = useForm<any>({
    resolver: zodResolver(profileSchema),
    values: profile
      ? {
          full_name: (profile as any).full_name,
          currency: (profile as any).currency,
          period: (profile as any).period as 'monthly' | 'biweekly',
        }
      : undefined,
  })

  const onSubmit = async (data: ProfileInput) => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { error } = await (supabase as any)
        .from('profiles')
        .update(data)
        .eq('id', user.id)

      if (error) throw error

      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success(t.common.success)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : t.common.error
      toast.error(errorMessage)
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t.profile.personalInfo}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.auth.fullName}</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan Pérez" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.profile.currency}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t.profile.currency} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USD">🇺🇸 USD ($) - Dólar Estadounidense</SelectItem>
                        <SelectItem value="EUR">🇪🇺 EUR (€) - Euro</SelectItem>
                        <SelectItem value="MXN">🇲🇽 MXN ($) - Peso Mexicano</SelectItem>
                        <SelectItem value="ARS">🇦🇷 ARS ($) - Peso Argentino</SelectItem>
                        <SelectItem value="PEN">🇵🇪 PEN (S/) - Sol Peruano</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="period"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.profile.period}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t.profile.period} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="monthly">{t.profile.monthly}</SelectItem>
                        <SelectItem value="biweekly">{t.profile.biweekly}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">{t.common.save}</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {t.profile.currentPlan}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t.profile.plan}:</span>
              <span className="font-semibold capitalize">
                {(userPlan as any)?.plans?.name || 'Free'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t.profile.status}:</span>
              <span className="font-semibold capitalize text-green-600">
                {(userPlan as any)?.status || t.profile.active}
              </span>
            </div>
            {(userPlan as any)?.plan_code === 'free' && (
              <div className="pt-4">
                <Button variant="outline" className="w-full" disabled>
                  Actualizar a Plus (Próximamente)
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

