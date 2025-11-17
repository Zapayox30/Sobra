'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useMonthlyCalculation } from '@/hooks/use-calculation'
import { useProfile } from '@/hooks/use-user'
import { formatCurrency } from '@/lib/finance/calc'
import {
  DollarSign,
  TrendingDown,
  Target,
  Wallet,
  Calendar,
} from 'lucide-react'

export default function DashboardPage() {
  const { data: profile } = useProfile()
  const { calculation, isLoading } = useMonthlyCalculation()

  if (isLoading) {
    return <LoadingSpinner />
  }

  const currency = (profile as any)?.currency || 'USD'

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Resumen de tu situación financiera actual
        </p>
      </div>

      {calculation && (
        <>
          {/* Main SOBRA Card */}
          <Card className="border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-purple-50/20 card-glow overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-accent opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <CardHeader className="relative">
              <CardTitle className="text-2xl flex items-center gap-3">
                <div className="p-2 bg-gradient-brand rounded-lg shadow-lg">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <span className="text-gradient">Lo que te SOBRA</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-2">
                    Después de gastos personales
                  </p>
                  <p
                    className={`text-6xl font-bold tracking-tight ${
                      calculation.leftoverAfterPersonal >= 0
                        ? 'text-gray-900 drop-shadow-lg'
                        : 'text-destructive'
                    }`}
                  >
                    {formatCurrency(calculation.leftoverAfterPersonal, currency)}
                  </p>
                </div>

                <div className="pt-6 border-t-2 border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium mb-1">
                        Sugerencia diaria
                      </p>
                      <p className="text-3xl font-bold text-purple-600">
                        {formatCurrency(calculation.dailySuggestion, currency)}
                        <span className="text-lg text-muted-foreground ml-2">/ día</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground font-medium mb-1">
                        Días restantes
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {calculation.remainingDays}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover-lift border-gray-200 bg-gradient-to-br from-gray-50 to-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-900">
                  Ingresos Totales
                </CardTitle>
                <div className="p-2 bg-gray-100 rounded-lg">
                  <DollarSign className="h-4 w-4 text-gray-700" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {formatCurrency(calculation.incomeTotal, currency)}
                </div>
                <p className="text-xs text-gray-600 mt-1 font-medium">
                  +100% base
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift border-red-200 bg-gradient-to-br from-red-50 to-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-900">
                  Gastos Fijos
                </CardTitle>
                <div className="p-2 bg-red-100 rounded-lg">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-700">
                  {formatCurrency(calculation.fixedTotal, currency)}
                </div>
                <p className="text-xs text-red-600 mt-1 font-medium">
                  {calculation.incomeTotal > 0 
                    ? `${((calculation.fixedTotal / calculation.incomeTotal) * 100).toFixed(0)}% del ingreso`
                    : 'Sin ingresos'}
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift border-purple-200 bg-gradient-to-br from-purple-50 to-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-900">
                  Compromisos
                </CardTitle>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Target className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-700">
                  {formatCurrency(calculation.commitmentsTotal, currency)}
                </div>
                <p className="text-xs text-purple-600 mt-1 font-medium">
                  Ahorros programados
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift border-gray-300 bg-gradient-to-br from-gray-100 to-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-900">
                  Presupuesto Personal
                </CardTitle>
                <div className="p-2 bg-gray-200 rounded-lg">
                  <Calendar className="h-4 w-4 text-gray-700" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-800">
                  {formatCurrency(calculation.personalTotal, currency)}
                </div>
                <p className="text-xs text-gray-600 mt-1 font-medium">
                  Gastos variables
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Desglose Mensual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Ingresos totales</span>
                  <span className="font-semibold text-green-600">
                    + {formatCurrency(calculation.incomeTotal, currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Gastos fijos</span>
                  <span className="font-semibold text-red-600">
                    - {formatCurrency(calculation.fixedTotal, currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Compromisos mensuales</span>
                  <span className="font-semibold text-red-600">
                    - {formatCurrency(calculation.commitmentsTotal, currency)}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="font-medium">Sobrante antes de personales</span>
                  <span className="font-bold text-lg">
                    {formatCurrency(calculation.leftoverBeforePersonal, currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Presupuesto personal</span>
                  <span className="font-semibold text-red-600">
                    - {formatCurrency(calculation.personalTotal, currency)}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="font-medium text-lg">
                    Lo que te SOBRA
                  </span>
                  <span
                    className={`font-bold text-2xl ${
                      calculation.leftoverAfterPersonal >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {formatCurrency(calculation.leftoverAfterPersonal, currency)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

