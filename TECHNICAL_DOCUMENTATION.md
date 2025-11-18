# 📚 Documentación Técnica Completa - SOBRA

> Documentación técnica detallada para desarrolladores que trabajarán en el proyecto SOBRA

---

## 📑 Tabla de Contenidos

1. [Overview del Proyecto](#overview-del-proyecto)
2. [Stack Técnico](#stack-técnico)
3. [Arquitectura del Sistema](#arquitectura-del-sistema)
4. [Base de Datos](#base-de-datos)
5. [Autenticación y Seguridad](#autenticación-y-seguridad)
6. [Lógica de Negocio](#lógica-de-negocio)
7. [Sistema de Internacionalización (i18n)](#sistema-de-internacionalización-i18n)
8. [Estructura de Archivos](#estructura-de-archivos)
9. [Hooks Personalizados](#hooks-personalizados)
10. [Componentes y Patrones](#componentes-y-patrones)
11. [Flujos de Usuario](#flujos-de-usuario)
12. [Configuración y Variables de Entorno](#configuración-y-variables-de-entorno)
13. [Deployment](#deployment)
14. [Convenciones de Código](#convenciones-de-código)
15. [Troubleshooting](#troubleshooting)
16. [Próximos Pasos](#próximos-pasos)

---

## 🎯 Overview del Proyecto

### ¿Qué es SOBRA?

**SOBRA** es una aplicación web de gestión financiera personal que permite a los usuarios:

1. **Registrar ingresos** - Sueldo fijo + ingresos extra (freelance, inversiones, etc.)
2. **Gestionar gastos fijos** - Alquiler, servicios, suscripciones, etc.
3. **Definir presupuestos personales** - Presupuestos por categoría para gastos variables
4. **Crear compromisos mensuales** - Ahorros programados o pagos con duración limitada
5. **Calcular dinero disponible** - Automáticamente calcula cuánto sobra después de todos los gastos
6. **Sugerencia diaria** - Calcula cuánto puedes gastar por día sin exceder tu presupuesto

### Propósito del Sistema

El objetivo principal es ayudar a las personas a **tomar control de sus finanzas personales** mediante un cálculo simple pero preciso:

```
Ingresos Totales
  - Gastos Fijos
  - Compromisos Mensuales
  - Presupuestos Personales
= LO QUE SOBRA
  ÷ Días Restantes del Mes
= Sugerencia de Gasto Diario
```

### Estado Actual

- ✅ **MVP completo** - Todas las funcionalidades básicas implementadas
- ✅ **Deploy en producción** - Netlify/Vercel + Supabase
- ✅ **Sistema de i18n** - Español e Inglés
- ✅ **Responsive design** - Funciona en móvil, tablet y desktop
- 🔜 **Plan Plus** - Funcionalidades premium (próximamente)

---

## 🛠 Stack Técnico

### Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Next.js** | `16.0.3` | Framework React con App Router |
| **React** | `19.2.0` | Librería UI |
| **TypeScript** | `5.x` | Type safety |
| **TailwindCSS** | `4.x` | Utility-first CSS |
| **shadcn/ui** | Latest | Componentes UI |
| **TanStack Query** | `5.90.9` | Data fetching y estado del servidor |
| **React Hook Form** | `7.66.0` | Manejo de formularios |
| **Zod** | `4.1.12` | Validación de esquemas |
| **Lucide React** | `0.553.0` | Iconos |
| **Sonner** | `2.0.7` | Toasts/notificaciones |
| **date-fns** | `4.1.0` | Manejo de fechas |

### Backend/BaaS

| Servicio | Propósito |
|----------|-----------|
| **Supabase** | Backend-as-a-Service completo |
| - **PostgreSQL** | Base de datos relacional |
| - **Supabase Auth** | Autenticación con email/password |
| - **Row Level Security (RLS)** | Seguridad a nivel de fila |
| - **Supabase Edge Functions** | Funciones serverless (opcional, futuro) |

### Deployment

| Plataforma | Propósito |
|------------|-----------|
| **Netlify** | Deploy del frontend Next.js |
| **Supabase Cloud** | Base de datos y auth en la nube |

### Herramientas de Desarrollo

- **ESLint** - Linting de código
- **TypeScript** - Type checking
- **Prettier** - Formateo de código

---

## 🏗 Arquitectura del Sistema

### Arquitectura General

```
┌─────────────────────────────────────────────────┐
│              Cliente (Browser)                  │
│  ┌──────────────────────────────────────────┐  │
│  │         Next.js App (Frontend)           │  │
│  │  ┌──────────┐  ┌──────────┐             │  │
│  │  │ React    │  │ TanStack │             │  │
│  │  │ Components│  │  Query   │             │  │
│  │  └──────────┘  └──────────┘             │  │
│  │       │              │                   │  │
│  └───────┼──────────────┼───────────────────┘  │
└──────────┼──────────────┼──────────────────────┘
           │              │
           │ HTTP/HTTPS   │
           │ (Supabase SDK)│
           ▼              ▼
┌─────────────────────────────────────────────────┐
│            Supabase Cloud                       │
│  ┌──────────────────┐  ┌──────────────────┐   │
│  │   PostgreSQL     │  │   Auth Service   │   │
│  │   (Database)     │  │   (JWT Tokens)   │   │
│  └──────────────────┘  └──────────────────┘   │
│         │                    │                  │
│         └────────────────────┘                  │
│              (RLS Policies)                     │
└─────────────────────────────────────────────────┘
```

### Patrón de Arquitectura

SOBRA sigue una **arquitectura en capas** con separación clara de responsabilidades:

1. **Capa de Presentación (UI)** - Componentes React
2. **Capa de Estado** - TanStack Query para data fetching
3. **Capa de Negocio** - Funciones puras en `lib/finance/`
4. **Capa de Datos** - Cliente Supabase + Queries
5. **Capa de Persistencia** - PostgreSQL en Supabase

### Flujo de Datos

```
Usuario interactúa con UI
    ↓
Hook personalizado (useIncomes, useExpenses, etc.)
    ↓
TanStack Query (cachea y gestiona estado)
    ↓
Cliente Supabase (createClient)
    ↓
Supabase API (con RLS)
    ↓
PostgreSQL Database
    ↓
Respuesta (con tipos TypeScript)
    ↓
TanStack Query actualiza cache
    ↓
UI se re-renderiza
```

---

## 🗄 Base de Datos

### Esquema de Base de Datos

La base de datos está diseñada con PostgreSQL en Supabase. Todas las tablas tienen RLS habilitado.

#### Tabla: `profiles`

Perfil extendido del usuario. Se crea automáticamente al registrarse.

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  currency TEXT NOT NULL DEFAULT 'USD',
  period TEXT NOT NULL DEFAULT 'monthly' CHECK (period IN ('monthly', 'biweekly')),
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Campos clave:**
- `id` - UUID que referencia a `auth.users.id`
- `currency` - Moneda del usuario (USD, EUR, MXN, ARS, PEN)
- `period` - Período de cálculo (monthly/biweekly)

**Índices:**
- `id` (primary key, índice automático)

---

#### Tabla: `incomes`

Fuentes de ingreso del usuario (sueldo, freelance, inversiones, etc.).

```sql
CREATE TABLE public.incomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
  kind TEXT NOT NULL DEFAULT 'salary' CHECK (kind IN ('salary', 'extra', 'other')),
  recurrence TEXT NOT NULL DEFAULT 'monthly' CHECK (recurrence IN ('monthly', 'one_off')),
  starts_on DATE NOT NULL DEFAULT CURRENT_DATE,
  ends_on DATE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Campos clave:**
- `label` - Nombre descriptivo (ej: "Sueldo Principal", "Freelance")
- `amount` - Monto del ingreso (máximo 12 dígitos, 2 decimales)
- `kind` - Tipo: 'salary' (sueldo), 'extra' (extra), 'other' (otro)
- `recurrence` - Recurrencia: 'monthly' (mensual), 'one_off' (único)
- `starts_on` - Fecha de inicio del ingreso
- `ends_on` - Fecha de fin (NULL = indefinido)
- `is_active` - Si está activo o no

**Índices:**
- `idx_incomes_user` - `(user_id)`
- `idx_incomes_user_active` - `(user_id, is_active)`
- `idx_incomes_user_range` - `(user_id, starts_on, COALESCE(ends_on, '9999-12-31'))`

**Uso:**
```typescript
// Ejemplo: Crear un ingreso
const { data } = await supabase.from('incomes').insert({
  label: 'Sueldo Principal',
  amount: 3000.00,
  kind: 'salary',
  recurrence: 'monthly',
  starts_on: '2024-01-01',
  is_active: true
})
```

---

#### Tabla: `fixed_expenses`

Gastos fijos recurrentes del usuario (alquiler, servicios, suscripciones).

```sql
CREATE TABLE public.fixed_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT DEFAULT 'otros',
  label TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
  recurrence TEXT NOT NULL DEFAULT 'monthly' CHECK (recurrence IN ('monthly', 'one_off')),
  starts_on DATE NOT NULL DEFAULT CURRENT_DATE,
  ends_on DATE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Campos clave:**
- `category` - Categoría predefinida (ver `lib/constants/categories.ts`)
- `label` - Nombre descriptivo
- `amount` - Monto del gasto
- `recurrence` - Recurrencia
- `starts_on` / `ends_on` - Rango de fechas
- `is_active` - Si está activo

**Categorías predefinidas:**
- `alquiler_hipoteca` - 🏠 Alquiler/Hipoteca
- `servicios` - 💡 Servicios (Luz, Agua, Gas)
- `internet_telefonia` - 📡 Internet y Telefonía
- `suscripciones` - 📱 Suscripciones
- `seguros` - 🛡️ Seguros
- `creditos_prestamos` - 💳 Créditos/Préstamos
- `mantenimiento` - 🔧 Mantenimiento
- `educacion` - 🎓 Educación
- `otros` - 📦 Otros

**Índices:**
- `idx_fixed_expenses_user` - `(user_id)`
- `idx_fixed_expenses_user_active` - `(user_id, is_active)`
- `idx_fixed_expenses_category` - `(category)`

---

#### Tabla: `personal_expenses`

Presupuestos personales por categoría para gastos variables.

```sql
CREATE TABLE public.personal_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  label TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
  starts_on DATE NOT NULL DEFAULT CURRENT_DATE,
  ends_on DATE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Campos clave:**
- `category` - Categoría predefinida (ver `lib/constants/categories.ts`)
- `label` - Nombre descriptivo (puede ser personalizado)
- `amount` - Presupuesto mensual
- `starts_on` / `ends_on` - Rango de fechas
- `is_active` - Si está activo

**Categorías predefinidas:**
- `comida_restaurantes` - 🍔 Comida y Restaurantes
- `transporte` - 🚗 Transporte
- `entretenimiento` - 🎮 Entretenimiento
- `salud_bienestar` - 💊 Salud y Bienestar
- `ropa_accesorios` - 👕 Ropa y Accesorios
- `educacion` - 📚 Educación
- `hogar_muebles` - 🏠 Hogar y Muebles
- `mascotas` - 🐕 Mascotas
- `regalos` - 🎁 Regalos
- `viajes` - ✈️ Viajes
- `tecnologia` - 💻 Tecnología
- `deportes` - ⚽ Deportes
- `otros` - 📦 Otros

**Índices:**
- `idx_personal_expenses_user` - `(user_id)`
- `idx_personal_expenses_user_active` - `(user_id, is_active)`
- `idx_personal_expenses_category` - `(category)`

---

#### Tabla: `monthly_commitments`

Compromisos financieros con duración limitada (ahorros programados, pagos temporales).

```sql
CREATE TABLE public.monthly_commitments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  amount_per_month NUMERIC(12,2) NOT NULL CHECK (amount_per_month >= 0),
  start_month DATE NOT NULL,
  end_month DATE NOT NULL,
  months_total INTEGER NOT NULL CHECK (months_total > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Campos clave:**
- `label` - Nombre descriptivo (ej: "Ahorro para vacaciones")
- `amount_per_month` - Monto a pagar/ahorrar por mes
- `start_month` - Primer día del mes de inicio
- `end_month` - Último día del mes de fin
- `months_total` - Total de meses del compromiso

**Ejemplo:**
- Usuario quiere ahorrar $750/mes durante 4 meses (Enero - Abril 2024)
- `amount_per_month`: 750.00
- `start_month`: 2024-01-01
- `end_month`: 2024-04-30
- `months_total`: 4

**Índices:**
- `idx_monthly_commitments_user` - `(user_id)`
- `idx_monthly_commitments_user_range` - `(user_id, start_month, end_month)`

**Nota:** El campo `end_month` se calcula automáticamente en el cliente basándose en `start_month` y `months_total`.

---

#### Tabla: `plans`

Planes de suscripción disponibles (Free y Plus).

```sql
CREATE TABLE public.plans (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price_cents INT NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  features JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Valores iniciales (seeds):**
```sql
-- Plan Free
INSERT INTO plans (code, name, price_cents, currency, features) VALUES
('free', 'Free', 0, 'USD', '{"history_months": 3, "export": false, "advanced_charts": false}');

-- Plan Plus
INSERT INTO plans (code, name, price_cents, currency, features) VALUES
('plus', 'Plus', 999, 'USD', '{"history_months": 24, "export": true, "advanced_charts": true, "envelopes": true}');
```

**Campos clave:**
- `code` - Código único ('free', 'plus')
- `name` - Nombre del plan
- `price_cents` - Precio en centavos (0 = gratis)
- `features` - JSONB con características del plan

---

#### Tabla: `user_plans`

Relación entre usuarios y planes (suscripciones).

```sql
CREATE TABLE public.user_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_code TEXT NOT NULL REFERENCES public.plans(code),
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ends_at TIMESTAMPTZ,
  external_subscription_id TEXT
);
```

**Campos clave:**
- `status` - Estado de la suscripción
- `started_at` - Cuándo comenzó la suscripción
- `ends_at` - Cuándo termina (NULL = indefinido)
- `external_subscription_id` - ID de Stripe/otro procesador (futuro)

**Índices:**
- `idx_user_plans_user_status` - `(user_id, status)`
- `uniq_active_plan_per_user` - Un solo plan activo por usuario

---

#### Tabla: `monthly_summaries` (Futuro)

Resumen histórico de cada mes (para funcionalidades premium).

```sql
CREATE TABLE public.monthly_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month_start DATE NOT NULL,
  income_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  fixed_expenses_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  personal_expenses_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  commitments_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  leftover NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Nota:** Esta tabla está definida pero no se usa actualmente. Se usará para el Plan Plus con historial extendido.

---

### Triggers y Funciones

#### Función: `set_updated_at()`

Actualiza automáticamente el campo `updated_at` cuando se modifica un registro.

```sql
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;
```

**Aplicado en:**
- `profiles`
- `incomes`
- `fixed_expenses`
- `personal_expenses`
- `monthly_commitments`

---

### Row Level Security (RLS)

**Todas las tablas tienen RLS habilitado.** Esto significa que los usuarios solo pueden acceder a sus propios datos, incluso si intentan hacer queries directas.

#### Políticas RLS

**Patrón general para todas las tablas de datos del usuario:**

```sql
-- Habilitar RLS
ALTER TABLE public.incomes ENABLE ROW LEVEL SECURITY;

-- SELECT: Solo el owner puede ver sus datos
CREATE POLICY "Users can view own incomes"
ON public.incomes FOR SELECT
USING (auth.uid() = user_id);

-- INSERT: Solo el owner puede insertar
CREATE POLICY "Users can insert own incomes"
ON public.incomes FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- UPDATE: Solo el owner puede actualizar
CREATE POLICY "Users can update own incomes"
ON public.incomes FOR UPDATE
USING (auth.uid() = user_id);

-- DELETE: Solo el owner puede eliminar
CREATE POLICY "Users can delete own incomes"
ON public.incomes FOR DELETE
USING (auth.uid() = user_id);
```

**Tablas con RLS:**
- ✅ `profiles`
- ✅ `incomes`
- ✅ `fixed_expenses`
- ✅ `personal_expenses`
- ✅ `monthly_commitments`
- ✅ `user_plans`
- ❌ `plans` - No tiene RLS (datos públicos)
- ❌ `monthly_summaries` - No tiene RLS (no se usa actualmente)

---

## 🔐 Autenticación y Seguridad

### Sistema de Autenticación

SOBRA usa **Supabase Auth** para autenticación:

- **Método:** Email/Password
- **Tokens:** JWT (JSON Web Tokens)
- **Sesiones:** Gestionadas por Supabase SDK

### Flujo de Autenticación

#### 1. Registro

```typescript
// app/(auth)/register/page.tsx
const { error } = await supabase.auth.signUp({
  email: data.email,
  password: data.password,
  options: {
    data: {
      full_name: data.full_name,
    },
  },
})
```

**Proceso:**
1. Usuario completa formulario de registro
2. Supabase crea usuario en `auth.users`
3. Automáticamente se crea un perfil en `profiles` (trigger o código)
4. Usuario es redirigido a `/onboarding`

#### 2. Login

```typescript
// app/(auth)/login/page.tsx
const { error } = await supabase.auth.signInWithPassword({
  email: data.email,
  password: data.password,
})
```

**Proceso:**
1. Usuario ingresa email/password
2. Supabase valida credenciales
3. Se genera JWT token
4. Token se guarda en cookies (gestionado por `@supabase/ssr`)
5. Usuario es redirigido a `/dashboard`

#### 3. Middleware de Autenticación

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  return await updateSession(request)
}
```

**Función:** `updateSession()` de `lib/supabase/middleware.ts`

**Qué hace:**
- Refresca el token JWT si es necesario
- Verifica que el token sea válido
- Redirige a `/login` si no está autenticado (para rutas protegidas)

**Rutas protegidas:**
- `/dashboard`
- `/incomes`
- `/expenses`
- `/commitments`
- `/settings`
- `/profile` (redirige a `/settings?tab=profile`)

**Rutas públicas:**
- `/` (landing page)
- `/login`
- `/register`

#### 4. Obtener Usuario Actual

```typescript
// hooks/use-user.ts
export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const supabase = createClient()
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return user
    },
  })
}
```

#### 5. Logout

```typescript
// components/layout/header.tsx
const { error } = await supabase.auth.signOut()
```

**Proceso:**
1. Supabase invalida el token
2. Se eliminan las cookies de sesión
3. Usuario es redirigido a `/login`

---

### Seguridad

#### 1. Row Level Security (RLS)

**Todas las queries se filtran automáticamente por `user_id`** gracias a RLS. Incluso si un atacante obtiene acceso a la base de datos, no podrá ver datos de otros usuarios.

**Ejemplo:**
```sql
-- Usuario A intenta hacer esto:
SELECT * FROM incomes;

-- Supabase automáticamente ejecuta:
SELECT * FROM incomes WHERE user_id = 'usuario-a-uuid';
```

#### 2. Validación en Cliente y Servidor

**Cliente (Zod):**
```typescript
// lib/validators/index.ts
export const incomeSchema = z.object({
  label: z.string().min(1).max(100),
  amount: z.number().min(0).max(999999999999.99),
  // ...
})
```

**Servidor (RLS):**
- RLS asegura que el `user_id` en el INSERT sea el usuario autenticado
- No se puede insertar datos para otro usuario

#### 3. Variables de Entorno

**NUNCA exponer:**
- ❌ `SUPABASE_SERVICE_ROLE_KEY` - Acceso total a la BD
- ❌ Tokens JWT en el código

**Solo exponer:**
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - URL pública
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Key pública (con RLS habilitado)

---

## 💼 Lógica de Negocio

### Cálculo Financiero Principal

La lógica de cálculo está en `lib/finance/calc.ts` como **funciones puras**. Esto permite:

- ✅ Reutilización en web y móvil
- ✅ Testing fácil
- ✅ Sin dependencias de framework
- ✅ Type-safe

#### Función Principal: `calculateMonthlySobra()`

```typescript
// lib/finance/calc.ts
export function calculateMonthlySobra({
  monthStart,
  incomes,
  fixedExpenses,
  personalBudgets,
  commitments,
}: CalculationInput): CalculationResult
```

**Input:**
- `monthStart` - Fecha de inicio del mes (Date)
- `incomes` - Array de ingresos activos en el mes
- `fixedExpenses` - Array de gastos fijos activos
- `personalBudgets` - Array de presupuestos personales activos
- `commitments` - Array de compromisos activos

**Output:**
```typescript
{
  incomeTotal: Money,              // Suma de ingresos activos
  fixedTotal: Money,               // Suma de gastos fijos activos
  commitmentsTotal: Money,         // Suma de compromisos activos
  personalTotal: Money,            // Suma de presupuestos personales
  leftoverBeforePersonal: Money,   // Ingresos - Fijos - Compromisos
  leftoverAfterPersonal: Money,    // Sobrante final
  dailySuggestion: Money,          // leftOverAfterPersonal / días restantes
  daysInMonth: number,             // Total de días del mes
  remainingDays: number,           // Días restantes (desde hoy)
}
```

**Algoritmo:**

1. **Filtrar activos en el mes:**
   ```typescript
   incomes.filter(x => 
     x.is_active && 
     isActiveInMonth(x.starts_on, x.ends_on, period)
   )
   ```

2. **Sumar montos:**
   ```typescript
   incomeTotal = sum(incomes.map(x => x.amount))
   fixedTotal = sum(fixedExpenses.map(x => x.amount))
   commitmentsTotal = sum(commitments.map(x => x.amount_per_month))
   personalTotal = sum(personalBudgets.map(x => x.amount))
   ```

3. **Calcular sobrantes:**
   ```typescript
   leftoverBeforePersonal = incomeTotal - fixedTotal - commitmentsTotal
   leftoverAfterPersonal = leftoverBeforePersonal - personalTotal
   ```

4. **Calcular sugerencia diaria:**
   ```typescript
   remainingDays = días desde hoy hasta fin de mes
   dailySuggestion = Math.max(leftoverAfterPersonal, 0) / remainingDays
   ```

**Función Helper: `isActiveInMonth()`**

Verifica si un registro está activo en un período dado:

```typescript
export function isActiveInMonth(
  startDate: Date,
  endDate: Date | null,
  period: Period
): boolean {
  const start = startDate <= period.end
  const end = !endDate || endDate >= period.start
  return start && end
}
```

**Ejemplo:**
- Ingreso activo desde 2024-01-01 hasta 2024-12-31
- Verificando si está activo en marzo 2024:
  - `startDate (2024-01-01) <= period.end (2024-03-31)` ✅
  - `endDate (2024-12-31) >= period.start (2024-03-01)` ✅
  - **Resultado: Activo** ✅

---

### Formato de Moneda

```typescript
// lib/finance/calc.ts
export function formatCurrency(amount: Money, currency = 'USD'): string
```

**Monedas soportadas:**
- `USD` - Dólar Estadounidense (locale: `en-US`)
- `EUR` - Euro (locale: `es-ES`)
- `MXN` - Peso Mexicano (locale: `es-MX`)
- `ARS` - Peso Argentino (locale: `es-AR`)
- `PEN` - Sol Peruano (locale: `es-PE`)

**Ejemplo:**
```typescript
formatCurrency(1234.56, 'USD') // "$1,234.56"
formatCurrency(1234.56, 'PEN') // "S/ 1,234.56"
formatCurrency(1234.56, 'EUR') // "1.234,56 €"
```

---

### Hook de Cálculo

```typescript
// hooks/use-calculation.ts
export function useMonthlyCalculation(monthStart: Date = new Date())
```

**Qué hace:**
1. Obtiene todos los datos necesarios (incomes, expenses, commitments)
2. Ejecuta `calculateMonthlySobra()` con `useMemo` (evita recálculos innecesarios)
3. Retorna el resultado + estados de loading

**Uso:**
```typescript
const { calculation, isLoading } = useMonthlyCalculation()

if (calculation) {
  console.log(calculation.leftoverAfterPersonal) // Dinero que sobra
  console.log(calculation.dailySuggestion)       // Sugerencia diaria
}
```

---

## 🌐 Sistema de Internacionalización (i18n)

### Arquitectura i18n

SOBRA usa un **sistema de i18n personalizado** basado en React Context.

**Estructura:**
```
lib/i18n/
├── context.tsx       # Provider y hook useI18n()
└── translations.ts   # Objeto con todas las traducciones
```

### Provider

```typescript
// lib/i18n/context.tsx
export function I18nProvider({ children }: { children: React.ReactNode })
```

**Ubicación:** `app/layout.tsx` (root layout)

**Funcionalidades:**
- Detecta idioma del navegador al cargar
- Guarda preferencia en `localStorage` (`sobra-locale`)
- Actualiza `document.documentElement.lang` automáticamente

### Hook: `useI18n()`

```typescript
const { locale, setLocale, t } = useI18n()
```

**Propiedades:**
- `locale` - Idioma actual ('es' | 'en')
- `setLocale()` - Cambiar idioma
- `t` - Objeto con todas las traducciones

**Uso:**
```typescript
const { t } = useI18n()

return (
  <h1>{t.dashboard.title}</h1>
  <p>{t.dashboard.subtitle}</p>
)
```

### Estructura de Traducciones

```typescript
// lib/i18n/translations.ts
export interface Translations {
  common: {
    save: string
    cancel: string
    delete: string
    // ...
  }
  nav: {
    dashboard: string
    incomes: string
    // ...
  }
  dashboard: {
    title: string
    subtitle: string
    leftover: string
    // ...
  }
  incomes: { ... }
  expenses: { ... }
  commitments: { ... }
  profile: { ... }
  auth: { ... }
  settings: { ... }
  landing: { ... }
  onboarding: { ... }
}

export const translations: Record<Locale, Translations> = {
  es: { ... },
  en: { ... }
}
```

**Idiomas soportados:**
- ✅ Español (`es`) - Default
- ✅ Inglés (`en`)

### Agregar Nuevas Traducciones

1. **Agregar al interface:**
```typescript
// lib/i18n/translations.ts
export interface Translations {
  // ... existentes
  nuevaSeccion: {
    nuevoTexto: string
  }
}
```

2. **Agregar traducciones en español:**
```typescript
export const translations: Record<Locale, Translations> = {
  es: {
    // ... existentes
    nuevaSeccion: {
      nuevoTexto: 'Texto en español'
    }
  },
  // ...
}
```

3. **Agregar traducciones en inglés:**
```typescript
en: {
  // ... existentes
  nuevaSeccion: {
    nuevoTexto: 'Text in English'
  }
}
```

4. **Usar en componentes:**
```typescript
const { t } = useI18n()
return <p>{t.nuevaSeccion.nuevoTexto}</p>
```

### Selector de Idioma

```typescript
// components/layout/language-selector.tsx
<LanguageSelector />
```

**Ubicación:** En la página de Settings (tab Preferences)

**Funcionalidad:**
- Dropdown con opciones: Español / English
- Actualiza `locale` automáticamente
- Guarda preferencia en localStorage

---

## 📁 Estructura de Archivos

### Estructura Completa del Proyecto

```
sobra/
│
├── app/                              # Next.js App Router
│   ├── (app)/                        # Rutas protegidas (requieren auth)
│   │   ├── layout.tsx                # Layout para rutas protegidas (Header + Sidebar)
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Dashboard principal con cálculo SOBRA
│   │   ├── incomes/
│   │   │   └── page.tsx              # Gestión de ingresos
│   │   ├── expenses/
│   │   │   └── page.tsx              # Gestión de gastos (tabs: fijos/personales)
│   │   ├── commitments/
│   │   │   └── page.tsx              # Gestión de compromisos mensuales
│   │   ├── settings/
│   │   │   ├── page.tsx              # Configuración (tabs: profile/preferences)
│   │   │   └── profile-tab.tsx       # Tab de perfil dentro de settings
│   │   └── profile/
│   │       └── page.tsx              # Redirige a /settings?tab=profile
│   │
│   ├── (auth)/                       # Rutas de autenticación (públicas)
│   │   ├── layout.tsx                # Layout para auth (solo metadata)
│   │   ├── login/
│   │   │   └── page.tsx              # Página de login
│   │   ├── register/
│   │   │   └── page.tsx              # Página de registro
│   │   └── onboarding/
│   │       └── page.tsx              # Onboarding inicial (configurar perfil)
│   │
│   ├── layout.tsx                    # Root layout (I18nProvider, Toaster, metadata SEO)
│   ├── page.tsx                      # Landing page (pública)
│   ├── globals.css                   # Estilos globales (Tailwind, variables CSS, animaciones)
│   ├── robots.ts                     # robots.txt dinámico
│   └── sitemap.ts                    # sitemap.xml dinámico
│
├── components/                       # Componentes React
│   ├── brand/
│   │   └── logo.tsx                  # Componente Logo reutilizable
│   │
│   ├── forms/                        # Formularios reutilizables
│   │   ├── income-form.tsx           # Formulario crear/editar ingreso
│   │   ├── expense-form.tsx          # Formulario crear/editar gasto (fijo/personal)
│   │   └── commitment-form.tsx       # Formulario crear/editar compromiso
│   │
│   ├── layout/                       # Componentes de layout
│   │   ├── header.tsx                # Header con navegación y logout
│   │   ├── sidebar.tsx               # Sidebar con navegación vertical
│   │   └── language-selector.tsx     # Selector de idioma
│   │
│   └── ui/                           # Componentes shadcn/ui
│       ├── alert.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── empty-state.tsx
│       ├── form.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── loading-spinner.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sonner.tsx                # Toasts
│       ├── tabs.tsx
│       └── textarea.tsx
│
├── hooks/                            # React Hooks personalizados
│   ├── use-user.ts                   # useUser(), useProfile(), useUserPlan()
│   ├── use-incomes.ts                # useIncomes(), useCreateIncome(), useUpdateIncome(), useDeleteIncome()
│   ├── use-expenses.ts               # useFixedExpenses(), usePersonalExpenses(), useCreateFixedExpense(), etc.
│   ├── use-commitments.ts            # useMonthlyCommitments(), useCreateMonthlyCommitment(), useUpdateMonthlyCommitment()
│   └── use-calculation.ts            # useMonthlyCalculation() - Hook principal de cálculo
│
├── lib/                              # Utilidades y lógica de negocio
│   ├── constants/
│   │   ├── categories.ts             # Categorías predefinidas para gastos
│   │   └── currencies.ts             # Lista de monedas soportadas
│   │
│   ├── finance/                      # Lógica de negocio (cálculos)
│   │   └── calc.ts                   # calculateMonthlySobra(), formatCurrency(), etc.
│   │
│   ├── i18n/                         # Sistema de internacionalización
│   │   ├── context.tsx               # I18nProvider y useI18n()
│   │   └── translations.ts           # Todas las traducciones (es/en)
│   │
│   ├── providers/
│   │   └── query-provider.tsx        # TanStack Query Provider
│   │
│   ├── supabase/                     # Clientes Supabase
│   │   ├── browser.ts                # createClient() para cliente (navegador)
│   │   ├── server.ts                 # createClient() para servidor (opcional)
│   │   └── middleware.ts             # updateSession() para middleware de Next.js
│   │
│   ├── validators/                   # Schemas Zod
│   │   └── index.ts                  # incomeSchema, expenseSchema, etc.
│   │
│   └── utils.ts                      # Utilidades generales (cn() para classnames)
│
├── middleware.ts                     # Next.js middleware (auth + i18n)
│
├── supabase/                         # Migraciones SQL y scripts
│   ├── migrations/                   # Migraciones organizadas por número
│   │   ├── 001_initial_schema.sql    # Tablas principales
│   │   ├── 002_row_level_security.sql # Políticas RLS
│   │   ├── 003_rpc_functions.sql     # Funciones PostgreSQL (opcional)
│   │   └── 004_add_categories.sql    # Agregar columnas de categorías
│   │
│   ├── APPLY_THIS.sql                # Todas las migraciones consolidadas (para aplicar en Supabase SQL Editor)
│   └── APPLY_CATEGORIES.sql          # Migración específica de categorías
│
├── types/                            # Tipos TypeScript
│   ├── database.types.ts             # Tipos generados desde Supabase (Database, Tables, etc.)
│   └── index.ts                      # Tipos compartidos (Money, Period, etc.)
│
├── public/                           # Archivos estáticos
│   ├── favicon.ico
│   └── ...
│
├── .env.local                        # Variables de entorno (NO committear)
├── env.example                       # Ejemplo de variables de entorno
├── next.config.ts                    # Configuración Next.js
├── package.json                      # Dependencias y scripts
├── tsconfig.json                     # Configuración TypeScript
├── tailwind.config.ts                # Configuración TailwindCSS
├── netlify.toml                      # Configuración Netlify (deployment)
└── README.md                         # README principal
```

---

### Explicación de Carpetas Principales

#### `app/` - Next.js App Router

**Estructura de rutas:**
- `(app)/` - Grupo de rutas protegidas (requieren autenticación)
- `(auth)/` - Grupo de rutas de autenticación (públicas)

**Convenciones:**
- `page.tsx` - Define una ruta
- `layout.tsx` - Define un layout compartido
- `loading.tsx` - UI de loading (opcional)
- `error.tsx` - UI de error (opcional)

**Ejemplo:**
```
app/(app)/dashboard/page.tsx
→ Ruta: /dashboard (requiere auth)
→ Layout: app/(app)/layout.tsx (Header + Sidebar)
```

#### `components/` - Componentes React

**Organización:**
- `brand/` - Componentes de marca (Logo)
- `forms/` - Formularios reutilizables
- `layout/` - Componentes de layout (Header, Sidebar)
- `ui/` - Componentes base de shadcn/ui

**Convenciones:**
- Nombres en PascalCase
- Un componente por archivo
- Export default o named export

#### `hooks/` - Custom Hooks

**Patrón CRUD:**
Cada entidad tiene hooks para:
- `use[Entity]()` - Query (obtener lista)
- `useCreate[Entity]()` - Mutation (crear)
- `useUpdate[Entity]()` - Mutation (actualizar)
- `useDelete[Entity]()` - Mutation (eliminar)

**Ejemplo:**
```typescript
// hooks/use-incomes.ts
export function useIncomes() { ... }
export function useCreateIncome() { ... }
export function useUpdateIncome() { ... }
export function useDeleteIncome() { ... }
```

#### `lib/` - Lógica de Negocio y Utilidades

**Organización:**
- `finance/` - Lógica de dominio (cálculos financieros)
- `supabase/` - Clientes de Supabase
- `validators/` - Schemas Zod
- `i18n/` - Sistema de internacionalización
- `providers/` - React Context Providers

#### `supabase/migrations/` - Migraciones SQL

**Convención de nombres:**
- `001_initial_schema.sql` - Primera migración (tablas)
- `002_row_level_security.sql` - Segunda migración (RLS)
- `003_rpc_functions.sql` - Tercera migración (funciones)
- `004_add_categories.sql` - Cuarta migración (categorías)

**Orden de aplicación:**
1. Aplicar migraciones en orden numérico
2. O usar `APPLY_THIS.sql` (todas consolidadas)

---

## 🪝 Hooks Personalizados

### Patrón General

Todos los hooks siguen el mismo patrón:

```typescript
// Query Hook
export function use[Entity]() {
  return useQuery({
    queryKey: ['entity'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('table_name')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })
}

// Mutation Hook
export function useCreate[Entity]() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: EntityInsert) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')
      
      const { data, error } = await supabase
        .from('table_name')
        .insert({ ...data, user_id: user.id })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entity'] })
      toast.success('Entity created successfully')
    },
    onError: (error) => {
      toast.error('Error: ' + error.message)
    },
  })
}
```

---

### Hook: `useUser()` y relacionados

**Archivo:** `hooks/use-user.ts`

#### `useUser()`

Obtiene el usuario autenticado actual.

```typescript
const { data: user, isLoading, error } = useUser()
```

**Retorna:**
- `user` - Objeto de usuario de Supabase Auth (o `null` si no está autenticado)
- `isLoading` - Estado de carga
- `error` - Error si ocurre

#### `useProfile()`

Obtiene el perfil extendido del usuario.

```typescript
const { data: profile, isLoading } = useProfile()
```

**Retorna:**
- `profile` - Objeto con `full_name`, `currency`, `period`, etc.
- `isLoading` - Estado de carga

#### `useUserPlan()`

Obtiene el plan de suscripción del usuario.

```typescript
const { data: userPlan, isLoading } = useUserPlan()
```

**Retorna:**
- `userPlan` - Objeto con `plan_code`, `status`, `plans` (join con tabla plans)
- `isLoading` - Estado de carga

---

### Hook: `useIncomes()` y relacionados

**Archivo:** `hooks/use-incomes.ts`

#### `useIncomes()`

Obtiene todos los ingresos del usuario.

```typescript
const { data: incomes, isLoading, error } = useIncomes()
```

**Retorna:**
- `incomes` - Array de ingresos ordenados por `created_at` (más recientes primero)
- `isLoading` - Estado de carga
- `error` - Error si ocurre

**Query Key:** `['incomes']`

#### `useCreateIncome()`

Crea un nuevo ingreso.

```typescript
const createIncome = useCreateIncome()

createIncome.mutate({
  label: 'Sueldo Principal',
  amount: 3000.00,
  kind: 'salary',
  recurrence: 'monthly',
  starts_on: '2024-01-01',
  is_active: true
})
```

**Invalidación:**
- Automáticamente invalida `['incomes']` después de crear
- Muestra toast de éxito/error

#### `useUpdateIncome()`

Actualiza un ingreso existente.

```typescript
const updateIncome = useUpdateIncome()

updateIncome.mutate({
  id: 'income-uuid',
  amount: 3500.00
})
```

#### `useDeleteIncome()`

Elimina un ingreso.

```typescript
const deleteIncome = useDeleteIncome()

deleteIncome.mutate('income-uuid')
```

---

### Hook: `useExpenses()` y relacionados

**Archivo:** `hooks/use-expenses.ts`

#### `useFixedExpenses()`

Obtiene todos los gastos fijos del usuario.

```typescript
const { data: fixedExpenses, isLoading } = useFixedExpenses()
```

**Query Key:** `['fixed_expenses']`

#### `usePersonalExpenses()`

Obtiene todos los presupuestos personales del usuario.

```typescript
const { data: personalExpenses, isLoading } = usePersonalExpenses()
```

**Query Key:** `['personal_expenses']`

#### Mutations

- `useCreateFixedExpense()` - Crear gasto fijo
- `useUpdateFixedExpense()` - Actualizar gasto fijo
- `useDeleteFixedExpense()` - Eliminar gasto fijo
- `useCreatePersonalExpense()` - Crear presupuesto personal
- `useUpdatePersonalExpense()` - Actualizar presupuesto personal
- `useDeletePersonalExpense()` - Eliminar presupuesto personal

---

### Hook: `useCommitments()` y relacionados

**Archivo:** `hooks/use-commitments.ts`

#### `useMonthlyCommitments()`

Obtiene todos los compromisos mensuales del usuario.

```typescript
const { data: commitments, isLoading } = useMonthlyCommitments()
```

**Query Key:** `['monthly_commitments']`

#### Mutations

- `useCreateMonthlyCommitment()` - Crear compromiso
- `useUpdateMonthlyCommitment()` - Actualizar compromiso

**Nota:** No hay `useDeleteMonthlyCommitment()` actualmente. Se puede agregar si es necesario.

---

### Hook: `useMonthlyCalculation()`

**Archivo:** `hooks/use-calculation.ts`

**Hook principal** que calcula el resumen financiero mensual.

```typescript
const { calculation, isLoading, incomes, fixedExpenses, personalExpenses, commitments } = useMonthlyCalculation(monthStart)
```

**Parámetros:**
- `monthStart` (opcional) - Fecha de inicio del mes (default: hoy)

**Retorna:**
- `calculation` - Objeto `CalculationResult` con todos los cálculos
- `isLoading` - Estado de carga (true si alguna query está cargando)
- `incomes` - Array de ingresos (pasado desde `useIncomes()`)
- `fixedExpenses` - Array de gastos fijos
- `personalExpenses` - Array de presupuestos personales
- `commitments` - Array de compromisos

**Uso típico:**
```typescript
const { calculation, isLoading } = useMonthlyCalculation()

if (isLoading) return <LoadingSpinner />

if (calculation) {
  return (
    <div>
      <p>Te sobra: {formatCurrency(calculation.leftoverAfterPersonal, currency)}</p>
      <p>Puedes gastar: {formatCurrency(calculation.dailySuggestion, currency)} / día</p>
    </div>
  )
}
```

**Optimización:**
- Usa `useMemo` para evitar recálculos innecesarios
- Solo recalcula si cambian los datos de entrada

---

## 🧩 Componentes y Patrones

### Componentes de Layout

#### `Header`

**Archivo:** `components/layout/header.tsx`

**Funcionalidad:**
- Muestra el Logo
- Navegación principal (Dashboard, Incomes, Expenses, Commitments)
- Link a Settings
- Botón de Logout
- Selector de idioma (integrado)

**Estado activo:**
- Detecta la ruta actual con `usePathname()`
- Resalta el link activo con estilo `bg-gray-100 text-gray-900`

**Estilos:**
- Fondo: `bg-white/95 backdrop-blur-sm`
- Borde: `border-gray-200/60`
- Sticky: `sticky top-0 z-50`

---

#### `Sidebar`

**Archivo:** `components/layout/sidebar.tsx`

**Funcionalidad:**
- Navegación vertical
- Items: Dashboard, Incomes, Expenses, Commitments, Settings
- Estado activo basado en ruta actual

**Estilos:**
- Fondo: `bg-white/95 backdrop-blur-sm`
- Ancho: `w-56`
- Estado activo: `bg-gray-100 text-gray-900 font-semibold`

---

### Componentes de Formularios

#### `IncomeForm`

**Archivo:** `components/forms/income-form.tsx`

**Propósito:** Crear o editar un ingreso.

**Props:**
```typescript
interface IncomeFormProps {
  income?: Income  // Si existe, modo edición
  onSuccess?: () => void  // Callback después de éxito
}
```

**Campos:**
- `label` - Nombre del ingreso
- `amount` - Monto
- `kind` - Tipo (salary/extra/other)
- `recurrence` - Recurrencia (monthly/one_off)
- `starts_on` - Fecha de inicio
- `ends_on` - Fecha de fin (opcional)
- `is_active` - Si está activo

**Validación:**
- Usa `incomeSchema` de `lib/validators/index.ts`
- Validación con Zod + React Hook Form

---

#### `ExpenseForm`

**Archivo:** `components/forms/expense-form.tsx`

**Propósito:** Crear o editar un gasto fijo o presupuesto personal.

**Props:**
```typescript
interface ExpenseFormProps {
  expense?: Expense  // Si existe, modo edición
  isPersonal?: boolean  // true = presupuesto personal, false = gasto fijo
  onSuccess?: () => void
}
```

**Campos:**
- `category` - Categoría (predefinida o personalizada)
- `label` - Nombre del gasto
- `amount` - Monto
- `recurrence` - Recurrencia (solo para gastos fijos)
- `starts_on` - Fecha de inicio
- `ends_on` - Fecha de fin (opcional)
- `is_active` - Si está activo

**Características especiales:**
- Selector de categorías predefinidas
- Opción "Otra (personalizada)" para categorías custom
- Si se selecciona "custom", muestra input adicional

---

#### `CommitmentForm`

**Archivo:** `components/forms/commitment-form.tsx`

**Propósito:** Crear o editar un compromiso mensual.

**Props:**
```typescript
interface CommitmentFormProps {
  commitment?: MonthlyCommitment
  onSuccess?: () => void
}
```

**Campos:**
- `label` - Nombre del compromiso
- `amount_per_month` - Monto por mes
- `start_month` - Mes de inicio
- `months_total` - Total de meses

**Lógica:**
- Calcula `end_month` automáticamente basándose en `start_month` y `months_total`

---

### Componentes UI Base

Todos los componentes en `components/ui/` son de **shadcn/ui** y están personalizados para el diseño de SOBRA.

#### `Button`

**Variantes:**
- `default` - Fondo gris oscuro, texto blanco
- `outline` - Borde, fondo blanco
- `destructive` - Fondo rojo
- `ghost` - Sin fondo, hover sutil
- `secondary` - Fondo gris claro

**Tamaños:**
- `sm` - Pequeño
- `default` - Normal
- `lg` - Grande

---

#### `Card`

**Estilos:**
- Fondo blanco
- Borde: `border-gray-200/80`
- Sombra: `shadow-sm` con `hover:shadow-md`
- Transición suave en hover

---

#### `Input`

**Estilos:**
- Altura: `h-9`
- Borde: `border-gray-300`
- Focus: `border-gray-900` con ring
- Placeholder: `text-gray-400`

---

### Patrón de Páginas

Todas las páginas siguen un patrón similar:

```typescript
'use client'

import { useState } from 'react'
import { use[Entity] } from '@/hooks/use-[entity]'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useI18n } from '@/lib/i18n/context'

export default function EntityPage() {
  const { data: entities, isLoading } = use[Entity]()
  const { t } = useI18n()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEntity, setEditingEntity] = useState<Entity | undefined>()

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">{t.entity.title}</h1>
          <p className="text-gray-600 mt-1 text-sm">{t.entity.subtitle}</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          {t.entity.newEntity}
        </Button>
      </div>

      {/* Lista o Empty State */}
      {!entities || entities.length === 0 ? (
        <EmptyState ... />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {entities.map((entity) => (
            <Card key={entity.id}>
              {/* Contenido de la card */}
            </Card>
          ))}
        </div>
      )}

      {/* Dialog para crear/editar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingEntity ? t.common.edit : t.entity.newEntity}
            </DialogTitle>
          </DialogHeader>
          <EntityForm entity={editingEntity} onSuccess={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
```

---

## 🔄 Flujos de Usuario

### Flujo de Registro y Onboarding

```
1. Usuario visita landing page (/)
   ↓
2. Click en "Registrarse"
   ↓
3. Rellena formulario de registro (/register)
   - Email
   - Password
   - Confirm Password
   - Full Name
   ↓
4. Supabase crea usuario en auth.users
   ↓
5. Automáticamente se crea perfil en profiles (trigger o código)
   ↓
6. Usuario es redirigido a /onboarding
   ↓
7. Completa onboarding:
   - Currency (USD, EUR, MXN, ARS, PEN)
   - Period (monthly/biweekly)
   - Initial Income (opcional)
   ↓
8. Usuario es redirigido a /dashboard
```

---

### Flujo de Login

```
1. Usuario visita /login
   ↓
2. Ingresa email y password
   ↓
3. Supabase valida credenciales
   ↓
4. Se genera JWT token
   ↓
5. Token se guarda en cookies (Supabase SSR)
   ↓
6. Usuario es redirigido a /dashboard
```

---

### Flujo de Cálculo Mensual

```
1. Usuario accede a /dashboard
   ↓
2. Hook useMonthlyCalculation() se ejecuta
   ↓
3. Obtiene datos de múltiples hooks:
   - useIncomes()
   - useFixedExpenses()
   - usePersonalExpenses()
   - useMonthlyCommitments()
   ↓
4. Cuando todos los datos están listos:
   ↓
5. Se ejecuta calculateMonthlySobra() con useMemo
   ↓
6. Cálculo:
   a. Filtra registros activos en el mes actual
   b. Suma ingresos activos → incomeTotal
   c. Suma gastos fijos activos → fixedTotal
   d. Suma compromisos activos → commitmentsTotal
   e. Suma presupuestos personales → personalTotal
   f. Calcula:
      - leftoverBeforePersonal = incomeTotal - fixedTotal - commitmentsTotal
      - leftoverAfterPersonal = leftoverBeforePersonal - personalTotal
      - dailySuggestion = leftoverAfterPersonal / días restantes
   ↓
7. UI muestra resultados en Dashboard
```

---

### Flujo de Agregar Ingreso

```
1. Usuario está en /incomes
   ↓
2. Click en "Nuevo Ingreso"
   ↓
3. Se abre Dialog con IncomeForm
   ↓
4. Usuario completa formulario:
   - Label: "Sueldo Principal"
   - Amount: 3000
   - Kind: salary
   - Recurrence: monthly
   - Starts on: 2024-01-01
   ↓
5. Formulario valida con Zod
   ↓
6. Si válido:
   - useCreateIncome().mutate() se ejecuta
   - Supabase inserta en tabla incomes
   - TanStack Query invalida ['incomes']
   - Query se re-ejecuta automáticamente
   - Toast de éxito se muestra
   - Dialog se cierra
   - Lista se actualiza automáticamente
```

---

## ⚙️ Configuración y Variables de Entorno

### Variables de Entorno Requeridas

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aquí

# Site URL (para SEO y links)
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
```

### Obtener Variables de Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Selecciona tu proyecto
3. Ve a **Settings > API**
4. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Variables Opcionales

```env
# Solo si usas Supabase CLI para generar tipos
SUPABASE_PROJECT_ID=tu-project-id
```

---

## 🚀 Deployment

### Deployment en Netlify

**Archivo:** `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  force = true
```

**Pasos:**

1. **Conecta repositorio a Netlify:**
   - Ve a [netlify.com](https://netlify.com)
   - "Add new site" > "Import an existing project"
   - Conecta tu repositorio GitHub

2. **Configura variables de entorno:**
   - Site settings > Environment variables
   - Agrega:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `NEXT_PUBLIC_SITE_URL` (opcional)

3. **Deploy:**
   - Netlify detecta automáticamente `netlify.toml`
   - Deploy se ejecuta automáticamente en cada push a `main`

**Ver documentación completa:** `DEPLOY_NETLIFY.md`

---

### Deployment en Vercel

**Pasos similares a Netlify:**

1. Conecta repositorio a Vercel
2. Configura variables de entorno
3. Deploy automático

---

## 📝 Convenciones de Código

### TypeScript

**Reglas:**
- ✅ Usar tipos explícitos, evitar `any`
- ✅ Interfaces para objetos, `type` para uniones
- ✅ Exportar tipos desde `types/index.ts`

**Ejemplo:**
```typescript
// ✅ Bien
interface UserProfile {
  id: string
  fullName: string
}

type Status = 'active' | 'inactive'

// ❌ Mal
const user: any = {}
```

---

### Componentes React

**Reglas:**
- ✅ Usar `'use client'` solo cuando sea necesario (interactividad, hooks)
- ✅ Preferir Server Components por defecto
- ✅ Componentes en PascalCase
- ✅ Props con interface explícita

**Ejemplo:**
```typescript
// ✅ Bien
'use client'

interface ButtonProps {
  label: string
  onClick: () => void
}

export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>
}
```

---

### Hooks

**Reglas:**
- ✅ Prefijo `use` obligatorio
- ✅ Hooks de datos en `hooks/use-*.ts`
- ✅ Retornar objetos con nombres descriptivos

**Ejemplo:**
```typescript
// ✅ Bien
export function useIncomes() {
  return useQuery({
    queryKey: ['incomes'],
    queryFn: async () => { ... }
  })
}

// Retorna: { data, isLoading, error }
```

---

### Estilos

**Reglas:**
- ✅ TailwindCSS para todo el styling
- ✅ Usar componentes shadcn/ui cuando sea posible
- ✅ Clases ordenadas: layout → spacing → typography → colors

**Ejemplo:**
```typescript
// ✅ Bien
<Card className="border-gray-200/80 hover:shadow-md transition-shadow">
  <CardHeader className="pb-3">
    <CardTitle className="text-sm font-medium text-gray-700">
      Título
    </CardTitle>
  </CardHeader>
</Card>
```

---

### Validación

**Reglas:**
- ✅ Schemas Zod en `lib/validators/index.ts`
- ✅ Validar en cliente (UX) y servidor (seguridad)
- ✅ Mensajes de error en español (i18n)

**Ejemplo:**
```typescript
// lib/validators/index.ts
export const incomeSchema = z.object({
  label: z.string().min(1, 'El nombre es requerido').max(100),
  amount: z.number().min(0, 'El monto debe ser positivo'),
})

// En componente
const form = useForm({
  resolver: zodResolver(incomeSchema),
})
```

---

### Supabase

**Reglas:**
- ✅ RLS siempre habilitado
- ✅ Políticas owner-only por defecto
- ✅ Índices en columnas de búsqueda
- ✅ Usar tipos generados en `types/database.types.ts`

**Ejemplo:**
```typescript
// ✅ Bien
const { data } = await supabase
  .from('incomes')
  .select('*')
  .eq('user_id', user.id)  // RLS ya filtra, pero explícito es mejor
  .order('created_at', { ascending: false })
```

---

### Data Fetching

**Reglas:**
- ✅ TanStack Query para todas las queries
- ✅ Invalidar queries después de mutaciones
- ✅ Toasts para feedback de mutaciones
- ✅ Manejar loading y error states

**Ejemplo:**
```typescript
// ✅ Bien
export function useCreateIncome() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data) => { ... },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] })
      toast.success('Ingreso creado')
    },
    onError: (error) => {
      toast.error('Error: ' + error.message)
    },
  })
}
```

---

## 🐛 Troubleshooting

### Problemas Comunes

#### 1. Error: "No user found"

**Causa:** Usuario no está autenticado o token expirado.

**Solución:**
```typescript
// Verificar autenticación
const { data: { user } } = await supabase.auth.getUser()
if (!user) {
  router.push('/login')
  return
}
```

---

#### 2. Error: "Row Level Security policy violation"

**Causa:** RLS no está configurado correctamente o usuario no tiene permisos.

**Solución:**
1. Verifica que RLS está habilitado:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

2. Verifica que las políticas existen:
```sql
SELECT * FROM pg_policies WHERE tablename = 'incomes';
```

3. Aplica migraciones nuevamente: `supabase/migrations/002_row_level_security.sql`

---

#### 3. Error: "Failed to fetch" en producción

**Causa:** Variables de entorno no configuradas en Netlify/Vercel.

**Solución:**
1. Ve a configuración de tu sitio en Netlify/Vercel
2. Agrega variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Re-deploy

---

#### 4. Error: Cálculos incorrectos

**Causa:** Datos no están activos en el mes actual o fechas incorrectas.

**Solución:**
1. Verifica que `is_active = true` en los registros
2. Verifica que `starts_on <= fin_mes` y `ends_on >= inicio_mes`
3. Revisa la lógica en `lib/finance/calc.ts`

---

#### 5. Error: Traducciones no funcionan

**Causa:** `I18nProvider` no está en el layout o hook `useI18n()` fuera del provider.

**Solución:**
1. Verifica que `I18nProvider` está en `app/layout.tsx`
2. Verifica que `useI18n()` se llama dentro de un componente hijo del provider

---

### Comandos de Debugging

```bash
# Ver tipos generados
npm run supabase:types

# Verificar tipos TypeScript
npm run type-check

# Ver errores de linting
npm run lint

# Build local para ver errores
npm run build
```

---

## 🎯 Próximos Pasos

### Funcionalidades Pendientes

#### 1. Plan Plus

**Objetivos:**
- Sistema de suscripciones con Stripe
- Historial extendido (24 meses)
- Gráficos avanzados
- Exportación a CSV/Excel
- Sistema de sobres/buckets

**Implementación:**
- Integrar Stripe para pagos
- Crear tabla `subscriptions` para tracking
- Agregar verificación de plan en hooks/queries

---

#### 2. Testing

**Objetivos:**
- Unit tests para lógica de cálculo
- Integration tests para hooks
- E2E tests para flujos críticos

**Herramientas sugeridas:**
- Vitest - Unit tests
- React Testing Library - Component tests
- Playwright - E2E tests

---

#### 3. App Móvil

**Objetivos:**
- React Native / Expo app
- Reutilizar lógica de `lib/finance/calc.ts`
- Mismo backend Supabase

**Estructura sugerida:**
```
sobra-mobile/
├── src/
│   ├── lib/
│   │   └── finance/
│   │       └── calc.ts  # Copiar desde web
│   └── screens/
│       ├── Dashboard.tsx
│       ├── Incomes.tsx
│       └── ...
```

---

### Mejoras Técnicas

#### 1. Performance

- ✅ Ya implementado: Caché con TanStack Query
- 🔜 Implementar: Paginación para listas largas
- 🔜 Implementar: Virtualización de listas

#### 2. Accesibilidad

- 🔜 Agregar: ARIA labels completos
- 🔜 Agregar: Navegación por teclado
- 🔜 Agregar: Soporte para screen readers

#### 3. SEO

- ✅ Ya implementado: Meta tags, JSON-LD, sitemap.xml, robots.txt
- 🔜 Agregar: Open Graph images personalizadas
- 🔜 Agregar: Analytics (Google Analytics o Plausible)

---

## 📞 Recursos Útiles

### Documentación Externa

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)

### Archivos de Referencia en el Proyecto

- `README.md` - README principal
- `DATABASE.md` - Documentación de base de datos
- `ARCHITECTURE.md` - Arquitectura del sistema
- `ROUTES.md` - Documentación de rutas
- `DEPLOY_NETLIFY.md` - Guía de deployment en Netlify

---

## ✅ Checklist para Nuevo Desarrollador

### Setup Inicial

- [ ] Clonar repositorio
- [ ] Instalar dependencias: `npm install`
- [ ] Crear `.env.local` con variables de Supabase
- [ ] Aplicar migraciones SQL en Supabase
- [ ] Verificar que RLS está habilitado
- [ ] Ejecutar `npm run dev` y verificar que funciona

### Entendimiento del Código

- [ ] Leer `README.md`
- [ ] Leer esta documentación técnica completa
- [ ] Revisar estructura de archivos
- [ ] Entender flujo de autenticación
- [ ] Entender lógica de cálculo (`lib/finance/calc.ts`)
- [ ] Revisar hooks personalizados
- [ ] Revisar componentes principales

### Práctica

- [ ] Crear un ingreso de prueba
- [ ] Crear un gasto fijo de prueba
- [ ] Crear un compromiso de prueba
- [ ] Verificar que el cálculo funciona correctamente
- [ ] Probar cambio de idioma
- [ ] Probar logout/login

---

## 📋 Notas Finales

### Puntos Clave a Recordar

1. **RLS siempre activo** - Los usuarios solo ven sus propios datos
2. **Lógica de cálculo en funciones puras** - Reutilizable para móvil
3. **i18n completo** - Todo el texto debe usar `t.*` del hook `useI18n()`
4. **TanStack Query para todo** - No usar `useState` para datos del servidor
5. **TypeScript estricto** - Evitar `any`, usar tipos explícitos
6. **Validación doble** - Zod en cliente + RLS en servidor

### Contacto y Soporte

Si tienes preguntas sobre el código:
1. Revisa esta documentación
2. Revisa los comentarios en el código
3. Revisa las migraciones SQL para entender el esquema
4. Revisa los hooks para entender los flujos de datos

---

**Última actualización:** Diciembre 2024  
**Versión del documento:** 1.0  
**Mantenido por:** Equipo de desarrollo SOBRA

---

