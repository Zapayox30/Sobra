# Ejemplos de Uso - SOBRA

Esta guía contiene ejemplos prácticos de cómo usar y extender SOBRA.

## 📚 Tabla de Contenidos

- [Uso Básico](#uso-básico)
- [Extender Funcionalidad](#extender-funcionalidad)
- [Queries Personalizadas](#queries-personalizadas)
- [Componentes Reutilizables](#componentes-reutilizables)

---

## Uso Básico

### Registrar un nuevo ingreso

```typescript
import { useCreateIncome } from '@/hooks/use-incomes'

function MyComponent() {
  const createIncome = useCreateIncome()

  const handleSubmit = async () => {
    await createIncome.mutateAsync({
      label: 'Sueldo mensual',
      amount: 3000,
      kind: 'salary',
      recurrence: 'monthly',
      starts_on: new Date(),
      is_active: true
    })
  }
}
```

### Obtener el cálculo del mes actual

```typescript
import { useMonthlyCalculation } from '@/hooks/use-calculation'
import { formatCurrency } from '@/lib/finance/calc'

function Dashboard() {
  const { calculation, isLoading } = useMonthlyCalculation()

  if (isLoading) return <div>Cargando...</div>

  return (
    <div>
      <h1>Te sobra: {formatCurrency(calculation.leftoverAfterPersonal)}</h1>
      <p>Puedes gastar {formatCurrency(calculation.dailySuggestion)} por día</p>
    </div>
  )
}
```

---

## Extender Funcionalidad

### Agregar una nueva categoría de gasto personal

**1. Actualizar el formulario:**

```typescript
// components/forms/expense-form.tsx
<SelectContent>
  <SelectItem value="personal">Personal</SelectItem>
  <SelectItem value="amigos">Amigos</SelectItem>
  <SelectItem value="pareja">Pareja</SelectItem>
  <SelectItem value="familia">Familia</SelectItem>
  <SelectItem value="mascotas">Mascotas</SelectItem> {/* Nueva */}
</SelectContent>
```

**2. Actualizar tipos (opcional):**

```typescript
// types/index.ts
export type PersonalCategory = 
  | 'personal' 
  | 'amigos' 
  | 'pareja' 
  | 'familia'
  | 'mascotas' // Nueva
```

### Agregar un nuevo tipo de ingreso

**1. Migración SQL:**

```sql
-- Agregar nuevo valor al check constraint
ALTER TABLE incomes 
DROP CONSTRAINT incomes_kind_check;

ALTER TABLE incomes 
ADD CONSTRAINT incomes_kind_check 
CHECK (kind IN ('salary', 'extra', 'other', 'freelance'));
```

**2. Actualizar tipos:**

```typescript
// types/database.types.ts
export type IncomeKind = 'salary' | 'extra' | 'other' | 'freelance'
```

**3. Actualizar validador:**

```typescript
// lib/validators/index.ts
kind: z.enum(['salary', 'extra', 'other', 'freelance'])
```

**4. Actualizar formulario:**

```typescript
// components/forms/income-form.tsx
<SelectContent>
  <SelectItem value="salary">Sueldo</SelectItem>
  <SelectItem value="extra">Extra</SelectItem>
  <SelectItem value="freelance">Freelance</SelectItem>
  <SelectItem value="other">Otro</SelectItem>
</SelectContent>
```

---

## Queries Personalizadas

### Obtener ingresos de un mes específico

```typescript
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/browser'

export function useIncomesForMonth(month: Date) {
  return useQuery({
    queryKey: ['incomes', 'month', month.toISOString()],
    queryFn: async () => {
      const supabase = createClient()
      const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1)
      const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0)

      const { data, error } = await supabase
        .from('incomes')
        .select('*')
        .lte('starts_on', endOfMonth.toISOString())
        .or(`ends_on.is.null,ends_on.gte.${startOfMonth.toISOString()}`)
        .eq('is_active', true)

      if (error) throw error
      return data
    }
  })
}
```

### Obtener total de gastos por categoría

```typescript
export function useExpensesByCategory() {
  return useQuery({
    queryKey: ['expenses', 'by-category'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('personal_expenses')
        .select('category, amount')
        .eq('is_active', true)

      if (error) throw error

      // Agrupar por categoría
      const grouped = data.reduce((acc, expense) => {
        const cat = expense.category
        acc[cat] = (acc[cat] || 0) + Number(expense.amount)
        return acc
      }, {} as Record<string, number>)

      return grouped
    }
  })
}
```

### Usar RPC para obtener totales del servidor

```typescript
export function useMonthTotalsRPC(month: Date) {
  return useQuery({
    queryKey: ['month-totals-rpc', month.toISOString()],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase.rpc('get_month_totals', {
        p_month: month.toISOString().split('T')[0]
      })

      if (error) throw error
      return data[0] // Retorna el primer resultado
    }
  })
}
```

---

## Componentes Reutilizables

### Componente de Tarjeta de Métrica

```typescript
// components/ui/metric-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string
  icon: LucideIcon
  color?: 'green' | 'red' | 'blue' | 'orange'
}

export function MetricCard({ title, value, icon: Icon, color = 'blue' }: MetricCardProps) {
  const colorClasses = {
    green: 'text-green-600',
    red: 'text-red-600',
    blue: 'text-blue-600',
    orange: 'text-orange-600'
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${colorClasses[color]}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${colorClasses[color]}`}>
          {value}
        </div>
      </CardContent>
    </Card>
  )
}
```

**Uso:**

```typescript
import { MetricCard } from '@/components/ui/metric-card'
import { DollarSign } from 'lucide-react'
import { formatCurrency } from '@/lib/finance/calc'

<MetricCard
  title="Ingresos Totales"
  value={formatCurrency(calculation.incomeTotal)}
  icon={DollarSign}
  color="green"
/>
```

### Hook personalizado para feature flags

```typescript
// hooks/use-feature-flag.ts
import { useIsPlusUser } from './use-user'

export function useFeatureFlag(feature: string) {
  const isPlusUser = useIsPlusUser()

  const features = {
    'advanced-charts': isPlusUser,
    'export-data': isPlusUser,
    'extended-history': isPlusUser,
    'envelopes': isPlusUser,
    'basic-dashboard': true, // Siempre disponible
  }

  return features[feature as keyof typeof features] ?? false
}
```

**Uso:**

```typescript
function Dashboard() {
  const canExport = useFeatureFlag('export-data')

  return (
    <div>
      {canExport && (
        <Button onClick={handleExport}>
          Exportar a CSV
        </Button>
      )}
    </div>
  )
}
```

### Componente de Confirmación

```typescript
// components/ui/confirm-dialog.tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onConfirm: () => void
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirmar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

**Uso:**

```typescript
const [showConfirm, setShowConfirm] = useState(false)
const deleteIncome = useDeleteIncome()

<ConfirmDialog
  open={showConfirm}
  onOpenChange={setShowConfirm}
  title="¿Eliminar ingreso?"
  description="Esta acción no se puede deshacer."
  onConfirm={() => {
    deleteIncome.mutate(incomeId)
    setShowConfirm(false)
  }}
/>
```

---

## Cálculos Avanzados

### Calcular proyección a 6 meses

```typescript
import { calculateMonthlySobra } from '@/lib/finance/calc'

export function calculateProjection(
  incomes: Income[],
  expenses: Expense[],
  commitments: Commitment[],
  months: number = 6
) {
  const results = []
  const today = new Date()

  for (let i = 0; i < months; i++) {
    const monthStart = new Date(today.getFullYear(), today.getMonth() + i, 1)
    
    const result = calculateMonthlySobra({
      monthStart,
      incomes,
      fixedExpenses: expenses,
      personalBudgets: [],
      commitments
    })

    results.push({
      month: monthStart,
      ...result
    })
  }

  return results
}
```

### Comparar mes actual vs anterior

```typescript
export function useMonthComparison() {
  const currentMonth = new Date()
  const previousMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)

  const current = useMonthlyCalculation(currentMonth)
  const previous = useMonthlyCalculation(previousMonth)

  if (current.isLoading || previous.isLoading) {
    return { isLoading: true }
  }

  const difference = 
    current.calculation!.leftoverAfterPersonal - 
    previous.calculation!.leftoverAfterPersonal

  const percentageChange = 
    (difference / previous.calculation!.leftoverAfterPersonal) * 100

  return {
    isLoading: false,
    current: current.calculation!,
    previous: previous.calculation!,
    difference,
    percentageChange,
    improved: difference > 0
  }
}
```

---

## Testing

### Test unitario de cálculo

```typescript
// __tests__/lib/finance/calc.test.ts
import { calculateMonthlySobra } from '@/lib/finance/calc'

describe('calculateMonthlySobra', () => {
  it('calcula correctamente el sobrante', () => {
    const result = calculateMonthlySobra({
      monthStart: new Date('2024-01-01'),
      incomes: [
        { amount: 3000, starts_on: new Date('2024-01-01'), ends_on: null, is_active: true }
      ],
      fixedExpenses: [
        { amount: 1000, starts_on: new Date('2024-01-01'), ends_on: null, is_active: true }
      ],
      personalBudgets: [
        { amount: 500, starts_on: new Date('2024-01-01'), ends_on: null, is_active: true }
      ],
      commitments: [
        { amount_per_month: 300, start_month: new Date('2024-01-01'), end_month: new Date('2024-06-01') }
      ]
    })

    expect(result.incomeTotal).toBe(3000)
    expect(result.fixedTotal).toBe(1000)
    expect(result.commitmentsTotal).toBe(300)
    expect(result.personalTotal).toBe(500)
    expect(result.leftoverBeforePersonal).toBe(1700) // 3000 - 1000 - 300
    expect(result.leftoverAfterPersonal).toBe(1200) // 1700 - 500
  })
})
```

---

## Integración con APIs Externas

### Exportar a CSV

```typescript
// lib/export/csv.ts
export function exportToCSV(data: any[], filename: string) {
  const headers = Object.keys(data[0])
  const csv = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => 
        JSON.stringify(row[header] ?? '')
      ).join(',')
    )
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}
```

**Uso:**

```typescript
import { exportToCSV } from '@/lib/export/csv'

function ExportButton() {
  const { data: incomes } = useIncomes()

  const handleExport = () => {
    if (!incomes) return
    exportToCSV(incomes, 'mis-ingresos.csv')
  }

  return <Button onClick={handleExport}>Exportar Ingresos</Button>
}
```

---

**Estos ejemplos te ayudarán a extender y personalizar SOBRA según tus necesidades.**

