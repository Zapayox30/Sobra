export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          account_type: string
          created_at: string
          currency: string
          current_balance: number
          id: string
          institution: string | null
          is_active: boolean
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_type?: string
          created_at?: string
          currency?: string
          current_balance?: number
          id?: string
          institution?: string | null
          is_active?: boolean
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_type?: string
          created_at?: string
          currency?: string
          current_balance?: number
          id?: string
          institution?: string | null
          is_active?: boolean
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      bank_connections: {
        Row: {
          created_at: string
          external_link_id: string | null
          id: string
          institution_code: string | null
          institution_name: string
          last_synced_at: string | null
          provider: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          external_link_id?: string | null
          id?: string
          institution_code?: string | null
          institution_name: string
          last_synced_at?: string | null
          provider?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          external_link_id?: string | null
          id?: string
          institution_code?: string | null
          institution_name?: string
          last_synced_at?: string | null
          provider?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      card_payments: {
        Row: {
          amount: number
          card_id: string
          created_at: string
          id: string
          method: string | null
          note: string | null
          paid_at: string
          statement_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          card_id: string
          created_at?: string
          id?: string
          method?: string | null
          note?: string | null
          paid_at?: string
          statement_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          card_id?: string
          created_at?: string
          id?: string
          method?: string | null
          note?: string | null
          paid_at?: string
          statement_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "card_payments_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "credit_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_payments_statement_id_fkey"
            columns: ["statement_id"]
            isOneToOne: false
            referencedRelation: "card_statements"
            referencedColumns: ["id"]
          },
        ]
      }
      card_statements: {
        Row: {
          card_id: string
          closing_date: string | null
          created_at: string
          due_date: string | null
          id: string
          minimum_due: number
          statement_month: string
          status: string
          total_due: number
          updated_at: string
          user_id: string
        }
        Insert: {
          card_id: string
          closing_date?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          minimum_due?: number
          statement_month: string
          status?: string
          total_due?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          card_id?: string
          closing_date?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          minimum_due?: number
          statement_month?: string
          status?: string
          total_due?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "card_statements_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "credit_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      card_transactions: {
        Row: {
          amount: number
          card_id: string
          category: string | null
          created_at: string
          description: string | null
          id: string
          installments_total: number
          purchased_at: string
          user_id: string
        }
        Insert: {
          amount: number
          card_id: string
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          installments_total?: number
          purchased_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          card_id?: string
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          installments_total?: number
          purchased_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "card_transactions_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "credit_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_cards: {
        Row: {
          created_at: string
          credit_limit: number | null
          cutoff_day: number
          due_day: number
          id: string
          is_active: boolean
          issuer: string | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credit_limit?: number | null
          cutoff_day: number
          due_day: number
          id?: string
          is_active?: boolean
          issuer?: string | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credit_limit?: number | null
          cutoff_day?: number
          due_day?: number
          id?: string
          is_active?: boolean
          issuer?: string | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      debts: {
        Row: {
          created_at: string
          creditor: string | null
          due_day: number | null
          ends_on: string | null
          id: string
          interest_rate: number | null
          is_active: boolean
          label: string
          monthly_payment: number
          original_amount: number
          remaining_amount: number
          starts_on: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          creditor?: string | null
          due_day?: number | null
          ends_on?: string | null
          id?: string
          interest_rate?: number | null
          is_active?: boolean
          label: string
          monthly_payment: number
          original_amount: number
          remaining_amount: number
          starts_on?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          creditor?: string | null
          due_day?: number | null
          ends_on?: string | null
          id?: string
          interest_rate?: number | null
          is_active?: boolean
          label?: string
          monthly_payment?: number
          original_amount?: number
          remaining_amount?: number
          starts_on?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      financial_alerts: {
        Row: {
          alert_type: string
          created_at: string
          id: string
          is_read: boolean
          message: string
          metadata: Json | null
          severity: string
          title: string
          user_id: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          metadata?: Json | null
          severity?: string
          title: string
          user_id: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          metadata?: Json | null
          severity?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      financial_tips: {
        Row: {
          body_en: string
          body_es: string
          category: string
          condition_rule: Json | null
          created_at: string
          id: string
          is_active: boolean
          priority: number
          tip_key: string
          title_en: string
          title_es: string
        }
        Insert: {
          body_en: string
          body_es: string
          category: string
          condition_rule?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean
          priority?: number
          tip_key: string
          title_en: string
          title_es: string
        }
        Update: {
          body_en?: string
          body_es?: string
          category?: string
          condition_rule?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean
          priority?: number
          tip_key?: string
          title_en?: string
          title_es?: string
        }
        Relationships: []
      }
      fixed_expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          ends_on: string | null
          id: string
          is_active: boolean
          label: string
          recurrence: string
          starts_on: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          category?: string
          created_at?: string
          ends_on?: string | null
          id?: string
          is_active?: boolean
          label: string
          recurrence?: string
          starts_on?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          ends_on?: string | null
          id?: string
          is_active?: boolean
          label?: string
          recurrence?: string
          starts_on?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      incomes: {
        Row: {
          amount: number
          created_at: string
          ends_on: string | null
          id: string
          is_active: boolean
          kind: string
          label: string
          recurrence: string
          starts_on: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          ends_on?: string | null
          id?: string
          is_active?: boolean
          kind?: string
          label: string
          recurrence?: string
          starts_on?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          ends_on?: string | null
          id?: string
          is_active?: boolean
          kind?: string
          label?: string
          recurrence?: string
          starts_on?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      monthly_commitments: {
        Row: {
          amount_per_month: number
          created_at: string
          end_month: string | null
          id: string
          label: string
          months_total: number
          start_month: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_per_month: number
          created_at?: string
          end_month?: string | null
          id?: string
          label: string
          months_total: number
          start_month: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_per_month?: number
          created_at?: string
          end_month?: string | null
          id?: string
          label?: string
          months_total?: number
          start_month?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      personal_expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          ends_on: string | null
          id: string
          is_active: boolean
          label: string | null
          recurrence: string
          starts_on: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          ends_on?: string | null
          id?: string
          is_active?: boolean
          label?: string | null
          recurrence?: string
          starts_on?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          ends_on?: string | null
          id?: string
          is_active?: boolean
          label?: string | null
          recurrence?: string
          starts_on?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      plans: {
        Row: {
          code: string
          created_at: string
          currency: string
          features: Json
          name: string
          price_cents: number
        }
        Insert: {
          code: string
          created_at?: string
          currency?: string
          features?: Json
          name: string
          price_cents?: number
        }
        Update: {
          code?: string
          created_at?: string
          currency?: string
          features?: Json
          name?: string
          price_cents?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          currency: string
          full_name: string | null
          id: string
          onboarding_completed: boolean
          period: string
          photo_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          full_name?: string | null
          id: string
          onboarding_completed?: boolean
          period?: string
          photo_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean
          period?: string
          photo_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      savings_goals: {
        Row: {
          created_at: string
          current_amount: number
          goal_type: string
          id: string
          is_active: boolean
          label: string
          monthly_contribution: number
          target_amount: number
          target_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_amount?: number
          goal_type?: string
          id?: string
          is_active?: boolean
          label: string
          monthly_contribution?: number
          target_amount: number
          target_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_amount?: number
          goal_type?: string
          id?: string
          is_active?: boolean
          label?: string
          monthly_contribution?: number
          target_amount?: number
          target_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      surplus_history: {
        Row: {
          card_payments_total: number
          commitments_total: number
          consolidated_balance: number | null
          daily_suggestion: number | null
          debts_total: number
          fixed_expenses_total: number
          generated_at: string
          gross_surplus: number
          id: string
          income_total: number
          month: string
          net_surplus: number
          personal_expenses_total: number
          savings_committed: number
          surplus_operative: number
          surplus_safe: number
          surplus_unavailable: number
          user_id: string
        }
        Insert: {
          card_payments_total?: number
          commitments_total?: number
          consolidated_balance?: number | null
          daily_suggestion?: number | null
          debts_total?: number
          fixed_expenses_total?: number
          generated_at?: string
          gross_surplus?: number
          id?: string
          income_total?: number
          month: string
          net_surplus?: number
          personal_expenses_total?: number
          savings_committed?: number
          surplus_operative?: number
          surplus_safe?: number
          surplus_unavailable?: number
          user_id: string
        }
        Update: {
          card_payments_total?: number
          commitments_total?: number
          consolidated_balance?: number | null
          daily_suggestion?: number | null
          debts_total?: number
          fixed_expenses_total?: number
          generated_at?: string
          gross_surplus?: number
          id?: string
          income_total?: number
          month?: string
          net_surplus?: number
          personal_expenses_total?: number
          savings_committed?: number
          surplus_operative?: number
          surplus_safe?: number
          surplus_unavailable?: number
          user_id?: string
        }
        Relationships: []
      }
      user_plans: {
        Row: {
          ends_at: string | null
          external_subscription_id: string | null
          id: string
          plan_code: string
          started_at: string
          status: string
          user_id: string
        }
        Insert: {
          ends_at?: string | null
          external_subscription_id?: string | null
          id?: string
          plan_code: string
          started_at?: string
          status?: string
          user_id: string
        }
        Update: {
          ends_at?: string | null
          external_subscription_id?: string | null
          id?: string
          plan_code?: string
          started_at?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_plans_plan_code_fkey"
            columns: ["plan_code"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["code"]
          },
        ]
      }
      user_tips: {
        Row: {
          dismissed: boolean
          helpful: boolean | null
          id: string
          shown_at: string
          tip_id: string
          user_id: string
        }
        Insert: {
          dismissed?: boolean
          helpful?: boolean | null
          id?: string
          shown_at?: string
          tip_id: string
          user_id: string
        }
        Update: {
          dismissed?: boolean
          helpful?: boolean | null
          id?: string
          shown_at?: string
          tip_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_tips_tip_id_fkey"
            columns: ["tip_id"]
            isOneToOne: false
            referencedRelation: "financial_tips"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          created_at: string
          currency: string
          current_balance: number
          icon: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
          user_id: string
          wallet_type: string
        }
        Insert: {
          created_at?: string
          currency?: string
          current_balance?: number
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          user_id: string
          wallet_type?: string
        }
        Update: {
          created_at?: string
          currency?: string
          current_balance?: number
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          user_id?: string
          wallet_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

