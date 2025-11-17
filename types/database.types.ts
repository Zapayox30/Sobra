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
    }
    Enums: {
      [_ in never]: never
    }
  }
}

