'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LanguageSelector } from '@/components/layout/language-selector'
import { useI18n } from '@/lib/i18n/context'
import { User, Globe, ExternalLink } from 'lucide-react'
import { ProfileTab } from './profile-tab'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Button } from '@/components/ui/button'

function SettingsContent() {
  const { t } = useI18n()
  const searchParams = useSearchParams()
  const router = useRouter()
  const tab = searchParams.get('tab') || 'profile'

  const handleTabChange = (value: string) => {
    router.push(`/settings?tab=${value}`)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">{t.settings.title}</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {t.settings.subtitle}
        </p>
      </div>

      <Tabs value={tab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {t.settings.profile}
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            {t.settings.preferences}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <ProfileTab />
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {t.settings.language}
              </CardTitle>
              <CardDescription>
                {t.settings.languageDescription}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t.settings.language}
                  </label>
                  <LanguageSelector />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                {t.settings.landingTitle}
              </CardTitle>
              <CardDescription>
                {t.settings.landingDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                sobra.app
              </p>
              <Button asChild size="sm" className="w-full sm:w-auto">
                <Link href="/" target="_blank" rel="noreferrer">
                  {t.settings.landingButton}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SettingsContent />
    </Suspense>
  )
}

