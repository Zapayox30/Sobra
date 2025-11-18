import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/brand/logo'
import { DollarSign, TrendingDown, Target, Wallet, CheckCircle2, Shield, Zap, TrendingUp, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcula lo que te Sobra | Gestión Financiera Personal Gratis',
  description:
    'Descubre cuánto te sobra mensualmente después de tus ingresos y gastos. Calculadora financiera personal gratis para tomar control de tu dinero. Sin tarjeta de crédito.',
  keywords: [
    'calculadora de finanzas personales',
    'cuánto me sobra mensual',
    'presupuesto personal gratis',
    'control de gastos',
    'gestión financiera online',
    'calculadora de ahorro',
    'presupuesto mensual español'
  ],
  openGraph: {
    title: 'SOBRA - Calcula lo que te Sobra Después de tus Gastos',
    description: 'Gestiona tus finanzas personales de forma simple. Descubre cuánto te sobra mensualmente. 100% gratis.',
    type: 'website',
  },
}

// Schema.org JSON-LD para SEO
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'SOBRA',
  description: 'Calcula cuánto te sobra mensualmente después de tus ingresos y gastos. Gestión financiera personal simple y gratis.',
  url: 'https://sobra.app',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'EUR',
  },
  featureList: [
    'Calculadora de ingresos y gastos',
    'Gestión de presupuesto mensual',
    'Seguimiento de compromisos financieros',
    'Cálculo automático de dinero disponible',
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    ratingCount: '1',
  },
}

export default function HomePage() {
  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
              <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-24 text-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-brand opacity-10 rounded-full blur-3xl animate-pulse-green" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-accent opacity-10 rounded-full blur-3xl animate-pulse-green" style={{ animationDelay: '1s' }} />
        
        <div className="relative z-10">
          {/* Logo */}
          <div className="flex justify-center mb-8 animate-fade-in-up">
            <Logo size="xl" href="/" />
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 max-w-4xl mx-auto font-bold leading-tight">
            Descubre cuánto te <span className="text-primary">sobra</span> después de tus gastos mensuales
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Calcula tu dinero disponible con nuestra calculadora de finanzas personales. Toma control de tu presupuesto en minutos.
          </p>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Gestiona tus ingresos, gastos fijos y compromisos financieros. Descubre cuánto puedes gastar diariamente sin preocupaciones.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <Button asChild size="lg" className="gradient-brand hover:opacity-90 transition-opacity shadow-lg hover-lift text-lg px-8 py-6">
              <Link href="/register">
                Comenzar Gratis 🚀
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="hover-lift border-2 border-primary text-lg px-8 py-6">
              <Link href="/login">
                Iniciar Sesión
              </Link>
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-6 justify-center items-center text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Gratis para siempre
            </span>
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-600" />
              Sin tarjeta de crédito
            </span>
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-600" />
              Setup en 2 minutos
            </span>
          </div>
        </div>
      </header>

      {/* Benefits Section */}
      <section aria-label="Beneficios de SOBRA" className="container mx-auto px-4 py-16 bg-card/40">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-primary">
            ¿Por qué elegir SOBRA?
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg max-w-2xl mx-auto">
            La herramienta más simple para gestionar tus finanzas personales
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover-lift border-border/60 bg-card/80">
              <CardHeader>
                <div className="rounded-xl bg-primary/20 text-primary p-3 w-fit mb-2">
                  <Shield className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">100% Gratis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sin costos ocultos, sin tarjeta de crédito requerida. Gestiona tus finanzas sin límites de tiempo.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift border-border/60 bg-card/80">
              <CardHeader>
                <div className="rounded-xl bg-accent/20 text-accent p-3 w-fit mb-2">
                  <Zap className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Súper Rápido</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Configura tu cuenta en menos de 2 minutos. Interfaz intuitiva para calcular tu presupuesto al instante.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift border-border/60 bg-card/80">
              <CardHeader>
                <div className="rounded-xl bg-emerald-500/20 text-emerald-300 p-3 w-fit mb-2">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Control Total</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Visualiza todos tus ingresos, gastos y compromisos en un solo lugar. Toma decisiones informadas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section aria-label="Cómo funciona SOBRA" className="container mx-auto px-4 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-primary">
          ¿Cómo funciona?
        </h2>
        <p className="text-center text-muted-foreground mb-4 text-lg">
          4 simples pasos para tomar control de tus finanzas personales
        </p>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          Descubre cómo calcular cuánto te sobra mensualmente después de tus ingresos y gastos
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <article className="hover-lift card-glow border-border/60 bg-card/80 relative overflow-hidden group">
            <div className="absolute top-0 right-0 text-9xl font-bold text-muted/40 opacity-50 group-hover:opacity-70 transition-opacity">1</div>
            <CardContent className="pt-6 relative z-10">
              <div className="rounded-xl bg-primary/20 text-primary p-4 w-fit mb-4 shadow-md">
                <DollarSign className="h-8 w-8" />
              </div>
              <h3 className="font-bold mb-3 text-lg text-foreground">Agrega tus ingresos</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Registra tu sueldo mensual y cualquier ingreso extra. Calcula el total de tus ingresos fácilmente.
              </p>
            </CardContent>
          </article>

          <article className="hover-lift card-glow border-border/60 bg-card/80 relative overflow-hidden group">
            <div className="absolute top-0 right-0 text-9xl font-bold text-muted/40 opacity-50 group-hover:opacity-70 transition-opacity">2</div>
            <CardContent className="pt-6 relative z-10">
              <div className="rounded-xl bg-destructive/25 text-destructive-foreground p-4 w-fit mb-4 shadow-md">
                <TrendingDown className="h-8 w-8" />
              </div>
              <h3 className="font-bold mb-3 text-lg text-foreground">Registra tus gastos</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Añade tus gastos fijos recurrentes (alquiler, servicios) y presupuestos personales categorizados.
              </p>
            </CardContent>
          </article>

          <article className="hover-lift card-glow border-border/60 bg-card/80 relative overflow-hidden group">
            <div className="absolute top-0 right-0 text-9xl font-bold text-muted/40 opacity-50 group-hover:opacity-70 transition-opacity">3</div>
            <CardContent className="pt-6 relative z-10">
              <div className="rounded-xl bg-accent/20 text-accent p-4 w-fit mb-4 shadow-md">
                <Target className="h-8 w-8" />
              </div>
              <h3 className="font-bold mb-3 text-lg text-foreground">Define compromisos</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Establece metas de ahorro o pagos programados con fechas específicas. Planifica tus compromisos financieros.
              </p>
            </CardContent>
          </article>

          <article className="hover-lift card-glow border-border/60 bg-card/80 relative overflow-hidden group">
            <div className="absolute top-0 right-0 text-9xl font-bold text-muted/40 opacity-50 group-hover:opacity-70 transition-opacity">4</div>
            <CardContent className="pt-6 relative z-10">
              <div className="rounded-xl bg-primary/20 text-primary p-4 w-fit mb-4 shadow-md">
                <Wallet className="h-8 w-8" />
              </div>
              <h3 className="font-bold mb-3 text-lg text-foreground">Ve cuánto te SOBRA</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Descubre tu dinero disponible mensual y recibe una sugerencia de gasto diario para mantenerte dentro del presupuesto.
              </p>
            </CardContent>
          </article>
        </div>
      </section>

      {/* FAQ Section */}
      <section aria-label="Preguntas frecuentes" className="container mx-auto px-4 py-24 bg-card/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-primary">
            Preguntas Frecuentes
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Todo lo que necesitas saber sobre SOBRA
          </p>
          
          <div className="space-y-6">
            <Card className="border-border/70 bg-card">
              <CardHeader>
                <CardTitle className="text-lg">¿Es realmente gratis?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sí, SOBRA es 100% gratuito y siempre lo será. No requerimos tarjeta de crédito ni tienes límites de tiempo para usar la aplicación.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card">
              <CardHeader>
                <CardTitle className="text-lg">¿Cómo calcula cuánto me sobra?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  SOBRA toma tus ingresos totales, resta tus gastos fijos, gastos personales y compromisos mensuales. El resultado es tu dinero disponible, que dividimos entre los días del mes para darte una sugerencia de gasto diario.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card">
              <CardHeader>
                <CardTitle className="text-lg">¿Mis datos están seguros?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Absolutamente. Usamos Supabase con encriptación de extremo a extremo. Tus datos financieros son privados y solo tú puedes acceder a ellos. No compartimos tu información con terceros.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card">
              <CardHeader>
                <CardTitle className="text-lg">¿Puedo usar SOBRA desde mi móvil?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sí, SOBRA es una aplicación web responsive que funciona perfectamente en móviles, tablets y ordenadores. Accede desde cualquier dispositivo con conexión a internet.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section aria-label="Call to action" className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <Card className="border-2 border-border/60 bg-gradient-to-br from-card via-background to-accent/30 card-glow p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
              Comienza a gestionar tus finanzas hoy
            </h2>
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
              Es <strong className="text-foreground">gratis</strong>, <strong className="text-foreground">simple</strong> y te tomará menos de <strong className="text-foreground">2 minutos</strong> configurar tu cuenta.
            </p>
            <p className="text-base text-muted-foreground mb-8">
              Sin trucos, sin tarjeta de crédito requerida. Toma control de tu dinero ahora mismo.
            </p>
            <Button asChild size="lg" className="gradient-brand hover:opacity-90 transition-opacity shadow-lg hover-lift text-lg px-10 py-7 group">
              <Link href="/register" className="flex items-center gap-2">
                🎯 Crear Cuenta Gratis
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-card/40 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4 text-foreground">SOBRA</h3>
              <p className="text-sm text-muted-foreground">
                Calcula cuánto te sobra mensualmente después de tus ingresos y gastos. Gestión financiera personal simple y gratis.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-foreground">Enlaces</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/login" className="hover:text-foreground transition-colors">
                    Iniciar Sesión
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-foreground transition-colors">
                    Registrarse
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-foreground">Sobre</h3>
              <p className="text-sm text-muted-foreground">
                SOBRA es una herramienta gratuita para gestionar tus finanzas personales. Calcula tu presupuesto y toma control de tu dinero.
              </p>
            </div>
          </div>
          <div className="border-t border-border/60 pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} SOBRA. Todos los derechos reservados.</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Calculadora de finanzas personales | Gestión de presupuesto | Control de gastos
            </p>
          </div>
        </div>
      </footer>
    </div>
    </>
  )
}
