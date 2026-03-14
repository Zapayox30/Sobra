-- =============================================
-- MIGRATION 009: Sobra Engine RPC Functions
-- calculate_surplus: compute surplus for a given month
-- generate_surplus_snapshot: save/upsert surplus to history
-- get_consolidated_balance: sum of all accounts + wallets
-- =============================================

-- FUNCTION: get_consolidated_balance
-- Returns the total balance across all active accounts and wallets for the current user.
CREATE OR REPLACE FUNCTION public.get_consolidated_balance()
RETURNS numeric
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT SUM(current_balance) FROM public.accounts
     WHERE user_id = auth.uid() AND is_active = true),
    0
  ) + COALESCE(
    (SELECT SUM(current_balance) FROM public.wallets_manual
     WHERE user_id = auth.uid() AND is_active = true),
    0
  );
$$;

REVOKE ALL ON FUNCTION public.get_consolidated_balance() FROM public;
GRANT EXECUTE ON FUNCTION public.get_consolidated_balance() TO authenticated;

COMMENT ON FUNCTION public.get_consolidated_balance
  IS 'Get total balance across all active accounts and manual wallets';

-- FUNCTION: calculate_surplus
-- Computes the full Sobra breakdown for a given month.
CREATE OR REPLACE FUNCTION public.calculate_surplus(p_month date)
RETURNS TABLE (
  income_total numeric,
  fixed_expenses_total numeric,
  debts_total numeric,
  savings_committed numeric,
  personal_expenses_total numeric,
  card_payments_total numeric,
  commitments_total numeric,
  gross_surplus numeric,
  net_surplus numeric,
  surplus_safe numeric,
  surplus_operative numeric,
  surplus_unavailable numeric,
  consolidated_balance numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_month_start date := date_trunc('month', p_month)::date;
  v_month_end date := (date_trunc('month', p_month) + interval '1 month' - interval '1 day')::date;
  v_income numeric;
  v_fixed numeric;
  v_debts numeric;
  v_savings numeric;
  v_personal numeric;
  v_cards numeric;
  v_commitments numeric;
  v_gross numeric;
  v_net numeric;
  v_balance numeric;
BEGIN
  -- Sum active incomes for the month
  SELECT COALESCE(SUM(i.amount), 0) INTO v_income
  FROM public.incomes i
  WHERE i.user_id = v_uid
    AND i.is_active = true
    AND i.starts_on <= v_month_end
    AND (i.ends_on IS NULL OR i.ends_on >= v_month_start);

  -- Sum active fixed expenses for the month
  SELECT COALESCE(SUM(fe.amount), 0) INTO v_fixed
  FROM public.fixed_expenses fe
  WHERE fe.user_id = v_uid
    AND fe.is_active = true
    AND fe.starts_on <= v_month_end
    AND (fe.ends_on IS NULL OR fe.ends_on >= v_month_start);

  -- Sum active debts monthly payments
  SELECT COALESCE(SUM(d.monthly_payment), 0) INTO v_debts
  FROM public.debts d
  WHERE d.user_id = v_uid
    AND d.is_active = true
    AND d.starts_on <= v_month_end
    AND (d.ends_on IS NULL OR d.ends_on >= v_month_start);

  -- Sum active savings goal contributions
  SELECT COALESCE(SUM(sg.monthly_contribution), 0) INTO v_savings
  FROM public.savings_goals sg
  WHERE sg.user_id = v_uid
    AND sg.is_active = true;

  -- Sum active personal expenses for the month
  SELECT COALESCE(SUM(pe.amount), 0) INTO v_personal
  FROM public.personal_expenses pe
  WHERE pe.user_id = v_uid
    AND pe.is_active = true
    AND pe.starts_on <= v_month_end
    AND (pe.ends_on IS NULL OR pe.ends_on >= v_month_start);

  -- Sum card statement totals due this month
  SELECT COALESCE(SUM(cs.total_due), 0) INTO v_cards
  FROM public.card_statements cs
  JOIN public.credit_cards cc ON cc.id = cs.card_id
  WHERE cs.user_id = v_uid
    AND cc.is_active = true
    AND cs.status != 'paid'
    AND cs.due_date >= v_month_start::text
    AND cs.due_date <= v_month_end::text;

  -- Sum active commitments for the month
  SELECT COALESCE(SUM(mc.amount_per_month), 0) INTO v_commitments
  FROM public.monthly_commitments mc
  WHERE mc.user_id = v_uid
    AND mc.start_month <= v_month_start
    AND mc.end_month >= v_month_start;

  -- Get consolidated balance
  SELECT COALESCE(
    (SELECT SUM(current_balance) FROM public.accounts
     WHERE user_id = v_uid AND is_active = true), 0
  ) + COALESCE(
    (SELECT SUM(current_balance) FROM public.wallets_manual
     WHERE user_id = v_uid AND is_active = true), 0
  ) INTO v_balance;

  -- Calculate surpluses
  v_gross := v_income - v_fixed - v_debts - v_savings - v_commitments - v_cards;
  v_net := v_gross - v_personal;

  -- Return full breakdown
  RETURN QUERY SELECT
    v_income,
    v_fixed,
    v_debts,
    v_savings,
    v_personal,
    v_cards,
    v_commitments,
    v_gross,
    v_net,
    -- Surplus classification (50/30/20 rule)
    CASE WHEN v_net > 0 THEN ROUND(v_net * 0.50, 2) ELSE 0 END,
    CASE WHEN v_net > 0 THEN ROUND(v_net * 0.30, 2) ELSE 0 END,
    CASE WHEN v_net > 0 THEN ROUND(v_net * 0.20, 2) ELSE 0 END,
    v_balance;
END;
$$;

REVOKE ALL ON FUNCTION public.calculate_surplus(date) FROM public;
GRANT EXECUTE ON FUNCTION public.calculate_surplus(date) TO authenticated;

COMMENT ON FUNCTION public.calculate_surplus
  IS 'Calculate full Sobra breakdown for a given month including surplus classification';

-- FUNCTION: generate_surplus_snapshot
-- Calculates and upserts the surplus snapshot for a given month.
CREATE OR REPLACE FUNCTION public.generate_surplus_snapshot(p_month date)
RETURNS public.surplus_history
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result record;
  v_snapshot public.surplus_history;
  v_month_start date := date_trunc('month', p_month)::date;
BEGIN
  -- Calculate surplus
  SELECT * INTO v_result FROM public.calculate_surplus(p_month);

  -- Upsert into surplus_history
  INSERT INTO public.surplus_history (
    user_id, month,
    income_total, fixed_expenses_total, debts_total,
    savings_committed, personal_expenses_total, card_payments_total,
    commitments_total, gross_surplus, net_surplus,
    surplus_safe, surplus_operative, surplus_unavailable,
    consolidated_balance, generated_at
  ) VALUES (
    auth.uid(), v_month_start,
    v_result.income_total, v_result.fixed_expenses_total, v_result.debts_total,
    v_result.savings_committed, v_result.personal_expenses_total, v_result.card_payments_total,
    v_result.commitments_total, v_result.gross_surplus, v_result.net_surplus,
    v_result.surplus_safe, v_result.surplus_operative, v_result.surplus_unavailable,
    v_result.consolidated_balance, now()
  )
  ON CONFLICT (user_id, month) DO UPDATE SET
    income_total = EXCLUDED.income_total,
    fixed_expenses_total = EXCLUDED.fixed_expenses_total,
    debts_total = EXCLUDED.debts_total,
    savings_committed = EXCLUDED.savings_committed,
    personal_expenses_total = EXCLUDED.personal_expenses_total,
    card_payments_total = EXCLUDED.card_payments_total,
    commitments_total = EXCLUDED.commitments_total,
    gross_surplus = EXCLUDED.gross_surplus,
    net_surplus = EXCLUDED.net_surplus,
    surplus_safe = EXCLUDED.surplus_safe,
    surplus_operative = EXCLUDED.surplus_operative,
    surplus_unavailable = EXCLUDED.surplus_unavailable,
    consolidated_balance = EXCLUDED.consolidated_balance,
    generated_at = now()
  RETURNING * INTO v_snapshot;

  RETURN v_snapshot;
END;
$$;

REVOKE ALL ON FUNCTION public.generate_surplus_snapshot(date) FROM public;
GRANT EXECUTE ON FUNCTION public.generate_surplus_snapshot(date) TO authenticated;

COMMENT ON FUNCTION public.generate_surplus_snapshot
  IS 'Calculate and save/update the surplus snapshot for a given month';

-- =============================================
-- END OF MIGRATION 009
-- =============================================
