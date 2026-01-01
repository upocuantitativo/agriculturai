# 🚀 Cómo Abrir la Aplicación AgriculturaI

## ⚡ Método Rápido (Recomendado)

**Haz doble clic en el archivo:** `ABRIR_APP.bat`

Esto abrirá un servidor local automáticamente. Luego:

1. Abre tu navegador Chrome
2. Ve a: **http://localhost:8000**
3. Inicia sesión con:
   - **Usuario:** `manuel`
   - **Contraseña:** `1977Bienvenida`

---

## 🌐 Método Alternativo - Navegador con Extensión

Si no tienes Python instalado, puedes usar una extensión de Chrome:

1. Instala la extensión **"Web Server for Chrome"**
2. Abre la extensión y selecciona esta carpeta
3. Click en "Start Server"
4. Abre la URL que te muestra
5. Inicia sesión con las credenciales de arriba

---

## ❌ Por Qué NO Funciona Abrir index.html Directamente

Si abres `index.html` directamente haciendo doble clic, **NO funcionará** porque:

- El sistema de rutas (SPA) requiere un servidor web
- Las APIs de navegación del navegador necesitan protocolo HTTP
- Los archivos se cargan con protocolo `file://` que tiene restricciones

---

## 🔧 Si No Tienes Python

### Opción 1: Instalar Python
1. Ve a: https://www.python.org/downloads/
2. Descarga Python 3.x
3. Instala (marca la opción "Add to PATH")
4. Haz doble clic en `ABRIR_APP.bat`

### Opción 2: Usar Node.js
Si tienes Node.js instalado:

```bash
npx http-server -p 8000
```

Luego abre: http://localhost:8000

### Opción 3: Usar Visual Studio Code
1. Instala VS Code
2. Instala la extensión "Live Server"
3. Clic derecho en `index.html` → "Open with Live Server"

---

## ✅ Verificación

Sabrás que funciona correctamente cuando:

1. ✅ Ves la página de login con fondo degradado morado
2. ✅ El favicon (hoja verde) aparece en la pestaña de Chrome
3. ✅ Puedes iniciar sesión con usuario `manuel`
4. ✅ Después del login ves la página de inicio con la navbar

---

## 🆘 Problemas Comunes

### "No se puede conectar al servidor"
- Verifica que el servidor esté corriendo (ventana de terminal abierta)
- Asegúrate de usar `localhost:8000` no otro puerto

### "Página en blanco después del login"
- Presiona F12 en Chrome
- Revisa la consola por errores
- Asegúrate de estar usando un servidor, no abriendo archivos directamente

### "El favicon no aparece"
- Limpia la caché del navegador (Ctrl + Shift + Delete)
- Recarga con Ctrl + F5

---

## 📱 Acceso desde el Móvil (Misma Red WiFi)

1. Inicia el servidor en tu PC con `ABRIR_APP.bat`
2. Averigua la IP de tu PC (ejecuta `ipconfig` en cmd)
3. En tu móvil, abre el navegador y ve a: `http://[TU_IP]:8000`
   - Ejemplo: `http://192.168.1.10:8000`
4. Inicia sesión normalmente

---

## 🌍 Ver Online en GitHub Pages

Alternativamente, puedes activar GitHub Pages:

1. Ve a: https://github.com/upocuantitativo/agriculturai/settings/pages
2. En "Source" selecciona: **GitHub Actions**
3. Espera 2 minutos
4. Accede a: https://upocuantitativo.github.io/agriculturai/
5. Inicia sesión con las mismas credenciales

---

**¿Necesitas ayuda?** Revisa los archivos:
- `GUIA_GITHUB_PAGES.md` - Para deploy online
- `GUIA_SUPABASE.md` - Para configurar base de datos
- `README.md` - Documentación general
