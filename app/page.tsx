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
      <div className="relative min-h-screen overflow-hidden bg-background">
        <div className="pointer-events-none absolute left-0 top-0 hidden h-96 w-96 -translate-x-1/3 -translate-y-1/2 rounded-full bg-gradient-brand opacity-20 blur-3xl md:block" />
        <div className="pointer-events-none absolute right-0 bottom-0 hidden h-[28rem] w-[32rem] translate-x-1/3 translate-y-1/3 rounded-full bg-gradient-accent opacity-10 blur-3xl md:block" />
        <main className="mx-auto flex max-w-6xl flex-col gap-16 px-4 pb-16 pt-16 sm:px-6 lg:px-10">
          <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6 text-center lg:text-left">
              <div className="flex justify-center lg:justify-start">
                <Logo size="xl" href="/" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-muted-foreground">
                Finanzas personales sin complicaciones
              </p>
              <h1 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
                Descubre cuánto dinero te <span className="text-primary">sobra</span> cada mes
              </h1>
              <p className="text-lg text-muted-foreground sm:text-xl">
                Calcula tu dinero disponible, gestiona presupuestos y compromisos en minutos. Sin tarjetas, sin
    publicidad, 100% gratis.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-start">
                <Button asChild size="lg" className="w-full rounded-2xl bg-gradient-brand px-8 py-6 text-base font-semibold sm:w-auto">
                  <Link href="/register">Comenzar gratis 🚀</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full rounded-2xl border border-white/30 px-8 py-6 text-base sm:w-auto"
                >
                  <Link href="/login">Iniciar sesión</Link>
                </Button>
              </div>
              <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground lg:justify-start">
                <Tag icon={<CheckCircle2 className="h-4 w-4 text-green-400" />}>Gratis para siempre</Tag>
                <Tag icon={<Shield className="h-4 w-4 text-purple-400" />}>Sin tarjeta requerida</Tag>
                <Tag icon={<Zap className="h-4 w-4 text-amber-400" />}>Listo en 2 minutos</Tag>
              </div>
            </div>
            <div className="space-y-4 rounded-3xl border border-white/10 bg-card/70 p-6 shadow-2xl backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Resumen</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {heroHighlights.map((item) => (
                  <Card key={item.title} className="border-white/10 bg-background/50 text-left">
                    <CardHeader className="gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
                        {item.icon}
                      </div>
                      <CardTitle className="text-sm">{item.title}</CardTitle>
                      <p className="text-2xl font-semibold text-foreground">{item.value}</p>
                      <p className="text-xs text-muted-foreground">{item.caption}</p>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-12" id="beneficios">
            <div className="space-y-4 text-center">
              <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Beneficios</p>
              <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">Todo lo que necesitas en un panel</h2>
              <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
                Centraliza ingresos, gastos fijos, presupuestos personales y compromisos en un solo lugar. Tu dinero,
                claro y disponible.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit) => (
                <Card key={benefit.title} className="border border-white/10 bg-card/70 text-left">
                  <CardHeader className="space-y-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      {benefit.icon}
                    </div>
                    <CardTitle>{benefit.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>

          <section className="space-y-10" id="para-que-sirve">
            <div className="space-y-4 text-center">
              <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">¿Para qué sirve?</p>
              <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
                SOBRA te ayuda a tomar mejores decisiones
              </h2>
              <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
                Define tu salario disponible, separa un presupuesto por categoría y cumple con tus compromisos sin
                sacrificar tus metas personales.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {useCases.map((useCase) => (
                <Card key={useCase.title} className="border border-white/10 bg-card/70 text-left">
                  <CardHeader className="space-y-3">
                    <CardTitle>{useCase.title}</CardTitle>
                    <CardDescription>{useCase.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-muted-foreground">
                      {useCase.bullet}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="space-y-10" id="como-funciona">
            <div className="space-y-4 text-center">
              <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Flujo</p>
              <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">4 pasos sencillos</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <article key={step.title} className="relative overflow-hidden rounded-2xl border border-white/10 bg-card/80 p-6 shadow-lg">
                  <span className="absolute right-5 top-4 text-6xl font-black text-muted/40">{index + 1}</span>
                  <div className="space-y-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      {step.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]" id="faq">
            <Card className="border-white/10 bg-card/70">
              <CardHeader>
                <CardTitle className="text-2xl">Preguntas frecuentes</CardTitle>
                <CardDescription>Todo lo que necesitas saber antes de comenzar.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {faqs.map((faq) => (
                  <details key={faq.question} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <summary className="cursor-pointer list-none text-base font-semibold text-foreground">
                      {faq.question}
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
                  </details>
                ))}
              </CardContent>
            </Card>
            <Card className="border border-white/10 bg-gradient-to-br from-card via-background to-accent/20 text-center shadow-2xl">
              <CardHeader className="space-y-4">
                <CardTitle className="text-3xl">Comienza hoy mismo</CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  Configura tu cuenta y descubre cuánto te sobra al instante.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button asChild size="lg" className="w-full rounded-2xl bg-gradient-brand text-base font-semibold">
                  <Link href="/register">Crear cuenta gratis</Link>
                </Button>
                <p className="text-sm text-muted-foreground">
                  También puedes{' '}
                  <Link href="/login" className="text-primary underline-offset-4 hover:underline">
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
    <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-muted-foreground">
      {icon}
      {children}
    </span>
  )
}
