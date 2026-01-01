# 🚀 ACTIVAR GITHUB PAGES - 3 Pasos Simples

## ✅ Todo está listo en GitHub

El código ya está subido a: **https://github.com/upocuantitativo/agriculturai**

Ahora solo necesitas activar GitHub Pages:

---

## 📋 PASO 1: Ir a Configuración

1. Abre tu navegador
2. Ve a: **https://github.com/upocuantitativo/agriculturai/settings/pages**
3. O manualmente:
   - Abre: https://github.com/upocuantitativo/agriculturai
   - Click en **"Settings"** (pestaña arriba)
   - En el menú lateral izquierdo, busca **"Pages"**
   - Click en **"Pages"**

---

## 📋 PASO 2: Configurar Source

Verás una página que dice "GitHub Pages"

1. Busca la sección: **"Build and deployment"**
2. Debajo dice: **"Source"**
3. Click en el dropdown que probablemente dice **"Deploy from a branch"**
4. **Selecciona**: **"GitHub Actions"** ⚡
5. La página se guardará automáticamente

**NO toques ninguna otra opción**, solo cambiar "Source" a "GitHub Actions"

---

## 📋 PASO 3: Esperar Deploy (1-2 minutos)

1. Ve a: **https://github.com/upocuantitativo/agriculturai/actions**
2. Verás un workflow que dice: **"Deploy to GitHub Pages"**
3. Estado:
   - 🟡 Círculo amarillo = Ejecutándose (espera)
   - ✅ Check verde = ¡Completado!
   - ❌ X roja = Error (avísame)

4. **Espera** aproximadamente 1-2 minutos

---

## 🌐 PASO 4: Abrir Tu Sitio

Una vez que veas el check verde ✅:

1. Abre: **https://upocuantitativo.github.io/agriculturai/**

Deberías ver:
- ✅ Página de login con fondo degradado
- ✅ Icono de hoja verde en la pestaña
- ✅ Formulario de usuario y contraseña

---

## 🔐 Iniciar Sesión

- **Usuario**: `manuel`
- **Contraseña**: `1977Bienvenida`

---

## ✨ Después del Login

Verás:
- Navbar verde con menú
- Página de inicio
- Puedes navegar por todas las secciones:
  - 🏠 Inicio
  - 📸 Diagnóstico
  - 🌱 Mis Cultivos
  - 💬 Asistente
  - 🛒 Productos
  - 📦 Pedidos

---

## 🔧 Configurar Supabase (Para que funcionen los pedidos)

Sigue estos pasos después de activar GitHub Pages:

### 1. Ejecutar Script SQL

1. Ve a: **https://supabase.com/dashboard**
2. Abre tu proyecto: **"upocuantitativo's Project"**
3. Click en **"SQL Editor"** en el menú lateral
4. Click en **"New query"**
5. Abre el archivo **`SCRIPT_SUPABASE.sql`** de esta carpeta
6. Copia TODO el contenido
7. Pega en Supabase SQL Editor
8. Click en **"Run"** (▶️)
9. Deberías ver: "Tablas creadas exitosamente!"

### 2. Verificar Configuración

Ya configuraste:
- ✅ URL en `config/supabase-config.js`
- ✅ API Key en `config/supabase-config.js`

Listo! El sistema de pedidos ya funcionará.

---

## 📱 Ver desde el Móvil

Una vez activado GitHub Pages, puedes abrir desde cualquier dispositivo:

**URL**: https://upocuantitativo.github.io/agriculturai/

- Funciona en celular
- Funciona en tablet
- Funciona en cualquier navegador

---

## 🔄 Actualizar la Página

Si haces cambios en el código:

1. Haz commit y push a GitHub
2. GitHub Actions desplegará automáticamente
3. Espera 1-2 minutos
4. Recarga la página (Ctrl + F5)

---

## ❌ Solución de Problemas

### "404 - Page not found"

**Causa**: GitHub Pages no está activado o aún no terminó el deploy

**Solución**:
1. Verifica que Source esté en "GitHub Actions"
2. Revisa que el workflow haya terminado (Actions)
3. Espera 2 minutos más
4. Limpia caché (Ctrl + Shift + Delete)

### "La página se ve sin estilos"

**Causa**: El deploy aún no está completo

**Solución**:
1. Espera 1 minuto más
2. Recarga con Ctrl + F5
3. Revisa en Actions que haya terminado

### "Workflow fallido (X roja)"

**Causa**: Error en el deploy

**Solución**:
1. Click en el workflow fallido
2. Lee el error
3. Generalmente se soluciona haciendo otro push:
   ```bash
   git add .
   git commit -m "Fix deploy"
   git push
   ```

---

## ✅ RESUMEN RÁPIDO

**3 pasos:**
1. https://github.com/upocuantitativo/agriculturai/settings/pages
2. Source → "GitHub Actions"
3. Espera 2 minutos

**Tu sitio:**
https://upocuantitativo.github.io/agriculturai/

**Login:**
- Usuario: `manuel`
- Contraseña: `1977Bienvenida`

---

**¿Ya activaste GitHub Pages?**

Cuando lo hagas, espera 2 minutos y abre:
**https://upocuantitativo.github.io/agriculturai/**
