-- =============================================
-- MIGRATION 007: SOBRA – New Tables
-- accounts, wallets_manual, debts, savings_goals, surplus_history
-- All changes are ADDITIVE – no existing tables are modified.
-- =============================================

-- TABLE: accounts (bank accounts & connected sources)
CREATE TABLE IF NOT EXISTS public.accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  institution text,
  account_type text NOT NULL DEFAULT 'bank'
    CHECK (account_type IN ('bank','savings','investment','other')),
  currency text NOT NULL DEFAULT 'PEN',
  current_balance numeric(14,2) NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_accounts_user ON public.accounts (user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_user_active ON public.accounts (user_id, is_active);

CREATE TRIGGER trg_accounts_updated_at
  BEFORE UPDATE ON public.accounts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.accounts IS 'Bank accounts and connected financial sources';

-- TABLE: wallets_manual (Yape, Plin, cash, etc.)
CREATE TABLE IF NOT EXISTS public.wallets_manual (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  wallet_type text NOT NULL DEFAULT 'cash'
    CHECK (wallet_type IN ('yape','plin','cash','other')),
  currency text NOT NULL DEFAULT 'PEN',
  current_balance numeric(14,2) NOT NULL DEFAULT 0,
  icon text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wallets_manual_user ON public.wallets_manual (user_id);
CREATE INDEX IF NOT EXISTS idx_wallets_manual_user_active ON public.wallets_manual (user_id, is_active);

CREATE TRIGGER trg_wallets_manual_updated_at
  BEFORE UPDATE ON public.wallets_manual
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.wallets_manual IS 'Manual wallets: Yape, Plin, cash, and other digital wallets';

-- TABLE: debts (loans, credit obligations)
CREATE TABLE IF NOT EXISTS public.debts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label text NOT NULL,
  creditor text,
  original_amount numeric(14,2) NOT NULL CHECK (original_amount > 0),
  remaining_amount numeric(14,2) NOT NULL CHECK (remaining_amount >= 0),
  monthly_payment numeric(12,2) NOT NULL CHECK (monthly_payment >= 0),
  interest_rate numeric(6,4) DEFAULT 0,
  due_day integer CHECK (due_day BETWEEN 1 AND 31),
  starts_on date NOT NULL DEFAULT current_date,
  ends_on date,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_debts_user ON public.debts (user_id);
CREATE INDEX IF NOT EXISTS idx_debts_user_active ON public.debts (user_id, is_active);

CREATE TRIGGER trg_debts_updated_at
  BEFORE UPDATE ON public.debts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.debts IS 'User debts: loans, credit obligations, and recurring payments';

-- TABLE: savings_goals (committed savings targets)
CREATE TABLE IF NOT EXISTS public.savings_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label text NOT NULL,
  target_amount numeric(14,2) NOT NULL CHECK (target_amount > 0),
  current_amount numeric(14,2) NOT NULL DEFAULT 0 CHECK (current_amount >= 0),
  monthly_contribution numeric(12,2) NOT NULL DEFAULT 0,
  target_date date,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_savings_goals_user ON public.savings_goals (user_id);
CREATE INDEX IF NOT EXISTS idx_savings_goals_user_active ON public.savings_goals (user_id, is_active);

CREATE TRIGGER trg_savings_goals_updated_at
  BEFORE UPDATE ON public.savings_goals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.savings_goals IS 'User savings goals with target amounts and monthly contributions';

-- TABLE: surplus_history (monthly Sobra snapshots – engine output)
CREATE TABLE IF NOT EXISTS public.surplus_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month date NOT NULL,
  income_total numeric(14,2) NOT NULL DEFAULT 0,
  fixed_expenses_total numeric(14,2) NOT NULL DEFAULT 0,
  debts_total numeric(14,2) NOT NULL DEFAULT 0,
  savings_committed numeric(14,2) NOT NULL DEFAULT 0,
  personal_expenses_total numeric(14,2) NOT NULL DEFAULT 0,
  card_payments_total numeric(14,2) NOT NULL DEFAULT 0,
  commitments_total numeric(14,2) NOT NULL DEFAULT 0,
  gross_surplus numeric(14,2) NOT NULL DEFAULT 0,
  net_surplus numeric(14,2) NOT NULL DEFAULT 0,
  surplus_safe numeric(14,2) NOT NULL DEFAULT 0,
  surplus_operative numeric(14,2) NOT NULL DEFAULT 0,
  surplus_unavailable numeric(14,2) NOT NULL DEFAULT 0,
  consolidated_balance numeric(14,2),
  generated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, month)
);

CREATE INDEX IF NOT EXISTS idx_surplus_history_user_month
  ON public.surplus_history (user_id, month DESC);

COMMENT ON TABLE public.surplus_history IS 'Monthly surplus snapshots generated by the Sobra Engine';

-- =============================================
-- END OF MIGRATION 007
-- =============================================
