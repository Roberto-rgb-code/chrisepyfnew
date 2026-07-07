# Informe de Arquitectura y Estructura — Empaques & Fundas

**Proyecto:** `empaques-fundas-ecommerce`  
**Fecha del informe:** Julio 2026  
**Stack principal:** Next.js 14 · React 18 · TypeScript · Tailwind CSS · Firebase · Stripe · Resend

---

## 1. Resumen ejecutivo

**Empaques & Fundas** es un e-commerce de fundas de teléfono personalizadas. El usuario selecciona un modelo (68 disponibles), sube una imagen, la ajusta con controles visuales (escala, rotación, volteo, posición) y la agrega al carrito. El flujo de compra usa **Stripe Checkout**; la autenticación corre en **Firebase Auth**; los datos de órdenes y carritos se persisten en **Firestore**; y las notificaciones por correo usan **Resend**.

La aplicación actual es una migración de un prototipo HTML/JS vanilla (`index.html`, `app.js`, `style.css`) hacia **Next.js 14 con App Router**. Conserva la misma experiencia visual del personalizador mediante CSS semántico heredado en `globals.css`.

**Dominio de producción configurado:** `empaquesyfundas.com`

---

## 2. Diagrama de arquitectura general

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CLIENTE (Navegador)                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────────┐  │
│  │ AuthContext  │  │ CartContext  │  │ Componentes UI (CaseCustomizer│  │
│  │ (Firebase    │  │ (localStorage│  │ Navbar, modales, páginas...)  │  │
│  │  Auth)       │  │  por usuario)│  └──────────────────────────────┘  │
│  └──────┬───────┘  └──────────────┘                                     │
│         │                                                                │
│         ▼                                                                │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Firebase Client SDK (auth, firestore, analytics) — solo cliente  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ fetch POST
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    NEXT.JS SERVER (API Routes)                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────────┐  │
│  │ /api/       │  │ /api/       │  │ /api/       │  │ /api/         │  │
│  │ checkout    │  │ webhook     │  │ send-email  │  │ test-email    │  │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └───────────────┘  │
└─────────┼────────────────┼────────────────┼────────────────────────────┘
          │                │                │
          ▼                ▼                ▼
   ┌────────────┐   ┌────────────┐   ┌────────────┐
   │   Stripe   │   │ Firestore  │   │   Resend   │
   │  Checkout  │   │ (orders,   │   │  (emails   │
   │  + Webhook │   │  carts,    │   │transaccion.│
   │            │   │  users)    │   │            │
   └────────────┘   └────────────┘   └────────────┘
```

---

## 3. Estructura de directorios

```
chrisepyfnew/
│
├── src/                              # Código fuente de la aplicación
│   ├── app/                          # Next.js App Router (páginas + API)
│   │   ├── api/                      # Route Handlers (backend serverless)
│   │   ├── admin/                    # Panel de administración
│   │   ├── carrito/                  # Carrito y checkout
│   │   ├── catalogo/                 # Catálogo de modelos
│   │   ├── login/                    # Inicio de sesión
│   │   ├── register/                 # Registro
│   │   ├── perfil/                   # Perfil de usuario
│   │   ├── ordenes/                  # Historial de órdenes
│   │   ├── success/                  # Confirmación post-pago
│   │   ├── setup-admin/              # Utilidad de setup admin
│   │   ├── layout.tsx                # Layout raíz + providers
│   │   ├── page.tsx                  # Home (personalizador)
│   │   └── globals.css               # Estilos globales (~790 líneas)
│   │
│   ├── components/                   # Componentes React reutilizables (12)
│   ├── contexts/                     # Estado global (Auth, Cart)
│   ├── data/                         # Datos estáticos (catálogo de teléfonos)
│   └── lib/                          # Utilidades e integraciones
│
├── public/
│   └── downloaded_images/            # ~198 imágenes (color + máscara por modelo)
│
├── index.html                        # LEGACY — prototipo HTML original
├── app.js                            # LEGACY — lógica JS del prototipo
├── style.css                         # LEGACY — estilos base del prototipo
├── data.py                           # Script Python para descargar imágenes
│
├── firebase.json                     # Config de Firestore rules
├── firestore.rules                   # Reglas de seguridad Firestore
├── next.config.js                    # Config Next.js (imágenes, redirects HTTPS)
├── tailwind.config.js                # Config Tailwind CSS
├── postcss.config.js                 # PostCSS (tailwind + autoprefixer)
├── tsconfig.json                     # TypeScript (strict, alias @/*)
├── package.json                      # Dependencias y scripts
│
└── Documentación/
    ├── Readme.md
    ├── INICIO_RAPIDO.md
    ├── RESUMEN_PROYECTO.md
    ├── CHECKLIST.md
    ├── VERCEL_SETUP.md
    └── VERCEL_INSTRUCTIONS.md
```

---

## 4. Capas de la aplicación

### 4.1 Capa de presentación (UI)

Todas las páginas bajo `src/app/` son **Client Components** (`'use client'`). El patrón habitual es:

```
Navbar → Contenido de la página → Footer
```

Los modales (auth, advertencias, confirmaciones) se controlan con `useState` local en cada página o componente padre.

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/` | `src/app/page.tsx` | Página principal con el personalizador de fundas |
| `/catalogo` | `src/app/catalogo/page.tsx` | Catálogo navegable con búsqueda y filtros por marca |
| `/carrito` | `src/app/carrito/page.tsx` | Vista del carrito y botón de pago con Stripe |
| `/login` | `src/app/login/page.tsx` | Formulario de inicio de sesión |
| `/register` | `src/app/register/page.tsx` | Formulario de registro |
| `/perfil` | `src/app/perfil/page.tsx` | Perfil del usuario autenticado |
| `/ordenes` | `src/app/ordenes/page.tsx` | Historial de compras (pendiente de integración Firestore) |
| `/success` | `src/app/success/page.tsx` | Pantalla de éxito tras el pago en Stripe |
| `/admin` | `src/app/admin/page.tsx` | Panel admin: órdenes, estadísticas, cambio de estado |
| `/setup-admin` | `src/app/setup-admin/page.tsx` | Creación one-time de cuenta administrador |

**Layout raíz** (`src/app/layout.tsx`):
- Fuente **Inter** vía `next/font/google`
- Envuelve la app con `AuthProvider` → `CartProvider`
- Incluye `WhatsAppWidget` global
- Metadata SEO básica en español

**Ruta referenciada pero no implementada:** `/reset-password` (enlace en `login/page.tsx`).

**No existe `middleware.ts`:** no hay protección de rutas a nivel servidor.

---

### 4.2 Componentes (`src/components/`)

| Componente | Responsabilidad |
|------------|-----------------|
| `CaseCustomizer.tsx` | Núcleo del personalizador: selector de modelo, upload, preview con máscara CSS, drag & drop, controles de imagen y atajos de teclado |
| `CasePreview.tsx` | Miniatura del diseño en carrito/admin (réplica visual escalada al 32%) |
| `Navbar.tsx` | Navegación sticky, badge de carrito, menú de usuario, acceso admin |
| `Footer.tsx` | Links de productos, soporte y redes sociales |
| `AnnouncementBar.tsx` | Barra promocional rotativa (envío gratis, descuentos) |
| `AuthModal.tsx` | Login/registro inline sin cambiar de página |
| `AuthWarningModal.tsx` | Aviso de que se requiere login para agregar al carrito |
| `ImageWarningModal.tsx` | Aviso de que se requiere imagen antes de agregar al carrito |
| `ImageUploadSuccessModal.tsx` | Confirmación de subida exitosa |
| `CartSuccessModal.tsx` | Confirmación de producto agregado al carrito |
| `ConfirmationModal.tsx` | Modal genérico reutilizable (actualmente sin uso) |
| `WhatsAppWidget.tsx` | Widget flotante de WhatsApp/llamada (+52 33 1149 3852) |

---

### 4.3 Estado global (`src/contexts/`)

#### AuthContext

Gestiona la sesión del usuario con Firebase Authentication.

| Propiedad / Método | Descripción |
|--------------------|-------------|
| `user` | Usuario Firebase (`User \| null`) |
| `loading` | Estado de carga inicial |
| `isAdmin` | Rol administrador |
| `signup()` | Registro + `updateProfile` |
| `login()` | `signInWithEmailAndPassword` |
| `logout()` | `signOut` + redirect a `/` |
| `resetPassword()` | `sendPasswordResetEmail` (sin UI dedicada) |

**Lógica de admin:**
- Email hardcodeado: `admin@empaquesyfundas.com`
- Si coincide → `isAdmin = true` y escribe en Firestore `users/{uid}` con `role: 'admin'`
- Si no → consulta Firestore y verifica `role === 'admin'`

#### CartContext

Gestiona el carrito de compras con persistencia en `localStorage`.

| Propiedad / Método | Descripción |
|--------------------|-------------|
| `cart` | Array de `CartItem` |
| `addToCart()` | Agregar o incrementar cantidad |
| `removeFromCart()` | Eliminar item por id |
| `updateQuantity()` | Cambiar cantidad |
| `clearCart()` | Vaciar carrito |
| `getCartTotal()` | Suma total en MXN |
| `getCartCount()` | Total de unidades |

**Estructura `CartItem`:**
```typescript
{
  id: string;
  modelName: string;
  colorURL: string;      // Imagen base del modelo
  maskURL: string;       // Máscara para recorte CSS
  customImage: string;   // Imagen del usuario en base64
  price: number;         // 599 MXN (hardcodeado)
  quantity: number;
  imageControls: {
    scale, rotation, flipX, flipY,
    position: { x, y }
  };
}
```

**Persistencia por clave:**
- Autenticado: `cart_{user.uid}`
- Invitado: `cart_guest`

---

### 4.4 Capa de datos

#### Catálogo estático — `src/data/phoneData.ts`

Array TypeScript con **68 modelos** de teléfono:

```typescript
interface PhoneModel {
  id: string;           // ej. "ip17promax"
  modelName: string;    // ej. "iPhone 17 Pro Max"
  colorURL: string;     // "/downloaded_images/..._color.png"
  maskURL: string;      // "/downloaded_images/..._mask.png"
  brand: string;        // "Apple" | "Samsung" | "Google"
}
```

**Marcas cubiertas:**
- **Apple:** iPhone 7 → iPhone 17 Pro Max, SE, XR, XS, X
- **Samsung:** Galaxy S21–S24, Z Flip, Z Fold, serie A
- **Google:** Pixel 9 Pro XL, Pro, Pro Fold

Las imágenes viven en `public/downloaded_images/` (~198 archivos). Fueron generadas con `data.py` desde `img1.styletify.com`.

#### Firestore — colecciones

| Colección | Uso |
|-----------|-----|
| `users` | Perfiles y rol (`admin`) |
| `orders` | Órdenes confirmadas post-pago |
| `carts` | Snapshot del carrito antes del checkout |
| `personalizations` | Diseños guardados por usuario (opcional) |

---

### 4.5 Capa de servicios (`src/lib/`)

| Archivo | Función |
|---------|---------|
| `firebase.ts` | Inicializa Firebase **solo en cliente** (`typeof window !== 'undefined'`). Exporta `app`, `auth`, `db`, `analytics`. En servidor: todos son `null`. |
| `stripe.ts` | `loadStripe()` con clave pública. `redirectToCheckout(url)` redirige al checkout de Stripe. |
| `resend.ts` | Cliente Resend con `RESEND_API_KEY` (fallback `'re_placeholder'`). |
| `uploadImage.ts` | Convierte imagen a base64 (máx. 4 MB). No usa Firebase Storage. |
| `generateCaseImage.ts` | Renderiza canvas con diseño completo. **No importado en ningún archivo** (código muerto potencial). |
| `email-templates.ts` | Plantillas HTML: confirmación, en proceso, enviado. |

---

## 5. API Routes (backend serverless)

| Endpoint | Método | Archivo | Descripción |
|----------|--------|---------|-------------|
| `/api/checkout` | POST | `checkout/route.ts` | Crea sesión Stripe Checkout y guarda carrito en Firestore |
| `/api/webhook` | POST | `webhook/route.ts` | Recibe eventos Stripe, crea orden y envía email |
| `/api/send-email` | POST | `send-email/route.ts` | Envío manual de emails transaccionales |
| `/api/test-email` | POST | `test-email/route.ts` | Email de prueba con datos ficticios |

### Flujo de `/api/checkout`

1. Recibe `{ items, userId, userEmail }`
2. Valida que `items` no esté vacío
3. Construye `line_items` para Stripe (moneda `mxn`, precio en centavos)
4. Usa `colorURL` como imagen de producto en Stripe (no base64)
5. Guarda carrito en Firestore `carts` con `status: 'pending_checkout'`
6. Crea Stripe Checkout Session con metadata (`userId`, `cartId`, `itemCount`)
7. Retorna `{ url, sessionId }`

### Flujo de `/api/webhook`

**Eventos manejados:**
- `checkout.session.completed` → recupera items de `carts/{cartId}`, crea documento en `orders`, envía email vía Resend
- `payment_intent.succeeded` → solo logging

**Seguridad:** verificación de firma con `STRIPE_WEBHOOK_SECRET`

**Remitente email:** `Empaques & Fundas <noreply@empaquesyfundas.com>`

---

## 6. Flujos de negocio principales

### 6.1 Personalización y carrito

```
Usuario en /
  → Selecciona modelo de teléfono
  → Sube imagen (convertida a base64, máx. 4 MB)
  → Ajusta diseño (escala, rotación, flip, posición, teclado)
  → Click "Agregar al carrito"
      ├── Sin login → AuthWarningModal
      ├── Sin imagen → ImageWarningModal
      └── OK → CartContext + localStorage
```

**Atajos de teclado:** flechas (mover), +/- (zoom), R (rotar 90°)

### 6.2 Checkout y pago

```
/carrito
  → Revisar items (CasePreview)
  → "Proceder al Pago" (requiere login)
  → POST /api/checkout
  → Redirect a Stripe Checkout
  → Usuario paga con tarjeta

Stripe Webhook (checkout.session.completed)
  → Recupera carrito de Firestore
  → Crea orden en orders/
  → Envía email de confirmación (Resend)

/success?session_id=...
  → clearCart()
  → Mensaje de éxito
```

**Precio unitario:** $599 MXN (hardcodeado en `page.tsx`, `CaseCustomizer.tsx`, `catalogo/page.tsx`)

**Estados de orden (admin):** `confirmed` → `processing` → `shipped` → `delivered` | `cancelled`

### 6.3 Autenticación

```
/register o /login (o AuthModal)
  → Firebase Auth crea/valida sesión
  → AuthContext detecta cambio (onAuthStateChanged)
  → Redirect a / tras éxito
```

**Protección de rutas (solo client-side):**

| Ruta | Condición |
|------|-----------|
| `/perfil`, `/ordenes` | Redirect a `/login` si `!user` |
| `/admin` | Redirect a `/` si `!user` o `!isAdmin` |
| Agregar al carrito | Requiere login + imagen |
| Checkout | Requiere login |

---

## 7. Integraciones externas

| Servicio | Uso en el proyecto | Variables de entorno |
|----------|---------------------|----------------------|
| **Firebase Auth** | Login, registro, sesión, reset password | `NEXT_PUBLIC_FIREBASE_*` |
| **Firestore** | users, orders, carts, personalizations | `NEXT_PUBLIC_FIREBASE_*` |
| **Firebase Analytics** | Métricas en cliente | `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` |
| **Stripe** | Checkout Sessions + Webhooks | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` |
| **Resend** | Emails transaccionales HTML | `RESEND_API_KEY` |
| **Styletify** (legacy) | Origen de imágenes de modelos | — |

**Firebase Storage:** no se usa. Las imágenes personalizadas se almacenan como base64 en el carrito/orden.

---

## 8. Seguridad — Firestore Rules

Archivo: `firestore.rules`

| Colección | Lectura | Creación | Actualización | Eliminación |
|-----------|---------|----------|---------------|-------------|
| `orders` | Dueño o admin | Abierta (`create: true`) | Solo admin | Nadie |
| `carts` | Dueño o admin | Abierta | Dueño o admin | Solo admin |
| `personalizations` | Dueño o admin | Usuario autenticado (propio) | Dueño o admin | Dueño o admin |
| `users` | Propio o admin | Usuario autenticado (propio) | Propio o admin | Solo admin |

**Nota:** `orders.create: if true` es permisivo; en producción conviene restringirlo al backend con Firebase Admin SDK.

---

## 9. Estilos y diseño

### Enfoque híbrido

1. **Tailwind CSS** — layout general, páginas secundarias, modales, componentes nuevos
2. **CSS semántico legacy** — personalizador (`globals.css`, heredado de `style.css`)

### `globals.css` (~790 líneas)

Incluye clases del prototipo original:
- Grid de 3 columnas: `.main-content`, `.sidebar-left`, `.case-preview`, `.sidebar-right`
- Personalizador: `.case-container`, `.base-image`, `.custom-image-container`, máscaras CSS
- Controles: `.control-button`, `.move-button`, `.primary-button`
- Navbar: `.navbar`, `.nav-link`, `.cart-badge`, `.logo-text`
- Breakpoints responsive: 1200px, 1024px, 768px, 640px, 380px
- Optimizaciones touch, scrollbar custom, animación `.fade-in`

### Configuración

- `tailwind.config.js` — content paths en `src/pages`, `src/components`, `src/app`
- `postcss.config.js` — tailwindcss + autoprefixer
- Fuente Inter (Google Fonts) en layout + import redundante en globals.css

---

## 10. Archivos legacy y migración

| Archivo | Estado | Relación con Next.js |
|---------|--------|----------------------|
| `index.html` | Prototipo HTML completo con Tailwind/Lucide CDN | Base visual migrada a `src/app/page.tsx` |
| `app.js` | ~500 líneas JS vanilla con `phoneData` y lógica de carrito | Lógica reescrita en React/TypeScript |
| `style.css` | Estilos originales del prototipo | Replicados en `src/app/globals.css` |
| `data.py` | Script para descargar imágenes desde Styletify | Genera assets en `public/downloaded_images/` |

La migración preservó la UX del personalizador. `phoneData.ts` es la versión TypeScript enriquecida (campo `brand`, rutas con `/`).

---

## 11. Configuración del proyecto

### `next.config.js`
- `images.remotePatterns` para `img1.styletify.com`
- Redirect HTTP → HTTPS en producción hacia `https://empaquesyfundas.com/:path*`

### `tsconfig.json`
- `strict: true`
- Path alias: `@/*` → `./src/*`
- Target ES2020, `moduleResolution: "bundler"`

### `firebase.json`
- Solo despliega reglas de Firestore (`firestore.rules`)
- No incluye hosting ni Cloud Functions

### Scripts npm

```bash
npm run dev      # Servidor de desarrollo (puerto 3000)
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # ESLint
```

---

## 12. Variables de entorno requeridas

Archivo local: `.env.local` (gitignored)

```env
# Firebase (públicas — cliente)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend
RESEND_API_KEY=

# App
NEXT_PUBLIC_URL=http://localhost:3000
```

**Proyecto Firebase documentado:** `empaquesyfundas-9eebc`

---

## 13. Despliegue

**Plataforma recomendada:** Vercel

**Pasos:**
1. Conectar repositorio a Vercel
2. Configurar todas las variables de entorno (Production, Preview, Development)
3. Configurar webhook Stripe: `https://empaquesyfundas.com/api/webhook`
4. Verificar dominio en Resend para `noreply@empaquesyfundas.com`
5. Asegurar que `public/downloaded_images/` esté incluido en el deploy

**Documentación en repo:** `VERCEL_SETUP.md`, `VERCEL_INSTRUCTIONS.md`

---

## 14. Dependencias principales

| Paquete | Versión | Rol |
|---------|---------|-----|
| `next` | ^14.2.0 | Framework React con App Router |
| `react` / `react-dom` | ^18.3.1 | UI |
| `firebase` | ^10.12.0 | Auth, Firestore, Analytics |
| `stripe` | ^15.8.0 | API de pagos (servidor) |
| `@stripe/stripe-js` | ^8.1.0 | Checkout en cliente |
| `resend` | ^6.2.0 | Emails transaccionales |
| `lucide-react` | ^0.378.0 | Iconos |
| `uuid` | ^13.0.0 | IDs únicos |
| `tailwindcss` | ^3.4.3 | Utilidades CSS |
| `typescript` | ^5.4.5 | Tipado estático |

---

## 15. Fortalezas del proyecto

- Arquitectura Next.js 14 moderna con separación clara (pages, components, contexts, lib)
- Personalizador completo con máscaras CSS, drag & drop y atajos de teclado
- Integración end-to-end: carrito → Stripe Checkout → webhook → email
- Panel admin funcional con estadísticas y gestión de estados de orden
- Catálogo amplio (68 modelos, 3 marcas)
- Diseño responsive con optimizaciones touch
- Reglas Firestore definidas con roles de admin
- Assets de imágenes presentes en `public/` (~198 archivos)

---

## 16. Deuda técnica y gaps detectados

| Issue | Impacto | Ubicación |
|-------|---------|-----------|
| `firebase.ts` solo inicializa en cliente → `db = null` en API routes | Las escrituras a Firestore desde `/api/checkout` y `/api/webhook` **no funcionan en servidor** | `src/lib/firebase.ts`, API routes |
| `/ordenes` sin query a Firestore | El usuario no ve su historial de compras reales | `src/app/ordenes/page.tsx` (TODO explícito) |
| `/reset-password` no implementada | Enlace roto en login | `src/app/login/page.tsx` |
| `setup-admin` con credenciales hardcodeadas | Riesgo de seguridad en producción | `src/app/setup-admin/page.tsx` |
| Sin `middleware.ts` | Protección de rutas solo en cliente (bypasseable) | Raíz del proyecto |
| `generateCaseImage.ts` sin uso | Código muerto | `src/lib/generateCaseImage.ts` |
| `ConfirmationModal.tsx` sin uso | Código muerto | `src/components/ConfirmationModal.tsx` |
| Admin no dispara emails al cambiar estado | API `/api/send-email` infrautilizada | `src/app/admin/page.tsx` |
| `orders.create: if true` en Firestore rules | Cualquiera podría crear órdenes falsas | `firestore.rules` |
| Precio hardcodeado ($599) | Dificulta cambios centralizados | Múltiples archivos |
| Imágenes en base64 en carrito/órdenes | Documentos Firestore grandes, límites de tamaño | `CartContext`, checkout flow |
| README menciona precio $299 | Documentación desactualizada | `Readme.md` |

### Recomendación crítica

Crear un módulo `src/lib/firebase-admin.ts` con **Firebase Admin SDK** para las API routes del servidor. Esto permitiría que checkout, webhook y futuras operaciones backend escriban correctamente en Firestore sin depender del SDK de cliente.

---

## 17. Mapa de flujo de datos (resumen visual)

```
phoneData.ts (estático)
       │
       ▼
CaseCustomizer ──► CartContext ──► localStorage
       │                  │
       │                  ▼
       │            /carrito/page.tsx
       │                  │
       │                  ▼
       │         POST /api/checkout
       │                  │
       │         ┌────────┴────────┐
       │         ▼                 ▼
       │    Firestore          Stripe
       │    (carts)           Checkout
       │                         │
       │                         ▼
       │                  POST /api/webhook
       │                         │
       │              ┌──────────┼──────────┐
       │              ▼          ▼          ▼
       │         Firestore   Resend    /success
       │         (orders)   (email)   clearCart()
       │
       ▼
AuthContext ◄──► Firebase Auth
       │
       ▼
/admin (isAdmin) ◄──► Firestore (orders)
```

---

## 18. Conclusión

El proyecto **Empaques & Fundas** es un e-commerce funcional y bien estructurado para su etapa actual, con una migración exitosa del prototipo vanilla a Next.js 14. La arquitectura sigue patrones estándar de la industria (App Router, Context API, API Routes serverless, integraciones SaaS).

El principal bloqueador para producción robusta es la **inicialización de Firebase solo en cliente**, que impide la persistencia server-side de carritos y órdenes. Resolver esto con Firebase Admin SDK, completar la página `/ordenes`, y endurecer reglas de seguridad son los pasos prioritarios antes de un lanzamiento a escala.

---

*Informe generado a partir del análisis del código fuente en `C:\Users\User\Documents\chrisepyfnew`.*
