# SOBRA 💰

**Tu sobrante, tu poder.** App de finanzas personales para Perú que te dice exactamente cuánto te sobra cada mes y te ayuda a hacer crecer ese dinero. No miramos hacia atrás (en qué gastaste), miramos hacia adelante (cuánto te queda hoy).

---

## 🎯 Visión

Ser la app financiera de referencia en Perú que convierte el desorden monetario en claridad y acción — desde saber cuánto te sobra hasta invertir tu excedente de forma inteligente.

## 🚀 Misión

Ayudar a cada persona en Perú a responder con confianza: **"¿Cuánto me sobra este mes?"** y darle las herramientas para proteger, crecer y educar sus finanzas.

## 🏛️ Funcionalidades Core (Status Actual)

| Función | Plataforma | Capacidad | Estado |
|---|---|---|---|
| **Cálculo de Sobrante (Engine)** | `shared` | Motor matemático prospectivo que dice tu sobrante real disponible hoy. | ✅ Completado |
| **Arquitectura Monorepo** | Web & Móvil | Comparten Tipos y Lógica a través de npm workspaces (`@sobra/shared`). | ✅ Completado |
| **Frictionless Quick Add** | Móvil | Añadir un gasto de calle toma 2 segundos (Estilo Apple Wallet / BottomSheet). | ✅ Completado |
| **Seguridad Biométrica** | Móvil | La app te exige FaceID/TouchID al abrirla o minimizarla protegiendo tu saldo. | ✅ Completado |
| **Modo Privacidad (Eye-Off)** | Móvil | Botón que censura todos tus saldos reales (`S/ ••••••`) para usarla en público. | ✅ Completado |
| **Gráficas y Dashboard** | Móvil | Donut Charts y Bar Charts usando `react-native-gifted-charts`. | ✅ Completado |
| **Seguridad Backend (RLS)** | Supabase | Nube blindada con Políticas de Seguridad a Nivel de Fila (Row Level Security). | ✅ Completado |

---

## 🗺️ Roadmap / Próximos Pasos a Futuro

Para mantener un seguimiento claro de las siguientes grandes actualizaciones en las que nos enfocaremos:

- [ ] **Exportación a Plantilla Excel (Web)**
      Implementar una descarga de CSV/XLSX estructurada en el Dashboard Web para que el usuario guarde su contabilidad dura.
- [ ] **Integración Open Banking (Belvo API)**
      Finalizar la arquitectura para conectarse a plataformas como Belvo, permitiendo la lectura automatizada y segura en tiempo real de cuentas (BCP, Interbank, Yape) y facturaciones de tarjetas de crédito.
- [ ] **Sistema de Notificaciones / Gamificación**
      Alertas Push si te estás gastando tu Sobrante demasiado rápido o trofeos por mantener el colchón intacto.

---

## 📁 Estructura del Proyecto (Monorepo con Workspaces)

```text
sobra/
├── apps/
│   ├── web/                         # 🌐 Next.js 16 Web App (App Router)
│   └── mobile/                      # 📱 Expo / React Native (App Móvil)
│       ├── src/components/ui/       # Componentes shadcn-style + QuickAddModal
│       ├── src/providers/           # SecurityProvider, PrivacyProvider, Auth
│       ├── src/screens/             # Navegación y Vistas Dinámicas
│       └── package.json
│
├── packages/
│   └── shared/                      # 📦 @sobra/shared (Core Compartido)
│       ├── src/types/               # database.types.ts (100% TS)
│       └── src/engine/              # Lógica matemática (Sobra Engine)
│
├── supabase/                        # 🗄️ Migraciones SQL (Source of Truth)
│   └── migrations/                  # Contiene el Schema y el Hardening (RLS)
│
├── package.json                     # Workspace root de npm
└── README.md
```

---

## 🛠 Stack Técnico

### Web App (`apps/web/`)
- **Framework:** Next.js 16 (App Router)
- **UI:** TailwindCSS 4 + shadcn/ui
- **Datos:** TanStack Query 5

### Mobile App (`apps/mobile/`)
- **Framework:** Expo 55 + React Native 0.83
- **Seguridad Nivel Sistema:** `expo-local-authentication`
- **Componentes Visuales:** `lucide-react-native` + `react-native-gifted-charts`

### Backend y Base de Datos
- **DB:** Supabase (PostgreSQL 17)
- **Seguridad:** Supabase Auth + Row Level Security (RLS) Obligatorio.

---

## 🚀 Setup & Ejecución

1. **Instalar el Ecosistema:**
```bash
git clone <repo-url>
cd sobra
npm install                    # Instala dependencias web y mobile simultáneamente
```

2. **Ejecutar la App Móvil (Tu foco principal):**
```bash
cd apps/mobile
npm start                      # Escanea el QR con Expo Go
```

3. **Ejecutar la App Web:**
```bash
cd apps/web
npm run dev                    # Corre el servidor en localhost:3000
```

---

## 🤝 Guía Rápida para Nuevos Desarrolladores (Onboarding)

Si acabas de unirte a SOBRA o estás revisando el código por primera vez, aquí tienes el "TL;DR" de todo el proyecto para que puedas empezar a aportar valor en 10 minutos:

### 1. ¿Cómo pensamos en SOBRA? (La Filosofía)
No somos una app contable retrospectiva (no nos importa en qué gastaste el año pasado). Somos una app **Prospectiva**. El corazón de la aplicación es calcular y mostrar el **"Sobrante Diario"**. Tomamos el Saldo Actual, restamos todos los compromisos futuros y deudas, y arrojamos el presupuesto neto que el usuario puede gastar "hoy" sin remordimiento.

### 2. El "Cerebro" está centralizado
Nunca programes reglas de negocio o cálculos matemáticos sueltos en el Frontend Móvil o Web. 
*   **Regla de Oro:** Todo cálculo de "Sobrante", sumatorias y lógicas de categorización viven en `packages/shared/src/engine/`. 
*   Las interfaces de Expo y Next.js son "tontas", solo consumen los `hooks` desde ese paquete central.

### 3. Seguridad Paranoica (Zero Trust)
*   **En Móviles:** Usamos **bloqueo Biométrico Obligatorio** (`SecurityProvider` a nivel de `App.tsx`) cuando la app pasa al fondo. Nunca muestres saldos en la primera renderización sin pasar por este Provider. También existe un Modo Privado que reemplaza strings por asteriscos; úsalo con el hook `usePrivacy()`.
*   **En la Nube:** Ninguna tabla en Supabase puede existir sin **Row Level Security (RLS)**. Asegúrate de verificar que cada petición de `SELECT`/`UPDATE`/`INSERT` valide `auth.uid() = user_id`. Puedes leer esto en `009_security_hardening.sql`.

### 4. Estilo y Frictionless UI
Si vas a diseñar una pantalla para la App Móvil, recuerda que **nuestro estándar es que todo debe tomar menos de 3 segundos**. (Referencia: `QuickAddModal.tsx`). Usa botones nativos enormes, invoca el teclado numérico automático, y evita formularios aburridos de texto.

¡Bienvenido(a) a SOBRA! 🚀
