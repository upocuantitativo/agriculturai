@echo off
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

cd /d "%~dp0"

REM Intentar con Python 3
python -m http.server 8000 2>nul
if errorlevel 1 (
    REM Si Python 3 no funciona, intentar con Python 2
    python -m SimpleHTTPServer 8000 2>nul
    if errorlevel 1 (
        echo ERROR: Python no esta instalado
        echo.
        echo Por favor instala Python desde: https://www.python.org/downloads/
        echo.
        pause
        exit /b 1
    )
)
