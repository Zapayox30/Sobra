# SOBRA 💰

**Tu sobrante, tu poder.** App de finanzas personales para Perú que te dice exactamente cuánto te sobra cada mes y te ayuda a hacer crecer ese dinero.

---

## 🎯 Visión

Ser la app financiera de referencia en Perú que convierte el desorden monetario en claridad y acción — desde saber cuánto te sobra hasta invertir tu excedente de forma inteligente.

## 🚀 Misión

Ayudar a cada persona en Perú a responder con confianza: **"¿Cuánto me sobra este mes?"** y darle las herramientas para proteger, crecer y educar sus finanzas.

## 🏛️ Los 5 Pilares

| # | Pilar | Descripción |
|---|---|---|
| 1 | **Cálculo de Sobrante** | Motor que calcula tu surplus real restando ingresos − gastos fijos − deudas − ahorro − compromisos − tarjetas. Te dice cuánto puedes gastar por día. |
| 2 | **Colchón Financiero** | Fondo de emergencia inteligente. Te guía para construir 3–6 meses de respaldo según tu situación. |
| 3 | **Consejos de Inversión** | Una vez que tienes sobrante y colchón, sugerencias personalizadas de dónde colocar tu dinero (depósitos a plazo, fondos mutuos, etc.). |
| 4 | **Educación Financiera** | Tips contextuales dentro de la app que te enseñan a mejorar tus hábitos con tu propia data. |
| 5 | **Conexión Bancaria** | Sincronización con BCP, Interbank, BBVA y Scotiabank vía Belvo API para importar movimientos automáticamente. |

---

## 🛠 Stack Técnico

### Frontend

| Tecnología | Versión | Rol |
|---|---|---|
| Next.js | 16 | Framework (App Router, Turbopack) |
| React | 19 | UI library |
| TypeScript | 5 | Tipado estricto |
| TailwindCSS | 4 | Estilos |
| shadcn/ui | latest | Componentes UI (New York style) |
| TanStack Query | 5 | Data fetching + caché |
| React Hook Form | 7 | Formularios |
| Zod | 4 | Validación de schemas |
| Recharts | 3 | Gráficos |
| Lucide | latest | Iconos |

### Backend

| Tecnología | Rol |
|---|---|
| Supabase | BaaS (PostgreSQL 17, Auth, RLS) |
| Row Level Security | Aislamiento de datos por usuario |

### Infraestructura

| Servicio | Rol |
|---|---|
| Netlify | Deploy + CDN |
| Supabase Cloud | Base de datos + Auth |

---

## 🏗 Arquitectura

### Principios

1. **Single Source of Truth** — Los tipos se generan desde la BD (`database.types.ts`) y se re-exportan centralizados desde `types/index.ts`
2. **Funciones Puras** — La lógica financiera vive en `sobra-engine/` sin dependencias de framework
3. **Seguridad por defecto** — RLS en todas las tablas, políticas owner-only, validación con Zod
4. **Cero `any`** — TypeScript estricto en todo el codebase

### Sobra Engine

El corazón del producto. Motor de cálculo puro que computa el sobrante mensual:

```
gross_surplus = ingresos − gastos_fijos − deudas − ahorro − compromisos − tarjetas
net_surplus   = gross_surplus − gastos_personales

Clasificación del sobrante:
  safe (50%)        → invertible
  operative (30%)   → buffer operativo
  unavailable (20%) → reserva de emergencia
```

Calcula además la **sugerencia diaria** de gasto basada en los días restantes del mes.

### Base de Datos (20 tablas)

```
┌─ Usuarios ─────────────────────────────┐
│ profiles · plans · user_plans          │
├─ Ingresos y Gastos ───────────────────┤
│ incomes · fixed_expenses               │
│ personal_expenses · monthly_commitments │
├─ Patrimonio ──────────────────────────┤
│ accounts · wallets · debts             │
│ savings_goals                          │
├─ Tarjetas de Crédito ────────────────┤
│ credit_cards · card_statements         │
│ card_transactions · card_payments      │
├─ Motor de Sobrante ──────────────────┤
│ surplus_history                        │
├─ Educación y Alertas ────────────────┤
│ financial_tips · user_tips             │
│ financial_alerts                       │
├─ Conexiones Bancarias ───────────────┤
│ bank_connections                       │
└────────────────────────────────────────┘
```

Todas las tablas tienen RLS habilitado con políticas `user_id = auth.uid()`.

### Data Flow

```
Usuario → React Hook Form + Zod (validación)
       → TanStack Query mutation
       → Supabase Client (RLS)
       → PostgreSQL

PostgreSQL → Supabase Client
           → TanStack Query (caché)
           → Sobra Engine (cálculo puro)
           → UI (componentes React)
```

---

## 📁 Estructura del Proyecto

```
sobra/
├── src/
│   ├── app/                        # Rutas (Next.js App Router)
│   │   ├── (auth)/                 # Login, registro, onboarding
│   │   ├── (app)/                  # Rutas protegidas (dashboard, CRUD)
│   │   ├── auth/callback/          # OAuth callback
│   │   ├── contact/                # Página de contacto
│   │   ├── pricing/                # Página de precios
│   │   ├── layout.tsx              # Root layout (providers)
│   │   └── page.tsx                # Landing page
│   │
│   ├── components/
│   │   ├── auth/                   # Componentes de autenticación
│   │   ├── charts/                 # Gráficos (Recharts)
│   │   ├── forms/                  # Formularios (income, expense, commitment)
│   │   ├── layout/                 # Header, sidebar, mobile-nav
│   │   ├── metrics/                # Alertas y métricas
│   │   ├── providers/              # QueryProvider, I18nProvider
│   │   ├── ui/                     # shadcn/ui primitives
│   │   ├── landing-content.tsx     # Contenido del landing
│   │   └── logo.tsx                # Logo de SOBRA
│   │
│   ├── hooks/                      # Hooks de datos (10 hooks use-*.ts)
│   │
│   ├── lib/
│   │   ├── sobra-engine/           # Motor de cálculo de sobrante
│   │   ├── supabase/               # Clientes (browser, server, middleware)
│   │   ├── validators/             # Schemas Zod
│   │   ├── calc.ts                 # Funciones financieras
│   │   ├── categories.ts           # Categorías de gastos
│   │   ├── chart-utils.ts          # Utilidades para gráficos
│   │   ├── thresholds.ts           # Umbrales de alertas
│   │   ├── translations.ts         # Strings i18n (es/en)
│   │   └── utils.ts                # cn() + serializeDates()
│   │
│   ├── types/
│   │   ├── database.types.ts       # Auto-generado desde Supabase
│   │   └── index.ts                # Re-exports centralizados (source of truth)
│   │
│   └── middleware.ts               # Auth middleware
│
├── supabase/
│   └── migrations/
│       └── v2_complete_schema.sql  # Schema completo (20 tablas)
│
├── public/                         # Assets estáticos (favicon, manifest, PWA icons)
├── package.json
├── tsconfig.json
├── next.config.ts
└── netlify.toml
```

---

## 🚀 Setup

### Prerequisitos

- Node.js 20+ (ver `.nvmrc`)
- Cuenta en Supabase

### Instalación

```bash
git clone <repo-url>
cd sobra
npm install
cp env.example .env.local
# Editar .env.local con tus credenciales de Supabase
```

### Variables de Entorno

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

### Desarrollo

```bash
npm run dev          # Servidor local con Turbopack
npm run build        # Build de producción
npm run lint         # ESLint
npm run type-check   # TypeScript sin emitir
```

---

## 📈 Estado Actual

### ✅ Implementado

- Autenticación (email/password + Google OAuth)
- Onboarding inicial con perfil
- CRUD completo: ingresos, gastos fijos, gastos personales, compromisos
- Tarjetas de crédito (estados de cuenta, transacciones, pagos)
- Dashboard con cálculo automático de sobrante
- Sugerencia de gasto diario
- Gráficos (distribución de gastos, tendencia mensual, breakdown financiero)
- Sistema de alertas financieras
- i18n (español / inglés)
- Responsive design
- Deploy en Netlify

### 🔜 Próximos Pasos

- [ ] Cuentas bancarias y billeteras (UI)
- [ ] Deudas y metas de ahorro (UI)
- [ ] Historial de sobrante mensual
- [ ] Pilar 2: Colchón financiero (guía de fondo de emergencia)
- [ ] Pilar 3: Consejos de inversión personalizados
- [ ] Pilar 4: Tips de educación financiera contextuales
- [ ] Pilar 5: Conexión bancaria vía Belvo API
- [ ] PWA (Progressive Web App)
- [ ] Tests (Vitest + Playwright)
- [ ] Plan Plus con Stripe

---

## 📄 Licencia

Proyecto privado. Todos los derechos reservados.
