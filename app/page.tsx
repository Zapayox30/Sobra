import type { Metadata } from 'next'
import LandingContent from '@/components/landing/landing-content'

export const metadata: Metadata = {
  title: 'SOBRA | Calcula lo que te sobra cada mes',
  description:
    'Gestiona tus ingresos, gastos y compromisos desde un panel intuitivo. Calcula cuánto dinero te sobra y optimiza tu presupuesto en minutos.',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'SOBRA',
  description:
    'Calculadora de finanzas personales para registrar ingresos, gastos y obtener una sugerencia diaria de gasto.',
  url: 'https://sobra.app',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'EUR',
  },
}

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LandingContent />
    </>
  )
}
