# Empaques & Fundas - E-commerce de Fundas Personalizadas

Aplicación Next.js 14 para personalización y venta de fundas de teléfono con integración de Firebase Authentication y Stripe Checkout.

## 🚀 Características

- ✅ **Personalizador de Fundas**: Sube tu imagen y personaliza fundas para 60+ modelos de teléfonos
- ✅ **Controles de Edición**: Escala, rotación, volteo y posición de imágenes
- ✅ **Firebase Authentication**: Login, registro y gestión de usuarios
- ✅ **Carrito de Compras**: Sistema completo de carrito con persistencia
- ✅ **Stripe Checkout**: Pasarela de pago segura integrada
- ✅ **Responsive Design**: Optimizado para móviles, tablets y desktop
- ✅ **Panel de Administración**: Vista exclusiva para ver compras, movimientos y clientes

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Cuenta de Firebase
- Cuenta de Stripe

## 🛠️ Instalación

1. **Clonar el repositorio**:
```bash
cd chrisepyfnew
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno**:

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id_here
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id_here

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here

# PostgreSQL (Railway)
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

4. **Ejecutar en desarrollo**:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🔐 Credenciales de Administrador

El panel admin está en `/admin` y solo es accesible para usuarios con rol `admin`.

| Campo | Valor |
|-------|-------|
| **Email** | `admin@empaquesyfundas.com` |
| **Contraseña** | `Admin123!` |
| **URL del panel** | `/admin` |

### Crear o sincronizar el admin

```bash
npm run seed:admin
```

También puedes usar la página `/setup-admin` una sola vez.

### Qué puede ver el admin

- **Compras** — Todas las órdenes con detalle de productos y diseños personalizados
- **Movimientos** — Actividad de clientes: compras, carritos, personalizaciones y registros
- **Clientes** — Listado con total gastado, compras y personalizaciones por usuario

## 🧪 Tests

```bash
npm test
```

Ejecuta 18 tests que cubren: credenciales admin, validación Stripe, lógica de roles, flujos de carrito/órdenes y tipos de actividad.

## 📁 Estructura del Proyecto

```
chrisepyfnew/
├── public/
│   └── downloaded_images/     # Imágenes de modelos de teléfonos
├── src/
│   ├── app/                   # App Router de Next.js
│   │   ├── api/
│   │   │   └── checkout/      # API route de Stripe
│   │   ├── login/             # Página de login
│   │   ├── register/          # Página de registro
│   │   ├── carrito/           # Página de carrito
│   │   ├── perfil/            # Página de perfil de usuario
│   │   ├── ordenes/           # Página de órdenes
│   │   ├── success/           # Página de éxito post-pago
│   │   ├── layout.tsx         # Layout principal
│   │   ├── page.tsx           # Página principal (personalizador)
│   │   └── globals.css        # Estilos globales
│   ├── components/
│   │   ├── CaseCustomizer.tsx # Componente del personalizador
│   │   ├── Navbar.tsx         # Barra de navegación
│   │   └── Footer.tsx         # Footer
│   ├── contexts/
│   │   ├── AuthContext.tsx    # Contexto de autenticación
│   │   └── CartContext.tsx    # Contexto del carrito
│   ├── data/
│   │   └── phoneData.ts       # Datos de modelos de teléfonos
│   └── lib/
│       └── firebase.ts        # Configuración de Firebase
├── .env.local                 # Variables de entorno (NO SUBIR A GIT)
├── .env.example               # Ejemplo de variables de entorno
├── next.config.js             # Configuración de Next.js
├── tailwind.config.js         # Configuración de Tailwind
├── tsconfig.json              # Configuración de TypeScript
└── package.json               # Dependencias del proyecto
```

## 🎮 Uso del Personalizador

### Controles de Mouse/Touch:
- **Arrastrar**: Mueve la imagen personalizada
- **Scroll**: Zoom (próximamente)

### Atajos de Teclado:
- **Flechas**: Mover imagen (↑↓←→)
- **+/-**: Zoom in/out
- **R**: Rotar 90°

### Botones de Control:
- **Escala**: Aumentar/disminuir tamaño
- **Rotación**: Rotar izquierda/derecha
- **Voltear**: Voltear horizontal/vertical
- **Posición**: Controles direccionales
- **Reset**: Restablecer transformaciones

## 💳 Flujo de Compra

1. Usuario personaliza su funda
2. Agrega al carrito
3. Inicia sesión (si no lo ha hecho)
4. Revisa carrito
5. Procede al pago (Stripe Checkout)
6. Confirmación y limpieza del carrito

## 🔐 Autenticación

El proyecto usa **Firebase Authentication** con las siguientes funcionalidades:

- Registro con email y contraseña
- Login
- Logout
- Recuperación de contraseña
- Protección de rutas
- Persistencia de sesión

## 💰 Pagos con Stripe

Integración completa de Stripe Checkout:

- Sesiones seguras de pago
- Soporte para múltiples artículos
- Redirección automática post-pago
- Manejo de errores

## 🚢 Deploy

### Vercel (Recomendado)

1. Conecta tu repositorio de GitHub con Vercel
2. Configura las variables de entorno en el dashboard de Vercel
3. Deploy automático

### Otras plataformas

El proyecto es compatible con cualquier plataforma que soporte Next.js:
- Netlify
- Railway
- AWS Amplify
- Google Cloud Run

## 🔧 Scripts Disponibles

```bash
npm run dev      # Modo desarrollo
npm run build    # Construir para producción
npm run start    # Iniciar servidor de producción
npm run lint     # Ejecutar linter
npm test         # Ejecutar tests Jest
npm run seed:admin  # Crear/sincronizar usuario admin
```

## 🎨 Personalización

### Cambiar modelos de teléfonos:
Edita `src/data/phoneData.ts` para agregar/eliminar modelos

### Cambiar precio:
Busca y reemplaza `299` en el código (precio actual)

### Cambiar estilos:
Edita `src/app/globals.css` o las clases de Tailwind

## 📝 Notas Importantes

- Las imágenes de modelos están en `/public/downloaded_images/`
- El carrito se guarda en `localStorage`
- Las credenciales de Stripe en `.env.local` son de prueba (test mode)
- Para producción, usa las claves live de Stripe

## 🐛 Problemas Comunes

### Error de Firebase:
- Verifica que las variables de entorno estén configuradas correctamente
- Asegúrate de haber habilitado Email/Password en Firebase Console

### Error de Stripe:
- Verifica las claves API de Stripe
- Asegúrate de usar las claves correctas (test vs live)

### Imágenes no cargan:
- Verifica que `/public/downloaded_images/` existe
- Reinicia el servidor de desarrollo

## 📧 Soporte

Para soporte, contacta a: kevin.truiz@gmail.com

## 📄 Licencia

Este proyecto es privado y no tiene licencia pública.

---

**Desarrollado con ❤️ usando Next.js 14, Firebase y Stripe**

## 🚀 Última actualización
- ✅ Modal de advertencia para usuarios no autenticados
- ✅ Configuración optimizada para Vercel
- ✅ Build exitoso sin errores
