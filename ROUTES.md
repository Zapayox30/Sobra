# Rutas y Secciones de SOBRA

Este documento describe todas las rutas y secciones de la aplicación SOBRA.

---

## 📍 Estructura de Rutas

### Públicas (Sin Autenticación)

#### `/` - Landing Page
- **Nombre:** Página de Inicio
- **Descripción:** Landing page con información sobre la aplicación
- **Componentes:**
  - Hero section
  - Features section
  - FAQ section
  - CTA section
  - Footer

#### `/login` - Iniciar Sesión
- **Nombre:** Login
- **Descripción:** Página para iniciar sesión en la aplicación
- **Componentes:**
  - Formulario de login (email, password)
  - Link a registro

#### `/register` - Registrarse
- **Nombre:** Register
- **Descripción:** Página para crear una nueva cuenta
- **Componentes:**
  - Formulario de registro (nombre, email, password, confirm password)
  - Link a login

#### `/onboarding` - Onboarding
- **Nombre:** Onboarding
- **Descripción:** Configuración inicial después del registro
- **Componentes:**
  - Formulario de perfil inicial
  - Selección de moneda
  - Selección de período (mensual/quincenal)
  - Ingreso inicial opcional

---

### Protegidas (Requiere Autenticación)

Todas las rutas bajo `/dashboard`, `/incomes`, `/expenses`, `/commitments`, y `/profile` requieren autenticación.

#### `/dashboard` - Dashboard
- **Nombre:** Dashboard
- **Descripción:** Vista general de las finanzas personales
- **Componentes:**
  - Card principal "Lo que te SOBRA"
  - Sugerencia de gasto diario
  - Cards de resumen (Ingresos, Gastos Fijos, Compromisos, Presupuesto Personal)
  - Desglose de cálculo

#### `/incomes` - Ingresos
- **Nombre:** Incomes / Ingresos
- **Descripción:** Gestión de ingresos mensuales
- **Componentes:**
  - Lista de ingresos activos
  - Card de resumen de ingresos totales
  - Card de balance después de gastos
  - Formulario para agregar/editar ingresos
  - Alerta si el balance es negativo

#### `/expenses` - Gastos
- **Nombre:** Expenses / Gastos
- **Descripción:** Gestión de gastos fijos y presupuestos personales
- **Componentes:**
  - Tabs para cambiar entre Gastos Fijos y Presupuestos Personales
  - Lista de gastos fijos
  - Lista de presupuestos personales
  - Formulario para agregar/editar gastos
  - Categorías predefinidas con opción personalizada

#### `/commitments` - Compromisos
- **Nombre:** Commitments / Compromisos
- **Descripción:** Gestión de compromisos financieros mensuales
- **Componentes:**
  - Lista de compromisos activos
  - Card de total de compromisos
  - Formulario para agregar/editar compromisos
  - Fechas de inicio y fin

#### `/profile` - Perfil
- **Nombre:** Profile / Perfil
- **Descripción:** Configuración del perfil de usuario
- **Componentes:**
  - Formulario de información personal (nombre completo)
  - Selector de moneda
  - Selector de período
  - Información del plan actual
  - Estado del plan

---

## 🗂️ Nombres de Secciones (Internos)

### En Código (Variables/Constantes)

```typescript
// Rutas
const routes = {
  home: '/',
  login: '/login',
  register: '/register',
  onboarding: '/onboarding',
  dashboard: '/dashboard',
  incomes: '/incomes',
  expenses: '/expenses',
  commitments: '/commitments',
  profile: '/profile',
}

// Nombres de secciones
const sections = {
  dashboard: 'Dashboard',
  incomes: 'Ingresos',
  expenses: 'Gastos',
  commitments: 'Compromisos',
  profile: 'Perfil',
}
```

### En Base de Datos

```sql
-- Tablas relacionadas con secciones
profiles           -- Información del usuario
incomes            -- Ingresos
fixed_expenses     -- Gastos fijos
personal_expenses  -- Presupuestos personales
monthly_commitments -- Compromisos
```

---

## 🌐 Internacionalización

### Idiomas Soportados

- **Español (es)** - Idioma por defecto
- **Inglés (en)** - Idioma secundario

### Rutas y Traducciones

Las rutas NO cambian según el idioma. El contenido se traduce usando el sistema de i18n.

```typescript
// Ejemplo de uso
const { t } = useI18n()
t.nav.dashboard  // "Dashboard" o "Dashboard"
t.nav.incomes    // "Ingresos" o "Incomes"
t.nav.expenses   // "Gastos" o "Expenses"
```

---

## 💰 Monedas Soportadas

### Monedas Disponibles

1. **USD** - Dólar Estadounidense ($)
2. **EUR** - Euro (€)
3. **MXN** - Peso Mexicano ($)
4. **ARS** - Peso Argentino ($)
5. **PEN** - Sol Peruano (S/) ⭐ **NUEVO**

### Formato de Monedas

Cada moneda se formatea según su locale:
- USD: `en-US` → $1,234.56
- EUR: `es-ES` → 1.234,56 €
- MXN: `es-MX` → $1,234.56
- ARS: `es-AR` → $ 1.234,56
- PEN: `es-PE` → S/ 1,234.56

---

## 📱 Componentes Compartidos

### Layout Components

- **Header** (`components/layout/header.tsx`)
  - Logo
  - Navegación principal
  - Selector de idioma
  - Botón de perfil
  - Botón de logout

- **Sidebar** (`components/layout/sidebar.tsx`)
  - Navegación lateral (si se usa)

### Selectors

- **LanguageSelector** (`components/layout/language-selector.tsx`)
  - Selector de idioma (Español/English)

- **CurrencySelector** (en formularios)
  - Selector de moneda con banderas

---

## 🔐 Protección de Rutas

### Middleware

El archivo `middleware.ts` protege las rutas privadas:

```typescript
// Rutas protegidas
const protectedRoutes = [
  '/dashboard',
  '/incomes',
  '/expenses',
  '/commitments',
  '/profile',
]

// Rutas públicas
const publicRoutes = [
  '/',
  '/login',
  '/register',
]
```

### Row Level Security (RLS)

Todas las tablas tienen políticas RLS que aseguran que los usuarios solo accedan a sus propios datos:

```sql
-- Ejemplo: políticas RLS para incomes
CREATE POLICY "Users can view own incomes"
ON incomes FOR SELECT
USING (auth.uid() = user_id);
```

---

## 📝 Convenciones de Nombres

### Archivos de Páginas

- Rutas públicas: `app/(auth)/[route]/page.tsx`
- Rutas protegidas: `app/(app)/[route]/page.tsx`
- Landing: `app/page.tsx`

### Componentes

- Formularios: `components/forms/[entity]-form.tsx`
- Layout: `components/layout/[component].tsx`
- UI: `components/ui/[component].tsx`

### Hooks

- Data hooks: `hooks/use-[entity].ts`
- Business hooks: `hooks/use-[function].ts`

---

## 🚀 Próximas Rutas (Futuro)

- `/settings` - Configuraciones avanzadas
- `/reports` - Reportes y gráficos
- `/export` - Exportar datos
- `/help` - Centro de ayuda
- `/about` - Acerca de

---

**Última actualización:** 2024
**Versión:** 1.0

