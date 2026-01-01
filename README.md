# 🌱 AgriculturaI - Plataforma de IA para Agricultura

Plataforma web gratuita que ofrece servicios de inteligencia artificial aplicados a la agricultura, diseñada para ayudar a agricultores y profesionales del sector agrícola.

## 🎯 Funcionalidades

### 1. Diagnóstico Visual de Enfermedades
- **Fotografía tu planta** desde el móvil
- **Detección automática** de enfermedades mediante IA
- **Recomendaciones de tratamiento** personalizadas
- Información detallada sobre síntomas y prevención

### 2. Gestión de Cultivos
- Registra tus cultivos con información detallada
- Recibe recomendaciones de fertilización y riego
- Calendario de tareas según etapa del cultivo
- Alertas y recordatorios personalizados

### 3. Asistente Virtual (Chatbot)
- Consultas sobre fitopatología, nutrición y riego
- Respuestas en lenguaje natural en español
- Recomendaciones personalizadas según tus cultivos
- Disponible 24/7

### 4. Marketplace de Productos Agrícolas
- Catálogo de fertilizantes, fungicidas, insecticidas
- Comparación de precios entre proveedores
- Información detallada de productos
- Sistema de pedidos integrado

## 🚀 Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Bootstrap 5.3
- **Machine Learning**: TensorFlow.js
- **Base de Datos**: Supabase (PostgreSQL)
- **APIs**: MercadoLibre, OpenWeatherMap
- **Hosting**: GitHub Pages

## 📱 Características

✅ **Responsive**: Optimizado para móviles y tablets
✅ **Sin instalación**: Funciona directamente en el navegador
✅ **Offline parcial**: Algunas funciones disponibles sin conexión
✅ **Gratuito**: 100% libre y de código abierto
✅ **En español**: Interfaz completamente en castellano

## 🌐 Acceso

Accede a la plataforma en: **[https://upocuantitativo.github.io/agriculturai/](https://upocuantitativo.github.io/agriculturai/)**

## 🛠️ Desarrollo Local

```bash
# Clonar el repositorio
git clone https://github.com/upocuantitativo/agriculturai.git

# Navegar al directorio
cd agriculturai

# Abrir con un servidor local (ej: Live Server en VS Code)
# o usar Python:
python -m http.server 8000

# Visitar http://localhost:8000
```

## 📊 Datos y Modelos

### Modelo de Diagnóstico Visual
- Basado en MobileNetV2
- Entrenado con dataset PlantVillage + PlantDoc
- Detecta 38+ enfermedades comunes
- Precisión promedio: ~95%

### Base de Datos de Cultivos
- 15 cultivos principales
- Información agronómica completa
- Variedades, requerimientos climáticos, manejo

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo [LICENSE](LICENSE) para más detalles.

## 📧 Contacto

Para preguntas, sugerencias o reportar problemas:
- Crear un [Issue](https://github.com/upocuantitativo/agriculturai/issues)
- Email: contacto@agriculturai.org (próximamente)

## 🙏 Agradecimientos

- Dataset PlantVillage para imágenes de enfermedades
- Comunidad de TensorFlow.js
- Proveedores de APIs gratuitas (MercadoLibre, OpenWeatherMap)
- Todos los contribuidores del proyecto

---

**Desarrollado con 💚 para la comunidad agrícola**
