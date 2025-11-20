import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/lib/providers/query-provider'
import { I18nProvider } from '@/lib/i18n/context'
import { Toaster } from '@/components/ui/sonner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sobra.app'),
  title: {
    default: 'SOBRA - Gestiona tus Finanzas Personales | Calcula lo que te Sobra',
    template: '%s | SOBRA'
  },
  description:
    'Calcula cuánto te sobra después de tus ingresos y gastos mensuales. Gestión financiera personal simple, gratis y sin tarjeta de crédito. Toma control de tu dinero en minutos.',
  keywords: [
    'finanzas personales',
    'gestión financiera',
    'presupuesto personal',
    'calculadora de gastos',
    'ahorro personal',
    'control financiero',
    'ingresos y gastos',
    'presupuesto mensual',
    'finanzas en español',
    'gestión de dinero',
    'SOBRA',
    'calculadora financiera'
  ],
  authors: [{ name: 'SOBRA' }],
  creator: 'SOBRA',
  publisher: 'SOBRA',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: '/',
    siteName: 'SOBRA',
    title: 'SOBRA - Calcula lo que te Sobra Después de tus Gastos',
    description:
      'Gestiona tus finanzas personales de forma simple y efectiva. Descubre cuánto te sobra mensualmente después de tus ingresos y gastos. 100% gratis.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SOBRA - Gestión Financiera Personal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SOBRA - Calcula lo que te Sobra',
    description:
      'Gestiona tus finanzas personales de forma simple. Descubre cuánto te sobra mensualmente. 100% gratis.',
    images: ['/og-image.png'],
    creator: '@sobra_app',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Agregar códigos de verificación cuando los tengas
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  alternates: {
    canonical: '/',
  },
}

// Schema.org JSON-LD para Organization
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SOBRA',
  description: 'Calcula cuánto te sobra mensualmente después de tus ingresos y gastos. Gestión financiera personal simple y gratis.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://sobra.app',
  logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sobra.app'}/logo.png`,
  sameAs: [
    // Agregar redes sociales cuando las tengas
    // 'https://twitter.com/sobra_app',
    // 'https://github.com/sobra-app',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: ['Spanish', 'Spanish'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        {/* Mobile Viewport Optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        
        {/* Theme Color for Mobile Browsers */}
        <meta name="theme-color" content="#0f1115" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#fafaf9" media="(prefers-color-scheme: light)" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SOBRA" />
        
        {/* Organization Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <I18nProvider>
            {children}
            <Toaster />
          </I18nProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
