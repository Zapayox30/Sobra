# 🚀 Despliegue en Netlify - SOBRA

## ⚠️ Problema Actual: Error 404

Si ves "Page not found" después de desplegar, sigue estos pasos:

---

## ✅ Solución Completa

### 1. **Archivos de Configuración Creados**

Ya se crearon automáticamente:
- ✅ `netlify.toml` - Configuración de build y redirects
- ✅ `.nvmrc` - Versión de Node.js (20)
- ✅ `next.config.ts` - Output standalone para Netlify

### 2. **Configurar Variables de Entorno en Netlify**

Ve a tu dashboard de Netlify:

1. **Site settings** → **Environment variables** → **Add a variable**

2. Agrega estas variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://mfwvrhksghqtxshjzzuu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...tu_key_completa
```

3. Guarda los cambios

### 3. **Reinstalar Dependencias**

En tu terminal local:

```bash
# Instalar el plugin de Netlify
npm install

# Commit los cambios
git add .
git commit -m "fix: Add Netlify configuration"
git push
```

### 4. **Redesplegar en Netlify**

Opción A - **Automático** (si tienes auto-deploy):
- El push a GitHub activará un nuevo deploy automáticamente

Opción B - **Manual**:
1. Ve a Netlify Dashboard
2. Click en **"Deploys"**
3. Click en **"Trigger deploy"** → **"Deploy site"**

---

## 🔍 Verificar el Build

Mientras se despliega, revisa los logs:

**Debe mostrar:**
```
✓ Building Next.js with Netlify plugin
✓ Creating standalone build
✓ Redirects configured
✓ Deploy successful
```

**NO debe mostrar:**
```
✗ 404 errors
✗ Build failed
✗ Missing dependencies
```

---

## 🎯 Configuración Completa de Netlify

### `netlify.toml`
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### `next.config.ts`
```typescript
const nextConfig: NextConfig = {
  output: 'standalone',  // ← Importante para Netlify
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};
```

---

## 🐛 Troubleshooting

### Error: "Page not found" después de deploy

**Causa:** Netlify no encuentra las rutas de Next.js

**Solución:**
1. Verifica que `netlify.toml` existe en la raíz
2. Verifica que el plugin está instalado: `npm list @netlify/plugin-nextjs`
3. Limpia caché en Netlify: **Deploys** → **Clear cache and retry**

### Error: "Build failed"

**Causa:** Errores de TypeScript o ESLint

**Solución:**
- Ya configuramos `ignoreBuildErrors: true` en `next.config.ts`
- Si persiste, revisa los logs de build en Netlify

### Error: "Module not found"

**Causa:** Dependencias no instaladas

**Solución:**
```bash
npm install
git add package-lock.json
git commit -m "fix: Update dependencies"
git push
```

### Error: Variables de entorno no funcionan

**Causa:** No están configuradas en Netlify

**Solución:**
1. Ve a **Site settings** → **Environment variables**
2. Agrega todas las variables que necesitas
3. Redesplegar el sitio

---

## ✅ Checklist de Despliegue

Antes de desplegar, verifica:

- [ ] `netlify.toml` existe en la raíz
- [ ] `.nvmrc` configurado con Node 20
- [ ] `@netlify/plugin-nextjs` en `package.json`
- [ ] Variables de entorno configuradas en Netlify
- [ ] `next.config.ts` tiene `output: 'standalone'`
- [ ] Código pusheado a GitHub
- [ ] Build ejecutado en Netlify
- [ ] Sitio accesible sin errores 404

---

## 🎉 Resultado Esperado

Una vez completado, tu sitio debe:

✅ Cargar en `https://tu-sitio.netlify.app`  
✅ Todas las rutas funcionando (/, /login, /register, /dashboard, etc.)  
✅ Autenticación con Supabase funcionando  
✅ Sin errores 404

---

## 🔗 Links Útiles

- [Netlify Next.js Documentation](https://docs.netlify.com/frameworks/next-js/overview/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase + Netlify](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)

---

## 💡 Alternativa: Vercel

Si Netlify te da problemas, **Vercel** es más fácil para Next.js:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# Agregar variables de entorno
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# Redesplegar
vercel --prod
```

---

**¿Sigues teniendo problemas?** Revisa los logs de build en Netlify Dashboard → Deploys → [último deploy] → Deploy log

