# Arquitectura de SOBRA

## Visión General

SOBRA es una aplicación web de gestión financiera personal construida con Next.js y Supabase, diseñada para ser escalable, mantenible y preparada para expansión móvil.

## Principios de Diseño

1. **Separación de responsabilidades**: UI, lógica de negocio y acceso a datos están claramente separados
2. **Funciones puras**: La lógica financiera es independiente del framework
3. **Type-safety**: TypeScript en todo el proyecto
4. **Security-first**: RLS en todas las tablas, validación en cliente y servidor
5. **Mobile-ready**: Lógica compartible con React Native/Expo

## Stack Técnico

### Frontend
- **Next.js 15** (App Router) - Framework React con SSR/SSG
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first CSS
- **shadcn/ui** - Componentes UI accesibles
- **TanStack Query** - Data fetching y caché
- **React Hook Form + Zod** - Formularios y validación

### Backend
- **Supabase** - BaaS completo
  - PostgreSQL - Base de datos relacional
  - Auth - Autenticación JWT
  - RLS - Row Level Security
  - Edge Functions - Serverless (futuro)

## Arquitectura de Carpetas

```
app/                    # Next.js App Router
├── (auth)/            # Grupo de rutas públicas
│   ├── login/
│   ├── register/
│   └── onboarding/
└── (app)/             # Grupo de rutas protegidas
    ├── dashboard/
    ├── incomes/
    ├── expenses/
    ├── commitments/
    └── profile/

components/
├── forms/             # Formularios específicos del dominio
├── layout/            # Componentes de layout (Header, Sidebar)
└── ui/                # Componentes UI base (shadcn/ui)

hooks/                 # React hooks personalizados
├── use-user.ts        # Auth y perfil
├── use-incomes.ts     # CRUD ingresos
├── use-expenses.ts    # CRUD gastos
├── use-commitments.ts # CRUD compromisos
└── use-calculation.ts # Lógica de cálculo

lib/
├── finance/           # 🎯 Lógica de dominio (pura, reutilizable)
│   └── calc.ts
├── providers/         # React providers
├── supabase/          # Clientes Supabase
│   ├── browser.ts
│   ├── server.ts
│   └── middleware.ts
├── validators/        # Schemas Zod
└── utils.ts

supabase/
└── migrations/        # Migraciones SQL versionadas

types/                 # Tipos TypeScript
├── database.types.ts  # Generados desde Supabase
└── index.ts           # Tipos de dominio
```

## Flujo de Datos

### 1. Lectura (Query)

```
Component
  ↓ usa
Hook (TanStack Query)
  ↓ llama
Supabase Client (browser)
  ↓ query SQL con RLS
PostgreSQL
  ↓ retorna datos filtrados
Hook (caché + revalidación)
  ↓ provee
Component (render)
```

### 2. Escritura (Mutation)

```
Component (form submit)
  ↓ valida con
Zod Schema
  ↓ envía a
Hook Mutation
  ↓ llama
Supabase Client
  ↓ insert/update con RLS
PostgreSQL
  ↓ success
Hook (invalidate queries)
  ↓ refetch automático
Component (actualizado)
```

### 3. Cálculo Financiero

```
Component
  ↓ usa
useMonthlyCalculation hook
  ↓ obtiene datos de
[useIncomes, useExpenses, useCommitments]
  ↓ pasa a
lib/finance/calc.ts (función pura)
  ↓ retorna
CalculationResult
  ↓ renderiza
Component (dashboard)
```

## Base de Datos

### Modelo Entidad-Relación

```
auth.users (Supabase Auth)
    ↓ 1:1
profiles
    ↓ 1:1
user_plans → plans
    ↓ 1:N
[incomes, fixed_expenses, personal_expenses, monthly_commitments, monthly_summaries]
```

### Seguridad (RLS)

Todas las tablas de usuario tienen políticas:

```sql
-- Ejemplo: incomes
CREATE POLICY "select_own_incomes" ON incomes
FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "insert_own_incomes" ON incomes
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- Similar para UPDATE y DELETE
```

Esto garantiza que:
- ✅ Cada usuario solo ve sus datos
- ✅ No puede leer/modificar datos de otros
- ✅ La seguridad está en la BD, no en el cliente

## Lógica de Negocio

### Cálculo de SOBRA

La función principal está en `lib/finance/calc.ts`:

```typescript
calculateMonthlySobra({
  monthStart: Date,
  incomes: Income[],
  fixedExpenses: Expense[],
  personalBudgets: Expense[],
  commitments: Commitment[]
}) → CalculationResult
```

**Algoritmo:**

1. Filtrar registros activos en el mes
2. Sumar ingresos totales
3. Sumar gastos fijos
4. Sumar compromisos del mes
5. Calcular: `sobrante_antes = ingresos - fijos - compromisos`
6. Sumar presupuestos personales
7. Calcular: `sobrante_después = sobrante_antes - personales`
8. Calcular sugerencia diaria: `sobrante / días_restantes`

**Por qué funciones puras:**
- ✅ Testeable sin mocks
- ✅ Reutilizable en web y móvil
- ✅ Sin efectos secundarios
- ✅ Predecible y debuggeable

## Autenticación y Autorización

### Flujo de Auth

1. **Registro**: `supabase.auth.signUp()` → trigger crea `profile` y asigna plan Free
2. **Login**: `supabase.auth.signInWithPassword()` → JWT en cookie
3. **Middleware**: valida JWT en cada request, redirige si no autenticado
4. **RLS**: PostgreSQL valida `auth.uid()` en cada query

### Middleware

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  return await updateSession(request)
}
```

Protege automáticamente todas las rutas excepto `/login`, `/register`, `/auth/*`

## Estado y Caché

### TanStack Query

```typescript
// Configuración global
{
  staleTime: 60_000,        // 1 minuto
  refetchOnWindowFocus: false
}
```

### Estrategia de invalidación

Después de mutaciones:

```typescript
createIncome.mutate(data, {
  onSuccess: () => {
    queryClient.invalidateQueries(['incomes'])
    // Refetch automático
  }
})
```

## Validación

### Doble validación

1. **Cliente** (Zod + React Hook Form): feedback inmediato
2. **Servidor** (RLS + constraints): seguridad definitiva

```typescript
// Ejemplo: incomeSchema
const incomeSchema = z.object({
  label: z.string().min(1).max(100),
  amount: z.number().min(0).refine(/* max 2 decimales */),
  // ...
})
```

## Performance

### Optimizaciones implementadas

1. **Índices en BD**: `(user_id, ...)`, `(user_id, starts_on, ends_on)`
2. **Selects específicos**: solo columnas necesarias
3. **Caché de TanStack Query**: reduce requests
4. **React Server Components**: cuando sea posible
5. **Lazy loading**: componentes pesados con `next/dynamic`

### Métricas objetivo

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: > 90

## Escalabilidad

### Preparado para crecer

1. **Horizontal**: Supabase escala automáticamente
2. **Vertical**: Índices y queries optimizados
3. **Caché**: TanStack Query + futuro Redis
4. **CDN**: Vercel Edge Network
5. **Read replicas**: Supabase Pro (futuro)

### Plan Plus

Arquitectura preparada para features premium:

```typescript
// Hook de feature flag
const isPlusUser = useIsPlusUser()

if (isPlusUser) {
  // Mostrar features Plus
}
```

## Móvil (Futuro)

### Estrategia de reutilización

```
packages/
├── core/              # Lógica compartida
│   ├── finance/       # calc.ts (mismo código)
│   ├── validators/    # schemas Zod
│   └── types/         # tipos compartidos
├── web/               # Next.js (actual)
└── mobile/            # React Native/Expo
```

**Compartido:**
- ✅ Lógica de cálculo (`lib/finance`)
- ✅ Validadores Zod
- ✅ Tipos TypeScript
- ✅ Cliente Supabase
- ✅ Hooks de datos (adaptados)

**Específico:**
- UI/UX nativa
- Navegación (React Navigation)
- Almacenamiento local (AsyncStorage)

## Testing (Futuro)

### Estrategia

1. **Unit tests**: `lib/finance` (funciones puras)
2. **Integration tests**: hooks + Supabase
3. **E2E tests**: Playwright/Cypress

```typescript
// Ejemplo: test de cálculo
describe('calculateMonthlySobra', () => {
  it('calcula correctamente el sobrante', () => {
    const result = calculateMonthlySobra({
      monthStart: new Date('2024-01-01'),
      incomes: [{ amount: 3000, ... }],
      fixedExpenses: [{ amount: 1000, ... }],
      // ...
    })
    expect(result.leftoverAfterPersonal).toBe(2000)
  })
})
```

## Monitoreo (Futuro)

- **Sentry**: errores en producción
- **Vercel Analytics**: performance
- **Supabase Logs**: queries lentas
- **PostHog**: analytics de uso

## Buenas Prácticas

### Código

1. ✅ Nombres descriptivos
2. ✅ Funciones pequeñas (< 50 líneas)
3. ✅ Comentarios solo cuando sea necesario
4. ✅ Types explícitos (no `any`)
5. ✅ Manejo de errores consistente

### Git

1. Commits atómicos y descriptivos
2. Branches por feature: `feature/nombre`
3. PRs con descripción clara
4. No commitear `.env.local`

### Supabase

1. ✅ RLS siempre activo
2. ✅ Índices en columnas de búsqueda
3. ✅ Migraciones versionadas
4. ✅ Backups automáticos (Supabase)

---

**Esta arquitectura está diseñada para ser mantenible, escalable y preparada para el futuro móvil de SOBRA.**

