import type { ReactNode } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/brand/logo'
import {
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Shield,
  Zap,
  TrendingUp,
  Wallet,
  Calendar,
  Target,
  TrendingDown,
} from 'lucide-react'

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

const heroHighlights = [
  {
    title: 'Ingresos registrados',
    value: '1 200 €',
    caption: 'Promedio mensual',
    icon: <Wallet className="h-5 w-5" />,
  },
  {
    title: 'Gasto diario sugerido',
    value: '40 €',
    caption: 'Dinero disponible hoy',
    icon: <Calendar className="h-5 w-5" />,
  },
]

const benefits = [
  {
    title: 'Control total',
    description: 'Visualiza ingresos, gastos fijos, presupuestos y compromisos en un solo panel.',
    icon: <TrendingUp />,
  },
  {
    title: 'Sin fricciones',
    description: 'Registra operaciones en segundos desde web o móvil. Nada de hojas de cálculo.',
    icon: <Zap />,
  },
  {
    title: 'Siempre gratis',
    description: 'Planea tus finanzas personales sin tarjetas de crédito ni comisiones.',
    icon: <Shield />,
  },
]

const useCases = [
  {
    title: 'Control mensual',
    description: 'Lleva un seguimiento claro de cuánto entra, cuánto sale y a qué ritmo estás gastando.',
    bullet: 'Ideal para freelancers, personas con ingresos variables y familias.',
  },
  {
    title: 'Presupuestos personales',
    description: 'Crea sobres digitales para categorías como ocio, pareja, amigos o viajes.',
    bullet: 'Define límites, compara contra lo previsto y recibe alertas visuales.',
  },
  {
    title: 'Compromisos y metas',
    description: 'Agenda pagos futuros, ahorro para vacaciones o amortización de deudas.',
    bullet: 'SOBRA te muestra cuánto dinero queda libre después de cumplir con ellos.',
  },
]

const steps = [
  {
    title: 'Agrega tus ingresos',
    description: 'Sueldo, freelance, inversiones. Todo suma al cálculo mensual.',
    icon: <DollarSign />,
  },
  {
    title: 'Registra tus gastos fijos',
    description: 'Alquiler, servicios, suscripciones y cualquier pago recurrente.',
    icon: <TrendingDown />,
  },
  {
    title: 'Define compromisos y metas',
    description: 'Ahorros programados, deudas o inversiones a corto plazo.',
    icon: <Target />,
  },
  {
    title: 'Descubre cuánto te sobra',
    description: 'Obtén tu dinero disponible y una sugerencia de gasto diario.',
    icon: <Wallet />,
  },
]

const faqs = [
  {
    question: '¿Necesito tarjeta para usar SOBRA?',
    answer: 'No. SOBRA es gratuito. Solo necesitas una dirección de correo electrónico para registrarte.',
  },
  {
    question: '¿Mis datos son privados?',
    answer:
      'Sí. Todos los datos están protegidos en Supabase con RLS (Row Level Security). Solo tú puedes ver tu información.',
  },
  {
    question: '¿Puedo exportar mis datos?',
    answer: 'Pronto podrás descargar tus registros en CSV para analizarlos donde prefieras.',
  },
]

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="relative min-h-screen overflow-hidden bg-gray-950">
        {/* Decorative gradients - tema oscuro */}
        <div className="pointer-events-none absolute left-0 top-0 hidden h-96 w-96 -translate-x-1/3 -translate-y-1/2 rounded-full bg-purple-500/10 opacity-50 blur-3xl md:block" />
        <div className="pointer-events-none absolute right-0 bottom-0 hidden h-[28rem] w-[32rem] translate-x-1/3 translate-y-1/3 rounded-full bg-blue-500/10 opacity-50 blur-3xl md:block" />

        <main className="relative mx-auto flex max-w-7xl flex-col gap-20 px-4 pb-24 pt-20 sm:px-6 lg:px-10">
          {/* Hero Section */}
          <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div className="space-y-8 text-center lg:text-left">
              <div className="flex justify-center lg:justify-start">
                <Logo size="xl" href="/" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
                Finanzas personales sin complicaciones
              </p>
              <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                Descubre cuánto dinero te <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">sobra</span> cada mes
              </h1>
              <p className="text-lg leading-relaxed text-gray-300 sm:text-xl">
                Calcula tu dinero disponible, gestiona presupuestos y compromisos en minutos. Sin tarjetas, sin
                publicidad, 100% gratis.
              </p>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Button asChild size="lg" className="w-full touch-target touch-optimized bg-white px-8 py-6 text-base font-semibold text-gray-900 shadow-lg hover:bg-gray-100 sm:w-auto">
                  <Link href="/register">Comenzar gratis 🚀</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full touch-target touch-optimized rounded-lg border-2 border-gray-700 bg-transparent px-8 py-6 text-base font-medium text-gray-300 hover:bg-gray-800 sm:w-auto"
                >
                  <Link href="/login">Iniciar sesión</Link>
                </Button>
              </div>
              <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                <Tag icon={<CheckCircle2 className="h-4 w-4 text-green-400" />}>Gratis para siempre</Tag>
                <Tag icon={<Shield className="h-4 w-4 text-purple-400" />}>Sin tarjeta requerida</Tag>
                <Tag icon={<Zap className="h-4 w-4 text-amber-400" />}>Listo en 2 minutos</Tag>
              </div>
            </div>

            {/* Ejemplo visual mejorado - tema oscuro */}
            <div className="relative rounded-2xl border border-gray-800 bg-gray-900/50 p-8 shadow-xl backdrop-blur-sm">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Ejemplo</p>
                <p className="mt-1 text-sm text-gray-300">Situación hipotética mensual</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {heroHighlights.map((item) => (
                  <Card key={item.title} className="border border-gray-800 bg-gray-800/50 text-left shadow-sm">
                    <CardHeader className="space-y-3 pb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-900">
                        {item.icon}
                      </div>
                      <CardTitle className="text-sm font-medium text-gray-300">{item.title}</CardTitle>
                      <p className="text-3xl font-bold text-white">{item.value}</p>
                      <p className="text-xs text-gray-400">{item.caption}</p>
                    </CardHeader>
                  </Card>
                ))}
              </div>
              <div className="mt-6 rounded-lg bg-purple-500/10 p-4 border border-purple-500/20">
                <p className="text-xs font-semibold text-purple-300 mb-1">💡 Cómo funciona</p>
                <p className="text-xs leading-relaxed text-gray-300">
                  SOBRA calcula automáticamente tu dinero disponible restando gastos fijos y compromisos de tus ingresos, y te sugiere cuánto puedes gastar cada día.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-12" id="beneficios">
            <div className="space-y-4 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">Beneficios</p>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Todo lo que necesitas en un panel</h2>
              <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-300">
                Centraliza ingresos, gastos fijos, presupuestos personales y compromisos en un solo lugar. Tu dinero,
                claro y disponible.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit) => (
                <Card key={benefit.title} className="border border-gray-800 bg-gray-900/50 text-left shadow-sm hover:shadow-lg hover:border-gray-700 transition-all backdrop-blur-sm">
                  <CardHeader className="space-y-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-gray-900">
                      {benefit.icon}
                    </div>
                    <CardTitle className="text-xl font-semibold text-white">{benefit.title}</CardTitle>
                    <p className="text-sm leading-relaxed text-gray-300">{benefit.description}</p>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>

          <section className="space-y-10" id="para-que-sirve">
            <div className="space-y-4 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">¿Para qué sirve?</p>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                SOBRA te ayuda a tomar mejores decisiones
              </h2>
              <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-300">
                Define tu salario disponible, separa un presupuesto por categoría y cumple con tus compromisos sin
                sacrificar tus metas personales.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {useCases.map((useCase) => (
                <Card key={useCase.title} className="border border-gray-800 bg-gray-900/50 text-left shadow-sm hover:shadow-lg hover:border-gray-700 transition-all backdrop-blur-sm">
                  <CardHeader className="space-y-3">
                    <CardTitle className="text-xl font-semibold text-white">{useCase.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed text-gray-300">{useCase.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="rounded-xl border border-gray-800 bg-gray-800/50 px-4 py-3 text-sm leading-relaxed text-gray-300">
                      {useCase.bullet}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="space-y-10" id="como-funciona">
            <div className="space-y-4 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">Flujo</p>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">4 pasos sencillos</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <article key={step.title} className="relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 p-6 shadow-sm hover:shadow-lg hover:border-gray-700 transition-all backdrop-blur-sm">
                  <span className="absolute right-4 top-4 text-5xl font-black text-gray-900">{index + 1}</span>
                  <div className="relative space-y-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-gray-900">
                      {step.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white leading-tight">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-300">{step.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]" id="faq">
            <Card className="border border-gray-800 bg-gray-900/50 shadow-sm backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">Preguntas frecuentes</CardTitle>
                <CardDescription className="text-base text-gray-300">Todo lo que necesitas saber antes de comenzar.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqs.map((faq) => (
                  <details key={faq.question} className="group rounded-xl border border-gray-800 bg-gray-800/50 p-4 transition-colors hover:bg-gray-800">
                    <summary className="cursor-pointer list-none text-base font-semibold text-white hover:text-gray-200">
                      {faq.question}
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-gray-300">{faq.answer}</p>
                  </details>
                ))}
              </CardContent>
            </Card>
            <Card className="border border-gray-800 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-center text-white shadow-xl backdrop-blur-sm">
              <CardHeader className="space-y-4">
                <CardTitle className="text-3xl font-bold">Comienza hoy mismo</CardTitle>
                <CardDescription className="text-lg text-gray-300">
                  Configura tu cuenta y descubre cuánto te sobra al instante.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button asChild size="lg" className="touch-target touch-optimized w-full bg-white text-base font-semibold text-gray-900 hover:bg-gray-100">
                  <Link href="/register">Crear cuenta gratis</Link>
                </Button>
                <p className="text-sm text-gray-300">
                  También puedes{' '}
                  <Link href="/login" className="font-medium text-white underline-offset-4 hover:underline">
                    iniciar sesión
                  </Link>{' '}
                  si ya tienes una cuenta.
                </p>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </>
  )
}

function Tag({ children, icon }: { children: ReactNode; icon: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-gray-800/50 px-4 py-1.5 text-xs font-medium text-gray-300 border border-gray-700 backdrop-blur-sm">
      {icon}
      {children}
    </span>
  )
}

