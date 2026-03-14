/**
 * SOBRA Mobile — Types
 *
 * Derived from the auto-generated database.types.ts
 * Using Tables/TablesInsert/TablesUpdate helpers for type safety.
 */

import type { Tables, TablesInsert, TablesUpdate } from './database.types'

export type Money = number

export type Period = {
  start: Date
  end: Date
}

// ── Row types (direct from DB) ──
export type Income = Tables<'incomes'>
export type FixedExpense = Tables<'fixed_expenses'>
export type PersonalExpense = Tables<'personal_expenses'>
export type MonthlyCommitment = Tables<'monthly_commitments'>
export type Debt = Tables<'debts'>
export type SavingsGoal = Tables<'savings_goals'>
export type Account = Tables<'accounts'>
export type Wallet = Tables<'wallets'>
export type CreditCard = Tables<'credit_cards'>
export type CardStatement = Tables<'card_statements'>
export type CardPayment = Tables<'card_payments'>
export type SurplusHistory = Tables<'surplus_history'>
export type Profile = Tables<'profiles'>

// ── Insert types ──
export type IncomeInsert = TablesInsert<'incomes'>
export type FixedExpenseInsert = TablesInsert<'fixed_expenses'>
export type PersonalExpenseInsert = TablesInsert<'personal_expenses'>
export type MonthlyCommitmentInsert = TablesInsert<'monthly_commitments'>
export type DebtInsert = TablesInsert<'debts'>
export type SavingsGoalInsert = TablesInsert<'savings_goals'>
export type CreditCardInsert = TablesInsert<'credit_cards'>

// ── Update types ──
export type IncomeUpdate = TablesUpdate<'incomes'>
export type FixedExpenseUpdate = TablesUpdate<'fixed_expenses'>
export type PersonalExpenseUpdate = TablesUpdate<'personal_expenses'>
export type MonthlyCommitmentUpdate = TablesUpdate<'monthly_commitments'>
export type DebtUpdate = TablesUpdate<'debts'>
export type SavingsGoalUpdate = TablesUpdate<'savings_goals'>
export type CreditCardUpdate = TablesUpdate<'credit_cards'>

// ── Enums (app-level semantic names — DB stores as string) ──
export type IncomeKind = 'salary' | 'extra' | 'freelance' | 'passive' | 'other'
export type Recurrence = 'monthly' | 'biweekly' | 'weekly' | 'one_off'
export type UserPeriod = 'monthly' | 'biweekly'
export type AccountType = 'bank' | 'savings' | 'investment' | 'other'
export type WalletType = 'yape' | 'plin' | 'cash' | 'other'
export type GoalType = 'emergency_fund' | 'savings' | 'investment' | 'other'
export type StatementStatus = 'open' | 'closed' | 'paid' | 'overdue'

// ── Surplus Engine ──
export interface SurplusClassification {
  safe: Money
  operative: Money
  unavailable: Money
}

export interface SurplusOutput {
  incomeTotal: Money
  fixedTotal: Money
  debtsTotal: Money
  savingsCommitted: Money
  personalTotal: Money
  commitmentsTotal: Money
  cardDueTotal: Money
  grossSurplus: Money
  netSurplus: Money
  classification: SurplusClassification
  consolidatedBalance: Money
  dailySuggestion: Money
  daysInMonth: number
  remainingDays: number
}
