# Checklist de Verificación - SOBRA

Use esta lista para verificar que todo está funcionando correctamente.

---

## ✅ Setup Inicial

### Instalación
- [ ] Node.js 18+ instalado
- [ ] Dependencias instaladas (`npm install`)
- [ ] `.env.local` configurado con credenciales de Supabase
- [ ] Servidor dev arranca sin errores (`npm run dev`)

### Supabase
- [ ] Proyecto creado en Supabase
- [ ] Migración 001 aplicada (tablas creadas)
- [ ] Migración 002 aplicada (RLS configurado)
- [ ] Migración 003 aplicada (funciones RPC)
- [ ] Seed data aplicado (planes Free/Plus)
- [ ] 8 tablas visibles en Database

---

## ✅ Funcionalidad

### Autenticación
- [ ] Registro funciona (email/password)
- [ ] Login funciona
- [ ] Logout funciona
- [ ] Onboarding se muestra después de registro
- [ ] Middleware protege rutas (redirige a /login si no autenticado)
- [ ] Perfil se crea automáticamente al registrarse
- [ ] Plan Free se asigna automáticamente

### Ingresos
- [ ] Crear ingreso funciona
- [ ] Lista de ingresos se muestra
- [ ] Editar ingreso funciona
- [ ] Eliminar ingreso funciona (con confirmación)
- [ ] Validación de formulario funciona
- [ ] Toasts de éxito/error se muestran

### Gastos Fijos
- [ ] Crear gasto fijo funciona
- [ ] Lista de gastos fijos se muestra
- [ ] Editar gasto fijo funciona
- [ ] Eliminar gasto fijo funciona
- [ ] Tabs entre Fijos y Personales funciona

### Presupuestos Personales
- [ ] Crear presupuesto personal funciona
- [ ] Categorías se muestran correctamente
- [ ] Editar presupuesto funciona
- [ ] Eliminar presupuesto funciona

### Compromisos Mensuales
- [ ] Crear compromiso funciona
- [ ] Duración en meses se calcula correctamente
- [ ] Fecha de fin se muestra correctamente
- [ ] Editar compromiso funciona
- [ ] Eliminar compromiso funciona

### Dashboard
- [ ] Métricas se calculan correctamente
- [ ] Ingresos totales suma bien
- [ ] Gastos fijos suma bien
- [ ] Compromisos suma bien
- [ ] Presupuestos personales suma bien
- [ ] SOBRA se calcula correctamente
- [ ] Sugerencia diaria se muestra
- [ ] Desglose mensual es correcto

### Perfil
- [ ] Datos del perfil se muestran
- [ ] Editar nombre funciona
- [ ] Cambiar moneda funciona
- [ ] Cambiar período funciona
- [ ] Plan actual se muestra

---

## ✅ UI/UX

### Responsive
- [ ] Mobile (< 640px) se ve bien
- [ ] Tablet (640-1024px) se ve bien
- [ ] Desktop (> 1024px) se ve bien
- [ ] Sidebar se adapta en mobile
- [ ] Formularios son usables en mobile

### Estados
- [ ] Loading spinners se muestran
- [ ] Estados vacíos se muestran
- [ ] Errores se muestran con mensajes claros
- [ ] Toasts aparecen y desaparecen
- [ ] Botones disabled durante loading

### Navegación
- [ ] Header se muestra en todas las páginas
- [ ] Sidebar resalta página activa
- [ ] Links funcionan correctamente
- [ ] Logo redirige a dashboard

---

## ✅ Seguridad

### RLS (Row Level Security)
- [ ] Usuario A no puede ver datos de Usuario B
- [ ] Usuario A no puede modificar datos de Usuario B
- [ ] Policies SELECT funcionan
- [ ] Policies INSERT funcionan
- [ ] Policies UPDATE funcionan
- [ ] Policies DELETE funcionan

### Validación
- [ ] Formularios validan en cliente (Zod)
- [ ] BD valida constraints (amounts >= 0)
- [ ] Mensajes de error son claros
- [ ] No se pueden enviar datos inválidos

### Auth
- [ ] Rutas protegidas requieren login
- [ ] JWT se guarda en cookie
- [ ] Session persiste después de refresh
- [ ] Logout limpia session

---

## ✅ Performance

### Carga
- [ ] Página inicial carga en < 3s
- [ ] Dashboard carga en < 2s
- [ ] Transiciones son suaves
- [ ] No hay flashes de contenido

### Queries
- [ ] Queries usan índices (verificar en Supabase Logs)
- [ ] Caché de TanStack Query funciona
- [ ] Invalidación de queries funciona
- [ ] No hay queries duplicadas innecesarias

---

## ✅ Código

### TypeScript
- [ ] `npm run type-check` pasa sin errores
- [ ] No hay `any` en el código
- [ ] Tipos están bien definidos
- [ ] Imports están ordenados

### Linting
- [ ] `npm run lint` pasa sin errores
- [ ] No hay console.logs innecesarios
- [ ] Código sigue convenciones

### Build
- [ ] `npm run build` completa exitosamente
- [ ] No hay warnings críticos
- [ ] Bundle size es razonable

---

## ✅ Base de Datos

### Estructura
- [ ] 8 tablas creadas
- [ ] Todas las tablas tienen RLS habilitado
- [ ] Índices están creados
- [ ] Foreign keys están definidas
- [ ] Constraints están aplicados

### Datos
- [ ] Seed data de planes existe
- [ ] Trigger de nuevo usuario funciona
- [ ] updated_at se actualiza automáticamente
- [ ] end_month se calcula automáticamente

### Funciones
- [ ] `get_month_totals` funciona
- [ ] `handle_new_user` funciona
- [ ] `set_updated_at` funciona

---

## ✅ Documentación

### Archivos
- [ ] README.md está completo
- [ ] ARCHITECTURE.md explica la estructura
- [ ] DATABASE.md documenta el esquema
- [ ] SETUP.md guía la instalación
- [ ] EXAMPLES.md tiene ejemplos útiles
- [ ] DEPLOYMENT.md explica el deploy

### Código
- [ ] Funciones complejas tienen comentarios
- [ ] Tipos están documentados
- [ ] Migraciones SQL tienen comentarios

---

## ✅ Deploy (Opcional)

### Vercel
- [ ] Proyecto importado en Vercel
- [ ] Variables de entorno configuradas
- [ ] Deploy exitoso
- [ ] URL funciona
- [ ] HTTPS habilitado

### Supabase
- [ ] Auth redirects configurados
- [ ] CORS configurado (si es necesario)
- [ ] Backups configurados (Pro)

---

## ✅ Testing (Futuro)

### Unit Tests
- [ ] Tests de `lib/finance/calc.ts`
- [ ] Tests de validadores Zod
- [ ] Tests de utilidades

### Integration Tests
- [ ] Tests de hooks con Supabase
- [ ] Tests de mutaciones

### E2E Tests
- [ ] Test de registro → login → dashboard
- [ ] Test de crear ingreso → ver en dashboard
- [ ] Test de flujo completo

---

## 🎯 Métricas de Éxito

### Performance
- [ ] Lighthouse Score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s

### Funcionalidad
- [ ] Todas las features del MVP funcionan
- [ ] No hay bugs críticos
- [ ] UX es fluida

### Código
- [ ] Type-check pasa
- [ ] Lint pasa
- [ ] Build exitoso

---

## 📝 Notas

### Issues Conocidos
- Ninguno actualmente

### Mejoras Futuras
- Tests automatizados
- Plan Plus con Stripe
- Gráficos avanzados
- App móvil

---

**Fecha de última verificación:** _____________________

**Verificado por:** _____________________

**Estado:** ⬜ Pendiente | ⬜ En Progreso | ⬜ Completado

