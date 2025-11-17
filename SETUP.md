# Guía de Setup - SOBRA

Esta guía te llevará paso a paso desde cero hasta tener SOBRA corriendo en tu máquina local.

## ⏱️ Tiempo estimado: 15-20 minutos

---

## Paso 1: Prerequisitos

### Instalar Node.js

```bash
# Verificar versión (necesitas 18+)
node --version

# Si no tienes Node.js, descarga desde:
# https://nodejs.org/
```

### Crear cuenta en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Haz clic en "Start your project"
3. Crea una cuenta (gratis)

---

## Paso 2: Clonar y configurar proyecto

```bash
# Clonar repositorio
git clone <tu-repo-url>
cd sobra

# Instalar dependencias
npm install
```

---

## Paso 3: Crear proyecto en Supabase

### 3.1 Crear nuevo proyecto

1. En el dashboard de Supabase, clic en "New project"
2. Completa:
   - **Name**: `sobra` (o el nombre que prefieras)
   - **Database Password**: guarda esta contraseña en lugar seguro
   - **Region**: elige la más cercana a ti
   - **Pricing Plan**: Free (suficiente para empezar)
3. Clic en "Create new project"
4. Espera 2-3 minutos mientras se crea

### 3.2 Obtener credenciales

1. Ve a **Project Settings** (icono de engranaje)
2. Ve a **API**
3. Copia:
   - **Project URL** (ej: `https://abcdefgh.supabase.co`)
   - **anon/public key** (la key larga que empieza con `eyJ...`)

---

## Paso 4: Configurar variables de entorno

```bash
# Copiar archivo de ejemplo
cp env.example .env.local

# Editar .env.local con tus credenciales
```

Abre `.env.local` y reemplaza:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (tu anon key)
```

---

## Paso 5: Aplicar migraciones de base de datos

### Opción A: Desde el Dashboard (Recomendado para principiantes)

1. En tu proyecto Supabase, ve a **SQL Editor**
2. Abre `supabase/migrations/001_initial_schema.sql` en tu editor
3. Copia todo el contenido
4. Pégalo en el SQL Editor de Supabase
5. Clic en **Run**
6. Repite para:
   - `002_row_level_security.sql`
   - `003_rpc_functions.sql`

### Opción B: Con Supabase CLI

```bash
# Instalar CLI
npm install -g supabase

# Login
supabase login

# Link proyecto (usa el Project ID de Settings > General)
supabase link --project-ref <tu-project-ref>

# Aplicar migraciones
supabase db push
```

### Verificar que funcionó

En SQL Editor, ejecuta:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Deberías ver 8 tablas:
- fixed_expenses
- incomes
- monthly_commitments
- monthly_summaries
- personal_expenses
- plans
- profiles
- user_plans

---

## Paso 6: Iniciar servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

Deberías ver la página de inicio de SOBRA 🎉

---

## Paso 7: Crear tu primera cuenta

1. Clic en "Comenzar Gratis"
2. Completa el formulario de registro
3. Completa el onboarding
4. ¡Listo! Ya puedes usar SOBRA

---

## Verificación de Setup

### ✅ Checklist

- [ ] Node.js 18+ instalado
- [ ] Proyecto Supabase creado
- [ ] Variables de entorno configuradas en `.env.local`
- [ ] Migraciones aplicadas (8 tablas creadas)
- [ ] `npm run dev` funciona sin errores
- [ ] Puedes registrarte y hacer login
- [ ] Dashboard muestra "0" en todos los valores

---

## Problemas Comunes

### Error: "Invalid API key"

**Causa**: Variables de entorno incorrectas

**Solución**:
1. Verifica que `.env.local` existe
2. Verifica que copiaste correctamente URL y anon key
3. Reinicia el servidor (`Ctrl+C` y `npm run dev` de nuevo)

### Error: "relation does not exist"

**Causa**: Migraciones no aplicadas

**Solución**:
1. Ve a SQL Editor en Supabase
2. Ejecuta las 3 migraciones en orden
3. Verifica con `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`

### Error: "Failed to fetch"

**Causa**: Supabase URL incorrecta o proyecto pausado

**Solución**:
1. Verifica la URL en `.env.local`
2. En Supabase Dashboard, verifica que el proyecto esté activo (no pausado)

### No puedo registrarme

**Causa**: RLS no configurado o trigger faltante

**Solución**:
1. Aplica `002_row_level_security.sql`
2. Aplica `003_rpc_functions.sql` (contiene el trigger de nuevo usuario)
3. Verifica en SQL Editor:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```

---

## Siguientes Pasos

### Desarrollo

- Lee [ARCHITECTURE.md](./ARCHITECTURE.md) para entender la estructura
- Lee [DATABASE.md](./DATABASE.md) para entender el esquema
- Explora el código en `app/`, `components/`, `hooks/`, `lib/`

### Personalización

- Cambia colores en `app/globals.css`
- Modifica el logo en `app/page.tsx`
- Añade más categorías de gastos en `components/forms/expense-form.tsx`

### Deploy

- Lee la sección "Despliegue" en [README.md](./README.md)
- Sigue la guía de Vercel para deploy automático

---

## Obtener Ayuda

Si tienes problemas:

1. Revisa esta guía completa
2. Revisa los logs en la consola del navegador (F12)
3. Revisa los logs de Supabase (Logs en el dashboard)
4. Verifica que todas las migraciones se aplicaron

---

**¡Felicidades! Ya tienes SOBRA corriendo localmente 🎉**

