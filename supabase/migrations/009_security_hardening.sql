-- =============================================
-- 009: Security Hardening
-- Fixes critical security issues found in audit
-- =============================================

-- P0 CRITICAL: Remove INSERT policy on user_plans.
-- Users must NOT be able to self-upgrade their plan.
-- Plans should only be managed by the trigger (handle_new_user)
-- or by an admin/server-side function.
DROP POLICY IF EXISTS user_plans_insert ON public.user_plans;

-- P0 CRITICAL: Add SET search_path to SECURITY DEFINER function
-- Prevents search_path injection attacks
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  INSERT INTO public.user_plans (user_id, plan_code, status)
  VALUES (NEW.id, 'free', 'active');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- P1 HIGH: Add WITH CHECK to UPDATE policies for all owner-based tables
-- Without WITH CHECK, a user could theoretically update user_id to another user's ID
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
    -- Drop existing UPDATE policy and recreate with WITH CHECK
    EXECUTE format('DROP POLICY IF EXISTS %I_upd ON public.%I', tbl, tbl);
    EXECUTE format(
      'CREATE POLICY %I_upd ON public.%I FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)',
      tbl, tbl
    );
  END LOOP;
END;
$$;
