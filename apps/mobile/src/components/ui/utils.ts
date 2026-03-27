// ── Format money ──
export function formatMoney(amount: number, currency = 'S/'): string {
  const abs = Math.abs(amount)
  const formatted = abs.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return `${currency} ${formatted}`
}
