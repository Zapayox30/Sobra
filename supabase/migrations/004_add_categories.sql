-- =============================================
-- Agregar categorías a gastos fijos
-- =============================================

-- Agregar columna category a fixed_expenses
alter table public.fixed_expenses 
add column if not exists category text default 'otros';

-- Agregar índice para búsquedas por categoría
create index if not exists idx_fixed_expenses_category 
on public.fixed_expenses (category);

comment on column public.fixed_expenses.category is 'Categoría del gasto fijo (alquiler, servicios, internet, etc.)';

-- =============================================
-- Actualizar comentarios de tablas
-- =============================================
comment on table public.fixed_expenses is 'Gastos fijos recurrentes con categorías (alquiler, servicios, suscripciones, etc.)';
comment on table public.personal_expenses is 'Gastos personales variables con categorías (comida, transporte, entretenimiento, etc.)';

