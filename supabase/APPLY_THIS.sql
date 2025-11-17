-- =============================================
-- SOBRA - TODAS LAS MIGRACIONES CONSOLIDADAS
-- Aplicar este archivo completo en SQL Editor de Supabase
-- =============================================

-- =============================================
-- MIGRACIÓN 1: INITIAL SCHEMA
-- =============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- TRIGGER FUNCTION: Update updated_at timestamp
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- TABLE: profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  currency text not null default 'USD',
  period text not null default 'monthly' check (period in ('monthly','biweekly')),
  photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

comment on table public.profiles is 'Extended user profile information';

-- TABLE: plans
create table public.plans (
  code text primary key,
  name text not null,
  price_cents int not null default 0,
  currency text not null default 'USD',
  features jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

comment on table public.plans is 'Available subscription plans (Free/Plus)';

-- Seed initial plans
insert into public.plans (code, name, price_cents, currency, features) values
('free', 'Free', 0, 'USD', '{"history_months": 3, "export": false, "advanced_charts": false}'::jsonb),
('plus', 'Plus', 999, 'USD', '{"history_months": 24, "export": true, "advanced_charts": true, "envelopes": true}'::jsonb);

-- TABLE: user_plans
create table public.user_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_code text not null references public.plans(code),
  status text not null check (status in ('active','canceled','past_due','trialing')),
  started_at timestamptz not null default now(),
  ends_at timestamptz,
  external_subscription_id text
);

create index idx_user_plans_user_status on public.user_plans (user_id, status);
create unique index uniq_active_plan_per_user on public.user_plans(user_id) where status = 'active';

comment on table public.user_plans is 'User subscription status';

-- TABLE: incomes
create table public.incomes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null,
  amount numeric(12,2) not null check (amount >= 0),
  kind text not null default 'salary' check (kind in ('salary','extra','other')),
  recurrence text not null default 'monthly' check (recurrence in ('monthly','one_off')),
  starts_on date not null default current_date,
  ends_on date,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_incomes_user on public.incomes (user_id);
create index idx_incomes_user_active on public.incomes (user_id, is_active);
create index idx_incomes_user_range on public.incomes (user_id, starts_on, coalesce(ends_on, date '9999-12-31'));

create trigger trg_incomes_updated_at before update on public.incomes
for each row execute function public.set_updated_at();

comment on table public.incomes is 'User income sources (salary, extra income, etc.)';

-- TABLE: fixed_expenses
create table public.fixed_expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null,
  amount numeric(12,2) not null check (amount >= 0),
  recurrence text not null default 'monthly' check (recurrence in ('monthly','one_off')),
  starts_on date not null default current_date,
  ends_on date,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_fixed_expenses_user on public.fixed_expenses (user_id);
create index idx_fixed_expenses_user_active on public.fixed_expenses (user_id, is_active);
create index idx_fixed_expenses_user_range on public.fixed_expenses (user_id, starts_on, coalesce(ends_on, date '9999-12-31'));

create trigger trg_fixed_expenses_updated_at before update on public.fixed_expenses
for each row execute function public.set_updated_at();

comment on table public.fixed_expenses is 'Fixed monthly expenses (rent, utilities, subscriptions)';

-- TABLE: personal_expenses
create table public.personal_expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null,
  label text,
  amount numeric(12,2) not null check (amount >= 0),
  recurrence text not null default 'monthly' check (recurrence in ('monthly','one_off')),
  starts_on date not null default current_date,
  ends_on date,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_personal_expenses_user on public.personal_expenses (user_id);
create index idx_personal_expenses_user_cat on public.personal_expenses (user_id, category);

create trigger trg_personal_expenses_updated_at before update on public.personal_expenses
for each row execute function public.set_updated_at();

comment on table public.personal_expenses is 'Personal budget categories (friends, family, personal use)';

-- TABLE: monthly_commitments
create table public.monthly_commitments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null,
  amount_per_month numeric(12,2) not null check (amount_per_month > 0),
  months_total int not null check (months_total > 0 and months_total <= 120),
  start_month date not null,
  end_month date generated always as ((start_month + (interval '1 month' * (months_total - 1)))::date) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_monthly_commitments_user_range on public.monthly_commitments (user_id, start_month, end_month);

create trigger trg_monthly_commitments_updated_at before update on public.monthly_commitments
for each row execute function public.set_updated_at();

comment on table public.monthly_commitments is 'Time-limited financial commitments (e.g., save $750 for 4 months)';

-- TABLE: monthly_summaries
create table public.monthly_summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  month date not null,
  income_total numeric(12,2) not null,
  fixed_expenses_total numeric(12,2) not null,
  commitments_total numeric(12,2) not null,
  personal_budget_total numeric(12,2) not null,
  leftover_before_personal numeric(12,2) not null,
  leftover_after_personal numeric(12,2) not null,
  generated_at timestamptz not null default now(),
  unique (user_id, month)
);

create index idx_monthly_summaries_user_month on public.monthly_summaries (user_id, month desc);

comment on table public.monthly_summaries is 'Cached monthly financial summaries';

-- =============================================
-- MIGRACIÓN 2: ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.incomes enable row level security;
alter table public.fixed_expenses enable row level security;
alter table public.personal_expenses enable row level security;
alter table public.monthly_commitments enable row level security;
alter table public.monthly_summaries enable row level security;
alter table public.plans enable row level security;
alter table public.user_plans enable row level security;

-- PROFILES: Users can only access their own profile
create policy "select_own_profile" on public.profiles
for select to authenticated
using (id = auth.uid());

create policy "insert_own_profile" on public.profiles
for insert to authenticated
with check (id = auth.uid());

create policy "update_own_profile" on public.profiles
for update to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- INCOMES: Users can only access their own incomes
create policy "select_own_incomes" on public.incomes
for select to authenticated
using (user_id = auth.uid());

create policy "insert_own_incomes" on public.incomes
for insert to authenticated
with check (user_id = auth.uid());

create policy "update_own_incomes" on public.incomes
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "delete_own_incomes" on public.incomes
for delete to authenticated
using (user_id = auth.uid());

-- FIXED_EXPENSES: Users can only access their own expenses
create policy "select_own_fixed_expenses" on public.fixed_expenses
for select to authenticated
using (user_id = auth.uid());

create policy "insert_own_fixed_expenses" on public.fixed_expenses
for insert to authenticated
with check (user_id = auth.uid());

create policy "update_own_fixed_expenses" on public.fixed_expenses
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "delete_own_fixed_expenses" on public.fixed_expenses
for delete to authenticated
using (user_id = auth.uid());

-- PERSONAL_EXPENSES: Users can only access their own expenses
create policy "select_own_personal_expenses" on public.personal_expenses
for select to authenticated
using (user_id = auth.uid());

create policy "insert_own_personal_expenses" on public.personal_expenses
for insert to authenticated
with check (user_id = auth.uid());

create policy "update_own_personal_expenses" on public.personal_expenses
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "delete_own_personal_expenses" on public.personal_expenses
for delete to authenticated
using (user_id = auth.uid());

-- MONTHLY_COMMITMENTS: Users can only access their own commitments
create policy "select_own_monthly_commitments" on public.monthly_commitments
for select to authenticated
using (user_id = auth.uid());

create policy "insert_own_monthly_commitments" on public.monthly_commitments
for insert to authenticated
with check (user_id = auth.uid());

create policy "update_own_monthly_commitments" on public.monthly_commitments
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "delete_own_monthly_commitments" on public.monthly_commitments
for delete to authenticated
using (user_id = auth.uid());

-- MONTHLY_SUMMARIES: Users can only access their own summaries
create policy "select_own_monthly_summaries" on public.monthly_summaries
for select to authenticated
using (user_id = auth.uid());

create policy "insert_own_monthly_summaries" on public.monthly_summaries
for insert to authenticated
with check (user_id = auth.uid());

create policy "update_own_monthly_summaries" on public.monthly_summaries
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "delete_own_monthly_summaries" on public.monthly_summaries
for delete to authenticated
using (user_id = auth.uid());

-- PLANS: All authenticated users can read plans
create policy "read_plans" on public.plans
for select to authenticated
using (true);

-- USER_PLANS: Users can only read their own subscription
create policy "select_own_user_plans" on public.user_plans
for select to authenticated
using (user_id = auth.uid());

-- =============================================
-- MIGRACIÓN 3: RPC FUNCTIONS
-- =============================================

-- FUNCTION: get_month_totals
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
    select date_trunc('month', p_month)::date as period_start_month,
           (date_trunc('month', p_month) + interval '1 month' - interval '1 day')::date as period_end_month
  )
  select
    coalesce((
      select sum(amount) from public.incomes, period
      where user_id = auth.uid()
        and is_active = true
        and starts_on <= period.period_end_month
        and (ends_on is null or ends_on >= period.period_start_month)
    ), 0) as income_total,
    coalesce((
      select sum(amount) from public.fixed_expenses, period
      where user_id = auth.uid()
        and is_active = true
        and starts_on <= period.period_end_month
        and (ends_on is null or ends_on >= period.period_start_month)
    ), 0) as fixed_total,
    coalesce((
      select sum(amount_per_month) from public.monthly_commitments, period
      where user_id = auth.uid()
        and monthly_commitments.start_month <= period.period_start_month
        and monthly_commitments.end_month >= period.period_start_month
    ), 0) as commitments_total,
    coalesce((
      select sum(amount) from public.personal_expenses, period
      where user_id = auth.uid()
        and is_active = true
        and starts_on <= period.period_end_month
        and (ends_on is null or ends_on >= period.period_start_month)
    ), 0) as personal_total
$$;

revoke all on function public.get_month_totals(date) from public;
grant execute on function public.get_month_totals(date) to authenticated;

comment on function public.get_month_totals is 'Get aggregated financial totals for a specific month';

-- FUNCTION: create_profile_on_signup
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

-- =============================================
-- ¡LISTO! Base de datos configurada
-- =============================================

