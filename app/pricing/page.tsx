import type { ReactNode } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle2,
  Clock3,
  DownloadCloud,
  Shield,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export const metadata: Metadata = {
  title: 'Planes y precios | SOBRA',
  description:
    'Elige el plan de SOBRA que se adapta a tu gestión financiera: gratuito para empezar, Plus con histórico, alertas y exportaciones.',
}

const plans = [
  {
    name: 'Gratis',
    price: '0 €',
    description: 'Todo lo que necesitas para saber cuánto te sobra cada mes.',
    ctaLabel: 'Crear cuenta gratis',
    ctaHref: '/register',
    badge: 'Ideal para empezar',
    popular: false,
    features: [
      'Dashboard con sobrante y sugerencia diaria',
      'Ingresos, gastos fijos, presupuestos y compromisos',
      'Cálculo automático de pagos de tarjetas',
      'Seguridad Supabase con RLS',
      'Soporte por email en <24h',
    ],
  },
  {
    name: 'Plus (próximo)',
    price: '9 € / mes',
    description: 'Para quienes quieren mirar hacia adelante y hacia atrás.',
    ctaLabel: 'Unirme a la lista',
    ctaHref: '/contact',
    badge: 'En camino',
    popular: true,
    features: [
      'Histórico y tendencias de 24 meses',
      'Alertas: gasto proyectado, vencimientos y saldos en rojo',
      'Exportación CSV / Excel y backups mensuales',
      'Importación guiada de movimientos bancarios',
      'Soporte prioritario y roadmap privado',
    ],
  },
]

const allIncluded = [
  { label: 'Datos encriptados y acceso solo para ti', icon: Shield },
  { label: 'Modo responsive y optimizado para móvil', icon: Sparkles },
  { label: 'Cálculo de sobrante actualizado al día', icon: Clock3 },
]

const faqs = [
  {
    q: '¿Cuál es la diferencia principal entre Gratis y Plus?',
    a: 'Gratis te da todo para gestionar el mes actual. Plus añade histórico, alertas avanzadas y exportaciones para planificar mejor y auditar tus datos.',
  },
  {
    q: '¿Puedo cambiar de plan más adelante?',
    a: 'Sí. Puedes empezar gratis y pasar a Plus cuando lo necesites. Guardamos tus datos: no pierdes nada.',
  },
  {
    q: '¿Cómo funciona la suscripción de Plus?',
    a: 'Será mensual, sin permanencia. Te avisaremos antes de activar el cobro; hoy solo puedes unirte a la lista.',
  },
  {
    q: '¿Mis datos están seguros?',
    a: 'Sí. Usamos Supabase con RLS y cifrado en reposo. Solo tú accedes a tu información.',
  },
]

export default function PricingPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.12)_0,_rgba(15,17,21,0)_45%)]" />

      <section className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Planes y precios
          </p>
          <h1 className="text-4xl font-bold sm:text-5xl">
            Elige el plan que se adapta a tus metas financieras
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Empieza gratis para calcular tu sobrante y súmate a Plus para histórico, alertas y exportar tus datos sin
            complicaciones.
          </p>
          <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Sin tarjeta para empezar</span>
            <Separator orientation="vertical" className="h-4" />
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Configurable en 2 minutos</span>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative overflow-hidden border ${plan.popular ? 'border-primary/60 shadow-xl shadow-primary/10' : 'border-border/70'}`}
            >
              {plan.popular && (
                <span className="absolute right-3 top-3 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  Popular
                </span>
              )}
              <CardHeader className="space-y-3">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  {plan.name}
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    {plan.badge}
                  </span>
                </CardTitle>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold">{plan.price}</p>
                  {plan.name === 'Gratis' ? (
                    <span className="text-muted-foreground text-sm">para siempre</span>
                  ) : (
                    <span className="text-muted-foreground text-sm">sin permanencia</span>
                  )}
                </div>
                <CardDescription className="text-base">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500" />
                      <p className="text-sm">{feature}</p>
                    </div>
                  ))}
                </div>
                <Button asChild className="w-full gap-2">
                  <Link href={plan.ctaHref}>
                    {plan.ctaLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-border/70">
            <CardHeader>
              <CardTitle>Todo SOBRA incluye</CardTitle>
              <CardDescription>Beneficios que vienen con cualquier plan.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {allIncluded.map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/40 px-4 py-3"
                  >
                    <Icon className="h-5 w-5 text-primary" />
                    <p className="text-sm">{item.label}</p>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardHeader>
              <CardTitle>Próximas mejoras</CardTitle>
              <CardDescription>Transparencia de roadmap para que sepas qué viene.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RoadmapItem
                icon={<BarChart3 className="h-4 w-4" />}
                title="Tendencias históricas"
                description="Ver evolución de ingresos, gastos y sobrante mes a mes."
              />
              <RoadmapItem
                icon={<Bell className="h-4 w-4" />}
                title="Alertas inteligentes"
                description="Avisos por vencimientos, gasto proyectado y saldo negativo."
              />
              <RoadmapItem
                icon={<DownloadCloud className="h-4 w-4" />}
                title="Exportar e importar"
                description="Exporta a CSV/Excel e importa movimientos bancarios guiados."
              />
            </CardContent>
          </Card>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-border/70">
            <CardHeader>
              <CardTitle>Preguntas frecuentes</CardTitle>
              <CardDescription>Resolvemos las dudas antes de elegir.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-xl border border-border/70 bg-muted/40 p-4 transition-colors hover:bg-muted/60"
                >
                  <summary className="cursor-pointer list-none text-sm font-semibold">
                    {faq.q}
                  </summary>
                  <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
                </details>
              ))}
            </CardContent>
          </Card>

          <Card className="border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background shadow-lg">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">¿Quieres SOBRA Plus antes?</CardTitle>
              <CardDescription className="text-base">
                Déjanos tu correo y comparte tus necesidades. Priorizamos a quienes participen en la lista.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full gap-2">
                <Link href="/contact">
                  Unirme a la lista
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <p className="text-xs text-muted-foreground">
                Sin spam. Solo te escribiremos para novedades relevantes y acceso anticipado.
              </p>
            </CardContent>
          </Card>
        </section>
      </section>
    </main>
  )
}

function RoadmapItem({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/70 px-4 py-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
