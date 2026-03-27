# 🏗️ Plan de Mejoras de Estructura - SOBRA Mobile

## ✅ Ya Completado

### 1. Factory de Hooks CRUD
- **Estado:** ✅ Completado
- **Impacto:** Reducción de ~320 líneas de código repetido
- **Archivos:** `create-crud-hooks.ts` + 6 archivos refactorizados
- **Beneficio:** Agregar nuevas entidades toma 3 líneas en vez de 70

---

## 🎯 Próximas Prioridades (Orden Sugerido)

### 2. Consolidar Constantes y Categorías
**Prioridad:** Alta 🔴  
**Esfuerzo:** Bajo (1-2 horas)

**Problema:**
- `QuickAddModal.tsx` tiene categorías hardcodeadas (línea 24-31)
- `@sobra/shared/constants/categories.ts` tiene otra lista
- Las categorías no están sincronizadas entre mobile y shared

**Solución:**
```typescript
// En @sobra/shared/constants/categories.ts
export const PERSONAL_EXPENSE_QUICK_CATEGORIES = [
  { id: 'comida', label: 'Comida', icon: '🍔', color: '#fbbf24' },
  { id: 'transporte', label: 'Transporte', icon: '🚕', color: '#60a5fa' },
  // ...
]

// En QuickAddModal.tsx
import { PERSONAL_EXPENSE_QUICK_CATEGORIES } from '@sobra/shared'
```

**Impacto:**
- Single source of truth para categorías
- Fácil agregar/modificar categorías desde un solo lugar
- Web puede reutilizar las mismas categorías

---

### 3. Tipado de Navigation (Types Centralizados)
**Prioridad:** Media 🟡  
**Esfuerzo:** Bajo (1 hora)

**Problema:**
- Cada screen puede recibir params pero no hay validación
- TypeScript no valida las rutas de navegación

**Solución:**
```typescript
// src/navigation/types.ts (ya existe pero expandir)
export type RootStackParamList = {
  Auth: undefined
  Main: undefined
}

export type AuthStackParamList = {
  Login: undefined
  Register: undefined
}

export type MainTabParamList = {
  Dashboard: undefined
  Incomes: { categoryFilter?: string }
  Expenses: { categoryFilter?: string }
  Cards: { cardId?: string }
  Profile: undefined
}
```

---

### 4. Separar Lógica de UI en Screens Grandes
**Prioridad:** Media 🟡  
**Esfuerzo:** Medio (3-4 horas)

**Problema:**
- `ExpensesScreen.tsx` tiene 302 líneas (muy grande)
- `DashboardScreen.tsx` tiene 264 líneas
- Mezcla lógica de negocio con UI

**Solución:**
Crear custom hooks para lógica de negocio:

```typescript
// src/screens/main/Dashboard/useDashboardData.ts
export function useDashboardData() {
  const { surplus, isLoading } = useSurplus()
  const { data: history } = useSurplusHistory()
  
  const pieData = useMemo(() => {
    // Lógica de preparación de gráficos
  }, [surplus])
  
  const barData = useMemo(() => {
    // Lógica de historial
  }, [history])
  
  return { surplus, isLoading, pieData, barData }
}

// DashboardScreen.tsx - solo UI
export default function DashboardScreen() {
  const { surplus, pieData, barData } = useDashboardData()
  return <View>...</View>
}
```

**Impacto:**
- Archivos más pequeños y legibles
- Lógica reutilizable y testeable
- Separación clara de responsabilidades

---

### 5. Crear Components de Features (Feature Folders)
**Prioridad:** Media-Baja 🟢  
**Esfuerzo:** Alto (5-6 horas)

**Problema actual:**
```
src/
├── components/ui/      # ✅ Buenos componentes genéricos
├── screens/main/       # ❌ Todo mezclado aquí
└── hooks/              # ❌ Todos los hooks juntos
```

**Estructura propuesta:**
```
src/
├── components/ui/            # Componentes genéricos (Button, Card, Input)
├── features/
│   ├── dashboard/
│   │   ├── DashboardScreen.tsx
│   │   ├── useDashboardData.ts
│   │   ├── components/
│   │   │   ├── SurplusCard.tsx
│   │   │   ├── ClassificationBadge.tsx
│   │   │   └── HistoryChart.tsx
│   │   └── index.ts
│   ├── incomes/
│   │   ├── IncomesScreen.tsx
│   │   ├── IncomeForm.tsx
│   │   ├── hooks/
│   │   │   ├── use-incomes.ts
│   │   │   └── use-income-form.ts
│   │   └── index.ts
│   └── expenses/
│       ├── ExpensesScreen.tsx
│       ├── QuickAddModal.tsx      # Movido aquí
│       ├── hooks/
│       │   └── use-expenses.ts
│       └── index.ts
├── hooks/
│   ├── create-crud-hooks.ts       # Factory genérica
│   ├── use-surplus.ts             # Hook principal
│   └── use-auth.ts                # Hook global
└── screens/                        # Solo para rutas sin feature
    └── auth/
```

**Beneficios:**
- Código relacionado vive junto ("colocación")
- Fácil encontrar todo lo relacionado a una feature
- Mejor para work en equipo (menos conflictos)
- Preparado para code splitting futuro

---

### 6. Barrel Exports Organizados
**Prioridad:** Baja 🟢  
**Esfuerzo:** Bajo (30 min)

**Problema:**
Imports largos y repetitivos:
```typescript
import { useIncomes } from '../../hooks/use-incomes'
import { useDebts } from '../../hooks/use-debts'
import { useExpenses } from '../../hooks/use-expenses'
```

**Solución:**
```typescript
// src/hooks/index.ts
export * from './use-incomes'
export * from './use-debts'
export * from './use-expenses'
export * from './use-surplus'

// En componentes
import { useIncomes, useDebts, useExpenses } from '@/hooks'
```

También crear barrel para componentes:
```typescript
// src/components/index.ts
export * from './ui'

// Uso
import { Button, Card, Input } from '@/components'
```

---

### 7. Configurar Path Aliases
**Prioridad:** Baja 🟢  
**Esfuerzo:** Bajo (15 min)

**Cambiar:**
```typescript
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../../hooks/use-auth'
```

**A esto:**
```typescript
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/use-auth'
```

**Config en tsconfig.json:**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/screens/*": ["src/screens/*"],
      "@/lib/*": ["src/lib/*"]
    }
  }
}
```

---

## 📊 Resumen de Impacto

| Mejora | Prioridad | Esfuerzo | Impacto en MVP | Impacto en Escala |
|--------|-----------|----------|----------------|-------------------|
| 1. Factory CRUD | ✅ Hecho | Bajo | Medio | Alto |
| 2. Constantes compartidas | 🔴 Alta | Bajo | Alto | Alto |
| 3. Tipado Navigation | 🟡 Media | Bajo | Bajo | Medio |
| 4. Separar lógica/UI | 🟡 Media | Medio | Medio | Alto |
| 5. Feature Folders | 🟢 Baja | Alto | Bajo | Muy Alto |
| 6. Barrel Exports | 🟢 Baja | Bajo | Bajo | Medio |
| 7. Path Aliases | 🟢 Baja | Bajo | Bajo | Medio |

---

## 🚀 Recomendación para MVP

Para sacar el MVP rápido, enfócate en:

1. ✅ **Factory CRUD** - Ya hecho
2. 🔴 **Constantes compartidas** - Crítico para no tener bugs de sincronización
3. 🟡 **Separar lógica en 2-3 screens más grandes** - Mejora legibilidad sin mucho esfuerzo

Las demás mejoras (Feature Folders, Path Aliases) son inversión para el futuro pero no bloquean el MVP.

---

**Última actualización:** 2026-03-27
