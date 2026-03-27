/**
 * SOBRA — i18n for mobile
 * Spanish & English. Spanish default (Peru market).
 */

import { createContext, useContext } from 'react'

export type Locale = 'es' | 'en'

export const translations = {
  es: {
    // Tabs
    dashboard: 'Inicio',
    incomes: 'Ingresos',
    expenses: 'Gastos',
    cards: 'Tarjetas',
    profile: 'Perfil',

    // Dashboard
    greeting: 'Hola',
    monthSummary: 'Resumen del mes',
    netSurplus: 'Sobra neta',
    grossSurplus: 'Sobra bruta',
    dailySuggestion: 'Gasto diario sugerido',
    consolidatedBalance: 'Balance consolidado',
    remainingDays: 'Días restantes',
    classification: 'Clasificación',
    safe: 'Invertible',
    operative: 'Operativo',
    unavailable: 'Reserva',
    breakdown: 'Desglose',
    income: 'Ingresos',
    fixedExpenses: 'Gastos fijos',
    debts: 'Deudas',
    savings: 'Ahorro',
    personal: 'Personal',
    commitments: 'Compromisos',
    creditCards: 'Tarjetas',
    saveSurplus: 'Guardar sobra',
    surplusSaved: 'Sobra guardada en historial',

    // CRUD
    add: 'Agregar',
    edit: 'Editar',
    delete: 'Eliminar',
    save: 'Guardar',
    cancel: 'Cancelar',
    name: 'Nombre',
    amount: 'Monto',
    category: 'Categoría',
    active: 'Activo',
    inactive: 'Inactivo',
    startDate: 'Fecha inicio',
    endDate: 'Fecha fin',
    monthly: 'Mensual',
    noData: 'Sin datos',
    noDataDescription: 'Agrega tu primer registro para comenzar.',
    confirmDelete: '¿Eliminar este registro?',
    created: 'Creado exitosamente',
    updated: 'Actualizado exitosamente',
    deleted: 'Eliminado exitosamente',
    error: 'Ocurrió un error',

    // Income specific
    salary: 'Salario',
    extra: 'Extra',
    freelance: 'Freelance',
    passive: 'Pasivo',
    other: 'Otro',

    // Expense categories
    food: 'Comida',
    transport: 'Transporte',
    entertainment: 'Entretenimiento',
    health: 'Salud',
    clothing: 'Ropa',
    education: 'Educación',
    home: 'Hogar',
    pets: 'Mascotas',
    gifts: 'Regalos',
    travel: 'Viajes',
    technology: 'Tecnología',
    sports: 'Deportes',

    // Fixed expense categories
    rent: 'Alquiler',
    utilities: 'Servicios',
    internet: 'Internet',
    subscriptions: 'Suscripciones',
    insurance: 'Seguros',
    credits: 'Créditos',
    maintenance: 'Mantenimiento',

    // Debts
    monthlyPayment: 'Pago mensual',
    remainingAmount: 'Monto pendiente',

    // Savings
    targetAmount: 'Meta',
    currentAmount: 'Actual',
    monthlyContribution: 'Aporte mensual',
    progress: 'Progreso',

    // Cards
    creditLimit: 'Límite',
    billingDay: 'Día de corte',
    dueDay: 'Día de pago',
    totalDue: 'Total a pagar',
    minimumDue: 'Mínimo a pagar',

    // Auth
    login: 'Iniciar sesión',
    register: 'Crear cuenta',
    email: 'Correo electrónico',
    password: 'Contraseña',
    loginWithGoogle: 'Continuar con Google',
    noAccount: '¿No tienes cuenta?',
    hasAccount: '¿Ya tienes cuenta?',
    logout: 'Cerrar sesión',
    forgotPassword: '¿Olvidaste tu contraseña?',

    // Profile
    fullName: 'Nombre completo',
    currency: 'Moneda',
    language: 'Idioma',
    settings: 'Configuración',
    about: 'Acerca de',
    version: 'Versión',

    // Accounts & Wallets
    accounts: 'Cuentas',
    wallets: 'Billeteras',
    bankName: 'Banco',
    balance: 'Saldo',

    // Misc
    loading: 'Cargando...',
    retry: 'Reintentar',
    seeAll: 'Ver todo',
    total: 'Total',
    perMonth: '/mes',
  },

  en: {
    dashboard: 'Home',
    incomes: 'Income',
    expenses: 'Expenses',
    cards: 'Cards',
    profile: 'Profile',

    greeting: 'Hello',
    monthSummary: 'Month summary',
    netSurplus: 'Net surplus',
    grossSurplus: 'Gross surplus',
    dailySuggestion: 'Suggested daily spend',
    consolidatedBalance: 'Consolidated balance',
    remainingDays: 'Days remaining',
    classification: 'Classification',
    safe: 'Investable',
    operative: 'Operative',
    unavailable: 'Reserve',
    breakdown: 'Breakdown',
    income: 'Income',
    fixedExpenses: 'Fixed expenses',
    debts: 'Debts',
    savings: 'Savings',
    personal: 'Personal',
    commitments: 'Commitments',
    creditCards: 'Credit cards',
    saveSurplus: 'Save surplus',
    surplusSaved: 'Surplus saved to history',

    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    name: 'Name',
    amount: 'Amount',
    category: 'Category',
    active: 'Active',
    inactive: 'Inactive',
    startDate: 'Start date',
    endDate: 'End date',
    monthly: 'Monthly',
    noData: 'No data',
    noDataDescription: 'Add your first record to get started.',
    confirmDelete: 'Delete this record?',
    created: 'Created successfully',
    updated: 'Updated successfully',
    deleted: 'Deleted successfully',
    error: 'An error occurred',

    salary: 'Salary',
    extra: 'Extra',
    freelance: 'Freelance',
    passive: 'Passive',
    other: 'Other',

    food: 'Food',
    transport: 'Transport',
    entertainment: 'Entertainment',
    health: 'Health',
    clothing: 'Clothing',
    education: 'Education',
    home: 'Home',
    pets: 'Pets',
    gifts: 'Gifts',
    travel: 'Travel',
    technology: 'Technology',
    sports: 'Sports',

    rent: 'Rent',
    utilities: 'Utilities',
    internet: 'Internet',
    subscriptions: 'Subscriptions',
    insurance: 'Insurance',
    credits: 'Credits',
    maintenance: 'Maintenance',

    monthlyPayment: 'Monthly payment',
    remainingAmount: 'Remaining amount',

    targetAmount: 'Target',
    currentAmount: 'Current',
    monthlyContribution: 'Monthly contribution',
    progress: 'Progress',

    creditLimit: 'Limit',
    billingDay: 'Billing day',
    dueDay: 'Due day',
    totalDue: 'Total due',
    minimumDue: 'Minimum due',

    login: 'Sign in',
    register: 'Create account',
    email: 'Email',
    password: 'Password',
    loginWithGoogle: 'Continue with Google',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    logout: 'Sign out',
    forgotPassword: 'Forgot password?',

    fullName: 'Full name',
    currency: 'Currency',
    language: 'Language',
    settings: 'Settings',
    about: 'About',
    version: 'Version',

    accounts: 'Accounts',
    wallets: 'Wallets',
    bankName: 'Bank',
    balance: 'Balance',

    loading: 'Loading...',
    retry: 'Retry',
    seeAll: 'See all',
    total: 'Total',
    perMonth: '/mo',
  },
} as const

export type TranslationKeys = {
  [K in keyof typeof translations.es]: string
}

export interface I18nContextType {
  locale: Locale
  setLocale: (l: Locale) => void
  t: TranslationKeys
}

export const I18nContext = createContext<I18nContextType>({
  locale: 'es',
  setLocale: () => {},
  t: translations.es,
})

export function useI18n(): I18nContextType {
  return useContext(I18nContext)
}
