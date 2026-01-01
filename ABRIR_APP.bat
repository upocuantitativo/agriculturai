@echo off
chcp 65001 >nul
echo ==========================================
echo   AgriculturaI - Servidor Local
echo ==========================================
echo.
echo Iniciando servidor en http://localhost:8000
echo.
echo IMPORTANTE:
echo - Usuario: manuel
echo - Contrasena: 1977Bienvenida
echo.
echo Presiona Ctrl+C para detener el servidor
echo ==========================================
echo.

REM Cambiar al directorio donde está este archivo
cd /d "%~dp0"

REM Verificar que existe index.html
if not exist "index.html" (
    echo ERROR: No se encuentra index.html
    echo Asegurate de estar en la carpeta correcta
    pause
    exit /b 1
)

echo Directorio actual: %CD%
echo.
echo Abriendo navegador en 3 segundos...
timeout /t 3 >nul
start http://localhost:8000
echo.

REM Intentar con Python 3
python -m http.server 8000 2>nul
if errorlevel 1 (
    REM Si Python 3 no funciona, intentar con Python 2
    python -m SimpleHTTPServer 8000 2>nul
    if errorlevel 1 (
        echo.
        echo ==========================================
        echo ERROR: Python no esta instalado
        echo ==========================================
        echo.
        echo Opciones:
        echo 1. Instala Python desde: https://www.python.org/downloads/
        echo 2. O instala VS Code y usa Live Server
        echo 3. O activa GitHub Pages para ver online
        echo.
        pause
        exit /b 1
    )
)
