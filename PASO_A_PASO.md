# 📋 PASO A PASO - Configurar y Abrir AgriculturaI

## 🎯 PARTE 1: Ejecutar Script en Supabase

Ya tienes la URL y API Key. Ahora ejecuta el script SQL:

### Paso 1: Ir a Supabase SQL Editor
1. Abre tu navegador
2. Ve a: **https://supabase.com/dashboard**
3. Inicia sesión
4. Click en tu proyecto: **"upocuantitativo's Project"**
5. En el menú lateral izquierdo, click en **"SQL Editor"** (icono 📝)

### Paso 2: Crear Nueva Query
1. Click en **"New query"** (botón arriba a la derecha)
2. Se abrirá un editor vacío

### Paso 3: Copiar y Pegar Script
1. Abre el archivo: **`SCRIPT_SUPABASE.sql`** (está en esta carpeta)
2. **Selecciona TODO el contenido** (Ctrl + A)
3. **Copia** (Ctrl + C)
4. **Pega** en el SQL Editor de Supabase (Ctrl + V)

### Paso 4: Ejecutar Script
1. Click en el botón **"Run"** (▶️) arriba a la derecha
2. **O presiona** Ctrl + Enter
3. Espera 2-3 segundos

### Paso 5: Verificar Éxito
Deberías ver en la parte inferior:
```
✅ Success
Tablas creadas exitosamente!
total_suppliers: 3
total_products: 3
total_prices: 3
```

Si ves esto, ¡EXCELENTE! Las tablas están creadas. ✅

---

## 🚀 PARTE 2: Abrir la Aplicación Local

### Opción A: Si tienes Python instalado

1. **Cierra** cualquier terminal o servidor que tengas abierto
2. **Haz doble clic** en: `ABRIR_APP.bat`
3. Verás una ventana que dice "Servidor iniciado"
4. Se abrirá Chrome automáticamente en `http://localhost:8000`
5. Deberías ver el **LOGIN**

### Opción B: Si NO tienes Python

#### Método 1: Instalar Python (5 minutos)
1. Ve a: **https://www.python.org/downloads/**
2. Click en **"Download Python"** (versión más reciente)
3. **Ejecuta el instalador**
4. ✅ **IMPORTANTE**: Marca la casilla **"Add Python to PATH"**
5. Click en "Install Now"
6. Espera a que termine
7. Cierra y abre una nueva terminal
8. Haz doble clic en `ABRIR_APP.bat`

#### Método 2: Usar Visual Studio Code
1. Descarga VS Code: **https://code.visualstudio.com/**
2. Instálalo
3. Abre VS Code
4. Click en "File" > "Open Folder"
5. Selecciona la carpeta: `servicio IA agricultura`
6. Click en "Extensions" (icono cuadrados en barra lateral)
7. Busca: **"Live Server"**
8. Instala la extensión de **Ritwick Dey**
9. Clic derecho en `index.html` en el explorador de VS Code
10. Selecciona: **"Open with Live Server"**
11. Se abrirá el navegador automáticamente

#### Método 3: Usar Node.js (si lo tienes)
Abre una terminal en la carpeta y ejecuta:
```bash
npx http-server -p 8000
```

---

## 🌐 PARTE 3: Abrir en GitHub Pages (Online)

Si no quieres instalar nada, puedes verlo online:

### Paso 1: Activar GitHub Pages
1. Ve a: **https://github.com/upocuantitativo/agriculturai/settings/pages**
2. En "Source" selecciona: **"GitHub Actions"**
3. No toques nada más, solo cambia "Source"

### Paso 2: Esperar Deploy
1. Ve a: **https://github.com/upocuantitativo/agriculturai/actions**
2. Verás un workflow ejecutándose (círculo amarillo 🟡)
3. Espera 1-2 minutos hasta que aparezca check verde ✅

### Paso 3: Abrir Sitio
1. Ve a: **https://upocuantitativo.github.io/agriculturai/**
2. Deberías ver el **LOGIN**

---

## 🔐 INICIAR SESIÓN

Una vez que veas la página de login:

- **Usuario**: `manuel`
- **Contraseña**: `1977Bienvenida`

Después del login verás:
- ✅ Navbar verde con opciones
- ✅ Página de inicio
- ✅ Icono de hoja verde en la pestaña

---

## ❌ Solución de Problemas

### "Error 404 - File not found"

**Causa**: No tienes un servidor web corriendo

**Soluciones**:
1. Instala Python (ver Opción B - Método 1)
2. O usa VS Code con Live Server (ver Opción B - Método 2)
3. O activa GitHub Pages (ver PARTE 3)

### "Python no reconocido"

**Causa**: Python no está en el PATH

**Solución**:
1. Desinstala Python
2. Vuelve a instalar
3. ✅ Marca "Add Python to PATH" durante instalación

### "Página en blanco"

**Causa**: Estás abriendo index.html directamente (doble clic)

**Solución**:
- NO hagas doble clic en index.html
- USA `ABRIR_APP.bat` o GitHub Pages

### "No aparece el login"

**Causa**: Problema con las rutas o el servidor

**Solución**:
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Console"
3. Copia los errores que veas
4. O usa GitHub Pages directamente

---

## ✅ VERIFICACIÓN FINAL

Todo funciona correctamente cuando:

1. ✅ Ves página de login con fondo degradado morado
2. ✅ Icono de hoja verde en pestaña de Chrome
3. ✅ Puedes iniciar sesión con usuario `manuel`
4. ✅ Navbar verde aparece después del login
5. ✅ Puedes navegar entre páginas

---

## 🆘 SI NADA FUNCIONA

**Usa GitHub Pages** (es la opción más confiable):

1. https://github.com/upocuantitativo/agriculturai/settings/pages
2. Source: "GitHub Actions"
3. Espera 2 minutos
4. Abre: https://upocuantitativo.github.io/agriculturai/

---

## 📧 Credenciales que Tienes

**Supabase:**
- URL: Ya configurada en `config/supabase-config.js`
- API Key: Ya configurada
- Password: `dray*J3q-HLt3qU`

**Login App:**
- Usuario: `manuel`
- Contraseña: `1977Bienvenida`

---

¿Listo? Empieza por **PARTE 1** (Supabase) y luego **PARTE 2 o 3** (abrir app).
