# Guía de Despliegue - SOBRA

Esta guía cubre el despliegue de SOBRA en producción usando Vercel y Supabase.

---

## 📋 Pre-requisitos

- ✅ Proyecto funcionando localmente
- ✅ Cuenta en GitHub
- ✅ Cuenta en Vercel (gratis)
- ✅ Proyecto Supabase configurado

---

## 🚀 Despliegue en Vercel

### Paso 1: Preparar el repositorio

```bash
# Inicializar git (si no lo has hecho)
git init

# Agregar todos los archivos
git add .

# Commit inicial
git commit -m "Initial commit: SOBRA MVP"

# Crear repositorio en GitHub y conectar
git remote add origin https://github.com/tu-usuario/sobra.git
git branch -M main
git push -u origin main
```

### Paso 2: Importar en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Clic en "Add New" → "Project"
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente Next.js

### Paso 3: Configurar variables de entorno

En la sección "Environment Variables":

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (tu anon key)
```

**Importante:**
- ✅ Usa las mismas credenciales que en desarrollo
- ✅ NO expongas el `service_role_key`
- ✅ Vercel encripta las variables automáticamente

### Paso 4: Deploy

1. Clic en "Deploy"
2. Espera 2-3 minutos
3. ✅ Tu app estará en `https://tu-proyecto.vercel.app`

---

## 🔄 Despliegue Continuo

### Configuración automática

Vercel configura CI/CD automáticamente:

- **Push a `main`** → Deploy a producción
- **Push a otra rama** → Preview deployment
- **Pull Request** → Preview deployment automático

### Workflow típico

```bash
# Desarrollo local
git checkout -b feature/nueva-funcionalidad
# ... hacer cambios ...
git add .
git commit -m "Add: nueva funcionalidad"
git push origin feature/nueva-funcionalidad

# Crear PR en GitHub
# Vercel crea preview automáticamente
# Revisar preview
# Merge PR → Deploy automático a producción
```

---

## 🗄️ Configuración de Supabase para Producción

### Verificar configuración

1. Ve a tu proyecto en Supabase
2. **Settings** → **API**
3. Verifica que las URLs sean correctas

### Configurar dominio personalizado (opcional)

Si usas dominio propio en Vercel:

1. En Supabase: **Settings** → **API** → **Custom Domain**
2. Agrega tu dominio de Vercel
3. Actualiza variables de entorno si es necesario

### Configurar Auth Redirects

1. En Supabase: **Authentication** → **URL Configuration**
2. Agrega tu dominio de Vercel:
   - **Site URL**: `https://tu-proyecto.vercel.app`
   - **Redirect URLs**: 
     - `https://tu-proyecto.vercel.app/auth/callback`
     - `https://tu-proyecto.vercel.app/**`

---

## 🔒 Seguridad en Producción

### Checklist de Seguridad

- [x] RLS habilitado en todas las tablas
- [x] Variables de entorno configuradas
- [x] Service role key NO expuesta
- [x] HTTPS habilitado (automático en Vercel)
- [x] Auth redirects configurados
- [x] CORS configurado correctamente

### Configurar CORS en Supabase (si es necesario)

1. **Settings** → **API** → **CORS**
2. Agrega tu dominio de Vercel
3. Guarda cambios

---

## 📊 Monitoreo

### Vercel Analytics

1. En tu proyecto Vercel: **Analytics**
2. Habilita Analytics (gratis)
3. Monitorea:
   - Page views
   - Performance
   - Errores

### Supabase Logs

1. En Supabase: **Logs**
2. Monitorea:
   - API requests
   - Errores de BD
   - Auth events

---

## 🐛 Debugging en Producción

### Ver logs de Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Ver logs en tiempo real
vercel logs tu-proyecto.vercel.app
```

### Ver logs de Supabase

1. Dashboard → **Logs**
2. Filtrar por:
   - API
   - Auth
   - Database
   - Realtime

---

## 🔄 Rollback

### Si algo sale mal

**Opción 1: Desde Vercel Dashboard**

1. Ve a tu proyecto
2. **Deployments**
3. Encuentra el deployment anterior
4. Clic en "..." → "Promote to Production"

**Opción 2: Desde Git**

```bash
# Revertir último commit
git revert HEAD
git push origin main

# O volver a commit específico
git reset --hard <commit-hash>
git push origin main --force
```

---

## 🌍 Dominio Personalizado

### Configurar dominio propio

1. En Vercel: **Settings** → **Domains**
2. Agrega tu dominio (ej: `sobra.com`)
3. Configura DNS según instrucciones de Vercel
4. Espera propagación (5-60 min)
5. Actualiza Auth Redirects en Supabase

### DNS Records (ejemplo)

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 📈 Escalabilidad

### Vercel

**Plan Free (suficiente para MVP):**
- 100 GB bandwidth
- Unlimited deployments
- Automatic HTTPS
- Edge Network

**Escalar:**
- Pro: $20/mes (más bandwidth, analytics avanzados)
- Enterprise: custom (SLA, soporte prioritario)

### Supabase

**Plan Free (suficiente para MVP):**
- 500 MB database
- 1 GB file storage
- 50,000 monthly active users

**Escalar:**
- Pro: $25/mes (8 GB database, backups, soporte)
- Team/Enterprise: custom (read replicas, SLA)

---

## 🔧 Optimizaciones Post-Deploy

### 1. Habilitar ISR (Incremental Static Regeneration)

```typescript
// app/dashboard/page.tsx
export const revalidate = 60 // Revalidar cada 60 segundos
```

### 2. Configurar Edge Functions (opcional)

```typescript
// app/api/route.ts
export const runtime = 'edge'
```

### 3. Optimizar imágenes

```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['tu-proyecto.supabase.co'],
  },
}
```

### 4. Habilitar compresión

Vercel habilita automáticamente:
- Gzip
- Brotli
- Image optimization

---

## 📱 PWA (Progressive Web App) - Futuro

### Configurar PWA

```bash
npm install next-pwa
```

```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development'
})

module.exports = withPWA({
  // ... rest of config
})
```

---

## 🧪 Staging Environment

### Crear entorno de staging

**Opción 1: Branch separada**

```bash
git checkout -b staging
git push origin staging
```

En Vercel:
1. Conecta la rama `staging`
2. Configura variables de entorno separadas
3. Usa proyecto Supabase separado (opcional)

**Opción 2: Preview deployments**

Vercel crea preview automático para cada PR.

---

## 📊 Performance Monitoring

### Lighthouse CI

```bash
npm install -g @lhci/cli

# Correr audit
lhci autorun --collect.url=https://tu-proyecto.vercel.app
```

### Metas de Performance

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Lighthouse Score**: > 90

---

## 🔐 Backups

### Base de Datos

**Supabase Free:**
- No backups automáticos
- Backup manual:

```bash
pg_dump -h db.xxx.supabase.co -U postgres -d postgres > backup.sql
```

**Supabase Pro:**
- Backups automáticos diarios
- Point-in-time recovery
- Retención de 7 días

### Código

- ✅ Git (GitHub) es tu backup
- ✅ Vercel mantiene historial de deployments
- ✅ Considera backups adicionales en otro servicio

---

## 🚨 Disaster Recovery

### Plan de contingencia

1. **BD corrupta**: Restaurar desde backup
2. **Deploy fallido**: Rollback a versión anterior
3. **Supabase down**: Esperar (uptime 99.9%)
4. **Vercel down**: Esperar (uptime 99.99%)

### Contactos de Emergencia

- Vercel Support: support@vercel.com
- Supabase Support: support@supabase.io

---

## ✅ Checklist Final Pre-Deploy

### Código

- [ ] Tests pasando (cuando los implementes)
- [ ] No hay console.logs innecesarios
- [ ] Variables de entorno configuradas
- [ ] `.env.local` en `.gitignore`
- [ ] Build local exitoso (`npm run build`)

### Supabase

- [ ] Migraciones aplicadas
- [ ] RLS habilitado en todas las tablas
- [ ] Seed data aplicado (planes)
- [ ] Auth redirects configurados
- [ ] Backups configurados (Pro)

### Vercel

- [ ] Variables de entorno configuradas
- [ ] Dominio configurado (si aplica)
- [ ] Analytics habilitado
- [ ] Alerts configurados

### Seguridad

- [ ] Service role key NO expuesta
- [ ] HTTPS habilitado
- [ ] CORS configurado
- [ ] Rate limiting (futuro)

---

## 🎉 Post-Deploy

### Verificación

1. ✅ Registrar cuenta de prueba
2. ✅ Crear ingreso/gasto/compromiso
3. ✅ Verificar cálculo de SOBRA
4. ✅ Probar en mobile
5. ✅ Verificar performance (Lighthouse)

### Anunciar

1. Compartir URL con usuarios beta
2. Recopilar feedback
3. Iterar y mejorar

---

**¡Tu aplicación SOBRA está lista para producción! 🚀**

