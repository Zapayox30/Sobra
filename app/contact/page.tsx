import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ContactForm } from './contact-form'

export const metadata: Metadata = {
  title: 'Contacto | SOBRA',
  description:
    'Escríbenos si necesitas ayuda con tu cuenta o tienes ideas para mejorar SOBRA. Nuestro equipo responde en menos de 24 horas.',
}

export default function ContactPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-16 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Centro de ayuda
        </p>
        <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
          ¿Necesitas ayuda con tu cuenta SOBRA?
        </h1>
        <p className="text-lg text-muted-foreground">
          Estamos disponibles todos los días para responder tus preguntas sobre
          finanzas, planes y soporte técnico. Completa el formulario o
          escríbenos directamente.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-20 md:grid-cols-2">
        <Card className="border border-white/10 bg-card/90 shadow-xl">
          <CardHeader>
            <CardTitle>Contáctanos</CardTitle>
            <CardDescription>
              Comparte tu mensaje y te responderemos en menos de 24 horas hábiles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border border-white/10 bg-card/90 shadow-xl">
            <CardHeader>
              <CardTitle>Canales directos</CardTitle>
              <CardDescription>Te respondemos en menos de 24 horas hábiles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ContactTile
                icon={<Mail className="h-5 w-5" />}
                title="Email de soporte"
                description="soporte@sobra.app"
                href="mailto:soporte@sobra.app"
              />
              <ContactTile
                icon={<Phone className="h-5 w-5" />}
                title="Agendar una llamada"
                description="Coordina una videollamada con nuestro equipo"
                href="mailto:soporte@sobra.app?subject=Agendar%20llamada%20SOBRA"
              />
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-card/90 shadow-xl">
            <CardHeader>
              <CardTitle>Respuestas rápidas</CardTitle>
              <CardDescription>Antes de escribirnos, revisa estos recursos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {resources.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group flex items-center justify-between rounded-xl border border-border/60 px-4 py-3 text-sm transition-colors hover:border-border hover:bg-muted/30"
                >
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                  <span className="text-accent transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}

const resources = [
  {
    title: 'Preguntas frecuentes',
    description: 'Soluciones a los problemas más comunes.',
    href: '/#faq',
  },
  {
    title: 'Guía de inicio',
    description: 'Aprende a registrar ingresos y gastos en minutos.',
    href: '/#como-funciona',
  },
  {
    title: 'Planes y precios',
    description: 'Compara funciones y descubre SOBRA Plus.',
    href: '/#planes',
  },
]

function ContactTile({
  icon,
  title,
  description,
  href,
}: {
  icon: ReactNode
  title: string
  description: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-2xl border border-border/60 px-4 py-3 transition-colors hover:border-border hover:bg-muted/30"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted/40 text-primary">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  )
}
