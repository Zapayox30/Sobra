-- =============================================
-- SOBRA - Row Level Security (RLS) Policies
-- =============================================

-- =============================================
-- Enable RLS on all tables
-- =============================================
alter table public.profiles enable row level security;
alter table public.incomes enable row level security;
alter table public.fixed_expenses enable row level security;
alter table public.personal_expenses enable row level security;
alter table public.monthly_commitments enable row level security;
alter table public.monthly_summaries enable row level security;
alter table public.plans enable row level security;
alter table public.user_plans enable row level security;

-- =============================================
-- PROFILES: Users can only access their own profile
-- =============================================
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

-- =============================================
-- INCOMES: Users can only access their own incomes
-- =============================================
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

-- =============================================
-- FIXED_EXPENSES: Users can only access their own expenses
-- =============================================
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

-- =============================================
-- PERSONAL_EXPENSES: Users can only access their own expenses
-- =============================================
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

-- =============================================
-- MONTHLY_COMMITMENTS: Users can only access their own commitments
-- =============================================
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

-- =============================================
-- MONTHLY_SUMMARIES: Users can only access their own summaries
-- =============================================
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

-- =============================================
-- PLANS: All authenticated users can read plans
-- =============================================
create policy "read_plans" on public.plans
for select to authenticated
using (true);

-- =============================================
-- USER_PLANS: Users can only read their own subscription
-- =============================================
create policy "select_own_user_plans" on public.user_plans
for select to authenticated
using (user_id = auth.uid());

-- Note: Insert/update/delete on user_plans should be done via service role
-- (e.g., from Stripe webhooks or admin functions)

