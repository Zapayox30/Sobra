'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { useI18n } from '@/components/providers/i18n-provider'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'
import {
  ArrowRight,
  Bot,
  Calculator,
  CheckCircle2,
  CreditCard,
  DollarSign,
  GraduationCap,
  Link2,
  Shield,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
  Zap,
} from 'lucide-react'

/* ================================================================
   SOBRA — Landing Page
   ================================================================ */

export default function LandingContent() {
  const { t } = useI18n()

  return (
    <div className="relative min-h-screen bg-gray-950">
      {/* Subtle grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.012)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* ── Top Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo size="sm" href="/" />
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-sm font-medium text-gray-400 hover:bg-gray-900 hover:text-white"
            >
              <Link href="/login">{t.landing.ctaLogin}</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="rounded-lg bg-white px-4 text-sm font-semibold text-gray-900 hover:bg-gray-100"
            >
              <Link href="/register">{t.landing.ctaStart}</Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="relative mx-auto flex max-w-6xl flex-col gap-32 px-4 pb-32 pt-24 sm:px-6 lg:px-8">
        <HeroSection t={t} />
        <TrustBar t={t} />
        <PillarsSection t={t} />
        <DashboardPreviewSection t={t} />
        <HowItWorksSection t={t} />
        <PeruSection t={t} />
        <TestimonialsSection t={t} />
        <FaqSection t={t} />
        <CtaSection t={t} />
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-800/60 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <Logo size="sm" href="/" />
          <p className="text-xs text-gray-600">&copy; {new Date().getFullYear()} SOBRA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

/* ── Types ── */

type SectionProps = { t: ReturnType<typeof useI18n>['t'] }

/* ================================================================
   HERO
   ================================================================ */

function HeroSection({ t }: SectionProps) {
  return (
    <section className="flex flex-col items-center gap-8 text-center">
      <div className="space-y-5">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-gray-500">
          {t.landing.heroSubtitle}
        </p>

        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
          {t.landing.heroTitle}
        </h1>

        <p className="mx-auto max-w-xl text-base leading-relaxed text-gray-400 sm:text-lg">
          {t.landing.heroDescription}
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Button
          asChild
          size="lg"
          className="h-12 w-full rounded-lg bg-white px-8 text-sm font-semibold text-gray-900 shadow-md transition-all hover:bg-gray-100 hover:shadow-lg sm:w-auto"
        >
          <Link href="/register">
            {t.landing.ctaStart}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="ghost"
          className="h-12 w-full rounded-lg px-8 text-sm font-medium text-gray-400 hover:bg-gray-900 hover:text-white sm:w-auto"
        >
          <Link href="/login">{t.landing.ctaLogin}</Link>
        </Button>
      </div>
    </section>
  )
}

/* ================================================================
   TRUST BAR
   ================================================================ */

function TrustBar({ t }: SectionProps) {
  const items = [
    { label: t.landing.free, icon: <CheckCircle2 className="h-4 w-4" /> },
    { label: t.landing.noCreditCard, icon: <Shield className="h-4 w-4" /> },
    { label: t.landing.quickSetup, icon: <Zap className="h-4 w-4" /> },
  ]

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 border-y border-gray-800/60 py-6 sm:gap-10">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2 text-sm text-gray-500">
          <span className="text-gray-600">{item.icon}</span>
          {item.label}
        </div>
      ))}
    </div>
  )
}

/* ================================================================
   6 PILLARS
   ================================================================ */

function PillarsSection({ t }: SectionProps) {
  const pillars = [
    { title: t.landing.pillar1Title, description: t.landing.pillar1Description, icon: <Calculator className="h-5 w-5" />, color: 'text-purple-400' },
    { title: t.landing.pillar2Title, description: t.landing.pillar2Description, icon: <Shield className="h-5 w-5" />, color: 'text-emerald-400' },
    { title: t.landing.pillar3Title, description: t.landing.pillar3Description, icon: <TrendingUp className="h-5 w-5" />, color: 'text-blue-400' },
    { title: t.landing.pillar4Title, description: t.landing.pillar4Description, icon: <GraduationCap className="h-5 w-5" />, color: 'text-amber-400' },
    { title: t.landing.pillar5Title, description: t.landing.pillar5Description, icon: <Link2 className="h-5 w-5" />, color: 'text-cyan-400' },
  ]

  return (
    <section className="space-y-16" id="pilares">
      <SectionHeader
        eyebrow={t.landing.whyChoose}
        title={t.landing.pillarsTitle}
        subtitle={t.landing.pillarsSubtitle}
      />

      <div className="grid gap-px overflow-hidden rounded-xl border border-gray-800 bg-gray-800 sm:grid-cols-2 lg:grid-cols-3">
        {pillars.map((p) => (
          <div key={p.title} className="flex flex-col gap-4 bg-gray-950 p-6 transition-colors">
            <div className={p.color}>{p.icon}</div>
            <h3 className="text-base font-semibold text-white">{p.title}</h3>
            <p className="text-sm leading-relaxed text-gray-400">{p.description}</p>
          </div>
        ))}

        {/* AI Pillar — Coming Soon */}
        <div className="relative flex flex-col gap-4 bg-gradient-to-br from-gray-950 via-gray-950 to-violet-950/30 p-6">
          <div className="flex items-center gap-3">
            <span className="text-violet-400"><Bot className="h-5 w-5" /></span>
            <span className="inline-flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-300">
              <Sparkles className="h-3 w-3" />
              {t.landing.pillar6Badge}
            </span>
          </div>
          <h3 className="text-base font-semibold text-white">{t.landing.pillar6Title}</h3>
          <p className="text-sm leading-relaxed text-gray-400">{t.landing.pillar6Description}</p>
        </div>
      </div>
    </section>
  )
}

/* ================================================================
   DASHBOARD PREVIEW
   ================================================================ */

function DashboardPreviewSection({ t }: SectionProps) {
  const rows = [
    { label: t.landing.previewIncome, value: 'S/ 4,500', sign: '+', color: 'text-emerald-400' },
    { label: t.landing.previewFixed, value: 'S/ 1,200', sign: '\u2212', color: 'text-gray-300' },
    { label: t.landing.previewDebts, value: 'S/ 600', sign: '\u2212', color: 'text-gray-300' },
    { label: t.landing.previewSavings, value: 'S/ 400', sign: '\u2212', color: 'text-gray-300' },
    { label: t.landing.previewPersonal, value: 'S/ 800', sign: '\u2212', color: 'text-gray-300' },
    { label: t.landing.previewCards, value: 'S/ 350', sign: '\u2212', color: 'text-gray-300' },
  ]

  return (
    <section className="space-y-12" id="preview">
      <SectionHeader title={t.landing.previewTitle} subtitle={t.landing.previewSubtitle} />

      <div className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 border-b border-gray-800 px-5 py-3">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-gray-700" />
            <div className="h-2.5 w-2.5 rounded-full bg-gray-700" />
            <div className="h-2.5 w-2.5 rounded-full bg-gray-700" />
          </div>
          <div className="ml-3 flex-1 rounded-md bg-gray-800/80 px-3 py-1">
            <span className="text-xs text-gray-500">sobra.app/dashboard</span>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="divide-y divide-gray-800/60">
            {rows.map((row) => (
              <div key={row.label} className="flex items-center justify-between py-3">
                <span className="text-sm text-gray-400">{row.label}</span>
                <span className={`text-sm font-medium tabular-nums ${row.color}`}>
                  {row.sign} {row.value}
                </span>
              </div>
            ))}
          </div>

          <div className="my-4 border-t-2 border-dashed border-gray-700" />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-800 bg-gray-800/40 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{t.landing.previewSurplus}</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-white">S/ 1,150</p>
            </div>
            <div className="rounded-lg border border-gray-800 bg-gray-800/40 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{t.landing.previewDaily}</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-white">S/ 38.33</p>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <div className="flex justify-between text-[11px] text-gray-500">
              <span>{t.landing.previewIncome}</span>
              <span>25.6% {t.landing.previewSurplus.toLowerCase()}</span>
            </div>
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-gray-800">
              <div className="h-full bg-gray-600" style={{ width: '26.7%' }} />
              <div className="h-full bg-gray-500" style={{ width: '13.3%' }} />
              <div className="h-full bg-gray-500/70" style={{ width: '8.9%' }} />
              <div className="h-full bg-gray-400/50" style={{ width: '17.8%' }} />
              <div className="h-full bg-gray-400/30" style={{ width: '7.8%' }} />
              <div className="h-full bg-white/90" style={{ width: '25.6%' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ================================================================
   HOW IT WORKS
   ================================================================ */

function HowItWorksSection({ t }: SectionProps) {
  const steps = [
    { title: t.landing.step1Title, description: t.landing.step1Description, icon: <DollarSign className="h-5 w-5" /> },
    { title: t.landing.step2Title, description: t.landing.step2Description, icon: <TrendingDown className="h-5 w-5" /> },
    { title: t.landing.step3Title, description: t.landing.step3Description, icon: <Target className="h-5 w-5" /> },
    { title: t.landing.step4Title, description: t.landing.step4Description, icon: <Wallet className="h-5 w-5" /> },
  ]

  return (
    <section className="space-y-12" id="como-funciona">
      <SectionHeader eyebrow={t.landing.howItWorks} title={t.landing.howItWorksSubtitle} />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <div key={step.title} className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-700 text-xs font-bold text-gray-400">
                {i + 1}
              </span>
              <span className="text-gray-600">{step.icon}</span>
            </div>
            <h3 className="text-sm font-semibold text-white">{step.title}</h3>
            <p className="text-sm leading-relaxed text-gray-500">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ================================================================
   MADE FOR PERU
   ================================================================ */

function PeruSection({ t }: SectionProps) {
  const integrations = [
    { label: 'BCP' }, { label: 'Interbank' }, { label: 'BBVA' }, { label: 'Scotiabank' },
    { label: 'Yape' }, { label: 'Plin' }, { label: 'S/.' },
  ]

  return (
    <section className="space-y-12" id="peru">
      <SectionHeader title={t.landing.peruTitle} subtitle={t.landing.peruSubtitle} />

      <div className="flex flex-wrap items-center justify-center gap-4">
        {integrations.map((item) => (
          <div
            key={item.label}
            className="flex h-14 min-w-[100px] items-center justify-center rounded-lg border border-gray-800 bg-gray-900/50 px-5 text-sm font-semibold text-gray-400 transition-colors hover:border-gray-700 hover:text-gray-300"
          >
            {item.label}
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-2xl grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-800 bg-gray-900/30 p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-500">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-sm font-semibold text-white">{t.landing.privacyTitle}</span>
          </div>
          <p className="text-sm leading-relaxed text-gray-500">{t.landing.privacyDescription}</p>
        </div>
        <div className="rounded-lg border border-gray-800 bg-gray-900/30 p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-500">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-semibold text-white">{t.landing.free100}</span>
          </div>
          <p className="text-sm leading-relaxed text-gray-500">{t.landing.free100Description}</p>
        </div>
      </div>
    </section>
  )
}

/* ================================================================
   TESTIMONIALS
   ================================================================ */

function TestimonialsSection({ t }: SectionProps) {
  const testimonials = [
    { quote: t.landing.testimonial1Quote, name: t.landing.testimonial1Name },
    { quote: t.landing.testimonial2Quote, name: t.landing.testimonial2Name },
    { quote: t.landing.testimonial3Quote, name: t.landing.testimonial3Name },
  ]

  return (
    <section className="space-y-12">
      <SectionHeader eyebrow={t.landing.testimonialTitle} subtitle={t.landing.testimonialSubtitle} />

      <div className="grid gap-4 md:grid-cols-3">
        {testimonials.map((item) => (
          <blockquote key={item.name} className="rounded-lg border border-gray-800 bg-gray-900/30 p-6 space-y-4">
            <p className="text-sm leading-relaxed text-gray-300">{item.quote}</p>
            <footer className="text-xs font-medium text-gray-500">{item.name}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  )
}

/* ================================================================
   FAQ
   ================================================================ */

function FaqSection({ t }: SectionProps) {
  const faqs = [
    { question: t.landing.faq1Question, answer: t.landing.faq1Answer },
    { question: t.landing.faq2Question, answer: t.landing.faq2Answer },
    { question: t.landing.faq3Question, answer: t.landing.faq3Answer },
    { question: t.landing.faq4Question, answer: t.landing.faq4Answer },
  ]

  return (
    <section className="space-y-10" id="faq">
      <SectionHeader title={t.landing.faq} subtitle={t.landing.faqSubtitle} />

      <div className="mx-auto max-w-2xl divide-y divide-gray-800">
        {faqs.map((faq) => (
          <details key={faq.question} className="group py-5">
            <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-white hover:text-gray-300">
              {faq.question}
              <span className="ml-4 text-gray-600 transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-gray-500 pr-8">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

/* ================================================================
   CTA
   ================================================================ */

function CtaSection({ t }: SectionProps) {
  return (
    <section className="text-center">
      <div className="mx-auto max-w-lg space-y-6 rounded-xl border border-gray-800 bg-gray-900/30 p-8 sm:p-10">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">{t.landing.ctaTitle}</h2>
        <p className="text-sm text-gray-400">{t.landing.ctaDescription}</p>
        <Button
          asChild
          size="lg"
          className="h-12 w-full rounded-lg bg-white text-sm font-semibold text-gray-900 shadow-md hover:bg-gray-100"
        >
          <Link href="/register">{t.landing.ctaButton}</Link>
        </Button>
        <p className="text-xs text-gray-600">
          {t.auth.hasAccount}{' '}
          <Link href="/login" className="text-gray-400 underline underline-offset-4 hover:text-white">
            {t.landing.ctaLogin}
          </Link>
        </p>
      </div>
    </section>
  )
}

/* ================================================================
   SHARED UI
   ================================================================ */

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow?: string; title?: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-2xl space-y-3 text-center">
      {eyebrow && <p className="text-xs font-medium uppercase tracking-[0.3em] text-gray-600">{eyebrow}</p>}
      {title && <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h2>}
      {subtitle && <p className="text-sm leading-relaxed text-gray-500 sm:text-base">{subtitle}</p>}
    </div>
  )
}
