-- =============================================
-- SOBRA — Complete Database Schema v2.0
-- =============================================
-- A single migration that creates the full schema for SOBRA.
-- 19 tables, all with RLS, indexes, triggers, and proper FK relationships.
--
-- TABLE MAP:
--   CORE:        profiles, plans, user_plans
--   INCOME:      incomes
--   EXPENSES:    fixed_expenses, personal_expenses, monthly_commitments
--   ACCOUNTS:    accounts, wallets
--   DEBTS:       debts
--   SAVINGS:     savings_goals
--   CREDIT:      credit_cards, card_statements, card_transactions, card_payments
--   BANKING:     bank_connections, bank_transactions
--   INTELLIGENCE: financial_alerts
--   HISTORY:     surplus_history
-- =============================================

-- =============================================
-- 0. EXTENSIONS & UTILITY FUNCTIONS
-- =============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =============================================
-- 1. DROP ALL EXISTING TABLES (clean slate)
-- Order: dependents first, then parents
-- =============================================

-- Drop triggers on auth.users first (if exists)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop RPC functions
DROP FUNCTION IF EXISTS public.get_month_totals(date);
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.mark_alert_as_read(uuid);
DROP FUNCTION IF EXISTS public.mark_all_alerts_as_read();

-- Drop enum types
DROP TYPE IF EXISTS alert_type CASCADE;
DROP TYPE IF EXISTS alert_severity CASCADE;

-- Drop all tables (CASCADE handles FK dependencies)
DROP TABLE IF EXISTS public.bank_transactions CASCADE;
DROP TABLE IF EXISTS public.bank_connections CASCADE;
DROP TABLE IF EXISTS public.financial_alerts CASCADE;
DROP TABLE IF EXISTS public.surplus_history CASCADE;
DROP TABLE IF EXISTS public.card_payments CASCADE;
DROP TABLE IF EXISTS public.card_transactions CASCADE;
DROP TABLE IF EXISTS public.card_statements CASCADE;
DROP TABLE IF EXISTS public.credit_cards CASCADE;
DROP TABLE IF EXISTS public.savings_goals CASCADE;
DROP TABLE IF EXISTS public.debts CASCADE;
DROP TABLE IF EXISTS public.loans CASCADE;
DROP TABLE IF EXISTS public.wallets CASCADE;
DROP TABLE IF EXISTS public.wallets_manual CASCADE;
DROP TABLE IF EXISTS public.accounts CASCADE;
DROP TABLE IF EXISTS public.monthly_summaries CASCADE;
DROP TABLE IF EXISTS public.monthly_commitments CASCADE;
DROP TABLE IF EXISTS public.personal_expenses CASCADE;
DROP TABLE IF EXISTS public.fixed_expenses CASCADE;
DROP TABLE IF EXISTS public.incomes CASCADE;
DROP TABLE IF EXISTS public.user_plans CASCADE;
DROP TABLE IF EXISTS public.plans CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;


-- =============================================================================
-- =============================================================================
--                         TABLE DEFINITIONS
-- =============================================================================
-- =============================================================================


-- =============================================
-- T1. profiles
-- Extended user profile with financial preferences
-- =============================================
CREATE TABLE public.profiles (
  id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     text,
  currency      text        NOT NULL DEFAULT 'PEN',
  period        text        NOT NULL DEFAULT 'monthly'
                            CHECK (period IN ('monthly','biweekly')),
  country       text        NOT NULL DEFAULT 'PE',
  timezone      text        NOT NULL DEFAULT 'America/Lima',
  photo_url     text,
  onboarding_completed boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.profiles IS 'User profile: identity, currency, country, and preferences';


-- =============================================
-- T2. plans
-- Subscription tiers (free, plus, pro)
-- =============================================
CREATE TABLE public.plans (
  code          text PRIMARY KEY,
  name          text        NOT NULL,
  price_cents   int         NOT NULL DEFAULT 0,
  currency      text        NOT NULL DEFAULT 'PEN',
  interval      text        NOT NULL DEFAULT 'month'
                            CHECK (interval IN ('month','year','lifetime')),
  features      jsonb       NOT NULL DEFAULT '{}'::jsonb,
  is_active     boolean     NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.plans IS 'Subscription plans available in SOBRA';

INSERT INTO public.plans (code, name, price_cents, currency, features) VALUES
  ('free',  'Gratis', 0,    'PEN', '{"history_months":3,"export":false,"bank_connections":0,"advanced_charts":false,"ai_tips":false}'::jsonb),
  ('plus',  'Plus',   1990, 'PEN', '{"history_months":24,"export":true,"bank_connections":3,"advanced_charts":true,"ai_tips":true}'::jsonb),
  ('pro',   'Pro',    4990, 'PEN', '{"history_months":999,"export":true,"bank_connections":10,"advanced_charts":true,"ai_tips":true,"api_access":true}'::jsonb);


-- =============================================
-- T3. user_plans
-- Which plan each user is subscribed to
-- =============================================
CREATE TABLE public.user_plans (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_code                 text        NOT NULL REFERENCES public.plans(code),
  status                    text        NOT NULL DEFAULT 'active'
                                        CHECK (status IN ('active','canceled','past_due','trialing')),
  started_at                timestamptz NOT NULL DEFAULT now(),
  ends_at                   timestamptz,
  external_subscription_id  text,
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_plans_user ON public.user_plans (user_id, status);
CREATE UNIQUE INDEX uniq_active_plan ON public.user_plans (user_id) WHERE status = 'active';

CREATE TRIGGER trg_user_plans_updated_at
  BEFORE UPDATE ON public.user_plans
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.user_plans IS 'User subscription: links user to a plan with status tracking';


-- =============================================
-- T4. incomes
-- All income sources (salary, freelance, passive, etc.)
-- =============================================
CREATE TABLE public.incomes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        text          NOT NULL,
  amount      numeric(14,2) NOT NULL CHECK (amount >= 0),
  income_type text          NOT NULL DEFAULT 'salary'
                            CHECK (income_type IN ('salary','freelance','extra','passive','rental','other')),
  recurrence  text          NOT NULL DEFAULT 'monthly'
                            CHECK (recurrence IN ('monthly','biweekly','weekly','one_off')),
  starts_on   date          NOT NULL DEFAULT CURRENT_DATE,
  ends_on     date,
  is_active   boolean       NOT NULL DEFAULT true,
  notes       text,
  created_at  timestamptz   NOT NULL DEFAULT now(),
  updated_at  timestamptz   NOT NULL DEFAULT now()
);

CREATE INDEX idx_incomes_user ON public.incomes (user_id);
CREATE INDEX idx_incomes_user_active ON public.incomes (user_id, is_active);
CREATE INDEX idx_incomes_date_range ON public.incomes (user_id, starts_on, COALESCE(ends_on, '9999-12-31'::date));

CREATE TRIGGER trg_incomes_updated_at
  BEFORE UPDATE ON public.incomes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.incomes IS 'Income sources: salary, freelance, passive income, etc.';


-- =============================================
-- T5. fixed_expenses
-- Recurring fixed obligations (rent, utilities, subscriptions)
-- =============================================
CREATE TABLE public.fixed_expenses (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        text          NOT NULL,
  amount      numeric(14,2) NOT NULL CHECK (amount >= 0),
  category    text          NOT NULL DEFAULT 'other'
                            CHECK (category IN (
                              'housing','utilities','internet','phone','insurance',
                              'transport','education','health','subscriptions','other'
                            )),
  recurrence  text          NOT NULL DEFAULT 'monthly'
                            CHECK (recurrence IN ('monthly','biweekly','weekly','one_off')),
  due_day     int           CHECK (due_day BETWEEN 1 AND 31),
  starts_on   date          NOT NULL DEFAULT CURRENT_DATE,
  ends_on     date,
  is_active   boolean       NOT NULL DEFAULT true,
  notes       text,
  created_at  timestamptz   NOT NULL DEFAULT now(),
  updated_at  timestamptz   NOT NULL DEFAULT now()
);

CREATE INDEX idx_fixed_expenses_user ON public.fixed_expenses (user_id);
CREATE INDEX idx_fixed_expenses_user_active ON public.fixed_expenses (user_id, is_active);
CREATE INDEX idx_fixed_expenses_category ON public.fixed_expenses (user_id, category);
CREATE INDEX idx_fixed_expenses_date_range ON public.fixed_expenses (user_id, starts_on, COALESCE(ends_on, '9999-12-31'::date));

CREATE TRIGGER trg_fixed_expenses_updated_at
  BEFORE UPDATE ON public.fixed_expenses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.fixed_expenses IS 'Fixed recurring expenses: rent, utilities, subscriptions, insurance';


-- =============================================
-- T6. personal_expenses
-- Variable personal spending budgets by category
-- =============================================
CREATE TABLE public.personal_expenses (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category    text          NOT NULL
                            CHECK (category IN (
                              'food','transport','entertainment','shopping','health',
                              'personal','friends','family','couple','pets','education','other'
                            )),
  name        text,
  amount      numeric(14,2) NOT NULL CHECK (amount >= 0),
  recurrence  text          NOT NULL DEFAULT 'monthly'
                            CHECK (recurrence IN ('monthly','biweekly','weekly','one_off')),
  starts_on   date          NOT NULL DEFAULT CURRENT_DATE,
  ends_on     date,
  is_active   boolean       NOT NULL DEFAULT true,
  notes       text,
  created_at  timestamptz   NOT NULL DEFAULT now(),
  updated_at  timestamptz   NOT NULL DEFAULT now()
);

CREATE INDEX idx_personal_expenses_user ON public.personal_expenses (user_id);
CREATE INDEX idx_personal_expenses_user_active ON public.personal_expenses (user_id, is_active);
CREATE INDEX idx_personal_expenses_category ON public.personal_expenses (user_id, category);

CREATE TRIGGER trg_personal_expenses_updated_at
  BEFORE UPDATE ON public.personal_expenses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.personal_expenses IS 'Personal spending budgets: food, entertainment, friends, family, etc.';


-- =============================================
-- T7. monthly_commitments
-- Time-limited monthly commitments (save $X for N months)
-- =============================================
CREATE TABLE public.monthly_commitments (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name             text          NOT NULL,
  amount_per_month numeric(14,2) NOT NULL CHECK (amount_per_month > 0),
  months_total     int           NOT NULL CHECK (months_total > 0 AND months_total <= 120),
  start_month      date          NOT NULL,
  end_month        date          GENERATED ALWAYS AS
                                 ((start_month + (INTERVAL '1 month' * (months_total - 1)))::date) STORED,
  notes            text,
  created_at       timestamptz   NOT NULL DEFAULT now(),
  updated_at       timestamptz   NOT NULL DEFAULT now()
);

CREATE INDEX idx_commitments_user ON public.monthly_commitments (user_id);
CREATE INDEX idx_commitments_date_range ON public.monthly_commitments (user_id, start_month, end_month);

CREATE TRIGGER trg_commitments_updated_at
  BEFORE UPDATE ON public.monthly_commitments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.monthly_commitments IS 'Time-limited monthly commitments: save X soles for N months';


-- =============================================
-- T8. accounts
-- Bank accounts (manual or connected via Belvo)
-- =============================================
CREATE TABLE public.accounts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            text          NOT NULL,
  institution     text,
  account_type    text          NOT NULL DEFAULT 'checking'
                                CHECK (account_type IN ('checking','savings','investment','cts','other')),
  currency        text          NOT NULL DEFAULT 'PEN',
  current_balance numeric(14,2) NOT NULL DEFAULT 0,
  is_primary      boolean       NOT NULL DEFAULT false,
  is_active       boolean       NOT NULL DEFAULT true,
  color           text,
  icon            text,
  created_at      timestamptz   NOT NULL DEFAULT now(),
  updated_at      timestamptz   NOT NULL DEFAULT now()
);

CREATE INDEX idx_accounts_user ON public.accounts (user_id);
CREATE INDEX idx_accounts_user_active ON public.accounts (user_id, is_active);

CREATE TRIGGER trg_accounts_updated_at
  BEFORE UPDATE ON public.accounts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.accounts IS 'Bank accounts: BCP, Interbank, BBVA, Scotiabank, etc.';


-- =============================================
-- T9. wallets
-- Digital wallets and cash (Yape, Plin, cash, etc.)
-- =============================================
CREATE TABLE public.wallets (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            text          NOT NULL,
  wallet_type     text          NOT NULL DEFAULT 'cash'
                                CHECK (wallet_type IN ('yape','plin','tunki','cash','other')),
  currency        text          NOT NULL DEFAULT 'PEN',
  current_balance numeric(14,2) NOT NULL DEFAULT 0,
  linked_phone    text,
  is_active       boolean       NOT NULL DEFAULT true,
  color           text,
  icon            text,
  created_at      timestamptz   NOT NULL DEFAULT now(),
  updated_at      timestamptz   NOT NULL DEFAULT now()
);

CREATE INDEX idx_wallets_user ON public.wallets (user_id);
CREATE INDEX idx_wallets_user_active ON public.wallets (user_id, is_active);

CREATE TRIGGER trg_wallets_updated_at
  BEFORE UPDATE ON public.wallets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.wallets IS 'Digital wallets: Yape, Plin, Tunki, cash, etc.';


-- =============================================
-- T10. debts
-- Loans and credit obligations
-- =============================================
CREATE TABLE public.debts (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name             text          NOT NULL,
  creditor         text,
  debt_type        text          NOT NULL DEFAULT 'personal'
                                 CHECK (debt_type IN ('personal','bank','credit_card','mortgage','car','education','other')),
  original_amount  numeric(14,2) NOT NULL CHECK (original_amount > 0),
  remaining_amount numeric(14,2) NOT NULL CHECK (remaining_amount >= 0),
  monthly_payment  numeric(14,2) NOT NULL CHECK (monthly_payment >= 0),
  interest_rate    numeric(6,4)  DEFAULT 0,
  currency         text          NOT NULL DEFAULT 'PEN',
  due_day          int           CHECK (due_day BETWEEN 1 AND 31),
  starts_on        date          NOT NULL DEFAULT CURRENT_DATE,
  ends_on          date,
  is_active        boolean       NOT NULL DEFAULT true,
  notes            text,
  created_at       timestamptz   NOT NULL DEFAULT now(),
  updated_at       timestamptz   NOT NULL DEFAULT now()
);

CREATE INDEX idx_debts_user ON public.debts (user_id);
CREATE INDEX idx_debts_user_active ON public.debts (user_id, is_active);

CREATE TRIGGER trg_debts_updated_at
  BEFORE UPDATE ON public.debts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.debts IS 'Debts: personal loans, bank loans, mortgages, car payments, etc.';


-- =============================================
-- T11. savings_goals
-- Savings targets including emergency fund
-- =============================================
CREATE TABLE public.savings_goals (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              uuid          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name                 text          NOT NULL,
  goal_type            text          NOT NULL DEFAULT 'custom'
                                     CHECK (goal_type IN ('emergency_fund','vacation','purchase','education','retirement','custom')),
  target_amount        numeric(14,2) NOT NULL CHECK (target_amount > 0),
  current_amount       numeric(14,2) NOT NULL DEFAULT 0 CHECK (current_amount >= 0),
  monthly_contribution numeric(14,2) NOT NULL DEFAULT 0 CHECK (monthly_contribution >= 0),
  currency             text          NOT NULL DEFAULT 'PEN',
  target_date          date,
  linked_account_id    uuid          REFERENCES public.accounts(id) ON DELETE SET NULL,
  priority             int           NOT NULL DEFAULT 1 CHECK (priority BETWEEN 1 AND 5),
  is_active            boolean       NOT NULL DEFAULT true,
  completed_at         timestamptz,
  notes                text,
  created_at           timestamptz   NOT NULL DEFAULT now(),
  updated_at           timestamptz   NOT NULL DEFAULT now()
);

CREATE INDEX idx_savings_goals_user ON public.savings_goals (user_id);
CREATE INDEX idx_savings_goals_user_active ON public.savings_goals (user_id, is_active);
CREATE INDEX idx_savings_goals_type ON public.savings_goals (user_id, goal_type);

CREATE TRIGGER trg_savings_goals_updated_at
  BEFORE UPDATE ON public.savings_goals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.savings_goals IS 'Savings goals: emergency fund, vacation, purchases, retirement, etc.';


-- =============================================
-- T12. credit_cards
-- Credit card definitions
-- =============================================
CREATE TABLE public.credit_cards (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name         text          NOT NULL,
  issuer       text,
  network      text          CHECK (network IS NULL OR network IN ('visa','mastercard','amex','diners','other')),
  credit_limit numeric(14,2),
  currency     text          NOT NULL DEFAULT 'PEN',
  cutoff_day   int           NOT NULL CHECK (cutoff_day BETWEEN 1 AND 28),
  due_day      int           NOT NULL CHECK (due_day BETWEEN 1 AND 28),
  annual_fee   numeric(10,2) DEFAULT 0,
  is_active    boolean       NOT NULL DEFAULT true,
  color        text,
  created_at   timestamptz   NOT NULL DEFAULT now(),
  updated_at   timestamptz   NOT NULL DEFAULT now()
);

CREATE INDEX idx_credit_cards_user ON public.credit_cards (user_id);
CREATE INDEX idx_credit_cards_user_active ON public.credit_cards (user_id, is_active);

CREATE TRIGGER trg_credit_cards_updated_at
  BEFORE UPDATE ON public.credit_cards
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.credit_cards IS 'Credit cards: Visa, Mastercard, etc. from BCP, Interbank, BBVA, Scotiabank';


-- =============================================
-- T13. card_statements
-- Monthly credit card statements
-- =============================================
CREATE TABLE public.card_statements (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id         uuid          NOT NULL REFERENCES public.credit_cards(id) ON DELETE CASCADE,
  statement_month date          NOT NULL,
  closing_date    date          NOT NULL,
  due_date        date          NOT NULL,
  total_due       numeric(14,2) NOT NULL CHECK (total_due >= 0),
  minimum_due     numeric(14,2) NOT NULL DEFAULT 0 CHECK (minimum_due >= 0),
  status          text          NOT NULL DEFAULT 'open'
                                CHECK (status IN ('open','partial','paid','overdue')),
  created_at      timestamptz   NOT NULL DEFAULT now(),
  updated_at      timestamptz   NOT NULL DEFAULT now(),
  UNIQUE (card_id, statement_month)
);

CREATE INDEX idx_card_statements_user ON public.card_statements (user_id, statement_month DESC);
CREATE INDEX idx_card_statements_due ON public.card_statements (user_id, due_date);
CREATE INDEX idx_card_statements_status ON public.card_statements (user_id, status) WHERE status != 'paid';

CREATE TRIGGER trg_card_statements_updated_at
  BEFORE UPDATE ON public.card_statements
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.card_statements IS 'Monthly credit card statements: total due, minimum due, due date';


-- =============================================
-- T14. card_transactions
-- Individual credit card purchases
-- =============================================
CREATE TABLE public.card_transactions (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            uuid          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id            uuid          NOT NULL REFERENCES public.credit_cards(id) ON DELETE CASCADE,
  amount             numeric(14,2) NOT NULL CHECK (amount > 0),
  description        text,
  category           text,
  merchant           text,
  purchased_at       date          NOT NULL DEFAULT CURRENT_DATE,
  installments_total int           NOT NULL DEFAULT 1 CHECK (installments_total BETWEEN 1 AND 48),
  interest_rate      numeric(6,4)  DEFAULT 0,
  created_at         timestamptz   NOT NULL DEFAULT now(),
  updated_at         timestamptz   NOT NULL DEFAULT now()
);

CREATE INDEX idx_card_transactions_user ON public.card_transactions (user_id, purchased_at DESC);
CREATE INDEX idx_card_transactions_card ON public.card_transactions (card_id, purchased_at DESC);

CREATE TRIGGER trg_card_transactions_updated_at
  BEFORE UPDATE ON public.card_transactions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.card_transactions IS 'Credit card purchases: amount, merchant, installments';


-- =============================================
-- T15. card_payments
-- Payments applied to credit cards
-- =============================================
CREATE TABLE public.card_payments (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id      uuid          NOT NULL REFERENCES public.credit_cards(id) ON DELETE CASCADE,
  statement_id uuid          REFERENCES public.card_statements(id) ON DELETE SET NULL,
  amount       numeric(14,2) NOT NULL CHECK (amount > 0),
  paid_at      date          NOT NULL DEFAULT CURRENT_DATE,
  method       text,
  note         text,
  created_at   timestamptz   NOT NULL DEFAULT now(),
  updated_at   timestamptz   NOT NULL DEFAULT now()
);

CREATE INDEX idx_card_payments_user ON public.card_payments (user_id, paid_at DESC);
CREATE INDEX idx_card_payments_statement ON public.card_payments (statement_id);

CREATE TRIGGER trg_card_payments_updated_at
  BEFORE UPDATE ON public.card_payments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.card_payments IS 'Payments applied to a credit card or specific statement';


-- =============================================
-- T16. bank_connections
-- External bank links via Belvo (BCP, Interbank, BBVA, Scotiabank)
-- =============================================
CREATE TABLE public.bank_connections (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider          text        NOT NULL DEFAULT 'belvo'
                                CHECK (provider IN ('belvo','manual')),
  institution_name  text        NOT NULL,
  institution_code  text,
  external_link_id  text,
  status            text        NOT NULL DEFAULT 'active'
                                CHECK (status IN ('active','expired','error','revoked','pending')),
  last_synced_at    timestamptz,
  sync_frequency    text        NOT NULL DEFAULT 'daily'
                                CHECK (sync_frequency IN ('realtime','daily','weekly','manual')),
  linked_account_id uuid        REFERENCES public.accounts(id) ON DELETE SET NULL,
  metadata          jsonb       DEFAULT '{}'::jsonb,
  error_message     text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_bank_connections_user ON public.bank_connections (user_id);
CREATE INDEX idx_bank_connections_status ON public.bank_connections (user_id, status);
CREATE UNIQUE INDEX uniq_bank_connection ON public.bank_connections (user_id, provider, institution_code)
  WHERE status = 'active';

CREATE TRIGGER trg_bank_connections_updated_at
  BEFORE UPDATE ON public.bank_connections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.bank_connections IS 'External bank connections via Belvo: BCP, Interbank, BBVA, Scotiabank';


-- =============================================
-- T17. bank_transactions
-- Transactions synced from connected banks
-- =============================================
CREATE TABLE public.bank_transactions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  connection_id    uuid          NOT NULL REFERENCES public.bank_connections(id) ON DELETE CASCADE,
  account_id       uuid          REFERENCES public.accounts(id) ON DELETE SET NULL,
  external_id      text,
  description      text          NOT NULL,
  amount           numeric(14,2) NOT NULL,
  currency         text          NOT NULL DEFAULT 'PEN',
  transaction_type text          NOT NULL CHECK (transaction_type IN ('income','expense','transfer')),
  category         text,
  merchant         text,
  transaction_date date          NOT NULL,
  balance_after    numeric(14,2),
  status           text          NOT NULL DEFAULT 'posted'
                                 CHECK (status IN ('pending','posted')),
  is_categorized   boolean       NOT NULL DEFAULT false,
  metadata         jsonb         DEFAULT '{}'::jsonb,
  created_at       timestamptz   NOT NULL DEFAULT now()
);

CREATE INDEX idx_bank_transactions_user ON public.bank_transactions (user_id, transaction_date DESC);
CREATE INDEX idx_bank_transactions_connection ON public.bank_transactions (connection_id, transaction_date DESC);
CREATE INDEX idx_bank_transactions_account ON public.bank_transactions (account_id, transaction_date DESC);
CREATE INDEX idx_bank_transactions_category ON public.bank_transactions (user_id, category);
CREATE UNIQUE INDEX uniq_bank_transaction ON public.bank_transactions (connection_id, external_id)
  WHERE external_id IS NOT NULL;

COMMENT ON TABLE public.bank_transactions IS 'Transactions synced from banks via Belvo: auto-categorized income/expense';


-- =============================================
-- T18. financial_alerts
-- Smart alerts and notifications
-- =============================================
CREATE TABLE public.financial_alerts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  alert_type      text          NOT NULL
                                CHECK (alert_type IN (
                                  'overspending','under_budget','no_activity','achievement',
                                  'budget_warning','goal_progress','debt_reminder','card_due',
                                  'surplus_negative','surplus_milestone','emergency_fund','tip'
                                )),
  severity        text          NOT NULL DEFAULT 'info'
                                CHECK (severity IN ('info','warning','critical','success')),
  title           text          NOT NULL,
  message         text          NOT NULL,
  category        text,
  amount          numeric(14,2),
  percentage      numeric(5,2),
  action_url      text,
  is_read         boolean       NOT NULL DEFAULT false,
  is_dismissed    boolean       NOT NULL DEFAULT false,
  read_at         timestamptz,
  dismissed_at    timestamptz,
  expires_at      timestamptz,
  created_at      timestamptz   NOT NULL DEFAULT now()
);

CREATE INDEX idx_alerts_user ON public.financial_alerts (user_id, created_at DESC);
CREATE INDEX idx_alerts_unread ON public.financial_alerts (user_id, created_at DESC) WHERE is_read = false;
CREATE INDEX idx_alerts_type ON public.financial_alerts (user_id, alert_type);

COMMENT ON TABLE public.financial_alerts IS 'Smart financial alerts: overspending, goals, reminders, tips';


-- =============================================
-- T19. surplus_history
-- Monthly surplus snapshots from the Sobra Engine
-- =============================================
CREATE TABLE public.surplus_history (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month                 date          NOT NULL,
  income_total          numeric(14,2) NOT NULL DEFAULT 0,
  fixed_expenses_total  numeric(14,2) NOT NULL DEFAULT 0,
  debts_total           numeric(14,2) NOT NULL DEFAULT 0,
  savings_committed     numeric(14,2) NOT NULL DEFAULT 0,
  personal_expenses_total numeric(14,2) NOT NULL DEFAULT 0,
  card_payments_total   numeric(14,2) NOT NULL DEFAULT 0,
  commitments_total     numeric(14,2) NOT NULL DEFAULT 0,
  gross_surplus         numeric(14,2) NOT NULL DEFAULT 0,
  net_surplus           numeric(14,2) NOT NULL DEFAULT 0,
  surplus_safe          numeric(14,2) NOT NULL DEFAULT 0,
  surplus_operative     numeric(14,2) NOT NULL DEFAULT 0,
  surplus_unavailable   numeric(14,2) NOT NULL DEFAULT 0,
  consolidated_balance  numeric(14,2),
  daily_suggestion      numeric(14,2),
  remaining_days        int,
  generated_at          timestamptz   NOT NULL DEFAULT now(),
  UNIQUE (user_id, month)
);

CREATE INDEX idx_surplus_history_user ON public.surplus_history (user_id, month DESC);

COMMENT ON TABLE public.surplus_history IS 'Monthly surplus snapshots: the full output of the Sobra Engine';


-- =============================================================================
-- =============================================================================
--                    ROW LEVEL SECURITY (RLS)
-- =============================================================================
-- =============================================================================

-- Enable RLS on ALL tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fixed_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_commitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surplus_history ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS: profiles (id = auth.uid, not user_id)
-- =============================================
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- =============================================
-- RLS: plans (readable by all authenticated)
-- =============================================
CREATE POLICY "plans_select" ON public.plans FOR SELECT TO authenticated USING (true);

-- =============================================
-- RLS: user_plans (read own, mutations via service_role)
-- =============================================
CREATE POLICY "user_plans_select" ON public.user_plans FOR SELECT TO authenticated USING (user_id = auth.uid());

-- =============================================
-- RLS MACRO: owner-only CRUD for user_id tables
-- (Applied to: incomes, fixed_expenses, personal_expenses, monthly_commitments,
--  accounts, wallets, debts, savings_goals, credit_cards, card_statements,
--  card_transactions, card_payments, bank_connections, bank_transactions,
--  financial_alerts, surplus_history)
-- =============================================

-- INCOMES
CREATE POLICY "incomes_select" ON public.incomes FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "incomes_insert" ON public.incomes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "incomes_update" ON public.incomes FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "incomes_delete" ON public.incomes FOR DELETE TO authenticated USING (user_id = auth.uid());

-- FIXED_EXPENSES
CREATE POLICY "fixed_expenses_select" ON public.fixed_expenses FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "fixed_expenses_insert" ON public.fixed_expenses FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "fixed_expenses_update" ON public.fixed_expenses FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "fixed_expenses_delete" ON public.fixed_expenses FOR DELETE TO authenticated USING (user_id = auth.uid());

-- PERSONAL_EXPENSES
CREATE POLICY "personal_expenses_select" ON public.personal_expenses FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "personal_expenses_insert" ON public.personal_expenses FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "personal_expenses_update" ON public.personal_expenses FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "personal_expenses_delete" ON public.personal_expenses FOR DELETE TO authenticated USING (user_id = auth.uid());

-- MONTHLY_COMMITMENTS
CREATE POLICY "commitments_select" ON public.monthly_commitments FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "commitments_insert" ON public.monthly_commitments FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "commitments_update" ON public.monthly_commitments FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "commitments_delete" ON public.monthly_commitments FOR DELETE TO authenticated USING (user_id = auth.uid());

-- ACCOUNTS
CREATE POLICY "accounts_select" ON public.accounts FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "accounts_insert" ON public.accounts FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "accounts_update" ON public.accounts FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "accounts_delete" ON public.accounts FOR DELETE TO authenticated USING (user_id = auth.uid());

-- WALLETS
CREATE POLICY "wallets_select" ON public.wallets FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "wallets_insert" ON public.wallets FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "wallets_update" ON public.wallets FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "wallets_delete" ON public.wallets FOR DELETE TO authenticated USING (user_id = auth.uid());

-- DEBTS
CREATE POLICY "debts_select" ON public.debts FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "debts_insert" ON public.debts FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "debts_update" ON public.debts FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "debts_delete" ON public.debts FOR DELETE TO authenticated USING (user_id = auth.uid());

-- SAVINGS_GOALS
CREATE POLICY "savings_goals_select" ON public.savings_goals FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "savings_goals_insert" ON public.savings_goals FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "savings_goals_update" ON public.savings_goals FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "savings_goals_delete" ON public.savings_goals FOR DELETE TO authenticated USING (user_id = auth.uid());

-- CREDIT_CARDS
CREATE POLICY "credit_cards_select" ON public.credit_cards FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "credit_cards_insert" ON public.credit_cards FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "credit_cards_update" ON public.credit_cards FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "credit_cards_delete" ON public.credit_cards FOR DELETE TO authenticated USING (user_id = auth.uid());

-- CARD_STATEMENTS
CREATE POLICY "card_statements_select" ON public.card_statements FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "card_statements_insert" ON public.card_statements FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "card_statements_update" ON public.card_statements FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "card_statements_delete" ON public.card_statements FOR DELETE TO authenticated USING (user_id = auth.uid());

-- CARD_TRANSACTIONS
CREATE POLICY "card_transactions_select" ON public.card_transactions FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "card_transactions_insert" ON public.card_transactions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "card_transactions_update" ON public.card_transactions FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "card_transactions_delete" ON public.card_transactions FOR DELETE TO authenticated USING (user_id = auth.uid());

-- CARD_PAYMENTS
CREATE POLICY "card_payments_select" ON public.card_payments FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "card_payments_insert" ON public.card_payments FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "card_payments_update" ON public.card_payments FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "card_payments_delete" ON public.card_payments FOR DELETE TO authenticated USING (user_id = auth.uid());

-- BANK_CONNECTIONS
CREATE POLICY "bank_connections_select" ON public.bank_connections FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "bank_connections_insert" ON public.bank_connections FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "bank_connections_update" ON public.bank_connections FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "bank_connections_delete" ON public.bank_connections FOR DELETE TO authenticated USING (user_id = auth.uid());

-- BANK_TRANSACTIONS
CREATE POLICY "bank_transactions_select" ON public.bank_transactions FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "bank_transactions_insert" ON public.bank_transactions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- FINANCIAL_ALERTS
CREATE POLICY "alerts_select" ON public.financial_alerts FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "alerts_insert" ON public.financial_alerts FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "alerts_update" ON public.financial_alerts FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "alerts_delete" ON public.financial_alerts FOR DELETE TO authenticated USING (user_id = auth.uid());

-- SURPLUS_HISTORY
CREATE POLICY "surplus_history_select" ON public.surplus_history FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "surplus_history_insert" ON public.surplus_history FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "surplus_history_update" ON public.surplus_history FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "surplus_history_delete" ON public.surplus_history FOR DELETE TO authenticated USING (user_id = auth.uid());


-- =============================================================================
-- =============================================================================
--                    RPC FUNCTIONS
-- =============================================================================
-- =============================================================================

-- =============================================
-- F1. handle_new_user — Auto-create profile on signup
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, currency, country, period)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'PEN',
    'PE',
    'monthly'
  );

  INSERT INTO public.user_plans (user_id, plan_code, status)
  VALUES (NEW.id, 'free', 'active');

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- =============================================
-- F2. get_month_totals — Aggregated totals for Sobra Engine
-- =============================================
CREATE OR REPLACE FUNCTION public.get_month_totals(p_month date)
RETURNS TABLE (
  income_total numeric,
  fixed_total numeric,
  debts_total numeric,
  savings_total numeric,
  commitments_total numeric,
  personal_total numeric,
  card_due_total numeric
)
LANGUAGE sql SECURITY DEFINER SET search_path = public
AS $$
  WITH period AS (
    SELECT
      date_trunc('month', p_month)::date AS month_start,
      (date_trunc('month', p_month) + INTERVAL '1 month' - INTERVAL '1 day')::date AS month_end
  )
  SELECT
    -- Incomes
    COALESCE((
      SELECT SUM(amount) FROM public.incomes, period
      WHERE user_id = auth.uid()
        AND is_active = true
        AND starts_on <= period.month_end
        AND (ends_on IS NULL OR ends_on >= period.month_start)
    ), 0) AS income_total,

    -- Fixed expenses
    COALESCE((
      SELECT SUM(amount) FROM public.fixed_expenses, period
      WHERE user_id = auth.uid()
        AND is_active = true
        AND starts_on <= period.month_end
        AND (ends_on IS NULL OR ends_on >= period.month_start)
    ), 0) AS fixed_total,

    -- Debts
    COALESCE((
      SELECT SUM(monthly_payment) FROM public.debts, period
      WHERE user_id = auth.uid()
        AND is_active = true
        AND starts_on <= period.month_end
        AND (ends_on IS NULL OR ends_on >= period.month_start)
    ), 0) AS debts_total,

    -- Savings contributions
    COALESCE((
      SELECT SUM(monthly_contribution) FROM public.savings_goals
      WHERE user_id = auth.uid()
        AND is_active = true
    ), 0) AS savings_total,

    -- Monthly commitments
    COALESCE((
      SELECT SUM(amount_per_month) FROM public.monthly_commitments, period
      WHERE user_id = auth.uid()
        AND start_month <= period.month_start
        AND end_month >= period.month_start
    ), 0) AS commitments_total,

    -- Personal expenses
    COALESCE((
      SELECT SUM(amount) FROM public.personal_expenses, period
      WHERE user_id = auth.uid()
        AND is_active = true
        AND starts_on <= period.month_end
        AND (ends_on IS NULL OR ends_on >= period.month_start)
    ), 0) AS personal_total,

    -- Card statements due
    COALESCE((
      SELECT SUM(cs.total_due) FROM public.card_statements cs, period
      WHERE cs.user_id = auth.uid()
        AND cs.statement_month = period.month_start
        AND cs.status != 'paid'
    ), 0) AS card_due_total
$$;

REVOKE ALL ON FUNCTION public.get_month_totals(date) FROM public;
GRANT EXECUTE ON FUNCTION public.get_month_totals(date) TO authenticated;


-- =============================================
-- F3. mark_alert_as_read
-- =============================================
CREATE OR REPLACE FUNCTION public.mark_alert_as_read(p_alert_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE public.financial_alerts
  SET is_read = true, read_at = now()
  WHERE id = p_alert_id AND user_id = auth.uid();
END;
$$;

REVOKE ALL ON FUNCTION public.mark_alert_as_read(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.mark_alert_as_read(uuid) TO authenticated;


-- =============================================
-- F4. mark_all_alerts_as_read
-- =============================================
CREATE OR REPLACE FUNCTION public.mark_all_alerts_as_read()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE public.financial_alerts
  SET is_read = true, read_at = now()
  WHERE user_id = auth.uid() AND is_read = false;
END;
$$;

REVOKE ALL ON FUNCTION public.mark_all_alerts_as_read() FROM public;
GRANT EXECUTE ON FUNCTION public.mark_all_alerts_as_read() TO authenticated;


-- =============================================
-- F5. get_consolidated_balance — Total across all accounts + wallets
-- =============================================
CREATE OR REPLACE FUNCTION public.get_consolidated_balance()
RETURNS numeric LANGUAGE sql SECURITY DEFINER SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT SUM(current_balance) FROM public.accounts WHERE user_id = auth.uid() AND is_active = true), 0
  ) + COALESCE(
    (SELECT SUM(current_balance) FROM public.wallets WHERE user_id = auth.uid() AND is_active = true), 0
  );
$$;

REVOKE ALL ON FUNCTION public.get_consolidated_balance() FROM public;
GRANT EXECUTE ON FUNCTION public.get_consolidated_balance() TO authenticated;


-- =============================================
-- DONE! 🎉
-- 19 tables, 5 RPC functions, full RLS, indexes, triggers
-- =============================================
