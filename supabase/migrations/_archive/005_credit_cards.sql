-- =============================================
-- SOBRA - Credit Cards & Alerts (consumos y pagos)
-- =============================================

-- Tabla de tarjetas
create table public.credit_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  issuer text,
  credit_limit numeric(12,2),
  cutoff_day int not null check (cutoff_day between 1 and 28),
  due_day int not null check (due_day between 1 and 28),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_credit_cards_user on public.credit_cards (user_id, is_active);

create trigger trg_credit_cards_updated_at
before update on public.credit_cards
for each row execute function public.set_updated_at();

comment on table public.credit_cards is 'Tarjetas de crédito del usuario';

-- Tabla de estados de cuenta (statement) por mes
create table public.card_statements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  card_id uuid not null references public.credit_cards(id) on delete cascade,
  statement_month date not null, -- usar día 1 del mes
  closing_date date not null,
  due_date date not null,
  total_due numeric(12,2) not null check (total_due >= 0),
  minimum_due numeric(12,2) not null default 0 check (minimum_due >= 0),
  status text not null default 'open' check (status in ('open','partial','paid')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (card_id, statement_month)
);

create index idx_card_statements_user_month on public.card_statements (user_id, statement_month desc);
create index idx_card_statements_due_date on public.card_statements (user_id, due_date);

create trigger trg_card_statements_updated_at
before update on public.card_statements
for each row execute function public.set_updated_at();

comment on table public.card_statements is 'Estado mensual de tarjeta: total a pagar y mínimo';

-- Pagos aplicados a una tarjeta/estado
create table public.card_payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  card_id uuid not null references public.credit_cards(id) on delete cascade,
  statement_id uuid references public.card_statements(id) on delete set null,
  amount numeric(12,2) not null check (amount > 0),
  paid_at date not null default current_date,
  method text,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_card_payments_user_date on public.card_payments (user_id, paid_at desc);
create index idx_card_payments_statement on public.card_payments (statement_id);

create trigger trg_card_payments_updated_at
before update on public.card_payments
for each row execute function public.set_updated_at();

comment on table public.card_payments is 'Pagos realizados a una tarjeta o estado específico';

-- (Opcional) Transacciones para trazabilidad de consumos
create table public.card_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  card_id uuid not null references public.credit_cards(id) on delete cascade,
  amount numeric(12,2) not null check (amount > 0),
  description text,
  category text,
  purchased_at date not null default current_date,
  installments_total int default 1 check (installments_total >= 1 and installments_total <= 48),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_card_transactions_user_date on public.card_transactions (user_id, purchased_at desc);
create index idx_card_transactions_card on public.card_transactions (card_id);

create trigger trg_card_transactions_updated_at
before update on public.card_transactions
for each row execute function public.set_updated_at();

comment on table public.card_transactions is 'Consumos en tarjeta (opcional, para seguimiento)';

-- =============================================
-- Row Level Security
-- =============================================
alter table public.credit_cards enable row level security;
alter table public.card_statements enable row level security;
alter table public.card_payments enable row level security;
alter table public.card_transactions enable row level security;

-- Credit cards
create policy "select_own_credit_cards" on public.credit_cards
  for select to authenticated using (user_id = auth.uid());
create policy "insert_own_credit_cards" on public.credit_cards
  for insert to authenticated with check (user_id = auth.uid());
create policy "update_own_credit_cards" on public.credit_cards
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "delete_own_credit_cards" on public.credit_cards
  for delete to authenticated using (user_id = auth.uid());

-- Statements
create policy "select_own_card_statements" on public.card_statements
  for select to authenticated using (user_id = auth.uid());
create policy "insert_own_card_statements" on public.card_statements
  for insert to authenticated with check (user_id = auth.uid());
create policy "update_own_card_statements" on public.card_statements
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "delete_own_card_statements" on public.card_statements
  for delete to authenticated using (user_id = auth.uid());

-- Payments
create policy "select_own_card_payments" on public.card_payments
  for select to authenticated using (user_id = auth.uid());
create policy "insert_own_card_payments" on public.card_payments
  for insert to authenticated with check (user_id = auth.uid());
create policy "update_own_card_payments" on public.card_payments
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "delete_own_card_payments" on public.card_payments
  for delete to authenticated using (user_id = auth.uid());

-- Transactions
create policy "select_own_card_transactions" on public.card_transactions
  for select to authenticated using (user_id = auth.uid());
create policy "insert_own_card_transactions" on public.card_transactions
  for insert to authenticated with check (user_id = auth.uid());
create policy "update_own_card_transactions" on public.card_transactions
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "delete_own_card_transactions" on public.card_transactions
  for delete to authenticated using (user_id = auth.uid());
