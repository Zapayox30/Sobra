import { z } from 'zod'

// Validador base para montos
const moneySchema = z
  .number()
  .min(0, 'El monto debe ser mayor o igual a 0')
  .refine(
    (val) => {
      const decimals = val.toString().split('.')[1]
      return !decimals || decimals.length <= 2
    },
    { message: 'El monto debe tener máximo 2 decimales' }
  )

// Validador para fechas
const dateSchema = z.coerce.date()

// Profile
export const profileSchema = z.object({
  full_name: z.string().min(1, 'El nombre es requerido').max(100).nullable(),
  currency: z.string().optional().default('USD'),
  period: z.enum(['monthly', 'biweekly']).optional().default('monthly'),
  photo_url: z.string().url().nullable().optional(),
})

export type ProfileInput = z.infer<typeof profileSchema>

// Income
export const incomeSchema = z.object({
  label: z.string().min(1, 'La etiqueta es requerida').max(100),
  amount: moneySchema,
  kind: z.enum(['salary', 'extra', 'other']).default('salary'),
  recurrence: z.enum(['monthly', 'one_off']).default('monthly'),
  starts_on: dateSchema,
  ends_on: dateSchema.nullable().optional(),
  is_active: z.boolean().default(true),
})

export type IncomeInput = z.infer<typeof incomeSchema>

// Fixed Expense
export const fixedExpenseSchema = z.object({
  category: z.string().min(1, 'La categoría es requerida').max(50).default('otros'),
  label: z.string().min(1, 'La etiqueta es requerida').max(100),
  amount: moneySchema,
  recurrence: z.enum(['monthly', 'one_off']).default('monthly'),
  starts_on: dateSchema,
  ends_on: dateSchema.nullable().optional(),
  is_active: z.boolean().default(true),
})

export type FixedExpenseInput = z.infer<typeof fixedExpenseSchema>

// Personal Expense
export const personalExpenseSchema = z.object({
  category: z.string().min(1, 'La categoría es requerida').max(50),
  label: z.string().max(100).nullable().optional(),
  amount: moneySchema,
  recurrence: z.enum(['monthly', 'one_off']).default('monthly'),
  starts_on: dateSchema,
  ends_on: dateSchema.nullable().optional(),
  is_active: z.boolean().default(true),
})

export type PersonalExpenseInput = z.infer<typeof personalExpenseSchema>

// Monthly Commitment
export const monthlyCommitmentSchema = z.object({
  label: z.string().min(1, 'La etiqueta es requerida').max(100),
  amount_per_month: z.number().min(0.01, 'El monto debe ser mayor a 0'),
  months_total: z
    .number()
    .int()
    .min(1, 'Debe ser al menos 1 mes')
    .max(120, 'Máximo 120 meses'),
  start_month: dateSchema,
})

export type MonthlyCommitmentInput = z.infer<typeof monthlyCommitmentSchema>

// Auth
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export type LoginInput = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string(),
    full_name: z.string().min(1, 'El nombre es requerido').max(100),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

export type RegisterInput = z.infer<typeof registerSchema>

// Onboarding
export const onboardingSchema = z.object({
  full_name: z.string().min(1, 'El nombre es requerido').max(100),
  currency: z.string().default('USD'),
  period: z.enum(['monthly', 'biweekly']).default('monthly'),
  initial_income: z.number().min(0).optional(),
  initial_income_label: z.string().max(100).optional(),
})

export type OnboardingInput = z.infer<typeof onboardingSchema>

