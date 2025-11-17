-- =============================================
-- SOBRA - RPC Functions
-- =============================================

-- =============================================
-- FUNCTION: get_month_totals
-- Returns aggregated totals for a specific month
-- =============================================
create or replace function public.get_month_totals(p_month date)
returns table (
  income_total numeric,
  fixed_total numeric,
  commitments_total numeric,
  personal_total numeric
)
language sql
security definer
set search_path = public
as $$
  with period as (
    select date_trunc('month', p_month)::date as start_month,
           (date_trunc('month', p_month) + interval '1 month' - interval '1 day')::date as end_month
  )
  select
    coalesce((
      select sum(amount) from public.incomes, period
      where user_id = auth.uid()
        and is_active = true
        and starts_on <= period.end_month
        and (ends_on is null or ends_on >= period.start_month)
    ), 0) as income_total,
    coalesce((
      select sum(amount) from public.fixed_expenses, period
      where user_id = auth.uid()
        and is_active = true
        and starts_on <= period.end_month
        and (ends_on is null or ends_on >= period.start_month)
    ), 0) as fixed_total,
    coalesce((
      select sum(amount_per_month) from public.monthly_commitments, period
      where user_id = auth.uid()
        and start_month <= period.start_month
        and end_month >= period.start_month
    ), 0) as commitments_total,
    coalesce((
      select sum(amount) from public.personal_expenses, period
      where user_id = auth.uid()
        and is_active = true
        and starts_on <= period.end_month
        and (ends_on is null or ends_on >= period.start_month)
    ), 0) as personal_total
$$;

revoke all on function public.get_month_totals(date) from public;
grant execute on function public.get_month_totals(date) to authenticated;

comment on function public.get_month_totals is 'Get aggregated financial totals for a specific month';

-- =============================================
-- FUNCTION: create_profile_on_signup
-- Automatically create a profile when a user signs up
-- =============================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, currency, period)
  values (new.id, new.raw_user_meta_data->>'full_name', 'USD', 'monthly');
  
  -- Assign free plan by default
  insert into public.user_plans (user_id, plan_code, status)
  values (new.id, 'free', 'active');
  
  return new;
end;
$$;

-- Trigger to create profile on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

comment on function public.handle_new_user is 'Automatically creates profile and assigns free plan on user signup';

