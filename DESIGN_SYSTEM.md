# SOBRA - Sistema de Diseño e Identidad Visual

## 🎨 Paleta de Colores

### Colores Principales
- **Verde Financiero** (`--brand-green`): `oklch(0.65 0.15 155)`
  - Verde principal que transmite crecimiento, estabilidad y dinero
  - Variantes: `brand-green-light`, `brand-green-dark`
  
- **Dorado Acento** (`--brand-gold`): `oklch(0.72 0.18 85)`
  - Acento dorado que representa valor y logros
  - Usado para destacar elementos importantes

### Colores Semánticos
- **Success**: `oklch(0.62 0.20 142)` - Confirmaciones y estados positivos
- **Danger**: `oklch(0.58 0.24 27)` - Errores y alertas críticas

### Aplicación
```css
/* Gradientes de marca */
.gradient-brand → Verde principal a verde oscuro
.gradient-gold → Dorado a verde
.text-gradient → Gradiente de texto verde a dorado
```

---

## 🔤 Tipografía

- **Font Principal**: Geist Sans (variable font)
- **Font Mono**: Geist Mono (para números/código)
- **Peso**: Semi-bold (600) para títulos, Medium (500) para texto

### Jerarquía
- **Hero**: 7xl (72px) - Landing page principal
- **H1**: 4xl (36px) - Títulos de página con gradiente
- **H2**: 3xl (30px) - Secciones importantes
- **H3**: 2xl (24px) - Subtítulos
- **Body**: Base (16px) / sm (14px)

---

## 🎭 Logo y Marca

### Componente `<Logo>`
```tsx
<Logo 
  size="sm" | "md" | "lg" | "xl"
  href="/dashboard"
  showText={true}
/>
```

**Características:**
- Badge con signo "$" integrado en el diseño
- Gradiente verde con brillo dorado
- Efecto hover con escala y brillo
- Responsive en 4 tamaños

**Significado:**
- **SO$**: "Sobra" + símbolo de dinero
- **Colores**: Verde = finanzas, Dorado = valor/logro

---

## 🧩 Componentes UI

### Buttons
```tsx
<Button variant="default" size="lg" className="hover-lift">
  Acción
</Button>
```

**Variantes:**
- `default` - Verde primario con sombra
- `destructive` - Rojo para acciones críticas
- `outline` - Borde con efecto hover
- `secondary`, `ghost`, `link`

**Características:**
- Border radius: `0.75rem` (12px)
- Transición: `200ms all`
- Efecto: `active:scale-95` (feedback táctil)
- Sombras: `shadow-md` → `shadow-lg` on hover

### Cards
```tsx
<Card className="hover-lift card-glow">
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>
```

**Clases Especiales:**
- `.hover-lift` - Elevación suave on hover
- `.card-glow` - Brillo sutil verde en hover
- Gradientes: `from-{color}-50 to-white`

### Inputs
- Height: `40px`
- Border: `2px solid`
- Radius: `0.75rem`
- Focus: Ring verde con transición suave
- Hover: Border verde claro

---

## ✨ Animaciones

### Keyframes Personalizados
```css
@keyframes fade-in-up → Entrada suave desde abajo
@keyframes pulse-green → Pulso verde suave
@keyframes shimmer → Efecto de brillo deslizante
```

### Clases de Utilidad
- `.animate-fade-in-up` - Contenido que aparece
- `.animate-pulse-green` - Elementos decorativos
- `.shimmer` - Loading states
- `.hover-lift` - Interacción con tarjetas

---

## 🎯 Patrones de Diseño

### Dashboard Cards
```tsx
// Card con categoría de color
<Card className="hover-lift border-green-200 bg-gradient-to-br from-green-50 to-white">
  {/* Icono con badge de color */}
  <div className="p-2 bg-green-100 rounded-lg">
    <Icon className="h-4 w-4 text-green-600" />
  </div>
  {/* Valor grande */}
  <div className="text-3xl font-bold text-green-700">
    {value}
  </div>
  {/* Metadata */}
  <p className="text-xs text-green-600 mt-1 font-medium">
    Descripción
  </p>
</Card>
```

**Colores por Categoría:**
- **Ingresos**: Verde (`green-*`)
- **Gastos Fijos**: Naranja (`orange-*`)
- **Compromisos**: Morado (`purple-*`)
- **Presupuesto**: Azul (`blue-*`)

### Hero Card Principal
```tsx
<Card className="border-2 border-primary bg-gradient-to-br from-primary/5 to-accent/5 card-glow">
  {/* Elemento decorativo */}
  <div className="absolute ... bg-gradient-gold opacity-10 blur-3xl" />
  
  {/* Contenido destacado */}
  <p className="text-6xl font-bold text-primary drop-shadow-lg">
    {amount}
  </p>
</Card>
```

---

## 📱 Responsividad

### Breakpoints
- Mobile: `< 768px`
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`

### Grid Patterns
```tsx
// Cards adaptables
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
  ...
</div>
```

---

## 🎪 Efectos Visuales

### Elementos Decorativos
```tsx
{/* Círculos de fondo con blur */}
<div className="absolute w-72 h-72 bg-gradient-brand opacity-10 rounded-full blur-3xl animate-pulse-green" />
```

### Glassmorphism
```tsx
{/* Header flotante */}
<header className="bg-white/80 backdrop-blur-md sticky top-0 z-50">
```

### Depth & Shadow
- **Flat**: `shadow-sm` - Elementos sutiles
- **Medium**: `shadow-md` - Cards por defecto
- **High**: `shadow-lg` - Botones importantes
- **Glow**: `shadow-[custom]` - Efectos especiales

---

## 🔧 Mejores Prácticas

### DO ✅
- Usar gradientes para elementos hero
- Aplicar `.hover-lift` en cards interactivas
- Mantener jerarquía visual clara
- Usar colores semánticos (verde=positivo, rojo=negativo)
- Transiciones suaves (200-300ms)

### DON'T ❌
- No mezclar muchos colores en una vista
- No usar animaciones largas (>500ms)
- No abusar de sombras grandes
- No ignorar estados de hover/focus
- No usar colores crudos sin CSS vars

---

## 🚀 Casos de Uso

### Landing Page
- Logo XL con gradiente
- Hero con elementos decorativos animados
- Cards con números grandes (1, 2, 3, 4)
- CTA destacado con gradiente de marca

### Dashboard
- Logo MD en header sticky
- Card principal con brillo verde
- 4 cards de resumen con colores por categoría
- Navegación con underline animado

### Formularios
- Inputs con focus ring verde
- Botones con feedback táctil
- Validación con colores semánticos
- Loading states con shimmer

---

## 📦 Assets

### Componentes Reutilizables
- `<Logo>` - components/brand/logo.tsx
- `<Button>` - components/ui/button.tsx
- `<Card>` - components/ui/card.tsx
- `<Input>` - components/ui/input.tsx

### Utilidades CSS
- `app/globals.css` - Animaciones y clases personalizadas
- Variables CSS en `:root`
- Modo oscuro en `.dark` (ready but not styled yet)

---

## 🎨 Inspiración

**Concepto Visual:**
- Finanzas modernas y accesibles
- Verde = crecimiento financiero
- Dorado = logros y metas alcanzadas
- Diseño limpio con personalidad

**Referencias:**
- Apps fintech modernas (Revolut, N26)
- Material Design 3 (colores vibrantes)
- Glassmorphism (iOS style)
- Microinteracciones delicadas

---

**Versión**: 1.0  
**Última actualización**: 2024  
**Mantenedor**: Equipo SOBRA

