/**
 * useDashboardData - Hook de lógica de negocio para Dashboard
 * 
 * Separa toda la preparación de datos y cálculos del componente UI.
 */
import { useMemo } from 'react'
import { useSurplus, useSurplusHistory, useSaveSurplus } from '../../../hooks/use-surplus'
import { useProfile } from '../../../hooks/use-auth'
import { colors } from '../../../theme'

export function useDashboardData() {
  const { surplus, isLoading, cardDueTotal, overdue } = useSurplus()
  const { data: profile } = useProfile()
  const { data: history = [] } = useSurplusHistory()
  const saveSurplus = useSaveSurplus()

  // Datos procesados para gráficos
  const chartData = useMemo(() => {
    if (!surplus) return { pieData: [], barData: [] }

    const s = surplus
    const isPositive = s.netSurplus >= 0

    // Pie Chart - Distribución del ingreso
    const pieData: Array<{ value: number; color: string; text: string }> = [
      { value: s.fixedTotal, color: colors.red, text: 'Fijos' },
      { value: s.cardDueTotal + s.debtsTotal, color: colors.redDark, text: 'Deudas' },
      { value: s.savingsCommitted, color: colors.blue, text: 'Ahorro' },
      { value: s.personalTotal + s.commitmentsTotal, color: colors.textMuted, text: 'Varios' },
    ].filter(d => d.value > 0)
    
    if (s.netSurplus > 0) {
      pieData.push({ value: s.netSurplus, color: colors.emerald, text: 'Sobra' })
    } else if (pieData.length === 0) {
      pieData.push({ value: 1, color: colors.border, text: 'Vacío' })
    }

    // Bar Chart - Historial mensual
    const barData = history.slice(0, 6).reverse().map(entry => {
      const isPos = entry.net_surplus >= 0
      return {
        value: Math.abs(entry.net_surplus),
        frontColor: isPos ? colors.emerald : colors.red,
        label: new Date(`${entry.month}-02`).toLocaleString('es-PE', { month: 'short' }),
      }
    })

    return { pieData, barData }
  }, [surplus, history])

  // Estado visual
  const displayData = useMemo(() => {
    if (!surplus) return null

    const monthName = new Date().toLocaleString('es-PE', { month: 'long', year: 'numeric' })
    const isPositive = surplus.netSurplus >= 0

    return {
      monthName,
      isPositive,
      surplus,
      firstName: profile?.full_name?.split(' ')[0],
    }
  }, [surplus, profile])

  const handleSaveSurplus = () => {
    if (!surplus) return
    const month = new Date().toISOString().slice(0, 7)
    saveSurplus.mutate({ surplus, month })
  }

  return {
    isLoading,
    displayData,
    chartData,
    saveSurplus: {
      save: handleSaveSurplus,
      isPending: saveSurplus.isPending,
    },
    meta: {
      cardDueTotal,
      overdue,
    }
  }
}
