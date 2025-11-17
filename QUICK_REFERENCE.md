# 🎨 SOBRA - Quick Reference

## 🎯 Referencia Rápida de Diseño

### 🎭 Logo

```tsx
import { Logo } from '@/components/brand/logo'

// Header
<Logo size="md" href="/dashboard" />

// Hero
<Logo size="xl" href="/" />

// Sin texto
<Logo size="sm" showText={false} />
```

---

### 🌈 Colores

#### CSS Classes
```css
/* Gradientes */
.gradient-brand     → Verde a verde oscuro
.gradient-gold      → Dorado a verde
.text-gradient      → Gradiente en texto

/* Por Categoría */
text-green-700      → Ingresos
text-orange-700     → Gastos
text-purple-700     → Compromisos
text-blue-700       → Presupuestos
```

#### CSS Variables
```css
--brand-green       → oklch(0.65 0.15 155)
--brand-gold        → oklch(0.72 0.18 85)
--brand-success     → oklch(0.62 0.20 142)
--brand-danger      → oklch(0.58 0.24 27)
```

---

### ✨ Animaciones

```css
.animate-fade-in-up   → Entrada suave (500ms)
.animate-pulse-green  → Pulso verde (2s infinite)
.hover-lift           → Elevación on hover
.card-glow           → Brillo verde sutil
.shimmer             → Loading effect
```

---

### 🧩 Componentes

#### Button
```tsx
// Primary CTA
<Button className="gradient-brand hover:opacity-90 shadow-lg">
  Acción Principal
</Button>

// Secondary
<Button variant="outline" className="hover-lift">
  Acción Secundaria
</Button>

// Destructive
<Button variant="destructive">
  Eliminar
</Button>
```

#### Card - Hero
```tsx
<Card className="border-2 border-primary bg-gradient-to-br from-primary/5 to-accent/5 card-glow">
  <div className="absolute bg-gradient-gold opacity-10 blur-3xl" />
  <CardHeader>
    <div className="p-2 bg-gradient-brand rounded-lg shadow-lg">
      <Icon className="text-white" />
    </div>
    <span className="text-gradient">Título</span>
  </CardHeader>
  <CardContent>
    <p className="text-6xl font-bold text-primary drop-shadow-lg">
      Valor Principal
    </p>
  </CardContent>
</Card>
```

#### Card - Categoría
```tsx
<Card className="hover-lift border-green-200 bg-gradient-to-br from-green-50 to-white">
  <CardHeader className="flex flex-row items-center justify-between">
    <CardTitle className="text-sm font-medium text-green-900">
      Título
    </CardTitle>
    <div className="p-2 bg-green-100 rounded-lg">
      <Icon className="h-4 w-4 text-green-600" />
    </div>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold text-green-700">
      Valor
    </div>
    <p className="text-xs text-green-600 mt-1 font-medium">
      Metadata
    </p>
  </CardContent>
</Card>
```

#### Input
```tsx
<Input
  className="h-10 rounded-lg border-2"
  placeholder="Placeholder..."
/>
```

---

### 📐 Spacing

```css
/* Padding */
p-4  → 16px
p-6  → 24px
p-8  → 32px

/* Gap */
gap-4  → 16px
gap-6  → 24px
gap-8  → 32px

/* Margin Top */
mt-1  → 4px
mt-2  → 8px
mt-4  → 16px
```

---

### 🎨 Borders & Shadows

```css
/* Border Radius */
rounded-lg  → 12px
rounded-xl  → 16px
rounded-2xl → 24px

/* Border Width */
border    → 1px
border-2  → 2px

/* Shadows */
shadow-sm  → Subtle
shadow-md  → Medium (default cards)
shadow-lg  → Large (CTA buttons)
```

---

### 📏 Typography

```css
/* Sizes */
text-xs   → 12px
text-sm   → 14px
text-base → 16px
text-lg   → 18px
text-xl   → 20px
text-2xl  → 24px
text-3xl  → 30px
text-4xl  → 36px
text-6xl  → 60px

/* Weight */
font-medium   → 500
font-semibold → 600
font-bold     → 700
```

---

### 🎯 Color Patterns

#### Ingresos (Verde)
```tsx
border-green-200
bg-gradient-to-br from-green-50 to-white
bg-green-100 (icon badge)
text-green-600 (icon)
text-green-700 (value)
text-green-900 (title)
```

#### Gastos (Naranja)
```tsx
border-orange-200
bg-gradient-to-br from-orange-50 to-white
bg-orange-100 (icon badge)
text-orange-600 (icon)
text-orange-700 (value)
text-orange-900 (title)
```

#### Compromisos (Morado)
```tsx
border-purple-200
bg-gradient-to-br from-purple-50 to-white
bg-purple-100 (icon badge)
text-purple-600 (icon)
text-purple-700 (value)
text-purple-900 (title)
```

#### Presupuesto (Azul)
```tsx
border-blue-200
bg-gradient-to-br from-blue-50 to-white
bg-blue-100 (icon badge)
text-blue-600 (icon)
text-blue-700 (value)
text-blue-900 (title)
```

---

### 🎬 Transition Times

```css
duration-100  → 100ms (active states)
duration-200  → 200ms (hover, default)
duration-300  → 300ms (page transitions)
duration-500  → 500ms (fade-in-up)
duration-2000 → 2s (pulse)
```

---

### 🎪 Common Patterns

#### Page Title
```tsx
<h1 className="text-4xl font-bold text-gradient">
  Título
</h1>
```

#### Navigation Link
```tsx
<Link className="text-sm font-medium hover:text-primary transition-colors relative group">
  Link
  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform" />
</Link>
```

#### Icon Badge
```tsx
<div className="p-2 bg-green-100 rounded-lg shadow-md">
  <Icon className="h-4 w-4 text-green-600" />
</div>
```

#### Decorative Blur Circle
```tsx
<div className="absolute w-72 h-72 bg-gradient-brand opacity-10 rounded-full blur-3xl animate-pulse-green" />
```

---

### 📱 Responsive Grid

```tsx
// 1 → 2 → 4 columns
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
  ...
</div>

// 1 → 2 columns
<div className="grid gap-4 md:grid-cols-2">
  ...
</div>

// 1 → 3 columns
<div className="grid gap-4 md:grid-cols-3">
  ...
</div>
```

---

### 🎨 Quick Combos

#### Hero Section
```tsx
<section className="container mx-auto px-4 py-24 text-center relative overflow-hidden">
  <div className="absolute ... bg-gradient-brand opacity-10 blur-3xl animate-pulse-green" />
  <div className="relative z-10">
    <Logo size="xl" />
    <h1 className="text-3xl font-semibold">
      Descubre cuánto te <span className="text-gradient">sobra</span>
    </h1>
  </div>
</section>
```

#### CTA Button
```tsx
<Button 
  asChild 
  size="lg" 
  className="gradient-brand hover:opacity-90 shadow-lg hover-lift text-lg px-8"
>
  <Link href="/register">
    Comenzar Gratis 🚀
  </Link>
</Button>
```

#### Dashboard Card
```tsx
<div className="space-y-8 animate-fade-in-up">
  <h1 className="text-4xl font-bold text-gradient">
    Dashboard
  </h1>
  
  <Card className="border-2 border-primary card-glow">
    {/* Hero content */}
  </Card>
  
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
    {/* Category cards */}
  </div>
</div>
```

---

### 🔗 Links Útiles

- **Sistema Completo**: `DESIGN_SYSTEM.md`
- **Cambios Detallados**: `CHANGELOG_DESIGN.md`
- **Showcase Visual**: `DESIGN_SHOWCASE.md`
- **Resumen**: `DESIGN_SUMMARY.md`

---

### 🎯 Reglas de Oro

1. **Consistencia**: Usar siempre `rounded-lg` (12px)
2. **Transiciones**: Duración estándar `200ms`
3. **Colores**: Usar variables CSS (`--brand-green`)
4. **Spacing**: Múltiplos de 8px (16, 24, 32)
5. **Hover**: Siempre feedback visual
6. **Gradientes**: Solo en elementos hero/CTA
7. **Sombras**: Aumentar en hover
8. **Animaciones**: Sutiles y rápidas (<500ms)

---

**⚡ Referencia rápida para desarrollo ágil**

Última actualización: 2024

