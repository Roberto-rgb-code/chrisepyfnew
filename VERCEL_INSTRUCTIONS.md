# 🚀 Instrucciones para Deploy en Vercel

## ⚠️ IMPORTANTE: Configurar Variables de Entorno

Para que el proyecto funcione en Vercel, debes configurar las variables de entorno en el dashboard de Vercel.

## 📋 Variables Requeridas

### Firebase (7 variables)
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` 
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

### Stripe (2 variables)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`

## 🔧 Pasos para Configurar

1. **Ve a tu proyecto en Vercel Dashboard**
2. **Settings** → **Environment Variables**
3. **Agrega cada variable** con su valor correspondiente
4. **Marca todas las opciones**: Production, Preview, Development
5. **Redeploy** tu proyecto

## 📞 Contacto para Claves

Las claves reales están disponibles en el archivo `.env.local` local. 
Para obtenerlas, contacta al desarrollador o revisa la configuración local.

## ✅ Verificación

Una vez configuradas las variables:
- El sitio debe cargar sin errores
- Login/Register debe funcionar
- Stripe checkout debe funcionar
- Todas las funcionalidades deben estar operativas

## 🆘 Si hay problemas

1. Verifica que todas las variables estén configuradas
2. Revisa los logs de Vercel
3. Asegúrate de que las claves sean correctas
4. Contacta al soporte si persiste el problema
