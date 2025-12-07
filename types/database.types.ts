// Generated types for Supabase tables
// Run: npx supabase gen types typescript --project-id <project-id> > types/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          currency: string
          period: 'monthly' | 'biweekly'
          photo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          currency?: string
          period?: 'monthly' | 'biweekly'
          photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          currency?: string
          period?: 'monthly' | 'biweekly'
          photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      plans: {
        Row: {
          code: string
          name: string
          price_cents: number
          currency: string
          features: Json
          created_at: string
        }
        Insert: {
          code: string
          name: string
          price_cents?: number
          currency?: string
          features?: Json
          created_at?: string
        }
        Update: {
          code?: string
          name?: string
          price_cents?: number
          currency?: string
          features?: Json
          created_at?: string
        }
      }
      user_plans: {
        Row: {
          id: string
          user_id: string
          plan_code: string
          status: 'active' | 'canceled' | 'past_due' | 'trialing'
          started_at: string
          ends_at: string | null
          external_subscription_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          plan_code: string
          status: 'active' | 'canceled' | 'past_due' | 'trialing'
          started_at?: string
          ends_at?: string | null
          external_subscription_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          plan_code?: string
          status?: 'active' | 'canceled' | 'past_due' | 'trialing'
          started_at?: string
          ends_at?: string | null
          external_subscription_id?: string | null
        }
      }
      incomes: {
        Row: {
          id: string
          user_id: string
          label: string
          amount: number
          kind: 'salary' | 'extra' | 'other'
          recurrence: 'monthly' | 'one_off'
          starts_on: string
          ends_on: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          label: string
          amount: number
          kind?: 'salary' | 'extra' | 'other'
          recurrence?: 'monthly' | 'one_off'
          starts_on?: string
          ends_on?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          label?: string
          amount?: number
          kind?: 'salary' | 'extra' | 'other'
          recurrence?: 'monthly' | 'one_off'
          starts_on?: string
          ends_on?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      fixed_expenses: {
        Row: {
          id: string
          user_id: string
          label: string
          amount: number
          recurrence: 'monthly' | 'one_off'
          starts_on: string
          ends_on: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          label: string
          amount: number
          recurrence?: 'monthly' | 'one_off'
          starts_on?: string
          ends_on?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          label?: string
          amount?: number
          recurrence?: 'monthly' | 'one_off'
          starts_on?: string
          ends_on?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      personal_expenses: {
        Row: {
          id: string
          user_id: string
          category: string
          label: string | null
          amount: number
          recurrence: 'monthly' | 'one_off'
          starts_on: string
          ends_on: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category: string
          label?: string | null
          amount: number
          recurrence?: 'monthly' | 'one_off'
          starts_on?: string
          ends_on?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category?: string
          label?: string | null
          amount?: number
          recurrence?: 'monthly' | 'one_off'
          starts_on?: string
          ends_on?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      monthly_commitments: {
        Row: {
          id: string
          user_id: string
          label: string
          amount_per_month: number
          months_total: number
          start_month: string
          end_month: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          label: string
          amount_per_month: number
          months_total: number
          start_month: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          label?: string
          amount_per_month?: number
          months_total?: number
          start_month?: string
          created_at?: string
          updated_at?: string
        }
      }
      monthly_summaries: {
        Row: {
          id: string
          user_id: string
          month: string
          income_total: number
          fixed_expenses_total: number
          commitments_total: number
          personal_budget_total: number
          leftover_before_personal: number
          leftover_after_personal: number
          generated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          month: string
          income_total: number
          fixed_expenses_total: number
          commitments_total: number
          personal_budget_total: number
          leftover_before_personal: number
          leftover_after_personal: number
          generated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          month?: string
          income_total?: number
          fixed_expenses_total?: number
          commitments_total?: number
          personal_budget_total?: number
          leftover_before_personal?: number
          leftover_after_personal?: number
          generated_at?: string
        }
      }
      credit_cards: {
        Row: {
          id: string
          user_id: string
          name: string
          issuer: string | null
          credit_limit: number | null
          cutoff_day: number
          due_day: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          issuer?: string | null
          credit_limit?: number | null
          cutoff_day: number
          due_day: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          issuer?: string | null
          credit_limit?: number | null
          cutoff_day?: number
          due_day?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      card_statements: {
        Row: {
          id: string
          user_id: string
          card_id: string
          statement_month: string
          closing_date: string
          due_date: string
          total_due: number
          minimum_due: number
          status: 'open' | 'partial' | 'paid'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          card_id: string
          statement_month: string
          closing_date: string
          due_date: string
          total_due: number
          minimum_due?: number
          status?: 'open' | 'partial' | 'paid'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          card_id?: string
          statement_month?: string
          closing_date?: string
          due_date?: string
          total_due?: number
          minimum_due?: number
          status?: 'open' | 'partial' | 'paid'
          created_at?: string
          updated_at?: string
        }
      }
      card_payments: {
        Row: {
          id: string
          user_id: string
          card_id: string
          statement_id: string | null
          amount: number
          paid_at: string
          method: string | null
          note: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          card_id: string
          statement_id?: string | null
          amount: number
          paid_at?: string
          method?: string | null
          note?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          card_id?: string
          statement_id?: string | null
          amount?: number
          paid_at?: string
          method?: string | null
          note?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      card_transactions: {
        Row: {
          id: string
          user_id: string
          card_id: string
          amount: number
          description: string | null
          category: string | null
          purchased_at: string
          installments_total: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          card_id: string
          amount: number
          description?: string | null
          category?: string | null
          purchased_at?: string
          installments_total?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          card_id?: string
          amount?: number
          description?: string | null
          category?: string | null
          purchased_at?: string
          installments_total?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      financial_alerts: {
        Row: {
          id: string
          user_id: string
          alert_type: Database['public']['Enums']['alert_type']
          severity: Database['public']['Enums']['alert_severity']
          title: string
          message: string
          category: string | null
          amount_spent: number | null
          amount_average: number | null
          amount_budget: number | null
          percentage_diff: number | null
          is_read: boolean
          is_dismissed: boolean
          action_url: string | null
          created_at: string
          read_at: string | null
          dismissed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          alert_type: Database['public']['Enums']['alert_type']
          severity?: Database['public']['Enums']['alert_severity']
          title: string
          message: string
          category?: string | null
          amount_spent?: number | null
          amount_average?: number | null
          amount_budget?: number | null
          percentage_diff?: number | null
          is_read?: boolean
          is_dismissed?: boolean
          action_url?: string | null
          created_at?: string
          read_at?: string | null
          dismissed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          alert_type?: Database['public']['Enums']['alert_type']
          severity?: Database['public']['Enums']['alert_severity']
          title?: string
          message?: string
          category?: string | null
          amount_spent?: number | null
          amount_average?: number | null
          amount_budget?: number | null
          percentage_diff?: number | null
          is_read?: boolean
          is_dismissed?: boolean
          action_url?: string | null
          created_at?: string
          read_at?: string | null
          dismissed_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_month_totals: {
        Args: {
          p_month: string
        }
        Returns: {
          income_total: number
          fixed_total: number
          commitments_total: number
          personal_total: number
        }[]
      }
      mark_alert_as_read: {
        Args: {
          alert_id: string
        }
        Returns: Database['public']['Tables']['financial_alerts']['Row']
      }
      mark_all_alerts_as_read: {
        Args: Record<string, never>
        Returns: Database['public']['Tables']['financial_alerts']['Row'][]
      }
      get_unread_alert_count: {
        Args: Record<string, never>
        Returns: number
      }
    }
    Enums: {
      alert_type: 'overspending' | 'under_budget' | 'no_activity' | 'achievement' | 'budget_warning' | 'goal_progress'
      alert_severity: 'info' | 'warning' | 'critical' | 'success'
    }
  }
}

