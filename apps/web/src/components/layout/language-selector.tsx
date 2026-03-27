'use client'

import { useI18n } from '@/components/providers/i18n-provider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Globe } from 'lucide-react'

export function LanguageSelector() {
  const { locale, setLocale } = useI18n()

  return (
    <Select value={locale} onValueChange={(value) => setLocale(value as 'es' | 'en')}>
      <SelectTrigger className="w-[120px] border-2 border-border/60 hover:border-border">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="es">🇪🇸 Español</SelectItem>
        <SelectItem value="en">🇬🇧 English</SelectItem>
      </SelectContent>
    </Select>
  )
}

