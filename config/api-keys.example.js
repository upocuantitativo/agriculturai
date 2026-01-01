/**
 * Ejemplo de configuración de API keys
 *
 * IMPORTANTE:
 * 1. Copia este archivo como 'api-keys.js'
 * 2. Completa con tus claves reales
 * 3. NUNCA subas api-keys.js a Git (ya está en .gitignore)
 */

export const API_KEYS = {
    // Hugging Face Inference API (para chatbot avanzado y diagnóstico alternativo)
    // Obtener en: https://huggingface.co/settings/tokens
    // Gratuito: 30,000 requests/mes
    huggingface: 'hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',

    // OpenWeatherMap API (para información climática)
    // Obtener en: https://openweathermap.org/api
    // Gratuito: 60 llamadas/min, 1,000,000 llamadas/mes
    openweathermap: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',

    // MercadoLibre API (para comparación de precios)
    // No requiere key para búsquedas públicas básicas
    // Para uso avanzado: https://developers.mercadolibre.com/
    mercadolibre: null
};

// Exportar configuración por defecto
export default API_KEYS;
