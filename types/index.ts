export type Money = number

export type Period = {
  start: Date
  end: Date
}

export type IncomeKind = 'salary' | 'extra' | 'other'
export type Recurrence = 'monthly' | 'one_off'
export type PlanStatus = 'active' | 'canceled' | 'past_due' | 'trialing'
export type UserPeriod = 'monthly' | 'biweekly'

export interface Income {
  id: string
  user_id: string
  label: string
  amount: Money
  kind: IncomeKind
  recurrence: Recurrence
  starts_on: Date
  ends_on: Date | null
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface FixedExpense {
  id: string
  user_id: string
  label: string
  amount: Money
  recurrence: Recurrence
  starts_on: Date
  ends_on: Date | null
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface PersonalExpense {
  id: string
  user_id: string
  category: string
  label: string | null
  amount: Money
  recurrence: Recurrence
  starts_on: Date
  ends_on: Date | null
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface MonthlyCommitment {
  id: string
  user_id: string
  label: string
  amount_per_month: Money
  months_total: number
  start_month: Date
  end_month: Date
  created_at: Date
  updated_at: Date
}

export interface Profile {
  id: string
  full_name: string | null
  currency: string
  period: UserPeriod
  photo_url: string | null
  created_at: Date
  updated_at: Date
}

export interface Plan {
  code: string
  name: string
  price_cents: number
  currency: string
  features: Record<string, unknown>
  created_at: Date
}

export interface UserPlan {
  id: string
  user_id: string
  plan_code: string
  status: PlanStatus
  started_at: Date
  ends_at: Date | null
  external_subscription_id: string | null
}

export interface MonthlySummary {
  id: string
  user_id: string
  month: Date
  income_total: Money
  fixed_expenses_total: Money
  commitments_total: Money
  personal_budget_total: Money
  leftover_before_personal: Money
  leftover_after_personal: Money
  generated_at: Date
}

export interface CalculationResult {
  incomeTotal: Money
  fixedTotal: Money
  commitmentsTotal: Money
  personalTotal: Money
  leftoverBeforePersonal: Money
  leftoverAfterPersonal: Money
  dailySuggestion: Money
}

