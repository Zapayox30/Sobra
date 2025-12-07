# Real-Time Performance Charts - Documentación

**Fecha:** 2025-12-05
**Proyecto:** SOBRA - Financial Management App
**Versión:** 1.0.0

---

## 📊 Introducción

Sistema completo de **visualización en tiempo real** de métricas de performance usando **Recharts**. Los charts se actualizan automáticamente cada 5 segundos cuando el auto-refresh está activo.

---

## 🎨 Charts Disponibles

### 1. **Web Vitals Line Chart** 📈

**Tipo:** Line Chart (Multi-línea)
**Archivo:** `components/metrics/charts/web-vitals-chart.tsx`

**Métricas Visualizadas:**
- 🔵 LCP (Largest Contentful Paint) - Azul
- 🟢 FCP (First Contentful Paint) - Verde
- 🟡 TTFB (Time to First Byte) - Amarillo

**Características:**
- ✅ Actualización smooth cada 5 segundos
- ✅ Hasta 50 data points históricos
- ✅ Tooltips interactivos
- ✅ Legend con colores personalizados
- ✅ Grid con ejes X/Y
- ✅ Animaciones de 300ms

**Ejemplo Visual:**
```
LCP (ms)
3000│                    ●
    │              ●   ● │
2500│         ●  ●       │
    │    ●  ●            │
2000│  ●                 │
    │____________________│
     10:30  10:31  10:32
```

**Interpretación:**
- **Línea descendente** = Mejorando ✅
- **Línea ascendente** = Empeorando ❌
- **Línea plana** = Estable →

---

### 2. **Cache Hit Rate Area Chart** 📊

**Tipo:** Area Chart con gradiente
**Archivo:** `components/metrics/charts/cache-chart.tsx`

**Métrica Visualizada:**
- Cache Hit Rate (%) - Verde con gradiente

**Características:**
- ✅ **Reference Line** en 60% (target)
- ✅ Gradiente fill de verde
- ✅ Domain fijo 0-100%
- ✅ Current value en header (grande)
- ✅ Smooth animations

**Ejemplo Visual:**
```
100%│
    │     ╱‾‾╲
 60%│- - -‾ - ‾- - - (Target)
    │   ╱        ╲
  0%│__╱__________╲_│
     10:30    10:32

Current: 72% ✅
```

**Interpretación:**
- **> 60%** = 🟢 Excelente
- **30-60%** = 🟡 Aceptable
- **< 30%** = 🔴 Problema

**Target Line:**
- Línea punteada en 60%
- Objetivo: mantener por encima

---

### 3. **Network Performance Bar Chart** 📊

**Tipo:** Dual-Axis Bar Chart
**Archivo:** `components/metrics/charts/network-chart.tsx`

**Métricas Visualizadas:**
- **Latency** (Left Axis) - Bars con colores dinámicos
- **Failures** (Right Axis) - Bars rojas

**Características:**
- ✅ **Color-coded bars** para latency:
  - Verde: < 200ms (Good)
  - Amarillo: 200-300ms (OK)
  - Rojo: > 300ms (Slow)
- ✅ Solo últimos 10 data points (mejor visibilidad)
- ✅ Dual Y-axis (latency vs failures)
- ✅ Average latency en header
- ✅ Legend explicativa

**Ejemplo Visual:**
```
Latency (ms)     Failures
300│ █            │    █
   │ █  █         │    █
200│ █  █  █      │
   │ █  █  █  █   │
100│ █  █  █  █   │
   │_____________│____│
    L  L  L  L     F

Colors:
🟢 Good | 🟡 OK | 🔴 Slow
```

**Interpretación:**
- **Barras verdes** = Latency óptima
- **Barras rojas (failures)** = Requests fallidos (crítico)
- **Average < 200ms** = Performance excelente

---

### 4. **React Query Composed Chart** 📊

**Tipo:** Composed Chart (Bars + Line)
**Archivo:** `components/metrics/charts/composed-metrics-chart.tsx`

**Métricas Visualizadas:**
- **Queries** (Bar, Left Axis) - Azul
- **Mutations** (Bar, Left Axis) - Verde
- **Cache Size** (Line, Right Axis) - Amarillo

**Características:**
- ✅ Combina bars y línea
- ✅ Dual Y-axis (count vs KB)
- ✅ Stats cards en header (current values)
- ✅ Smooth line para cache size
- ✅ Stacked bars para queries/mutations

**Ejemplo Visual:**
```
Count    Cache (KB)
 20│      /‾‾‾‾\   │500
   │     /      \  │
 15│  ██ /    ██  \│400
   │  ██/  ██ ██   │
 10│  █   ██ ██ ██ │300
   │______________│____

📊 Q: 15 | M: 2 | C: 450KB
```

**Interpretación:**
- **Queries altas + Cache size creciente** = Normal
- **Mutations > 5** = Muchas escrituras concurrentes
- **Cache size > 5MB** = Posible memory leak

---

## 🚀 Uso del Sistema

### Activación

```bash
# 1. Navegar al dashboard
http://localhost:3000/dev/metrics

# 2. Click "Start Auto-Refresh"
# Los charts aparecerán y empezarán a actualizarse

# 3. Esperar ~30 segundos
# Los charts se llenarán con datos
```

### Live Updates

**Frecuencia:** Cada 5 segundos

**Flow:**
```typescript
1. Auto-refresh ACTIVADO
   ↓
2. Recolectar métricas actuales
   ↓
3. Agregar data point a time series
   ↓
4. Charts se re-renderizan automáticamente
   ↓
5. Animación smooth de 300ms
   ↓
6. Esperar 5 segundos → Repetir
```

### Máximo de Data Points

**Límite:** 50 data points
**Duración:** ~4 minutos de datos (50 × 5 segundos)
**Comportamiento:** FIFO (First In, First Out)

```typescript
// Cuando se llega al límite
timeSeries.length = 50
Nueva medición llega
  → Se elimina la más antigua
  → Se agrega la nueva
timeSeries.length = 50 (siempre)
```

---

## 📊 Arquitectura Técnica

### Hook Principal

**Archivo:** `hooks/use-metrics-timeseries.ts`

```typescript
export function useMetricsTimeSeries() {
  const [timeSeries, setTimeSeries] = useState<TimeSeriesDataPoint[]>([])

  // Auto-coleccionar cuando isCollecting = true
  useEffect(() => {
    if (!isCollecting) return

    const interval = setInterval(() => {
      addDataPoint()  // Agregar nuevo data point
    }, 5000)

    return () => clearInterval(interval)
  }, [isCollecting])

  return {
    timeSeries,      // Array de data points
    addDataPoint,    // Agregar manualmente
    clear,           // Limpiar todo
    getMetricData,   // Obtener data específica
    hasData,         // Boolean si hay datos
  }
}
```

### Data Point Structure

```typescript
interface TimeSeriesDataPoint {
  timestamp: number              // Unix timestamp
  timestampLabel: string         // "10:30:45"

  // Web Vitals
  LCP?: number
  FID?: number
  CLS?: number
  FCP?: number
  TTFB?: number
  INP?: number

  // React Query
  cacheHitRate: number          // 0-100 (percentage)
  cacheSize: number             // KB
  queries: number
  mutations: number

  // Network
  networkLatency: number        // ms
  networkFailures: number
  dataTransferred: number       // KB
}
```

### Chart Components

**Patrón:** React.memo para prevenir re-renders

```typescript
export const WebVitalsChart = memo(function WebVitalsChart({
  data,
}: WebVitalsChartProps) {
  // Si no hay datos, mostrar placeholder
  if (data.length === 0) {
    return <EmptyState />
  }

  // Renderizar chart con animaciones
  return (
    <ResponsiveContainer>
      <LineChart data={data}>
        <Line
          dataKey="LCP"
          animationDuration={300}  // Smooth updates
        />
      </LineChart>
    </ResponsiveContainer>
  )
})
```

---

## 🎯 Casos de Uso

### 1. **Monitorear Performance en Vivo**

```typescript
// Escenario: Deploy nuevo código

1. Abrir metrics dashboard
2. Activar auto-refresh
3. Ver charts en tiempo real
4. Hacer deploy
5. Observar cambios en charts:
   - LCP aumenta? ❌ Problema
   - Cache hit rate baja? ❌ Revisar
   - Network failures aparecen? ❌ Crítico
```

### 2. **Debugging de Cache Issues**

```typescript
// Problema: App se siente lenta

1. Abrir Cache Chart
2. Ver cache hit rate: 25% ❌
3. Observar trend: Descendiendo
4. Aumentar staleTime:
   staleTime: 2 * 60 * 1000
5. Reload app
6. Ver Cache Chart:
   - Hit rate sube a 68% ✅
   - Línea ascendente en chart
```

### 3. **Optimizar Network Performance**

```typescript
// Observación: Barras rojas en Network Chart

1. Ver Network Chart
2. Identificar:
   - Latency > 300ms (rojo) ❌
   - Failures > 0 ❌
3. Revisar Network tab
4. Implementar retry logic
5. Ver mejora en real-time:
   - Barras verdes ✅
   - Failures = 0 ✅
```

### 4. **Validar Optimizaciones**

```typescript
// Antes de optimización
LCP Chart: Promedio 3,200ms ❌

// Implementar lazy loading
const HeavyComponent = dynamic(() => import('./heavy'))

// Después (ver en chart)
LCP Chart: Promedio 2,100ms ✅
Mejora: -34% 🎉

// El chart muestra la mejora visualmente
// Línea descendente desde 3,200ms a 2,100ms
```

---

## 🔧 Personalización

### Cambiar Colores de Chart

```typescript
// components/metrics/charts/web-vitals-chart.tsx

<Line
  dataKey="LCP"
  stroke="hsl(var(--chart-1))"  // Cambiar a otro color
  strokeWidth={3}                // Grosor de línea
/>

// Usar custom colors
stroke="#ff6b6b"  // Rojo personalizado
```

### Agregar Nueva Métrica al Chart

```typescript
// 1. Agregar a TimeSeriesDataPoint
interface TimeSeriesDataPoint {
  // ... existentes
  customMetric?: number  // Nueva métrica
}

// 2. Recolectar en addDataPoint
const dataPoint = {
  // ... existentes
  customMetric: calculateCustomMetric(),
}

// 3. Agregar Line al chart
<Line
  type="monotone"
  dataKey="customMetric"
  name="My Custom Metric"
  stroke="hsl(var(--chart-4))"
  strokeWidth={2}
/>
```

### Ajustar Frecuencia de Updates

```typescript
// hooks/use-metrics-timeseries.ts

// Cambiar de 5s a 10s
const interval = setInterval(addDataPoint, 10000)  // Antes: 5000

// Cambiar máximo de data points
const MAX_DATA_POINTS = 100  // Antes: 50
// Resultado: ~8 minutos de histórico (100 × 5s)
```

### Custom Tooltips

```typescript
<Tooltip
  content={({ active, payload }) => {
    if (!active || !payload) return null

    return (
      <div className="custom-tooltip">
        <p>{payload[0].value}ms</p>
        <p>Rating: {getRating(payload[0].value)}</p>
      </div>
    )
  }}
/>
```

---

## 📈 Performance Tips

### Optimización de Re-renders

```typescript
// ✅ BUENO: React.memo en todos los charts
export const WebVitalsChart = memo(function WebVitalsChart({
  data,
}: WebVitalsChartProps) {
  // Solo re-renderiza si 'data' cambia
})

// ❌ MALO: Sin memo
export function WebVitalsChart({ data }) {
  // Re-renderiza en cada parent update
}
```

### Limitar Data Points Mostrados

```typescript
// Para charts muy densos, mostrar solo últimos N
const recentData = data.slice(-20)  // Últimos 20

<LineChart data={recentData}>
  {/* Mejor performance con menos data */}
</LineChart>
```

### Animaciones Condicionales

```typescript
// Deshabilitar animaciones si muchos data points
const shouldAnimate = data.length < 30

<Line
  dataKey="LCP"
  animationDuration={shouldAnimate ? 300 : 0}
  isAnimationActive={shouldAnimate}
/>
```

---

## 🐛 Troubleshooting

### Problema: "Charts vacíos"

**Causa:** Auto-refresh no activado

**Solución:**
```typescript
1. Click "Start Auto-Refresh"
2. Esperar ~10 segundos
3. Charts aparecerán con primera data
```

---

### Problema: "Charts no se actualizan"

**Causa:** isCollecting = false

**Solución:**
```typescript
// Verificar que auto-refresh está activo
console.log(isCollecting)  // Debe ser true

// Si false, click "Start Auto-Refresh"
```

---

### Problema: "Animaciones laggy"

**Causa:** Demasiados data points

**Solución:**
```typescript
// Reducir MAX_DATA_POINTS
const MAX_DATA_POINTS = 30  // Antes: 50

// O reducir frecuencia
const interval = setInterval(addDataPoint, 10000)  // 10s
```

---

### Problema: "Tooltips no aparecen"

**Causa:** Conflicto de z-index

**Solución:**
```typescript
// Agregar z-index alto al tooltip container
<Tooltip
  wrapperStyle={{ zIndex: 1000 }}
  contentStyle={{ ... }}
/>
```

---

## 📚 Referencias de Recharts

### Props Útiles

**LineChart:**
- `margin`: Espacio alrededor del chart
- `syncId`: Sincronizar múltiples charts
- `onClick`: Interactividad

**Line:**
- `type`: "monotone" | "linear" | "step"
- `strokeWidth`: Grosor de línea
- `dot`: Mostrar puntos
- `activeDot`: Punto al hover
- `connectNulls`: Conectar datos faltantes

**AreaChart:**
- `stackId`: Stack múltiples areas
- `fill`: Color de relleno
- `fillOpacity`: Transparencia

**BarChart:**
- `barSize`: Ancho de bars
- `barGap`: Espacio entre bars
- `barCategoryGap`: Espacio entre categorías

### Gradients

```typescript
<defs>
  <linearGradient id="customGradient" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
  </linearGradient>
</defs>

<Area fill="url(#customGradient)" />
```

### Reference Lines

```typescript
// Horizontal line
<ReferenceLine
  y={2500}
  stroke="red"
  strokeDasharray="5 5"
  label="Max LCP"
/>

// Vertical line
<ReferenceLine
  x="10:30:00"
  stroke="blue"
  label="Deploy"
/>
```

---

## ✅ Checklist de Features

**Implementado:**
- [x] Line Chart para Web Vitals
- [x] Area Chart para Cache Hit Rate
- [x] Bar Chart para Network Performance
- [x] Composed Chart para React Query
- [x] Time series data collection
- [x] Auto-refresh integration
- [x] React.memo optimization
- [x] Smooth animations
- [x] Tooltips interactivos
- [x] Legends personalizadas
- [x] Color-coded bars
- [x] Reference lines
- [x] Gradientes
- [x] Dual Y-axis
- [x] Empty states
- [x] Live updates cada 5s

**Futuro (opcional):**
- [ ] Zoom & Pan functionality
- [ ] Brush para selección de rango
- [ ] Export chart como imagen
- [ ] Comparación de períodos
- [ ] Annotations en eventos
- [ ] Custom themes
- [ ] Dark/Light mode switch

---

## 🎉 Conclusión

El sistema de **Real-Time Charts** transforma las métricas de texto en **visualizaciones intuitivas**:

✅ **4 Charts diferentes** - Line, Area, Bar, Composed
✅ **Live updates** - Auto-refresh cada 5 segundos
✅ **Optimizado** - React.memo + animaciones suaves
✅ **Interactivo** - Tooltips, legends, hover effects
✅ **Informativo** - Color-coding + reference lines
✅ **Production-ready** - Manejo de edge cases

**Resultado:** Visualización **profesional** de performance en **tiempo real**! 📊

---

**Creado por:** Claude Code (Anthropic)
**Librería:** Recharts 3.4.1
**Última actualización:** 2025-12-05
