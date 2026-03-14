import type { Database } from './database.types'

// =============================================
// Utility Types
// =============================================
export type Money = number

export type Period = {
  start: Date
  end: Date
}

// =============================================
// DB Row Type Aliases (single source of truth)
// =============================================
export type DBTables = Database['public']['Tables']

export type Income = DBTables['incomes']['Row']
export type IncomeInsert = DBTables['incomes']['Insert']
export type IncomeUpdate = DBTables['incomes']['Update']

export type FixedExpense = DBTables['fixed_expenses']['Row']
export type FixedExpenseInsert = DBTables['fixed_expenses']['Insert']
export type FixedExpenseUpdate = DBTables['fixed_expenses']['Update']

export type PersonalExpense = DBTables['personal_expenses']['Row']
export type PersonalExpenseInsert = DBTables['personal_expenses']['Insert']
export type PersonalExpenseUpdate = DBTables['personal_expenses']['Update']

export type MonthlyCommitment = DBTables['monthly_commitments']['Row']
export type MonthlyCommitmentInsert = DBTables['monthly_commitments']['Insert']
export type MonthlyCommitmentUpdate = DBTables['monthly_commitments']['Update']

export type Account = DBTables['accounts']['Row']
export type AccountInsert = DBTables['accounts']['Insert']
export type AccountUpdate = DBTables['accounts']['Update']

export type Wallet = DBTables['wallets']['Row']
export type WalletInsert = DBTables['wallets']['Insert']
export type WalletUpdate = DBTables['wallets']['Update']

export type Debt = DBTables['debts']['Row']
export type DebtInsert = DBTables['debts']['Insert']
export type DebtUpdate = DBTables['debts']['Update']

export type SavingsGoal = DBTables['savings_goals']['Row']
export type SavingsGoalInsert = DBTables['savings_goals']['Insert']
export type SavingsGoalUpdate = DBTables['savings_goals']['Update']

export type CreditCard = DBTables['credit_cards']['Row']
export type CreditCardInsert = DBTables['credit_cards']['Insert']
export type CreditCardUpdate = DBTables['credit_cards']['Update']

export type CardStatement = DBTables['card_statements']['Row']
export type CardStatementInsert = DBTables['card_statements']['Insert']
export type CardStatementUpdate = DBTables['card_statements']['Update']

export type CardTransaction = DBTables['card_transactions']['Row']
export type CardTransactionInsert = DBTables['card_transactions']['Insert']
export type CardTransactionUpdate = DBTables['card_transactions']['Update']

export type CardPayment = DBTables['card_payments']['Row']
export type CardPaymentInsert = DBTables['card_payments']['Insert']
export type CardPaymentUpdate = DBTables['card_payments']['Update']

export type SurplusHistory = DBTables['surplus_history']['Row']
export type SurplusHistoryInsert = DBTables['surplus_history']['Insert']

export type Profile = DBTables['profiles']['Row']
export type ProfileUpdate = DBTables['profiles']['Update']

export type Plan = DBTables['plans']['Row']
export type UserPlan = DBTables['user_plans']['Row']

export type FinancialTip = DBTables['financial_tips']['Row']
export type UserTip = DBTables['user_tips']['Row']
export type FinancialAlert = DBTables['financial_alerts']['Row']
export type BankConnection = DBTables['bank_connections']['Row']

// =============================================
// Enum-like Types (match DB CHECK constraints)
// =============================================
export type IncomeKind = 'salary' | 'extra' | 'freelance' | 'passive' | 'other'
export type Recurrence = 'monthly' | 'biweekly' | 'weekly' | 'one_off'
export type PlanStatus = 'active' | 'canceled' | 'past_due' | 'trialing'
export type UserPeriod = 'monthly' | 'biweekly'
export type AccountType = 'bank' | 'savings' | 'investment' | 'other'
export type WalletType = 'yape' | 'plin' | 'cash' | 'other'
export type GoalType = 'emergency_fund' | 'savings' | 'investment' | 'other'
export type AlertSeverity = 'info' | 'warning' | 'critical'
export type AlertType = 'surplus_low' | 'debt_high' | 'goal_reached' | 'payment_due' | 'custom'
export type ConnectionStatus = 'active' | 'needs_reauth' | 'revoked'
export type StatementStatus = 'open' | 'closed' | 'paid' | 'overdue'

// =============================================
// Sobra Engine (pure calculation types)
// =============================================
export interface SurplusClassification {
  safe: Money       // investable (50%)
  operative: Money  // operational buffer (30%)
  unavailable: Money // emergency reserve (20%)
}

export interface SurplusResult {
  incomeTotal: Money
  fixedExpensesTotal: Money
  debtsTotal: Money
  savingsCommitted: Money
  personalExpensesTotal: Money
  cardPaymentsTotal: Money
  commitmentsTotal: Money
  grossSurplus: Money
  netSurplus: Money
  classification: SurplusClassification
  consolidatedBalance: Money
  dailySuggestion: Money
  remainingDays: number
  daysInMonth: number
}

