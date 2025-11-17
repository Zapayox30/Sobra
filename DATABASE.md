# Esquema de Base de Datos - SOBRA

## Diagrama Entidad-Relación

```
┌─────────────────┐
│  auth.users     │ (Supabase Auth)
│  - id (PK)      │
│  - email        │
│  - created_at   │
└────────┬────────┘
         │ 1:1
         ↓
┌─────────────────┐
│   profiles      │
│  - id (PK, FK)  │
│  - full_name    │
│  - currency     │
│  - period       │
│  - photo_url    │
└────────┬────────┘
         │ 1:1
         ↓
┌─────────────────┐      ┌──────────────┐
│  user_plans     │ N:1  │    plans     │
│  - id (PK)      │─────→│  - code (PK) │
│  - user_id (FK) │      │  - name      │
│  - plan_code    │      │  - price     │
│  - status       │      │  - features  │
└────────┬────────┘      └──────────────┘
         │
         │ 1:N
    ┌────┴────────────────────────────┐
    ↓                ↓                 ↓
┌──────────┐  ┌──────────────┐  ┌────────────────┐
│ incomes  │  │fixed_expenses│  │personal_expenses│
└──────────┘  └──────────────┘  └────────────────┘
    ↓                ↓                 ↓
┌──────────────────┐  ┌──────────────────────┐
│monthly_commitments│  │monthly_summaries     │
└──────────────────┘  └──────────────────────┘
```

## Tablas Detalladas

### 1. profiles

Perfil extendido del usuario (1:1 con `auth.users`)

| Columna      | Tipo         | Constraints                    | Descripción                      |
|--------------|--------------|--------------------------------|----------------------------------|
| id           | uuid         | PK, FK → auth.users            | ID del usuario                   |
| full_name    | text         | nullable                       | Nombre completo                  |
| currency     | text         | NOT NULL, default 'USD'        | Moneda preferida                 |
| period       | text         | NOT NULL, default 'monthly'    | Período: monthly/biweekly        |
| photo_url    | text         | nullable                       | URL de foto de perfil            |
| created_at   | timestamptz  | NOT NULL, default now()        | Fecha de creación                |
| updated_at   | timestamptz  | NOT NULL, default now()        | Última actualización             |

**Índices:**
- PK en `id`

**RLS:**
- SELECT: `id = auth.uid()`
- INSERT: `id = auth.uid()`
- UPDATE: `id = auth.uid()`

---

### 2. plans

Catálogo de planes disponibles (Free/Plus)

| Columna      | Tipo         | Constraints                    | Descripción                      |
|--------------|--------------|--------------------------------|----------------------------------|
| code         | text         | PK                             | Código único: 'free', 'plus'     |
| name         | text         | NOT NULL                       | Nombre del plan                  |
| price_cents  | int          | NOT NULL, default 0            | Precio en centavos               |
| currency     | text         | NOT NULL, default 'USD'        | Moneda del precio                |
| features     | jsonb        | NOT NULL, default '{}'         | Features del plan                |
| created_at   | timestamptz  | NOT NULL, default now()        | Fecha de creación                |

**Seed data:**
```sql
('free', 'Free', 0, 'USD', '{"history_months": 3}')
('plus', 'Plus', 999, 'USD', '{"history_months": 24, "export": true}')
```

**RLS:**
- SELECT: todos los autenticados

---

### 3. user_plans

Suscripciones de usuarios

| Columna                  | Tipo         | Constraints                           | Descripción                    |
|--------------------------|--------------|---------------------------------------|--------------------------------|
| id                       | uuid         | PK, default gen_random_uuid()         | ID único                       |
| user_id                  | uuid         | NOT NULL, FK → auth.users             | Usuario                        |
| plan_code                | text         | NOT NULL, FK → plans                  | Plan asignado                  |
| status                   | text         | NOT NULL, check(...)                  | active/canceled/past_due       |
| started_at               | timestamptz  | NOT NULL, default now()               | Inicio de suscripción          |
| ends_at                  | timestamptz  | nullable                              | Fin de suscripción             |
| external_subscription_id | text         | nullable                              | ID de Stripe/otro              |

**Índices:**
- `(user_id, status)`
- UNIQUE `(user_id)` WHERE `status = 'active'`

**RLS:**
- SELECT: `user_id = auth.uid()`

---

### 4. incomes

Fuentes de ingreso del usuario

| Columna      | Tipo         | Constraints                           | Descripción                    |
|--------------|--------------|---------------------------------------|--------------------------------|
| id           | uuid         | PK, default gen_random_uuid()         | ID único                       |
| user_id      | uuid         | NOT NULL, FK → auth.users             | Usuario propietario            |
| label        | text         | NOT NULL                              | Etiqueta descriptiva           |
| amount       | numeric(12,2)| NOT NULL, check(amount >= 0)          | Monto                          |
| kind         | text         | NOT NULL, default 'salary'            | salary/extra/other             |
| recurrence   | text         | NOT NULL, default 'monthly'           | monthly/one_off                |
| starts_on    | date         | NOT NULL, default current_date        | Fecha de inicio                |
| ends_on      | date         | nullable                              | Fecha de fin                   |
| is_active    | boolean      | NOT NULL, default true                | Si está activo                 |
| created_at   | timestamptz  | NOT NULL, default now()               | Fecha de creación              |
| updated_at   | timestamptz  | NOT NULL, default now()               | Última actualización           |

**Índices:**
- `(user_id)`
- `(user_id, is_active)`
- `(user_id, starts_on, coalesce(ends_on, '9999-12-31'))`

**RLS:**
- SELECT/INSERT/UPDATE/DELETE: `user_id = auth.uid()`

---

### 5. fixed_expenses

Gastos fijos mensuales (alquiler, servicios, etc.)

| Columna      | Tipo         | Constraints                           | Descripción                    |
|--------------|--------------|---------------------------------------|--------------------------------|
| id           | uuid         | PK, default gen_random_uuid()         | ID único                       |
| user_id      | uuid         | NOT NULL, FK → auth.users             | Usuario propietario            |
| label        | text         | NOT NULL                              | Etiqueta descriptiva           |
| amount       | numeric(12,2)| NOT NULL, check(amount >= 0)          | Monto                          |
| recurrence   | text         | NOT NULL, default 'monthly'           | monthly/one_off                |
| starts_on    | date         | NOT NULL, default current_date        | Fecha de inicio                |
| ends_on      | date         | nullable                              | Fecha de fin                   |
| is_active    | boolean      | NOT NULL, default true                | Si está activo                 |
| created_at   | timestamptz  | NOT NULL, default now()               | Fecha de creación              |
| updated_at   | timestamptz  | NOT NULL, default now()               | Última actualización           |

**Índices:** (igual que incomes)

**RLS:** (igual que incomes)

---

### 6. personal_expenses

Presupuestos personales por categoría

| Columna      | Tipo         | Constraints                           | Descripción                    |
|--------------|--------------|---------------------------------------|--------------------------------|
| id           | uuid         | PK, default gen_random_uuid()         | ID único                       |
| user_id      | uuid         | NOT NULL, FK → auth.users             | Usuario propietario            |
| category     | text         | NOT NULL                              | personal/amigos/pareja/familia |
| label        | text         | nullable                              | Etiqueta opcional              |
| amount       | numeric(12,2)| NOT NULL, check(amount >= 0)          | Monto                          |
| recurrence   | text         | NOT NULL, default 'monthly'           | monthly/one_off                |
| starts_on    | date         | NOT NULL, default current_date        | Fecha de inicio                |
| ends_on      | date         | nullable                              | Fecha de fin                   |
| is_active    | boolean      | NOT NULL, default true                | Si está activo                 |
| created_at   | timestamptz  | NOT NULL, default now()               | Fecha de creación              |
| updated_at   | timestamptz  | NOT NULL, default now()               | Última actualización           |

**Índices:**
- `(user_id)`
- `(user_id, category)`

**RLS:** (igual que incomes)

---

### 7. monthly_commitments

Compromisos financieros con duración limitada

| Columna          | Tipo         | Constraints                           | Descripción                    |
|------------------|--------------|---------------------------------------|--------------------------------|
| id               | uuid         | PK, default gen_random_uuid()         | ID único                       |
| user_id          | uuid         | NOT NULL, FK → auth.users             | Usuario propietario            |
| label            | text         | NOT NULL                              | Etiqueta descriptiva           |
| amount_per_month | numeric(12,2)| NOT NULL, check(> 0)                  | Monto mensual                  |
| months_total     | int          | NOT NULL, check(1..120)               | Duración en meses              |
| start_month      | date         | NOT NULL                              | Mes de inicio                  |
| end_month        | date         | GENERATED ALWAYS AS (computed)        | Mes de fin (calculado)         |
| created_at       | timestamptz  | NOT NULL, default now()               | Fecha de creación              |
| updated_at       | timestamptz  | NOT NULL, default now()               | Última actualización           |

**Columna computed:**
```sql
end_month = (start_month + interval '1 month' * (months_total - 1))::date
```

**Índices:**
- `(user_id, start_month, end_month)`

**RLS:** (igual que incomes)

---

### 8. monthly_summaries

Resúmenes mensuales precalculados (caché)

| Columna                    | Tipo         | Constraints                           | Descripción                    |
|----------------------------|--------------|---------------------------------------|--------------------------------|
| id                         | uuid         | PK, default gen_random_uuid()         | ID único                       |
| user_id                    | uuid         | NOT NULL, FK → auth.users             | Usuario propietario            |
| month                      | date         | NOT NULL                              | Mes (primer día)               |
| income_total               | numeric(12,2)| NOT NULL                              | Total ingresos                 |
| fixed_expenses_total       | numeric(12,2)| NOT NULL                              | Total gastos fijos             |
| commitments_total          | numeric(12,2)| NOT NULL                              | Total compromisos              |
| personal_budget_total      | numeric(12,2)| NOT NULL                              | Total presupuestos             |
| leftover_before_personal   | numeric(12,2)| NOT NULL                              | Sobrante antes de personales   |
| leftover_after_personal    | numeric(12,2)| NOT NULL                              | Sobrante final (SOBRA)         |
| generated_at               | timestamptz  | NOT NULL, default now()               | Fecha de generación            |

**Constraints:**
- UNIQUE `(user_id, month)`

**Índices:**
- `(user_id, month DESC)`

**RLS:** (igual que incomes)

---

## Funciones y Triggers

### Trigger: set_updated_at()

Actualiza automáticamente `updated_at` en todas las tablas:

```sql
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

Aplicado a: `profiles`, `incomes`, `fixed_expenses`, `personal_expenses`, `monthly_commitments`

### Trigger: handle_new_user()

Crea perfil y asigna plan Free automáticamente al registrarse:

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name) 
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  
  INSERT INTO user_plans (user_id, plan_code, status)
  VALUES (NEW.id, 'free', 'active');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### RPC: get_month_totals(date)

Retorna totales agregados de un mes específico:

```sql
CREATE FUNCTION get_month_totals(p_month date)
RETURNS TABLE (
  income_total numeric,
  fixed_total numeric,
  commitments_total numeric,
  personal_total numeric
)
```

**Uso desde cliente:**

```typescript
const { data } = await supabase.rpc('get_month_totals', {
  p_month: '2024-01-01'
})
```

---

## Políticas de Seguridad (RLS)

### Patrón "Owner-Only"

Todas las tablas de usuario siguen este patrón:

```sql
-- SELECT
CREATE POLICY "select_own_X" ON table_name
FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- INSERT
CREATE POLICY "insert_own_X" ON table_name
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- UPDATE
CREATE POLICY "update_own_X" ON table_name
FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- DELETE
CREATE POLICY "delete_own_X" ON table_name
FOR DELETE TO authenticated
USING (user_id = auth.uid());
```

### Excepciones

- **plans**: lectura pública (todos los autenticados)
- **user_plans**: solo lectura; escritura vía service role

---

## Optimizaciones

### Índices Estratégicos

1. **Por usuario**: todas las queries filtran por `user_id` primero
2. **Por rango de fechas**: `(starts_on, ends_on)` para filtros temporales
3. **Por estado**: `is_active` para filtrar registros activos
4. **Únicos**: prevenir duplicados (ej: un solo plan activo por usuario)

### Constraints

- **Check constraints**: validación a nivel BD (amounts >= 0, enums)
- **Foreign keys**: integridad referencial
- **Not null**: campos obligatorios
- **Unique**: prevenir duplicados

### Computed Columns

`end_month` en `monthly_commitments` se calcula automáticamente:

```sql
end_month date GENERATED ALWAYS AS 
  ((start_month + interval '1 month' * (months_total - 1))::date) 
STORED
```

Ventajas:
- ✅ Siempre consistente
- ✅ No requiere actualización manual
- ✅ Indexable

---

## Migraciones

Las migraciones están en `supabase/migrations/`:

1. **001_initial_schema.sql** - Tablas, triggers, seed
2. **002_row_level_security.sql** - RLS y políticas
3. **003_rpc_functions.sql** - Funciones RPC

Aplicar en orden para garantizar dependencias.

---

## Backup y Recuperación

Supabase provee:
- ✅ Backups automáticos diarios (plan Pro)
- ✅ Point-in-time recovery
- ✅ Exportación manual vía Dashboard

Para backup manual:

```bash
pg_dump -h db.xxx.supabase.co -U postgres -d postgres > backup.sql
```

---

**Este esquema está diseñado para ser escalable, seguro y mantenible.**

