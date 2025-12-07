# Performance Metrics Dashboard - Guía Completa

**Fecha:** 2025-12-05
**Proyecto:** SOBRA - Financial Management App
**Versión:** 1.0.0

---

## 📊 Introducción

El **Performance Metrics Dashboard** es un sistema completo de monitoreo en tiempo real que te permite visualizar, analizar y exportar métricas de performance de tu aplicación.

### ¿Qué Incluye?

✅ **Web Vitals Tracking** - 6 Core Web Vitals en tiempo real
✅ **React Query Stats** - Cache hits, queries, mutations
✅ **Network Monitoring** - Requests, failures, latency
✅ **Performance Alerts** - Detección automática de problemas
✅ **Historical Data** - Trends y comparaciones
✅ **Export Functionality** - Descarga datos en JSON

---

## 🚀 Acceso al Dashboard

### URL

```
http://localhost:3000/dev/metrics
```

### Ubicación en el Proyecto

```
app/(app)/dev/metrics/page.tsx
```

---

## 📁 Arquitectura del Sistema

### Archivos Creados

```
📁 hooks/
  └── use-performance-metrics.ts        # Hook principal de métricas

📁 components/metrics/
  ├── metric-card.tsx                   # Card individual de métrica
  ├── performance-alerts.tsx            # Sistema de alertas
  ├── web-vitals-display.tsx           # Visualización de Web Vitals
  └── metrics-history.tsx               # Histórico con sparklines

📁 lib/analytics/
  └── web-vitals.ts                     # Utilidades de Web Vitals (ya existía)

📁 app/(app)/dev/metrics/
  └── page.tsx                          # Página principal del dashboard
```

---

## 🎯 Características Principales

### 1. **Web Vitals Display**

Visualización de las 6 Core Web Vitals con ratings:

- **LCP** (Largest Contentful Paint) - Loading performance
- **FID** (First Input Delay) - Interactivity
- **CLS** (Cumulative Layout Shift) - Visual stability
- **FCP** (First Contentful Paint) - Initial render
- **TTFB** (Time to First Byte) - Server response
- **INP** (Interaction to Next Paint) - Responsiveness

**Ratings:**
- 🟢 **Good** - Optimal performance
- 🟡 **Needs Improvement** - Acceptable but could be better
- 🔴 **Poor** - Requires attention

**Visualización:**
```typescript
<WebVitalsDisplay averages={metrics.webVitals.averages} />
```

**Ejemplo de output:**
```
LCP: 2,100ms  [███████████████        ] Good
FID: 85ms     [████████               ] Good
CLS: 0.08     [██████                 ] Good
FCP: 1,650ms  [█████████████          ] Good
TTFB: 720ms   [███████████            ] Good
INP: 180ms    [██████████             ] Good
```

---

### 2. **Performance Alerts**

Sistema inteligente que detecta automáticamente problemas:

**Tipos de Alertas:**

🔴 **HIGH** (Crítico)
- Web Vitals con rating "poor"
- Network failure rate > 10%

🟡 **MEDIUM** (Advertencia)
- Web Vitals con rating "needs-improvement"
- Cache hit rate < 30%

🔵 **LOW** (Información)
- Cache size > 5MB

**Ejemplo:**
```typescript
const alerts = usePerformanceAlerts()

// Output:
[
  { severity: 'high', message: 'LCP is poor (4200ms)' },
  { severity: 'medium', message: 'Low cache hit rate (25%)' }
]
```

---

### 3. **React Query Statistics**

Monitoreo completo del cache de TanStack Query:

**Métricas:**
- **Active Queries** - Queries en el cache
- **Active Mutations** - Mutations en progreso
- **Cache Size** - Memoria usada (KB)
- **Cache Hit Rate** - % de queries servidas desde cache

**Targets Recomendados:**
```typescript
{
  cacheHitRate: > 60%,     // Más alto = mejor performance
  cacheSize: < 3000KB,     // Evitar memory leaks
  queries: Variable,       // Depende de la app
  mutations: < 5           // Idealmente pocas concurrentes
}
```

**Interpretación:**

**Cache Hit Rate:**
- **> 60%** 🟢 - Excelente, menos requests al servidor
- **30-60%** 🟡 - Aceptable, considerar aumentar `staleTime`
- **< 30%** 🔴 - Problemas, revisar configuración de cache

**Cache Size:**
- **< 3MB** 🟢 - Normal
- **3-5MB** 🟡 - Monitorear
- **> 5MB** 🔴 - Posible memory leak

---

### 4. **Network Performance**

Análisis de requests HTTP:

**Métricas:**
- **Total Requests** - Requests desde carga de página
- **Failed Requests** - Status >= 400
- **Average Latency** - Tiempo promedio de response
- **Data Transferred** - KB descargados

**Targets:**
```typescript
{
  failedRequests: 0,           // Cero es ideal
  averageLatency: < 200ms,     // Depende de API
  dataTransferred: Variable    // Monitorear trends
}
```

---

### 5. **Metrics History**

Visualización histórica con sparklines:

**Features:**
- **Mini sparkline** - Últimas 20 mediciones
- **Trend detection** - Improving / Degrading / Stable
- **Min / Avg / Max** - Estadísticas completas
- **Per-metric grouping** - Organizados por tipo

**Trend Detection:**
```typescript
// Compara últimas 5 mediciones vs primeras 5
Improving:  Nuevo < Viejo * 0.9  (↓ 10%+ mejor)
Degrading:  Nuevo > Viejo * 1.1  (↑ 10%+ peor)
Stable:     Diferencia < 10%     (→ Similar)
```

**Ejemplo:**
```
LCP  ↓ Improving
  Min: 1,800ms | Avg: 2,100ms | Max: 2,800ms
  [Sparkline: ▂▃▅▄▃▂▂▁▂▃]

FID  → Stable
  Min: 65ms | Avg: 85ms | Max: 120ms
  [Sparkline: ▃▂▃▄▃▂▃▃▂▃]
```

---

### 6. **Auto-Refresh**

Actualización automática cada 5 segundos:

**Controles:**
```typescript
const {
  metrics,
  isCollecting,
  startCollecting,   // Inicia auto-refresh
  stopCollecting,    // Detiene auto-refresh
  refresh,           // Refresh manual
} = usePerformanceMetrics()
```

**UI:**
- **Play Button** ▶️ - Iniciar auto-refresh
- **Pause Button** ⏸️ - Detener auto-refresh
- **Refresh Button** 🔄 - Actualización manual
- **Export Button** 📥 - Descargar JSON

---

### 7. **Export Functionality**

Descarga todos los datos en formato JSON:

**Contenido del Export:**
```json
{
  "timestamp": "2025-12-05T10:30:00.000Z",
  "metrics": {
    "webVitals": { /* ... */ },
    "reactQuery": { /* ... */ },
    "render": { /* ... */ },
    "network": { /* ... */ }
  },
  "userAgent": "Mozilla/5.0 ...",
  "url": "http://localhost:3000/dev/metrics"
}
```

**Uso:**
```typescript
import { exportMetrics } from '@/hooks/use-performance-metrics'

// Exportar métricas actuales
exportMetrics(metrics)

// Descarga: performance-metrics-1733396400000.json
```

---

## 🛠️ Uso del Dashboard

### Inicio Básico

1. **Navegar al dashboard**
   ```
   http://localhost:3000/dev/metrics
   ```

2. **Activar auto-refresh**
   - Click en "Start Auto-Refresh"
   - Las métricas se actualizan cada 5 segundos

3. **Revisar alertas**
   - Verifica el panel de "Performance Alerts"
   - Actúa sobre alertas HIGH primero

4. **Analizar Web Vitals**
   - Verifica que todos estén en "Good"
   - Si alguno está en "Poor", revisa tips

### Workflow Recomendado

#### 1. **Monitoreo Diario**

```bash
# Abrir dashboard
http://localhost:3000/dev/metrics

# Verificar:
1. Performance Alerts (debe estar verde)
2. Web Vitals (todos en "Good")
3. Cache Hit Rate (> 60%)
4. Network Failures (= 0)
```

#### 2. **Debugging de Performance Issues**

```typescript
// Paso 1: Identificar problema en alerts
❌ "LCP is poor (4200ms)"

// Paso 2: Ver histórico
LCP History: ↑ Degrading
  Min: 1,800ms → Max: 4,200ms

// Paso 3: Revisar network
Data Transferred: 850KB (↑ desde 400KB)

// Paso 4: Analizar
Probable causa: Nuevo componente pesado sin lazy loading

// Paso 5: Fix
Implementar lazy loading del componente
```

#### 3. **Optimización de Cache**

```typescript
// Ver cache hit rate
Cache Hit Rate: 25%  ❌ Poor

// Analizar queries
Active Queries: 15
Cache Size: 120KB

// Diagnóstico
Bajo hit rate + cache pequeño = staleTime muy bajo

// Fix
// hooks/use-*.ts
staleTime: 60_000 → staleTime: 2 * 60_000  // 1min → 2min

// Verificar después
Cache Hit Rate: 68%  ✅ Good
```

---

## 📈 Interpretación de Métricas

### Escenarios Comunes

#### **Escenario 1: Buen Performance**

```
✅ Performance Alerts: No issues detected
✅ LCP: 1,950ms (Good)
✅ Cache Hit Rate: 72%
✅ Network Failures: 0
✅ All trends: Stable
```

**Acción:** Mantener configuración actual

---

#### **Escenario 2: Cache Problema**

```
⚠️ Cache Hit Rate: 28%
⚠️ Alert: "Low cache hit rate (28%)"
```

**Diagnóstico:**
- `staleTime` muy bajo
- Invalidaciones muy frecuentes
- Queries sin cache

**Fix:**
```typescript
// Aumentar staleTime
useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  staleTime: 2 * 60 * 1000,  // 2 minutos
})
```

---

#### **Escenario 3: LCP Degradado**

```
❌ LCP: 4,500ms (Poor)
❌ Alert: "LCP is poor (4500ms)"
📈 Trend: Degrading (was 2,100ms)
```

**Posibles Causas:**
1. Nuevas imágenes sin optimizar
2. Componente pesado sin lazy loading
3. Fuentes bloqueando render
4. JavaScript bundle muy grande

**Fix:**
```typescript
// 1. Lazy loading
const HeavyChart = dynamic(() => import('./heavy-chart'))

// 2. Image optimization
<Image
  src="/large.jpg"
  width={800}
  height={600}
  priority={false}  // No bloquear LCP
/>

// 3. Font optimization (ya implementado)
display: 'swap'
```

---

#### **Escenario 4: Network Failures**

```
❌ Failed Requests: 12
❌ Failure Rate: 15%
❌ Alert: "High network failure rate (15%)"
```

**Diagnóstico:**
- API caída
- Timeout muy corto
- CORS issues
- Network intermitente

**Debug:**
```typescript
// Ver detalles en Network tab de DevTools
// Filtrar por status 4xx/5xx
// Revisar error messages

// Implementar retry
useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  retry: 3,              // Reintentar 3 veces
  retryDelay: 1000,      // 1 segundo entre intentos
})
```

---

## 🎨 Personalización

### Ajustar Thresholds de Alertas

```typescript
// hooks/use-performance-metrics.ts

// Cambiar threshold de cache hit rate
if (metrics.reactQuery.cacheHitRate < 0.5) {  // Antes: 0.3
  newAlerts.push({
    severity: 'medium',
    message: `Low cache hit rate (${Math.round(metrics.reactQuery.cacheHitRate * 100)}%)`,
  })
}

// Cambiar threshold de cache size
if (metrics.reactQuery.cacheSize > 3000) {  // Antes: 5000
  newAlerts.push({
    severity: 'low',
    message: `Large cache size (${metrics.reactQuery.cacheSize}KB)`,
  })
}
```

### Agregar Nuevas Métricas

```typescript
// 1. Extender interface
export interface PerformanceMetrics {
  // ... existentes
  custom: {
    myMetric: number
  }
}

// 2. Implementar collector
const collectCustomStats = useCallback(() => {
  const myValue = calculateMyMetric()

  setMetrics((prev) => ({
    ...prev,
    custom: { myMetric: myValue },
  }))
}, [])

// 3. Agregar a collectAll
const collectAll = useCallback(() => {
  // ... existentes
  collectCustomStats()
}, [..., collectCustomStats])
```

### Cambiar Intervalo de Auto-Refresh

```typescript
// hooks/use-performance-metrics.ts

// Cambiar de 5s a 10s
const interval = setInterval(collectAll, 10000)  // Antes: 5000
```

---

## 🔧 Troubleshooting

### Problema: "No data available"

**Causa:** Web Vitals aún no se han medido

**Solución:**
1. Navegar por la app (Dashboard, Analytics, etc.)
2. Regresar al metrics dashboard
3. Esperar ~30 segundos
4. Las métricas aparecerán automáticamente

---

### Problema: "Cache Hit Rate siempre 0%"

**Causa:** QueryClient no expuesto globalmente

**Solución:**
Verificar que `lib/providers/query-provider.tsx` tiene:
```typescript
useEffect(() => {
  if (typeof window !== 'undefined') {
    ;(window as any).__REACT_QUERY_CLIENT__ = queryClient
  }
}, [queryClient])
```

---

### Problema: "Network metrics vacíos"

**Causa:** Performance API no disponible

**Solución:**
- Usar browser moderno (Chrome, Firefox, Edge)
- Verificar que no esté en modo incógnito
- Hacer algunos requests (navegar por la app)

---

### Problema: "Historical data no aparece"

**Causa:** LocalStorage vacío

**Solución:**
1. Usar la app normalmente por ~5 minutos
2. Los Web Vitals se guardan automáticamente
3. Máximo 50 métricas guardadas
4. Verificar en DevTools: `localStorage.getItem('web-vitals')`

---

## 📊 Best Practices

### 1. **Monitoreo Regular**

✅ Revisar dashboard una vez al día
✅ Exportar métricas semanalmente
✅ Comparar trends mes a mes
✅ Actuar sobre alerts inmediatamente

### 2. **Performance Budget**

Establecer límites:
```typescript
const PERFORMANCE_BUDGET = {
  LCP: 2500,           // ms
  FID: 100,            // ms
  CLS: 0.1,            // score
  cacheHitRate: 0.6,   // 60%
  cacheSize: 3000,     // KB
  failureRate: 0,      // 0%
}
```

### 3. **Alerts Response**

**HIGH Priority** (responder en <1 día):
- Web Vitals poor
- Network failures > 10%

**MEDIUM Priority** (responder en <3 días):
- Web Vitals needs improvement
- Cache hit rate < 30%

**LOW Priority** (monitorear):
- Cache size > 5MB
- Trends degrading

### 4. **Export Estrategia**

```typescript
// Exportar en momentos clave
1. Antes de deploy a producción
2. Después de optimizaciones
3. Cuando hay issues de performance
4. Weekly backup

// Comparar exports
const before = import('./metrics-before-optimization.json')
const after = import('./metrics-after-optimization.json')

// Calcular mejora
const improvement = {
  LCP: ((before.LCP - after.LCP) / before.LCP) * 100,
  // ...
}
```

---

## 🚀 Próximos Pasos

### Features Planeados

1. **Real-time Charts** con Recharts
   - Line charts de trends
   - Comparación multi-métrica

2. **Slack/Email Alerts**
   - Notificaciones automáticas
   - Threshold configurable

3. **A/B Testing Integration**
   - Comparar performance entre variantes

4. **Backend Persistence**
   - Guardar en Supabase
   - Historical queries SQL

5. **Mobile App Support**
   - React Native compatible
   - Cross-platform metrics

---

## 📝 Referencias

### Documentación Relacionada

- [PERFORMANCE_AUDIT.md](./PERFORMANCE_AUDIT.md) - Optimizaciones básicas
- [ADVANCED_OPTIMIZATIONS.md](./ADVANCED_OPTIMIZATIONS.md) - Optimizaciones avanzadas
- [lib/analytics/web-vitals.ts](./lib/analytics/web-vitals.ts) - Implementación Web Vitals

### External Resources

- [Web Vitals](https://web.dev/vitals/)
- [TanStack Query Devtools](https://tanstack.com/query/latest/docs/react/devtools)
- [Chrome Performance Profiler](https://developer.chrome.com/docs/devtools/performance/)

---

## ✅ Checklist de Setup

- [x] Dashboard page creada (`/dev/metrics`)
- [x] Hooks implementados (`use-performance-metrics.ts`)
- [x] Componentes creados (6 componentes)
- [x] Web Vitals tracking activo
- [x] QueryClient expuesto globalmente
- [x] Auto-refresh funcional
- [x] Export implementado
- [x] Alerts system funcionando
- [x] Historical data con sparklines
- [x] Performance tips incluidos

---

## 🎉 Conclusión

El **Performance Metrics Dashboard** te da **visibilidad completa** sobre el performance de tu aplicación:

✅ **Monitoreo en tiempo real** - Sin lag
✅ **Alertas inteligentes** - Detecta problemas automáticamente
✅ **Histórico completo** - Trends y comparaciones
✅ **Export fácil** - Datos en JSON
✅ **Accionable** - Tips específicos

**Resultado:** Aplicación **más rápida**, **más confiable** y **mejor monitoreada**.

---

**Creado por:** Claude Code (Anthropic)
**Versión:** 1.0.0
**Última actualización:** 2025-12-05
