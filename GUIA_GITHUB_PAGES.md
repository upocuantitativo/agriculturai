# 🚀 Guía para Activar GitHub Pages

Esta guía te ayudará a activar GitHub Pages y hacer que tu plataforma AgriculturaI esté disponible online.

## Paso 1: Verificar que el código está en GitHub

✅ El repositorio ya está creado en: `https://github.com/upocuantitativo/agriculturai`

Puedes verificarlo visitando ese enlace.

## Paso 2: Activar GitHub Pages

1. **Ve a la configuración del repositorio:**
   - Abre https://github.com/upocuantitativo/agriculturai/settings/pages
   - O desde el repositorio: Click en "Settings" (⚙️) > "Pages" (en el menú lateral izquierdo)

2. **Configurar la fuente de publicación:**
   - En la sección "Build and deployment"
   - En "Source", selecciona: **"GitHub Actions"**
   - NO selecciones "Deploy from a branch" (la otra opción)

3. **Guardar:**
   - GitHub Pages se activará automáticamente
   - El archivo `.github/workflows/deploy.yml` que ya creamos se encargará del deploy

## Paso 3: Esperar el deploy

1. **Ve a la pestaña "Actions":**
   - Abre: https://github.com/upocuantitativo/agriculturai/actions

2. **Verás el workflow "Deploy to GitHub Pages":**
   - Estado "Running" (naranja 🟠) → en proceso
   - Estado "Success" (verde ✅) → completado
   - Esto toma 1-2 minutos la primera vez

3. **Si hay error (rojo ❌):**
   - Click en el workflow fallido
   - Revisa los logs para ver qué salió mal
   - Generalmente se soluciona haciendo otro push

## Paso 4: Verificar que funciona

Una vez completado el deploy:

1. **Visita tu sitio:**
   ```
   https://upocuantitativo.github.io/agriculturai/
   ```

2. **Debería abrirse la página de inicio** de AgriculturaI

3. **Prueba la navegación:**
   - ✅ Inicio
   - ✅ Diagnóstico
   - ✅ Mis Cultivos
   - ✅ Asistente (Chatbot)
   - ✅ Productos (Marketplace)
   - ✅ Pedidos (Carrito)

## Paso 5: Configurar dominio personalizado (Opcional)

Si quieres usar un dominio propio tipo `www.agriculturai.com`:

1. **Compra un dominio** (Namecheap, GoDaddy, etc.)

2. **Configura DNS:**
   Agrega estos registros en tu proveedor de dominio:
   ```
   Tipo: A
   Host: @
   Valor: 185.199.108.153
   Valor: 185.199.109.153
   Valor: 185.199.110.153
   Valor: 185.199.111.153

   Tipo: CNAME
   Host: www
   Valor: upocuantitativo.github.io
   ```

3. **En GitHub Pages:**
   - Settings > Pages > Custom domain
   - Ingresa tu dominio: `www.agriculturai.com`
   - Check "Enforce HTTPS"

4. **Espera 24-48 horas** para propagación de DNS

## Solución de Problemas Comunes

### ❌ Error 404 - Página no encontrada

**Causa:** GitHub Pages no está activado correctamente

**Solución:**
1. Ve a Settings > Pages
2. Verifica que "Source" esté en "GitHub Actions"
3. Espera 2-3 minutos después de hacer un push
4. Limpia cache del navegador (Ctrl + F5)

### ❌ La página se ve sin estilos

**Causa:** Rutas incorrectas en archivos

**Solución:**
1. Verifica que los archivos CSS estén en `assets/css/`
2. En `index.html`, las rutas deben ser relativas:
   ```html
   <link rel="stylesheet" href="assets/css/main.css">
   ```
   NO usar rutas absolutas como `/assets/css/main.css`

### ❌ El router no funciona / Error 404 en rutas

**Causa:** GitHub Pages no soporta routing del lado del servidor

**Solución:**
- Ya está implementado con router.js (client-side)
- El router usa History API y funciona correctamente
- Si ves problemas, asegúrate de navegar desde la página de inicio

### ❌ El deploy falla en Actions

**Causa:** Problemas con el workflow

**Solución:**
1. Ve a Actions > Click en el workflow fallido
2. Lee el error en los logs
3. Generalmente se soluciona con:
   ```bash
   git add .
   git commit -m "Fix deploy issue"
   git push
   ```

## Verificación Final

Usa este checklist para asegurarte que todo funciona:

- [ ] GitHub Pages activado (Settings > Pages)
- [ ] Workflow de deploy ejecutado exitosamente (Actions)
- [ ] Sitio accesible en https://upocuantitativo.github.io/agriculturai/
- [ ] Navegación funciona (todas las páginas cargan)
- [ ] Estilos se aplican correctamente
- [ ] Logo aparece en la barra de navegación
- [ ] Footer muestra la información correcta

## Actualizaciones Futuras

Cada vez que hagas cambios:

1. **Edita archivos localmente**
2. **Commit:**
   ```bash
   git add .
   git commit -m "Descripción de cambios"
   ```
3. **Push:**
   ```bash
   git push
   ```
4. **GitHub Actions desplegará automáticamente** (1-2 minutos)
5. **Recarga la página** (puede requerir Ctrl + F5 para limpiar cache)

## URLs Útiles

- **Repositorio:** https://github.com/upocuantitativo/agriculturai
- **Sitio web:** https://upocuantitativo.github.io/agriculturai/
- **Actions (deploy):** https://github.com/upocuantitativo/agriculturai/actions
- **Settings:** https://github.com/upocuantitativo/agriculturai/settings

## Soporte

Si tienes problemas:

1. Revisa los logs en Actions
2. Verifica que todos los archivos estén commitados
3. Asegúrate que el workflow deploy.yml esté presente
4. Prueba haciendo un nuevo push

---

**¡Listo!** Tu plataforma AgriculturaI debería estar online y funcionando. 🎉
