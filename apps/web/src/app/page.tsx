import type { Metadata } from 'next'
import LandingContent from '@/components/landing-content'

export const metadata: Metadata = {
  title: 'SOBRA | Calcula lo que te sobra cada mes — Finanzas personales Perú',
  description:
    'Gestiona tus ingresos, gastos y compromisos desde un panel intuitivo. Calcula cuánto dinero te sobra, crea tu fondo de emergencia y aprende a invertir. 100% gratis.',
  openGraph: {
    title: 'SOBRA — Calcula lo que te Sobra y toma el control de tu dinero',
    description:
      'App gratuita de finanzas personales para Perú. Dashboard inteligente, fondo de emergencia, simulador de inversiones y educación financiera.',
    url: '/',
  },
  alternates: {
    canonical: '/',
  },
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sobra.app'

const webAppJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'SOBRA',
  description:
    'Calculadora de finanzas personales para registrar ingresos, gastos, deudas y obtener una sugerencia diaria de gasto. Incluye fondo de emergencia, simulador de inversiones y educación financiera.',
  url: baseUrl,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  inLanguage: ['es', 'en'],
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'PEN',
  },
  featureList: [
    'Cálculo automático de sobra mensual',
    'Sugerencia de gasto diario',
    'Fondo de emergencia',
    'Simulador de inversiones',
    'Tarjetas de crédito y deudas',
    'Educación financiera personalizada',
    'Conexiones bancarias Open Banking',
    'Metas de ahorro',
    'Alertas inteligentes',
    'Análisis visual de finanzas',
  ],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Qué es SOBRA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SOBRA es una aplicación gratuita de finanzas personales que te permite calcular cuánto dinero te sobra cada mes después de todos tus ingresos, gastos, deudas y compromisos. Te da una sugerencia de gasto diario y herramientas para ahorrar e invertir.',
      },
    },
    {
      '@type': 'Question',
      name: '¿SOBRA es gratis?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí, SOBRA es 100% gratuita. Puedes registrar ingresos, gastos, deudas, tarjetas de crédito, crear tu fondo de emergencia y acceder al simulador de inversiones sin costo alguno.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Qué es el fondo de emergencia?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El fondo de emergencia de SOBRA te ayuda a calcular cuántos meses de gastos fijos tienes cubiertos. Te recomienda ahorrar entre 3 y 6 meses de gastos fijos para estar protegido ante imprevistos.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Puedo conectar mis bancos peruanos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SOBRA está preparada para integrarse con bancos peruanos como BCP, Interbank, BBVA, Scotiabank, BanBif y Mibanco a través de Belvo (Open Banking). Esta funcionalidad estará disponible próximamente.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cómo funciona el simulador de inversiones?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El simulador de inversiones calcula cuánto podrías acumular con interés compuesto. Puedes definir monto inicial, aporte mensual, tasa anual y plazo. Además incluye un catálogo de productos referenciales del mercado peruano.',
      },
    },
  ],
}

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <LandingContent />
    </>
  )
}
