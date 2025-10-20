# 🚀 Configuración de Vercel para Deploy

## 📋 Variables de Entorno Requeridas

Para que el proyecto funcione correctamente en Vercel, necesitas configurar las siguientes variables de entorno en el dashboard de Vercel:

### 🔥 Firebase Variables
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 💳 Stripe Variables
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
```

## 🔧 Pasos para Configurar en Vercel

### 1. Acceder al Dashboard de Vercel
- Ve a [vercel.com](https://vercel.com)
- Inicia sesión con tu cuenta
- Selecciona tu proyecto

### 2. Configurar Variables de Entorno
- Ve a **Settings** → **Environment Variables**
- Agrega cada variable una por una:
  - **Name**: `NEXT_PUBLIC_FIREBASE_API_KEY`
  - **Value**: `AIzaSyDGyr5AiP44KpHCsdaF_Aca1_yibjgL4lg`
  - **Environment**: Production, Preview, Development (marcar todos)
- Repite para todas las variables

### 3. Configurar Dominio (Opcional)
- Ve a **Settings** → **Domains**
- Agrega tu dominio personalizado si lo tienes

### 4. Redeploy
- Ve a **Deployments**
- Haz clic en **Redeploy** en el último deployment
- O haz un nuevo push al repositorio

## ⚠️ Solución de Problemas

### Error: "An unexpected error happened when running this build"
- **Causa**: Variables de entorno faltantes
- **Solución**: Configurar todas las variables de entorno en Vercel

### Error: "Module not found"
- **Causa**: Dependencias faltantes
- **Solución**: Verificar que `package.json` tenga todas las dependencias

### Error: "Build timeout"
- **Causa**: Build muy lento
- **Solución**: Optimizar imágenes y código

## 📊 Verificación del Deploy

Una vez configurado, verifica que:
- ✅ El sitio carga correctamente
- ✅ El login/register funciona
- ✅ El personalizador de fundas funciona
- ✅ El carrito funciona
- ✅ Stripe checkout funciona

## 🆘 Soporte

Si tienes problemas:
1. Revisa los logs en Vercel Dashboard
2. Verifica que todas las variables estén configuradas
3. Contacta a Vercel Support si persiste el problema
