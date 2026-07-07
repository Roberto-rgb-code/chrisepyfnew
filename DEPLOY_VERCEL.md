# Deploy en Vercel — Empaques & Fundas

## 1. Subir código a GitHub

El proyecto ya está en: `https://github.com/Roberto-rgb-code/chrisepyfnew`

Tras hacer push, Vercel redeploya automáticamente si el repo está conectado.

## 2. Variables de entorno en Vercel

**Settings → Environment Variables** → agregar todas (marcar Production, Preview y Development):

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Connection string de Railway PostgreSQL |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Console → Project Settings |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` en producción |
| `STRIPE_SECRET_KEY` | `sk_live_...` en producción (mismo modo que pk) |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Webhooks → Signing secret |
| `RESEND_API_KEY` | Resend dashboard |
| `NEXT_PUBLIC_URL` | `https://www.empaquesyfundas.com` |

## 3. Stripe en producción

1. En [Stripe Dashboard](https://dashboard.stripe.com) activa **Live mode**
2. Copia `pk_live_...` y `sk_live_...` (deben ser del mismo modo)
3. Crea webhook:
   - URL: `https://www.empaquesyfundas.com/api/webhook`
   - Evento: `checkout.session.completed`
4. Copia el **Signing secret** → `STRIPE_WEBHOOK_SECRET` en Vercel

## 4. Redeploy

**Deployments** → último deploy → **⋯** → **Redeploy**

## 5. Verificar

- [ ] Sitio carga en `empaquesyfundas.com`
- [ ] Login/registro funciona
- [ ] Personalizador y carrito funcionan
- [ ] Checkout Stripe completa el pago
- [ ] Orden aparece en `/admin` (PostgreSQL)
- [ ] Email de confirmación llega

## 6. Admin inicial

Visita una sola vez: `https://www.empaquesyfundas.com/setup-admin`

## Base de datos

Las tablas ya están en Railway (`User`, `Cart`, `Order`, `Personalization`).  
No hace falta correr migraciones en Vercel — el build ejecuta `prisma generate` automáticamente.
