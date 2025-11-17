// Categorías predefinidas para gastos personales
export const EXPENSE_CATEGORIES = [
  { value: 'comida', label: '🍔 Comida y Restaurantes', emoji: '🍔' },
  { value: 'transporte', label: '🚗 Transporte', emoji: '🚗' },
  { value: 'entretenimiento', label: '🎮 Entretenimiento', emoji: '🎮' },
  { value: 'salud', label: '💊 Salud y Bienestar', emoji: '💊' },
  { value: 'ropa', label: '👕 Ropa y Accesorios', emoji: '👕' },
  { value: 'educacion', label: '📚 Educación', emoji: '📚' },
  { value: 'hogar', label: '🏠 Hogar y Muebles', emoji: '🏠' },
  { value: 'mascotas', label: '🐕 Mascotas', emoji: '🐕' },
  { value: 'regalos', label: '🎁 Regalos', emoji: '🎁' },
  { value: 'viajes', label: '✈️ Viajes', emoji: '✈️' },
  { value: 'tecnologia', label: '💻 Tecnología', emoji: '💻' },
  { value: 'deportes', label: '⚽ Deportes', emoji: '⚽' },
  { value: 'otros', label: '📦 Otros', emoji: '📦' },
] as const

// Categorías predefinidas para gastos fijos
export const FIXED_EXPENSE_CATEGORIES = [
  { value: 'alquiler', label: '🏠 Alquiler/Hipoteca', emoji: '🏠' },
  { value: 'servicios', label: '💡 Servicios (Luz, Agua, Gas)', emoji: '💡' },
  { value: 'internet', label: '📡 Internet y Telefonía', emoji: '📡' },
  { value: 'suscripciones', label: '📱 Suscripciones', emoji: '📱' },
  { value: 'seguros', label: '🛡️ Seguros', emoji: '🛡️' },
  { value: 'creditos', label: '💳 Créditos/Préstamos', emoji: '💳' },
  { value: 'mantenimiento', label: '🔧 Mantenimiento', emoji: '🔧' },
  { value: 'educacion', label: '🎓 Educación', emoji: '🎓' },
  { value: 'otros', label: '📦 Otros', emoji: '📦' },
] as const

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number]['value']
export type FixedExpenseCategory = typeof FIXED_EXPENSE_CATEGORIES[number]['value']

// Helper para obtener el emoji de una categoría
export function getCategoryEmoji(category: string, isFixed = false): string {
  const categories = isFixed ? FIXED_EXPENSE_CATEGORIES : EXPENSE_CATEGORIES
  const found = categories.find(c => c.value === category)
  return found?.emoji || '📦'
}

// Helper para obtener el label de una categoría
export function getCategoryLabel(category: string, isFixed = false): string {
  const categories = isFixed ? FIXED_EXPENSE_CATEGORIES : EXPENSE_CATEGORIES
  const found = categories.find(c => c.value === category)
  return found?.label || category
}

