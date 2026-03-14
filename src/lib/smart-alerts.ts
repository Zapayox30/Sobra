/**
 * Smart Alert Generator
 *
 * Analyzes the surplus result and generates contextual financial alerts.
 * Called from the dashboard to create alerts when conditions are met.
 */
import type { SurplusOutput } from '@/lib/sobra-engine'
import type { Debt, SavingsGoal } from '@/types'

export interface AlertCandidate {
    title: string
    message: string
    alert_type: string
    severity: 'info' | 'warning' | 'critical'
}

/**
 * Generate alert candidates based on the current financial state.
 * These are evaluated client-side; the caller decides which to persist.
 */
export function generateSmartAlerts(params: {
    surplus: SurplusOutput
    debts: Debt[]
    savingsGoals: SavingsGoal[]
    cardDueTotal: number
    nextDueDate?: string | null
    overdue?: boolean
}): AlertCandidate[] {
    const { surplus, debts, savingsGoals, cardDueTotal, nextDueDate, overdue } = params
    const alerts: AlertCandidate[] = []

    // 1. Negative surplus — CRITICAL
    if (surplus.netSurplus < 0) {
        alerts.push({
            title: '⚠️ Sobra negativa',
            message: `Tu sobra neta este mes es ${surplus.netSurplus.toFixed(2)}. Estás gastando más de lo que ganas. Revisa tus gastos fijos y personales.`,
            alert_type: 'surplus_low',
            severity: 'critical',
        })
    }
    // 2. Very low surplus — WARNING (less than 10% of income)
    else if (surplus.incomeTotal > 0 && surplus.netSurplus < surplus.incomeTotal * 0.1) {
        alerts.push({
            title: '📉 Sobra muy ajustada',
            message: `Tu sobra neta es solo ${((surplus.netSurplus / surplus.incomeTotal) * 100).toFixed(1)}% de tus ingresos. Considera reducir gastos variables.`,
            alert_type: 'surplus_low',
            severity: 'warning',
        })
    }

    // 3. High debt ratio — WARNING (debts > 40% of income)
    if (surplus.incomeTotal > 0) {
        const debtRatio = (surplus.debtsTotal + cardDueTotal) / surplus.incomeTotal
        if (debtRatio > 0.5) {
            alerts.push({
                title: '🔴 Endeudamiento alto',
                message: `Tus deudas y pagos de tarjeta representan ${(debtRatio * 100).toFixed(0)}% de tus ingresos. Lo recomendado es máximo 30%.`,
                alert_type: 'debt_high',
                severity: 'critical',
            })
        } else if (debtRatio > 0.3) {
            alerts.push({
                title: '⚡ Nivel de deuda moderado',
                message: `Tus deudas consumen ${(debtRatio * 100).toFixed(0)}% de tus ingresos. Intenta mantenerlo por debajo del 30%.`,
                alert_type: 'debt_high',
                severity: 'warning',
            })
        }
    }

    // 4. Card payment overdue — CRITICAL
    if (overdue && cardDueTotal > 0) {
        alerts.push({
            title: '🚨 Pago de tarjeta vencido',
            message: `Tienes un pago de tarjeta vencido. Pagar lo antes posible para evitar intereses y afectar tu historial crediticio.`,
            alert_type: 'payment_due',
            severity: 'critical',
        })
    }
    // 5. Card payment due soon
    else if (nextDueDate) {
        const daysToDue = Math.ceil(
            (new Date(nextDueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        )
        if (daysToDue >= 0 && daysToDue <= 5) {
            alerts.push({
                title: '📅 Pago de tarjeta pronto',
                message: `Tu pago de tarjeta vence en ${daysToDue} día(s). No olvides pagarlo a tiempo.`,
                alert_type: 'payment_due',
                severity: 'warning',
            })
        }
    }

    // 6. Savings goal reached — INFO
    for (const goal of savingsGoals) {
        if (
            goal.is_active &&
            Number(goal.current_amount) >= Number(goal.target_amount) &&
            Number(goal.target_amount) > 0
        ) {
            alerts.push({
                title: '🎉 ¡Meta alcanzada!',
                message: `¡Felicidades! Alcanzaste tu meta "${goal.label}". Considera definir una nueva meta financiera.`,
                alert_type: 'goal_reached',
                severity: 'info',
            })
        }
    }

    // 7. No emergency fund — WARNING
    const hasEmergencyFund = savingsGoals.some(
        (g) => g.goal_type === 'emergency_fund' && g.is_active
    )
    if (!hasEmergencyFund && surplus.incomeTotal > 0) {
        alerts.push({
            title: '🛡️ Sin fondo de emergencia',
            message: 'Aún no tienes un fondo de emergencia. Te recomendamos crear uno equivalente a 3-6 meses de gastos fijos.',
            alert_type: 'custom',
            severity: 'warning',
        })
    }

    // 8. Active debts approaching end
    for (const debt of debts) {
        if (debt.is_active && debt.ends_on) {
            const daysToEnd = Math.ceil(
                (new Date(debt.ends_on).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            )
            if (daysToEnd > 0 && daysToEnd <= 30) {
                alerts.push({
                    title: `📋 Deuda por terminar`,
                    message: `Tu deuda "${debt.label}" termina en ${daysToEnd} día(s). ¡Ya casi te liberas!`,
                    alert_type: 'custom',
                    severity: 'info',
                })
            }
        }
    }

    return alerts
}
