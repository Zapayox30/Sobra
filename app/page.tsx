import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Logo } from '@/components/brand/logo'
import { DollarSign, TrendingDown, Target, Wallet } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-background to-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-brand opacity-10 rounded-full blur-3xl animate-pulse-green" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-accent opacity-10 rounded-full blur-3xl animate-pulse-green" style={{ animationDelay: '1s' }} />
        
        <div className="relative z-10">
          {/* Logo */}
          <div className="flex justify-center mb-8 animate-fade-in-up">
            <Logo size="xl" href="/" />
          </div>
          
          <p className="text-3xl text-foreground/80 mb-4 max-w-3xl mx-auto font-semibold">
            Descubre cuánto te <span className="text-gradient">sobra</span> después de tus gastos
          </p>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Gestiona tu dinero de forma simple y efectiva. Toma control de tus finanzas personales en minutos.
          </p>
          
          <div className="flex gap-4 justify-center items-center">
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
          
          <p className="text-sm text-muted-foreground mt-6">
            ✨ Gratis para siempre • Sin tarjeta de crédito • Setup en 2 minutos
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24">
        <h2 className="text-4xl font-bold text-center mb-4 text-gradient">
          ¿Cómo funciona?
        </h2>
        <p className="text-center text-muted-foreground mb-16 text-lg">
          4 simples pasos para tomar control de tus finanzas
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="hover-lift card-glow border-gray-200 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 text-9xl font-bold text-gray-100 opacity-50 group-hover:opacity-70 transition-opacity">1</div>
            <CardContent className="pt-6 relative z-10">
              <div className="rounded-xl bg-gray-100 p-4 w-fit mb-4 shadow-md">
                <DollarSign className="h-8 w-8 text-gray-800" />
              </div>
              <h3 className="font-bold mb-3 text-lg text-gray-900">Agrega tus ingresos</h3>
              <p className="text-sm text-gray-700/80">
                Registra tu sueldo y cualquier ingreso extra que tengas mensualmente
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift card-glow border-gray-200 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 text-9xl font-bold text-gray-100 opacity-50 group-hover:opacity-70 transition-opacity">2</div>
            <CardContent className="pt-6 relative z-10">
              <div className="rounded-xl bg-red-100 p-4 w-fit mb-4 shadow-md">
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="font-bold mb-3 text-lg text-gray-900">Registra tus gastos</h3>
              <p className="text-sm text-gray-700/80">
                Añade tus gastos fijos recurrentes y presupuestos personales
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift card-glow border-gray-200 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 text-9xl font-bold text-gray-100 opacity-50 group-hover:opacity-70 transition-opacity">3</div>
            <CardContent className="pt-6 relative z-10">
              <div className="rounded-xl bg-purple-100 p-4 w-fit mb-4 shadow-md">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-bold mb-3 text-lg text-gray-900">Define compromisos</h3>
              <p className="text-sm text-gray-700/80">
                Establece metas de ahorro o pagos programados por tiempo limitado
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift card-glow border-gray-200 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 text-9xl font-bold text-gray-100 opacity-50 group-hover:opacity-70 transition-opacity">4</div>
            <CardContent className="pt-6 relative z-10">
              <div className="rounded-xl bg-gray-900 p-4 w-fit mb-4 shadow-md">
                <Wallet className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold mb-3 text-lg text-gray-900">Ve cuánto te SOBRA</h3>
              <p className="text-sm text-gray-700/80">
                Descubre tu dinero disponible y recibe una sugerencia de gasto diario
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <Card className="border-2 border-gray-200 bg-gradient-to-br from-gray-50 via-background to-purple-50/30 card-glow p-8">
            <h2 className="text-4xl font-bold mb-6 text-gradient">
              Comienza a gestionar tus finanzas hoy
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Es <strong>gratis</strong>, <strong>simple</strong> y te tomará menos de <strong>2 minutos</strong> configurar tu cuenta.
              Sin trucos, sin tarjeta de crédito requerida.
            </p>
            <Button asChild size="lg" className="gradient-brand hover:opacity-90 transition-opacity shadow-lg hover-lift text-lg px-10 py-7">
              <Link href="/register">
                🎯 Crear Cuenta Gratis
              </Link>
            </Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 SOBRA. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
