// Categorías predefinidas para gastos personales
export const EXPENSE_CATEGORIES = [
  { value: 'comida', label: '🍔 Comida y Restaurantes', emoji: '🍔', color: '#fbbf24' },
  { value: 'transporte', label: '🚗 Transporte', emoji: '🚗', color: '#60a5fa' },
  { value: 'entretenimiento', label: '🎮 Entretenimiento', emoji: '🎮', color: '#a78bfa' },
  { value: 'salud', label: '💊 Salud y Bienestar', emoji: '💊', color: '#22d3ee' },
  { value: 'ropa', label: '👕 Ropa y Accesorios', emoji: '👕', color: '#f472b6' },
  { value: 'educacion', label: '📚 Educación', emoji: '📚', color: '#34d399' },
  { value: 'hogar', label: '🏠 Hogar y Muebles', emoji: '🏠', color: '#fb923c' },
  { value: 'mascotas', label: '🐕 Mascotas', emoji: '🐕', color: '#fbbf24' },
  { value: 'regalos', label: '🎁 Regalos', emoji: '🎁', color: '#f87171' },
  { value: 'viajes', label: '✈️ Viajes', emoji: '✈️', color: '#60a5fa' },
  { value: 'tecnologia', label: '💻 Tecnología', emoji: '💻', color: '#8b5cf6' },
  { value: 'deportes', label: '⚽ Deportes', emoji: '⚽', color: '#34d399' },
  { value: 'otros', label: '📦 Otros', emoji: '📦', color: '#6b7280' },
] as const

/**
 * Categorías Quick Add (subconjunto optimizado para mobile)
 * Top 6 categorías más usadas en Perú
 */
export const QUICK_ADD_CATEGORIES = [
  { value: 'comida', label: 'Comida', emoji: '🍔', color: '#fbbf24' },
  { value: 'transporte', label: 'Transporte', emoji: '🚕', color: '#60a5fa' },
  { value: 'supermercado', label: 'Supermercado', emoji: '🛒', color: '#34d399' },
  { value: 'entretenimiento', label: 'Ocio', emoji: '☕', color: '#a78bfa' },
  { value: 'salud', label: 'Salud', emoji: '💊', color: '#22d3ee' },
  { value: 'otros', label: 'Otros', emoji: '📦', color: '#6b7280' },
] as const

// Categorías predefinidas para gastos fijos
export const FIXED_EXPENSE_CATEGORIES = [
  { value: 'alquiler', label: '🏠 Alquiler/Hipoteca', emoji: '🏠', color: '#fb923c' },
  { value: 'servicios', label: '💡 Servicios (Luz, Agua, Gas)', emoji: '💡', color: '#fbbf24' },
  { value: 'internet', label: '📡 Internet y Telefonía', emoji: '📡', color: '#60a5fa' },
  { value: 'telefono', label: '📱 Teléfono', emoji: '📱', color: '#22d3ee' },
  { value: 'suscripciones', label: '📺 Suscripciones', emoji: '📺', color: '#a78bfa' },
  { value: 'seguros', label: '🛡️ Seguros', emoji: '🛡️', color: '#34d399' },
  { value: 'transporte', label: '🚗 Transporte Fijo', emoji: '🚗', color: '#60a5fa' },
  { value: 'educacion', label: '🎓 Educación', emoji: '🎓', color: '#34d399' },
  { value: 'salud', label: '💊 Salud', emoji: '💊', color: '#22d3ee' },
  { value: 'otros', label: '📦 Otros', emoji: '📦', color: '#6b7280' },
] as const

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number]['value']
export type FixedExpenseCategory = typeof FIXED_EXPENSE_CATEGORIES[number]['value']
export type QuickAddCategory = typeof QUICK_ADD_CATEGORIES[number]['value']

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

// Helper para obtener el color de una categoría
export function getCategoryColor(category: string, isFixed = false): string {
  const categories = isFixed ? FIXED_EXPENSE_CATEGORIES : EXPENSE_CATEGORIES
  const found = categories.find(c => c.value === category)
  return found?.color || '#6b7280'
}

// Helper para obtener toda la info de una categoría
export function getCategoryInfo(category: string, isFixed = false) {
  const categories = isFixed ? FIXED_EXPENSE_CATEGORIES : EXPENSE_CATEGORIES
  return categories.find(c => c.value === category) || {
    value: category,
    label: category,
    emoji: '📦',
    color: '#6b7280'
  }
}

