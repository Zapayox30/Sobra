# Configuración de Google OAuth para SOBRA

Esta guía te ayudará a configurar Google OAuth authentication para permitir que los usuarios inicien sesión con sus cuentas de Google.

## 📋 Requisitos Previos

- Cuenta de Google Cloud Console
- Proyecto de Supabase configurado
- 10-15 minutos

---

## Paso 1: Configurar Google Cloud Console

### 1.1 Crear/Seleccionar Proyecto

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Click en el selector de proyectos (arriba a la izquierda)
3. Click en "New Project" o selecciona un proyecto existente
4. Nombre del proyecto: `SOBRA` (o el que prefieras)
5. Click "Create"

### 1.2 Habilitar Google+ API (Opcional pero Recomendado)

1. En el menú lateral, ve a **APIs & Services > Library**
2. Busca "Google+ API"
3. Click en "Google+ API"
4. Click "Enable"

### 1.3 Configurar OAuth Consent Screen

1. Ve a **APIs & Services > OAuth consent screen**
2. Selecciona **External** (a menos que uses Google Workspace)
3. Click "Create"

**Completa el formulario:**
- **App name:** SOBRA
- **User support email:** tu-email@gmail.com
- **Developer contact email:** tu-email@gmail.com
- Deja el resto como opcional
- Click "Save and Continue"

**Scopes:**
- Click "Add or Remove Scopes"
- Selecciona:
  - `.../auth/userinfo.email`
  - `.../auth/userinfo.profile`
- Click "Update" y luego "Save and Continue"

**Test users (opcional para desarrollo):**
- Puedes añadir emails de prueba si quieres
- Click "Save and Continue"

### 1.4 Crear OAuth 2.0 Credentials

1. Ve a **APIs & Services > Credentials**
2. Click "Create Credentials" > "OAuth 2.0 Client ID"
3. Application type: **Web application**
4. Name: `SOBRA Web Client`

**Authorized JavaScript origins:**
```
http://localhost:3001
https://tu-dominio-produccion.com
```

**Authorized redirect URIs:**
```
https://[TU-PROJECT-REF].supabase.co/auth/v1/callback
http://localhost:3001/auth/callback
```

> **Nota:** Reemplaza `[TU-PROJECT-REF]` con tu referencia de proyecto Supabase. La encuentras en:
> Supabase Dashboard > Settings > General > Reference ID

5. Click "Create"

### 1.5 Guardar Credenciales

Una vez creado, aparecerá un modal con:
- **Client ID:** `123456789-abcdefg.apps.googleusercontent.com`
- **Client Secret:** `GOCSPX-xxxxxxxxxxxxxxxxx`

**¡IMPORTANTE!** Copia y guarda estos valores, los necesitarás en el siguiente paso.

---

## Paso 2: Configurar Supabase

### 2.1 Habilitar Google Provider

1. Ve a tu [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto SOBRA
3. En el menú lateral, ve a **Authentication > Providers**
4. Busca **Google** en la lista de providers
5. Click en **Google** para expandir

### 2.2 Ingresar Credenciales

En el formulario de Google:
1. **Enabled:** Toggle a ON (verde)
2. **Client ID (for OAuth):** Pega el Client ID de Google Cloud
3. **Client Secret (for OAuth):** Pega el Client Secret
4. Click "Save"

### 2.3 Verificar Redirect URL

Supabase te mostrará la Redirect URL que debes usar:
```
https://[TU-PROJECT-REF].supabase.co/auth/v1/callback
```

Asegúrate de que esta URL esté en tus **Authorized redirect URIs** en Google Cloud Console (Paso 1.4).

---

## Paso 3: Verificar Instalación

### 3.1 Probar en Desarrollo

1. Asegúrate de que el servidor esté corriendo:
   ```bash
   npm run dev
   ```

2. Ve a `http://localhost:3001/login`

3. Click en "Continuar con Google"

4. Deberías ver la pantalla de selección de cuenta de Google

5. Selecciona tu cuenta y autoriza los permisos

6. Deberías ser redirigido a `/onboarding` (primera vez) o `/dashboard` (usuario existente)

### 3.2 Verificar en Supabase Dashboard

1. Ve a **Authentication > Users**
2. Deberías ver tu usuario con:
   - Email de Google
   - Provider: `google`
   - Email Verified: `true`

---

## 🔧 Solución de Problemas

### Error: "redirect_uri_mismatch"

**Causa:** La redirect URI no coincide.

**Solución:**
1. Verifica que hayas agregado exactamente estas URIs en Google Cloud:
   ```
   https://[TU-PROJECT-REF].supabase.co/auth/v1/callback
   http://localhost:3001/auth/callback
   ```
2. Espera 1-2 minutos para que Google Cloud propague los cambios

### Error: "access_denied"

**Causa:** Usuario canceló o no autorizó los permisos.

**Solución:**
- Intenta nuevamente y asegúrate de hacer click en "Allow"
- Verifica que los scopes en OAuth Consent Screen incluyan email y profile

### Error: "invalid_client"

**Causa:** Client ID o Secret incorrecto.

**Solución:**
1. Verifica que copiaste correctamente las credenciales de Google Cloud
2. Busca espacios en blanco extra al pegar
3. Regenera las credenciales si es necesario

### No redirige después de login

**Causa:** Callback route no está funcionando.

**Solución:**
1. Verifica que existe el archivo `app/auth/callback/route.ts`
2. Revisa la consola del navegador para errores
3. Verifica los logs en Supabase Dashboard > Logs

---

## 📱 Producción

Cuando despliegues a producción:

1. **Agregar dominio de producción a Google Cloud:**
   - Ve a **Credentials > OAuth 2.0 Client ID**
   - En **Authorized JavaScript origins**, agrega:
     ```
     https://tu-dominio-real.com
     ```
   - En **Authorized redirect URIs**, agrega:
     ```
     https://tu-dominio-real.com/auth/callback
     ```

2. **Variables de entorno:**
   No necesitas variables adicionales, Supabase maneja todo.

3. **Verificación de configuración:**
   - Prueba el flujo completo en producción
   - Verifica HTTPS (Google OAuth requiere conexión segura)

---

## ✅ Checklist Final

- [ ] Proyecto creado en Google Cloud Console
- [ ] OAuth Consent Screen configurado
- [ ] OAuth 2.0 Client ID creado
- [ ] Client ID y Secret guardados
- [ ] Redirect URIs agregadas (Supabase + localhost)
- [ ] Google Provider habilitado en Supabase
- [ ] Credenciales ingresadas en Supabase
- [ ] Botón "Continuar con Google" visible en `/login` y `/register`
- [ ] Flujo de login probado exitosamente
- [ ] Usuario aparece en Supabase Dashboard > Users

---

## 💡 Tips Adicionales

- **Testing:** Usa Chrome Incognito para probar sin interferencias de sesiones anteriores
- **Multiple Accounts:** Puedes probar con diferentes cuentas de Google sin cerrar sesión
- **Logs:** Revisa Supabase Logs (Dashboard > Logs) para debugging
- **User Metadata:** La foto y nombre de Google se guardan automáticamente en `user_metadata`

---

**¡Listo!** Tu aplicación SOBRA ahora tiene autenticación con Google OAuth funcionando. 🎉
