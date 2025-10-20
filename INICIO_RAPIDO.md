# 🚀 Inicio Rápido - 3 Pasos

## 1️⃣ Instalar Dependencias (1 minuto)

```bash
npm install
```

## 2️⃣ Verificar que exista `.env.local` (Ya está creado) ✅

El archivo `.env.local` ya tiene todas las credenciales configuradas:
- ✅ Firebase (empaquesyfundas-9eebc)
- ✅ Stripe (cuenta: kevin.truiz@gmail.com)

## 3️⃣ Ejecutar el Proyecto

```bash
npm run dev
```

Abre en tu navegador: **http://localhost:3000**

---

## 🎉 ¡Listo! Ya funciona todo

### ✅ Lo que ya funciona:

- **Personalizador de fundas** con 60+ modelos
- **Login/Registro** con Firebase
- **Carrito de compras** con persistencia
- **Pago con Stripe** (modo test)
- **Responsive** en móviles y tablets

---

## 📱 Prueba Estas Funciones:

### 1. Personalizar una Funda
1. Abre http://localhost:3000
2. Selecciona un modelo de teléfono
3. Sube una imagen
4. Usa los controles o el teclado (flechas, +/-, R)

### 2. Crear una Cuenta
1. Click en el icono de usuario (arriba derecha)
2. "Regístrate aquí"
3. Completa el formulario
4. ¡Ya tienes cuenta!

### 3. Hacer una Compra de Prueba
1. Personaliza una funda
2. "Agregar al Carrito"
3. Ve al carrito
4. "Proceder al Pago"
5. Usa esta tarjeta de prueba de Stripe:
   - **Número**: 4242 4242 4242 4242
   - **Fecha**: Cualquier fecha futura (ej: 12/25)
   - **CVC**: Cualquier 3 dígitos (ej: 123)
   - **Código Postal**: Cualquiera (ej: 12345)

---

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Compilar para producción
npm run build

# Ejecutar versión de producción
npm run start
```

---

## 📚 Documentación Completa

- Ver `README.md` para documentación completa
- Ver `INSTRUCCIONES_SETUP.md` para configuración avanzada
- Ver `ENV_SETUP.md` para configuración de variables de entorno

---

## ❓ Problemas Comunes

**Error: Cannot find module**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Error de Firebase**
- Verifica que el archivo `.env.local` existe en la raíz
- Reinicia el servidor (`npm run dev`)

**Imágenes no cargan**
- Verifica que existe `public/downloaded_images/`
- Las imágenes ya deben estar ahí (190 archivos)

---

## 🎨 Personalización Rápida

### Cambiar el precio:
Busca `299` en el código y cámbialo por el precio que quieras

### Cambiar colores del tema:
Edita `src/app/globals.css`, busca los gradientes:
```css
background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
```

### Agregar más modelos:
Edita `src/data/phoneData.ts`

---

## 📊 Estado del Proyecto

✅ **100% Funcional y Listo para Usar**

- ✅ Frontend completamente funcional
- ✅ Autenticación con Firebase
- ✅ Pagos con Stripe configurados
- ✅ Carrito de compras
- ✅ Diseño responsive
- ✅ Todas las credenciales configuradas

---

## 🚀 Deploy a Producción (Vercel)

1. Sube tu código a GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Importa tu repositorio
4. Agrega las variables de `.env.local` en Vercel
5. ¡Deploy automático!

---

**¿Listo para empezar? Ejecuta:**

```bash
npm install
npm run dev
```

**¡Disfruta tu nuevo e-commerce! 🎉**

