import { z } from 'zod'

// Supported currencies
const currencySchema = z.enum(['PEN', 'USD', 'EUR']).default('PEN')

// Validador base para montos
const moneySchema = z
  .number()
  .min(0, 'El monto debe ser mayor o igual a 0')
  .max(99_999_999, 'El monto es demasiado grande')
  .refine(
    (val) => {
      const decimals = val.toString().split('.')[1]
      return !decimals || decimals.length <= 2
    },
    { message: 'El monto debe tener máximo 2 decimales' }
  )

// Validador para fechas
const dateSchema = z.coerce.date()

// Recurrence (shared)
const recurrenceSchema = z.enum(['monthly', 'biweekly', 'weekly', 'one_off']).default('monthly')

// Profile
export const profileSchema = z.object({
  full_name: z.string().trim().min(1, 'El nombre es requerido').max(100).nullable(),
  currency: currencySchema,
  period: z.enum(['monthly', 'biweekly']).default('monthly'),
  photo_url: z.string().url().nullable().optional(),
})

export type ProfileInput = z.infer<typeof profileSchema>

// Income
export const incomeSchema = z.object({
  label: z.string().trim().min(1, 'La etiqueta es requerida').max(100),
  amount: moneySchema,
  kind: z.enum(['salary', 'extra', 'freelance', 'passive', 'other']).default('salary'),
  recurrence: recurrenceSchema,
  starts_on: dateSchema,
  ends_on: dateSchema.nullable().optional(),
  is_active: z.boolean().default(true),
})

export type IncomeInput = z.infer<typeof incomeSchema>

// Fixed Expense
export const fixedExpenseSchema = z.object({
  category: z.string().trim().min(1, 'La categoría es requerida').max(50).default('otros'),
  label: z.string().trim().min(1, 'La etiqueta es requerida').max(100),
  amount: moneySchema,
  recurrence: recurrenceSchema,
  starts_on: dateSchema,
  ends_on: dateSchema.nullable().optional(),
  is_active: z.boolean().default(true),
})

export type FixedExpenseInput = z.infer<typeof fixedExpenseSchema>

// Personal Expense
export const personalExpenseSchema = z.object({
  category: z.string().trim().min(1, 'La categoría es requerida').max(50),
  label: z.string().trim().max(100).nullable().optional(),
  amount: moneySchema,
  recurrence: recurrenceSchema,
  starts_on: dateSchema,
  ends_on: dateSchema.nullable().optional(),
  is_active: z.boolean().default(true),
})

export type PersonalExpenseInput = z.infer<typeof personalExpenseSchema>

// Monthly Commitment
export const monthlyCommitmentSchema = z.object({
  label: z.string().trim().min(1, 'La etiqueta es requerida').max(100),
  amount_per_month: moneySchema.refine((val) => val >= 0.01, 'El monto debe ser mayor a 0'),
  months_total: z
    .number()
    .int()
    .min(1, 'Debe ser al menos 1 mes')
    .max(120, 'Máximo 120 meses'),
  start_month: dateSchema,
})

export type MonthlyCommitmentInput = z.infer<typeof monthlyCommitmentSchema>

// Debt
export const debtSchema = z.object({
  label: z.string().trim().min(1, 'La etiqueta es requerida').max(100),
  creditor: z.string().trim().max(100).nullable().optional(),
  original_amount: moneySchema,
  remaining_amount: moneySchema,
  monthly_payment: moneySchema,
  interest_rate: z.number().min(0).max(100).nullable().optional(),
  due_day: z.number().int().min(1).max(31).nullable().optional(),
  starts_on: dateSchema,
  ends_on: dateSchema.nullable().optional(),
  is_active: z.boolean().default(true),
})

export type DebtInput = z.infer<typeof debtSchema>

// Savings Goal
export const savingsGoalSchema = z.object({
  label: z.string().trim().min(1, 'La etiqueta es requerida').max(100),
  goal_type: z.enum(['emergency_fund', 'savings', 'investment', 'other']).default('savings'),
  target_amount: moneySchema,
  current_amount: moneySchema.default(0),
  monthly_contribution: moneySchema.default(0),
  target_date: dateSchema.nullable().optional(),
  is_active: z.boolean().default(true),
})

export type SavingsGoalInput = z.infer<typeof savingsGoalSchema>

// Credit Card
export const creditCardSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es requerido').max(100),
  issuer: z.string().trim().max(100).nullable().optional(),
  credit_limit: moneySchema.nullable().optional(),
  cutoff_day: z.number().int().min(1).max(31),
  due_day: z.number().int().min(1).max(31),
  is_active: z.boolean().default(true),
})

export type CreditCardInput = z.infer<typeof creditCardSchema>

// Card Statement
export const cardStatementSchema = z.object({
  card_id: z.string().uuid(),
  statement_month: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD'),
  total_due: moneySchema,
  minimum_due: moneySchema.default(0),
  closing_date: dateSchema.nullable().optional(),
  due_date: dateSchema.nullable().optional(),
  status: z.enum(['open', 'closed', 'paid', 'overdue']).default('open'),
})

export type CardStatementInput = z.infer<typeof cardStatementSchema>

// Card Transaction
export const cardTransactionSchema = z.object({
  card_id: z.string().uuid(),
  description: z.string().trim().max(200).nullable().optional(),
  amount: moneySchema,
  category: z.string().trim().max(50).nullable().optional(),
  installments_total: z.number().int().min(1).default(1),
  purchased_at: dateSchema,
})

export type CardTransactionInput = z.infer<typeof cardTransactionSchema>

// Card Payment
export const cardPaymentSchema = z.object({
  card_id: z.string().uuid(),
  statement_id: z.string().uuid().nullable().optional(),
  amount: moneySchema,
  paid_at: dateSchema,
  method: z.string().trim().max(50).nullable().optional(),
  note: z.string().trim().max(200).nullable().optional(),
})

export type CardPaymentInput = z.infer<typeof cardPaymentSchema>

// Account
export const accountSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es requerido').max(100),
  institution: z.string().trim().max(100).nullable().optional(),
  account_type: z.enum(['bank', 'savings', 'investment', 'other']).default('bank'),
  currency: currencySchema,
  current_balance: moneySchema.default(0),
  is_active: z.boolean().default(true),
})

export type AccountInput = z.infer<typeof accountSchema>

// Wallet
export const walletSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es requerido').max(100),
  wallet_type: z.enum(['yape', 'plin', 'cash', 'other']).default('cash'),
  currency: currencySchema,
  current_balance: moneySchema.default(0),
  icon: z.string().trim().max(50).nullable().optional(),
  is_active: z.boolean().default(true),
})

export type WalletInput = z.infer<typeof walletSchema>

// Bank Connection
export const bankConnectionSchema = z.object({
  institution_name: z.string().trim().min(1, 'La institución es requerida').max(100),
  institution_code: z.string().trim().max(50).nullable().optional(),
  provider: z.enum(['belvo', 'manual']).default('belvo'),
  external_link_id: z.string().trim().max(200).nullable().optional(),
  status: z.enum(['active', 'inactive', 'error']).default('active'),
})

export type BankConnectionInput = z.infer<typeof bankConnectionSchema>

// Financial Alert
export const financialAlertSchema = z.object({
  alert_type: z.string().trim().min(1).max(50),
  severity: z.enum(['info', 'warning', 'critical']).default('info'),
  title: z.string().trim().min(1).max(150),
  message: z.string().trim().max(500).nullable().optional(),
  is_read: z.boolean().default(false),
})

export type FinancialAlertInput = z.infer<typeof financialAlertSchema>

// Auth
export const loginSchema = z.object({
  email: z.string().trim().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export type LoginInput = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    email: z.string().trim().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string(),
    full_name: z.string().trim().min(1, 'El nombre es requerido').max(100),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

export type RegisterInput = z.infer<typeof registerSchema>

// Onboarding
export const onboardingSchema = z.object({
  full_name: z.string().trim().min(1, 'El nombre es requerido').max(100),
  currency: currencySchema.removeDefault(),
  period: z.enum(['monthly', 'biweekly']),
  initial_income: z.number().min(0).max(99_999_999).optional(),
  initial_income_label: z.string().trim().max(100).optional(),
})

export type OnboardingInput = z.infer<typeof onboardingSchema>

