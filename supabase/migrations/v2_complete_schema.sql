-- =============================================
-- SOBRA v2 — Complete Database Schema
-- A fresh, scalable, future-proof schema
-- =============================================

-- 0. UTILITY FUNCTION
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 1. PROFILES
-- =============================================
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  currency text NOT NULL DEFAULT 'PEN',
  period text NOT NULL DEFAULT 'monthly' CHECK (period IN ('monthly','biweekly')),
  photo_url text,
  onboarding_completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.profiles IS 'User profile and preferences';

-- =============================================
-- 2. PLANS & SUBSCRIPTIONS
-- =============================================
CREATE TABLE public.plans (
  code text PRIMARY KEY,
  name text NOT NULL,
  price_cents integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  features jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.plans IS 'Available subscription plans';

CREATE TABLE public.user_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_code text NOT NULL REFERENCES public.plans(code),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','canceled','past_due','trialing')),
  started_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz,
  external_subscription_id text,
  UNIQUE (user_id, status)
);

COMMENT ON TABLE public.user_plans IS 'User subscription status';

-- =============================================
-- 3. INCOMES
-- =============================================
CREATE TABLE public.incomes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label text NOT NULL,
  amount numeric(14,2) NOT NULL CHECK (amount >= 0),
  kind text NOT NULL DEFAULT 'salary' CHECK (kind IN ('salary','extra','freelance','passive','other')),
  recurrence text NOT NULL DEFAULT 'monthly' CHECK (recurrence IN ('monthly','biweekly','weekly','one_off')),
  starts_on date NOT NULL DEFAULT current_date,
  ends_on date,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_incomes_user ON public.incomes (user_id);
CREATE INDEX idx_incomes_user_active ON public.incomes (user_id, is_active);

CREATE TRIGGER trg_incomes_updated
  BEFORE UPDATE ON public.incomes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.incomes IS 'User income sources (salary, extra income, freelance, etc.)';

-- =============================================
-- 4. FIXED EXPENSES
-- =============================================
CREATE TABLE public.fixed_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label text NOT NULL,
  amount numeric(14,2) NOT NULL CHECK (amount >= 0),
  category text NOT NULL DEFAULT 'otros' CHECK (category IN ('alquiler','servicios','internet','telefono','seguros','transporte','educacion','salud','suscripciones','otros')),
  recurrence text NOT NULL DEFAULT 'monthly' CHECK (recurrence IN ('monthly','biweekly','weekly','one_off')),
  starts_on date NOT NULL DEFAULT current_date,
  ends_on date,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_fixed_expenses_user ON public.fixed_expenses (user_id);
CREATE INDEX idx_fixed_expenses_user_active ON public.fixed_expenses (user_id, is_active);

CREATE TRIGGER trg_fixed_expenses_updated
  BEFORE UPDATE ON public.fixed_expenses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.fixed_expenses IS 'Recurring fixed expenses (rent, utilities, subscriptions)';

-- =============================================
-- 5. PERSONAL EXPENSES (Variable budgets)
-- =============================================
CREATE TABLE public.personal_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category text NOT NULL CHECK (category IN ('comida','transporte','entretenimiento','salud','ropa','educacion','amigos','pareja','familia','mascotas','otros')),
  label text,
  amount numeric(14,2) NOT NULL CHECK (amount >= 0),
  recurrence text NOT NULL DEFAULT 'monthly' CHECK (recurrence IN ('monthly','biweekly','weekly','one_off')),
  starts_on date NOT NULL DEFAULT current_date,
  ends_on date,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_personal_expenses_user ON public.personal_expenses (user_id);
CREATE INDEX idx_personal_expenses_user_active ON public.personal_expenses (user_id, is_active);

CREATE TRIGGER trg_personal_expenses_updated
  BEFORE UPDATE ON public.personal_expenses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.personal_expenses IS 'Variable personal budgets by category';

-- =============================================
-- 6. MONTHLY COMMITMENTS
-- =============================================
CREATE TABLE public.monthly_commitments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label text NOT NULL,
  amount_per_month numeric(14,2) NOT NULL CHECK (amount_per_month > 0),
  months_total integer NOT NULL CHECK (months_total > 0),
  start_month date NOT NULL,
  end_month date GENERATED ALWAYS AS (start_month + (months_total || ' months')::interval - interval '1 day') STORED,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_commitments_user ON public.monthly_commitments (user_id);

CREATE TRIGGER trg_commitments_updated
  BEFORE UPDATE ON public.monthly_commitments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.monthly_commitments IS 'Time-limited financial commitments (e.g., save $750 for 4 months)';

-- =============================================
-- 7. ACCOUNTS (Bank accounts)
-- =============================================
CREATE TABLE public.accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  institution text,
  account_type text NOT NULL DEFAULT 'bank' CHECK (account_type IN ('bank','savings','investment','other')),
  currency text NOT NULL DEFAULT 'PEN',
  current_balance numeric(14,2) NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_accounts_user ON public.accounts (user_id);
CREATE INDEX idx_accounts_user_active ON public.accounts (user_id, is_active);

CREATE TRIGGER trg_accounts_updated
  BEFORE UPDATE ON public.accounts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.accounts IS 'Bank accounts and connected financial sources';

-- =============================================
-- 8. WALLETS (Yape, Plin, cash, etc.)
-- =============================================
CREATE TABLE public.wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  wallet_type text NOT NULL DEFAULT 'cash' CHECK (wallet_type IN ('yape','plin','cash','other')),
  currency text NOT NULL DEFAULT 'PEN',
  current_balance numeric(14,2) NOT NULL DEFAULT 0,
  icon text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_wallets_user ON public.wallets (user_id);
CREATE INDEX idx_wallets_user_active ON public.wallets (user_id, is_active);

CREATE TRIGGER trg_wallets_updated
  BEFORE UPDATE ON public.wallets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.wallets IS 'Digital wallets and cash: Yape, Plin, etc.';

-- =============================================
-- 9. DEBTS (Loans, credit obligations)
-- =============================================
CREATE TABLE public.debts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label text NOT NULL,
  creditor text,
  original_amount numeric(14,2) NOT NULL CHECK (original_amount > 0),
  remaining_amount numeric(14,2) NOT NULL CHECK (remaining_amount >= 0),
  monthly_payment numeric(14,2) NOT NULL CHECK (monthly_payment >= 0),
  interest_rate numeric(6,4) DEFAULT 0,
  due_day integer CHECK (due_day BETWEEN 1 AND 31),
  starts_on date NOT NULL DEFAULT current_date,
  ends_on date,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_debts_user ON public.debts (user_id);
CREATE INDEX idx_debts_user_active ON public.debts (user_id, is_active);

CREATE TRIGGER trg_debts_updated
  BEFORE UPDATE ON public.debts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.debts IS 'User debts: loans, credit obligations';

-- =============================================
-- 10. SAVINGS GOALS
-- =============================================
CREATE TABLE public.savings_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label text NOT NULL,
  goal_type text NOT NULL DEFAULT 'custom' CHECK (goal_type IN ('emergency_fund','investment','travel','purchase','education','retirement','custom')),
  target_amount numeric(14,2) NOT NULL CHECK (target_amount > 0),
  current_amount numeric(14,2) NOT NULL DEFAULT 0 CHECK (current_amount >= 0),
  monthly_contribution numeric(14,2) NOT NULL DEFAULT 0,
  target_date date,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_savings_goals_user ON public.savings_goals (user_id);
CREATE INDEX idx_savings_goals_user_active ON public.savings_goals (user_id, is_active);

CREATE TRIGGER trg_savings_goals_updated
  BEFORE UPDATE ON public.savings_goals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.savings_goals IS 'Savings goals with emergency fund support';

-- =============================================
-- 11. CREDIT CARDS
-- =============================================
CREATE TABLE public.credit_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  issuer text,
  credit_limit numeric(14,2) DEFAULT 0,
  cutoff_day integer NOT NULL CHECK (cutoff_day BETWEEN 1 AND 28),
  due_day integer NOT NULL CHECK (due_day BETWEEN 1 AND 28),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_credit_cards_user ON public.credit_cards (user_id);

CREATE TRIGGER trg_credit_cards_updated
  BEFORE UPDATE ON public.credit_cards
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.credit_cards IS 'User credit cards';

-- =============================================
-- 12. CARD STATEMENTS
-- =============================================
CREATE TABLE public.card_statements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id uuid NOT NULL REFERENCES public.credit_cards(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  statement_month date NOT NULL,
  closing_date date,
  due_date date,
  total_due numeric(14,2) NOT NULL DEFAULT 0,
  minimum_due numeric(14,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','partial','paid')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (card_id, statement_month)
);

CREATE INDEX idx_card_statements_user ON public.card_statements (user_id);
CREATE INDEX idx_card_statements_card ON public.card_statements (card_id);
CREATE INDEX idx_card_statements_due ON public.card_statements (due_date);

CREATE TRIGGER trg_card_statements_updated
  BEFORE UPDATE ON public.card_statements
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.card_statements IS 'Monthly credit card statements';

-- =============================================
-- 13. CARD TRANSACTIONS
-- =============================================
CREATE TABLE public.card_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id uuid NOT NULL REFERENCES public.credit_cards(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount numeric(14,2) NOT NULL CHECK (amount > 0),
  description text,
  category text,
  purchased_at date NOT NULL DEFAULT current_date,
  installments_total integer NOT NULL DEFAULT 1 CHECK (installments_total BETWEEN 1 AND 48),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_card_transactions_user ON public.card_transactions (user_id);
CREATE INDEX idx_card_transactions_card ON public.card_transactions (card_id);

COMMENT ON TABLE public.card_transactions IS 'Credit card purchases and transactions';

-- =============================================
-- 14. CARD PAYMENTS
-- =============================================
CREATE TABLE public.card_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id uuid NOT NULL REFERENCES public.credit_cards(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  statement_id uuid REFERENCES public.card_statements(id) ON DELETE SET NULL,
  amount numeric(14,2) NOT NULL CHECK (amount > 0),
  paid_at date NOT NULL DEFAULT current_date,
  method text,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_card_payments_user ON public.card_payments (user_id);
CREATE INDEX idx_card_payments_card ON public.card_payments (card_id);

COMMENT ON TABLE public.card_payments IS 'Payments made to credit cards';

-- =============================================
-- 15. SURPLUS HISTORY
-- =============================================
CREATE TABLE public.surplus_history (
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
  daily_suggestion numeric(14,2),
  generated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, month)
);

CREATE INDEX idx_surplus_history_user ON public.surplus_history (user_id);
CREATE INDEX idx_surplus_history_month ON public.surplus_history (user_id, month);

COMMENT ON TABLE public.surplus_history IS 'Monthly surplus snapshots for trend analysis';

-- =============================================
-- 16. FINANCIAL TIPS (Advice engine)
-- =============================================
CREATE TABLE public.financial_tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tip_key text NOT NULL UNIQUE,
  category text NOT NULL CHECK (category IN ('savings','investment','debt','spending','emergency','general')),
  title_es text NOT NULL,
  title_en text NOT NULL,
  body_es text NOT NULL,
  body_en text NOT NULL,
  priority integer NOT NULL DEFAULT 5 CHECK (priority BETWEEN 1 AND 10),
  condition_rule jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.financial_tips IS 'Financial education tips and advice content';

-- =============================================
-- 17. USER TIP HISTORY (Track which tips shown)
-- =============================================
CREATE TABLE public.user_tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tip_id uuid NOT NULL REFERENCES public.financial_tips(id) ON DELETE CASCADE,
  shown_at timestamptz NOT NULL DEFAULT now(),
  dismissed boolean NOT NULL DEFAULT false,
  helpful boolean,
  UNIQUE (user_id, tip_id)
);

CREATE INDEX idx_user_tips_user ON public.user_tips (user_id);

COMMENT ON TABLE public.user_tips IS 'Tracks which tips have been shown to each user';

-- =============================================
-- 18. FINANCIAL ALERTS
-- =============================================
CREATE TABLE public.financial_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  alert_type text NOT NULL CHECK (alert_type IN ('overspending','low_balance','debt_due','goal_reached','surplus_negative','card_due','emergency_fund_low','savings_milestone')),
  severity text NOT NULL DEFAULT 'info' CHECK (severity IN ('info','warning','critical','success')),
  title text NOT NULL,
  message text NOT NULL,
  metadata jsonb DEFAULT '{}',
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_financial_alerts_user ON public.financial_alerts (user_id);
CREATE INDEX idx_financial_alerts_unread ON public.financial_alerts (user_id, is_read) WHERE NOT is_read;

COMMENT ON TABLE public.financial_alerts IS 'Automated financial alerts and notifications';

-- =============================================
-- 19. BANK CONNECTIONS (Future: Belvo integration)
-- =============================================
CREATE TABLE public.bank_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider text NOT NULL DEFAULT 'belvo' CHECK (provider IN ('belvo','manual')),
  institution_name text NOT NULL,
  institution_code text,
  external_link_id text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','expired','error','pending')),
  last_synced_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_bank_connections_user ON public.bank_connections (user_id);

CREATE TRIGGER trg_bank_connections_updated
  BEFORE UPDATE ON public.bank_connections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.bank_connections IS 'External bank connections via Belvo or manual entry';

-- =============================================
-- RLS: Enable on ALL tables
-- =============================================
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
ALTER TABLE public.surplus_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_connections ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES: profiles
-- =============================================
CREATE POLICY profiles_select ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY profiles_insert ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY profiles_update ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- =============================================
-- RLS POLICIES: plans (public read)
-- =============================================
CREATE POLICY plans_select ON public.plans FOR SELECT USING (true);

-- =============================================
-- RLS POLICIES: user_plans
-- =============================================
CREATE POLICY user_plans_select ON public.user_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY user_plans_insert ON public.user_plans FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- RLS POLICIES: owner-based tables
-- =============================================
DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'incomes','fixed_expenses','personal_expenses','monthly_commitments',
    'accounts','wallets','debts','savings_goals',
    'credit_cards','card_statements','card_transactions','card_payments',
    'surplus_history','user_tips','financial_alerts','bank_connections'
  ])
  LOOP
    EXECUTE format('CREATE POLICY %I_sel ON public.%I FOR SELECT USING (auth.uid() = user_id)', tbl, tbl);
    EXECUTE format('CREATE POLICY %I_ins ON public.%I FOR INSERT WITH CHECK (auth.uid() = user_id)', tbl, tbl);
    EXECUTE format('CREATE POLICY %I_upd ON public.%I FOR UPDATE USING (auth.uid() = user_id)', tbl, tbl);
    EXECUTE format('CREATE POLICY %I_del ON public.%I FOR DELETE USING (auth.uid() = user_id)', tbl, tbl);
  END LOOP;
END;
$$;

-- =============================================
-- RLS POLICIES: financial_tips (public read)
-- =============================================
CREATE POLICY tips_select ON public.financial_tips FOR SELECT USING (true);

-- =============================================
-- SEED: Plans
-- =============================================
INSERT INTO public.plans (code, name, price_cents, currency, features) VALUES
  ('free', 'Gratis', 0, 'USD', '{"history_months": 6, "max_accounts": 2, "max_cards": 2, "bank_connections": false, "export": false}'),
  ('plus', 'Plus', 900, 'USD', '{"history_months": 24, "max_accounts": 10, "max_cards": 10, "bank_connections": true, "export": true, "advanced_charts": true, "priority_support": true}')
ON CONFLICT (code) DO NOTHING;

-- =============================================
-- SEED: Financial Tips
-- =============================================
INSERT INTO public.financial_tips (tip_key, category, title_es, title_en, body_es, body_en, priority, condition_rule) VALUES
  ('emergency_fund_start', 'emergency', 'Empieza tu fondo de emergencia', 'Start your emergency fund', 'Lo ideal es tener entre 3 y 6 meses de gastos fijos ahorrados. Empieza con una meta pequena y ve subiendo.', 'Ideally save 3-6 months of fixed expenses. Start small and build up.', 10, '{"no_emergency_fund": true}'),
  ('debt_high_interest', 'debt', 'Prioriza deudas con alta tasa', 'Prioritize high-interest debt', 'Si tienes deudas con mas del 30% de interes anual, prioriza pagarlas antes de invertir.', 'If you have debts above 30% annual interest, prioritize paying them before investing.', 9, '{"has_high_interest_debt": true}'),
  ('surplus_invest', 'investment', 'Tu sobra puede crecer', 'Your surplus can grow', 'Si llevas 3 meses con sobra positiva, considera invertir el 50% en un deposito a plazo o fondo mutuo.', 'If you have had positive surplus for 3 months, consider investing 50% in a term deposit or mutual fund.', 8, '{"consecutive_positive_months": 3}'),
  ('daily_budget', 'spending', 'Controla tu gasto diario', 'Control your daily spending', 'Divide tu sobra entre los dias restantes del mes. Ese es tu presupuesto diario maximo.', 'Divide your surplus by remaining days in the month. That is your maximum daily budget.', 7, null),
  ('fifty_thirty_twenty', 'general', 'La regla 50/30/20', 'The 50/30/20 rule', '50% para necesidades, 30% para gustos, 20% para ahorro e inversion. Usa SOBRA para verificar si la cumples.', '50% for needs, 30% for wants, 20% for savings and investments. Use SOBRA to check if you follow it.', 6, null),
  ('card_full_payment', 'debt', 'Paga el total de tu tarjeta', 'Pay your card in full', 'Siempre intenta pagar el monto total de tu tarjeta, no el minimo. El minimo genera intereses que se acumulan rapidamente.', 'Always try to pay the full amount on your card, not the minimum. Minimum payments generate rapidly accumulating interest.', 8, '{"has_credit_cards": true}'),
  ('automate_savings', 'savings', 'Automatiza tus ahorros', 'Automate your savings', 'Configura una transferencia automatica el dia que cobras. Asi ahorras antes de gastar.', 'Set up an automatic transfer on payday. This way you save before you spend.', 7, null),
  ('review_subscriptions', 'spending', 'Revisa tus suscripciones', 'Review your subscriptions', 'Revisa tus gastos fijos cada 3 meses. Muchas veces pagamos suscripciones que ya no usamos.', 'Review your fixed expenses every 3 months. We often pay for subscriptions we no longer use.', 5, null)
ON CONFLICT (tip_key) DO NOTHING;

-- =============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  INSERT INTO public.user_plans (user_id, plan_code, status)
  VALUES (NEW.id, 'free', 'active');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
