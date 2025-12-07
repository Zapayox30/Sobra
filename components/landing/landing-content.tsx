'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n/context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/brand/logo'
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  DollarSign,
  Shield,
  ShieldCheck,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
  Zap,
} from 'lucide-react'

export default function LandingContent() {
  const { t } = useI18n()

  const featureCards = [
    {
      title: t.landing.free100,
      description: t.landing.free100Description,
      icon: <Shield />,
    },
    {
      title: t.landing.superFast,
      description: t.landing.superFastDescription,
      icon: <Zap />,
    },
    {
      title: t.landing.totalControl,
      description: t.landing.totalControlDescription,
      icon: <TrendingUp />,
    },
  ]

  const steps = [
    {
      title: t.landing.step1Title,
      description: t.landing.step1Description,
      icon: <DollarSign />,
    },
    {
      title: t.landing.step2Title,
      description: t.landing.step2Description,
      icon: <TrendingDown />,
    },
    {
      title: t.landing.step3Title,
      description: t.landing.step3Description,
      icon: <Target />,
    },
    {
      title: t.landing.step4Title,
      description: t.landing.step4Description,
      icon: <Wallet />,
    },
  ]

  const faqs = [
    { question: t.landing.faq1Question, answer: t.landing.faq1Answer },
    { question: t.landing.faq2Question, answer: t.landing.faq2Answer },
    { question: t.landing.faq3Question, answer: t.landing.faq3Answer },
    { question: t.landing.faq4Question, answer: t.landing.faq4Answer },
  ]

  const testimonials = [
    { quote: t.landing.testimonial1Quote, name: t.landing.testimonial1Name },
    { quote: t.landing.testimonial2Quote, name: t.landing.testimonial2Name },
  ]

  const tags = [
    { label: t.landing.free, icon: <CheckCircle2 className="h-4 w-4 text-green-400" /> },
    { label: t.landing.noCreditCard, icon: <Shield className="h-4 w-4 text-purple-400" /> },
    { label: t.landing.quickSetup, icon: <Zap className="h-4 w-4 text-amber-400" /> },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-950">
      <div className="pointer-events-none absolute left-0 top-0 hidden h-96 w-96 -translate-x-1/3 -translate-y-1/2 rounded-full bg-purple-500/10 opacity-50 blur-3xl md:block" />
      <div className="pointer-events-none absolute right-0 bottom-0 hidden h-[28rem] w-[32rem] translate-x-1/3 translate-y-1/3 rounded-full bg-blue-500/10 opacity-50 blur-3xl md:block" />

      <main className="relative mx-auto flex max-w-7xl flex-col gap-20 px-4 pb-24 pt-20 sm:px-6 lg:px-10">
        <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="space-y-8 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start">
              <Logo size="xl" href="/" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
              {t.landing.heroSubtitle}
            </p>
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              {t.landing.heroTitle}
            </h1>
            <p className="text-lg leading-relaxed text-gray-300 sm:text-xl">{t.landing.heroDescription}</p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="w-full touch-target touch-optimized bg-white px-8 py-6 text-base font-semibold text-gray-900 shadow-lg hover:bg-gray-100 sm:w-auto"
              >
                <Link href="/register">
                  {t.landing.ctaStart}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full touch-target touch-optimized rounded-lg border-2 border-gray-700 bg-transparent px-8 py-6 text-base font-medium text-gray-300 hover:bg-gray-800 sm:w-auto"
              >
                <Link href="/login">{t.landing.ctaLogin}</Link>
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
              {tags.map((tag) => (
                <Tag key={tag.label} icon={tag.icon}>
                  {tag.label}
                </Tag>
              ))}
            </div>
          </div>

          <div className="relative rounded-2xl border border-gray-800 bg-gray-900/50 p-8 shadow-xl backdrop-blur-sm">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{t.landing.howItWorks}</p>
              <p className="mt-1 text-sm text-gray-300">{t.landing.howItWorksSubtitle}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border border-gray-800 bg-gray-800/50 text-left shadow-sm">
                <CardHeader className="space-y-3 pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-900">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-sm font-medium text-gray-300">{t.dashboard.leftover}</CardTitle>
                  <p className="text-3xl font-bold text-white">$1,200</p>
                  <p className="text-xs text-gray-400">{t.landing.exampleMonthly}</p>
                </CardHeader>
              </Card>
              <Card className="border border-gray-800 bg-gray-800/50 text-left shadow-sm">
                <CardHeader className="space-y-3 pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-900">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-sm font-medium text-gray-300">{t.dashboard.dailySuggestion}</CardTitle>
                  <p className="text-3xl font-bold text-white">$40</p>
                  <p className="text-xs text-gray-400">{t.landing.exampleDaily}</p>
                </CardHeader>
              </Card>
            </div>
            <div className="mt-6 rounded-lg border border-purple-500/20 bg-purple-500/10 p-4">
              <p className="mb-1 text-xs font-semibold text-purple-300">{t.landing.howItWorks}</p>
              <p className="text-xs leading-relaxed text-gray-300">{t.landing.heroDescription}</p>
            </div>
          </div>
        </section>

        <section className="space-y-12" id="beneficios">
          <div className="space-y-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">{t.landing.whyChoose}</p>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">{t.landing.whyChooseSubtitle}</h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-300">{t.landing.heroDescription}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featureCards.map((feature) => (
              <Card
                key={feature.title}
                className="border border-gray-800 bg-gray-900/50 text-left shadow-sm transition-all hover:border-gray-700 hover:shadow-lg backdrop-blur-sm"
              >
                <CardHeader className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-gray-900">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-white">{feature.title}</CardTitle>
                  <p className="text-sm leading-relaxed text-gray-300">{feature.description}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border border-gray-800 bg-gray-900/50 text-left shadow-sm backdrop-blur-sm">
            <CardHeader className="space-y-3">
              <CardTitle className="text-2xl font-semibold text-white">{t.landing.screenshotTitle}</CardTitle>
              <CardDescription className="text-base text-gray-300">
                {t.landing.screenshotSubtitle}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-800/70 via-gray-900 to-gray-950 p-4 shadow-inner">
                <div className="mb-3 flex items-center justify-between text-xs text-gray-400">
                  <span>Dashboard</span>
                  <span>Ejemplo</span>
                </div>
                <div className="rounded-xl border border-gray-800 bg-gray-900/70 p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-gray-800 bg-gray-800/60 p-3">
                      <p className="text-xs text-gray-400">{t.dashboard.leftover}</p>
                      <p className="text-2xl font-semibold text-white">$1,200</p>
                    </div>
                    <div className="rounded-lg border border-gray-800 bg-gray-800/60 p-3">
                      <p className="text-xs text-gray-400">{t.dashboard.dailySuggestion}</p>
                      <p className="text-2xl font-semibold text-white">$40</p>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    <MiniStat label="Ingresos" value="$2,700" />
                    <MiniStat label="Gastos" value="$2,200" />
                    <MiniStat label="Sobrante" value="$500" />
                  </div>
                  <div className="mt-4 h-2 w-full rounded-full bg-gray-800">
                    <div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-800 bg-gray-900/50 shadow-sm backdrop-blur-sm">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck className="h-5 w-5" />
                <CardTitle className="text-xl font-semibold text-white">{t.landing.privacyTitle}</CardTitle>
              </div>
              <CardDescription className="text-base text-gray-300">{t.landing.privacyDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-300">• Supabase + RLS: solo tú accedes a tus datos.</p>
              <p className="text-sm text-gray-300">• Cifrado en reposo y en tránsito.</p>
              <p className="text-sm text-gray-300">• Sin anuncios ni venta de datos.</p>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-10" id="como-funciona">
          <div className="space-y-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">{t.landing.howItWorks}</p>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">{t.landing.howItWorksSubtitle}</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className="relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 p-6 shadow-sm transition-all hover:border-gray-700 hover:shadow-lg backdrop-blur-sm"
              >
                <span className="absolute right-4 top-4 text-5xl font-black text-gray-900">{index + 1}</span>
                <div className="relative space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-gray-900">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-semibold leading-tight text-white">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-300">{step.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]" id="faq">
          <Card className="border border-gray-800 bg-gray-900/50 shadow-sm backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">{t.landing.faq}</CardTitle>
              <CardDescription className="text-base text-gray-300">{t.landing.faqSubtitle}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border border-gray-800 bg-gray-800/50 p-4 transition-colors hover:bg-gray-800"
                >
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
              <CardTitle className="text-3xl font-bold">{t.landing.ctaTitle}</CardTitle>
              <CardDescription className="text-lg text-gray-300">{t.landing.ctaDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button
                asChild
                size="lg"
                className="touch-target touch-optimized w-full bg-white text-base font-semibold text-gray-900 hover:bg-gray-100"
              >
                <Link href="/register">{t.landing.ctaButton}</Link>
              </Button>
              <p className="text-sm text-gray-300">
                {t.auth.hasAccount}{' '}
                <Link href="/login" className="font-medium text-white underline-offset-4 hover:underline">
                  {t.landing.ctaLogin}
                </Link>
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-6">
          <div className="space-y-3 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
              {t.landing.testimonialTitle}
            </p>
            <p className="text-lg text-gray-300">{t.landing.testimonialSubtitle}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {testimonials.map((item) => (
              <Card key={item.name} className="border border-gray-800 bg-gray-900/50 shadow-sm backdrop-blur-sm">
                <CardContent className="space-y-3 p-5">
                  <p className="text-base text-gray-100 leading-relaxed">{item.quote}</p>
                  <p className="text-sm font-semibold text-gray-300">{item.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

function Tag({ children, icon }: { children: ReactNode; icon: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-800/50 px-4 py-1.5 text-xs font-medium text-gray-300 backdrop-blur-sm">
      {icon}
      {children}
    </span>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-3">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-lg font-semibold text-white">{value}</p>
    </div>
  )
}
