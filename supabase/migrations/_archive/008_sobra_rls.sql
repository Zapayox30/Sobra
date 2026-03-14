-- =============================================
-- MIGRATION 008: RLS for New Sobra Tables
-- Each user can only access their own data.
-- =============================================

-- ========================
-- ACCOUNTS
-- ========================
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_accounts" ON public.accounts
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "insert_own_accounts" ON public.accounts
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "update_own_accounts" ON public.accounts
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "delete_own_accounts" ON public.accounts
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- ========================
-- WALLETS_MANUAL
-- ========================
ALTER TABLE public.wallets_manual ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_wallets" ON public.wallets_manual
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "insert_own_wallets" ON public.wallets_manual
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "update_own_wallets" ON public.wallets_manual
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "delete_own_wallets" ON public.wallets_manual
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- ========================
-- DEBTS
-- ========================
ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_debts" ON public.debts
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "insert_own_debts" ON public.debts
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "update_own_debts" ON public.debts
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "delete_own_debts" ON public.debts
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- ========================
-- SAVINGS_GOALS
-- ========================
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_savings_goals" ON public.savings_goals
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "insert_own_savings_goals" ON public.savings_goals
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "update_own_savings_goals" ON public.savings_goals
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "delete_own_savings_goals" ON public.savings_goals
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- ========================
-- SURPLUS_HISTORY
-- ========================
ALTER TABLE public.surplus_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_surplus_history" ON public.surplus_history
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "insert_own_surplus_history" ON public.surplus_history
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "update_own_surplus_history" ON public.surplus_history
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "delete_own_surplus_history" ON public.surplus_history
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- =============================================
-- END OF MIGRATION 008
-- =============================================
