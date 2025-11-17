# Supabase Migrations

Este directorio contiene las migraciones SQL para la base de datos de SOBRA.

## Orden de aplicación

Las migraciones deben aplicarse en el siguiente orden:

1. **001_initial_schema.sql** - Crea todas las tablas, triggers y seed data
2. **002_row_level_security.sql** - Configura RLS y políticas de seguridad
3. **003_rpc_functions.sql** - Crea funciones RPC y triggers de usuario

## Cómo aplicar migraciones

### Opción 1: Dashboard de Supabase

1. Ve a tu proyecto en [supabase.com](https://supabase.com)
2. Navega a SQL Editor
3. Copia y pega el contenido de cada archivo en orden
4. Ejecuta cada uno

### Opción 2: Supabase CLI

```bash
# Instalar CLI
npm install -g supabase

# Login
supabase login

# Link proyecto
supabase link --project-ref <tu-project-ref>

# Aplicar migraciones
supabase db push
```

## Verificar instalación

Ejecuta este SQL para verificar que todo se creó correctamente:

```sql
-- Verificar tablas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Verificar RLS
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Verificar funciones
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public';
```

## Estructura de la base de datos

### Tablas principales

- `profiles` - Perfil extendido del usuario
- `plans` - Catálogo de planes (Free/Plus)
- `user_plans` - Suscripciones de usuarios
- `incomes` - Fuentes de ingreso
- `fixed_expenses` - Gastos fijos mensuales
- `personal_expenses` - Presupuestos personales
- `monthly_commitments` - Compromisos con duración limitada
- `monthly_summaries` - Resúmenes mensuales (caché)

### Funciones RPC

- `get_month_totals(date)` - Obtiene totales agregados de un mes
- `handle_new_user()` - Trigger que crea perfil y asigna plan Free al registrarse

## Seguridad

Todas las tablas tienen:
- ✅ RLS habilitado
- ✅ Políticas owner-only (cada usuario solo ve sus datos)
- ✅ Índices optimizados
- ✅ Constraints de validación

## Regenerar tipos TypeScript

Después de cambios en la BD:

```bash
npx supabase gen types typescript --project-id <project-id> > ../types/database.types.ts
```

