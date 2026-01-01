/**
 * Módulo de integración con Growstuff API
 * Proporciona información de cultivos de la comunidad Growstuff
 */

window.GrowstuffAPI = {
    baseUrl: 'https://www.growstuff.org',
    cache: new Map(),
    cacheExpiry: 3600000, // 1 hora en milisegundos

    /**
     * Hacer request a la API de Growstuff
     */
    async request(endpoint, params = {}) {
        try {
            const queryString = new URLSearchParams(params).toString();
            const url = `${this.baseUrl}${endpoint}${queryString ? '?' + queryString : ''}`;

            // Verificar cache
            const cacheKey = url;
            if (this.cache.has(cacheKey)) {
                const cached = this.cache.get(cacheKey);
                if (Date.now() - cached.timestamp < this.cacheExpiry) {
                    console.log('Usando datos en cache de Growstuff');
                    return cached.data;
                }
            }

            console.log('Fetching from Growstuff API:', url);
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/vnd.api+json'
                }
            });

            if (!response.ok) {
                throw new Error(`Growstuff API error: ${response.status}`);
            }

            const data = await response.json();

            // Guardar en cache
            this.cache.set(cacheKey, {
                data: data,
                timestamp: Date.now()
            });

            return data;
        } catch (error) {
            console.error('Error en Growstuff API:', error);
            return null;
        }
    },

    /**
     * Buscar cultivos por nombre
     */
    async searchCrops(query) {
        const params = {
            'filter[name]': query,
            'page[size]': 10
        };

        const result = await this.request('/api/v1/crops', params);
        return result?.data || [];
    },

    /**
     * Obtener información detallada de un cultivo
     */
    async getCropById(cropId) {
        const result = await this.request(`/api/v1/crops/${cropId}`, {
            'include': 'scientific_names'
        });
        return result?.data || null;
    },

    /**
     * Obtener todos los cultivos disponibles
     */
    async getAllCrops(page = 1, size = 50) {
        const params = {
            'page[number]': page,
            'page[size]': size,
            'sort': 'name'
        };

        const result = await this.request('/api/v1/crops', params);
        return result?.data || [];
    },

    /**
     * Buscar información de plantaciones (para obtener consejos de la comunidad)
     */
    async getPlantings(cropId, limit = 20) {
        const params = {
            'filter[crop_id]': cropId,
            'page[size]': limit,
            'sort': '-planted'
        };

        const result = await this.request('/api/v1/plantings', params);
        return result?.data || [];
    },

    /**
     * Obtener estadísticas de cultivo de la comunidad
     */
    async getCropStatistics(cropId) {
        try {
            const plantings = await this.getPlantings(cropId, 100);

            if (!plantings || plantings.length === 0) {
                return null;
            }

            // Analizar datos de plantaciones para obtener insights
            const stats = {
                totalPlantings: plantings.length,
                successRate: 0,
                averageDays: 0,
                commonIssues: [],
                tips: []
            };

            // Calcular estadísticas básicas
            let totalDays = 0;
            let successCount = 0;

            plantings.forEach(planting => {
                const planted = planting.attributes?.planted_at;
                const finished = planting.attributes?.finished_at;

                if (planted && finished) {
                    const days = Math.floor((new Date(finished) - new Date(planted)) / (1000 * 60 * 60 * 24));
                    if (days > 0) {
                        totalDays += days;
                        successCount++;
                    }
                }
            });

            if (successCount > 0) {
                stats.successRate = Math.round((successCount / plantings.length) * 100);
                stats.averageDays = Math.round(totalDays / successCount);
            }

            return stats;
        } catch (error) {
            console.error('Error obteniendo estadísticas:', error);
            return null;
        }
    },

    /**
     * Buscar cultivo por nombre en español
     * Intenta mapear nombres comunes en español a nombres en inglés
     */
    async searchCropBySpanishName(spanishName) {
        // Mapeo de nombres comunes español -> inglés
        const nameMapping = {
            'tomate': 'tomato',
            'papa': 'potato',
            'patata': 'potato',
            'maíz': 'corn',
            'choclo': 'corn',
            'lechuga': 'lettuce',
            'zanahoria': 'carrot',
            'cebolla': 'onion',
            'ajo': 'garlic',
            'pimiento': 'pepper',
            'ají': 'pepper',
            'pepino': 'cucumber',
            'calabaza': 'pumpkin',
            'zapallo': 'pumpkin',
            'sandía': 'watermelon',
            'melón': 'melon',
            'fresa': 'strawberry',
            'frutilla': 'strawberry',
            'brócoli': 'broccoli',
            'coliflor': 'cauliflower',
            'espinaca': 'spinach',
            'acelga': 'chard',
            'rábano': 'radish',
            'berenjena': 'eggplant',
            'albahaca': 'basil',
            'perejil': 'parsley',
            'cilantro': 'coriander'
        };

        const englishName = nameMapping[spanishName.toLowerCase()] || spanishName;
        return await this.searchCrops(englishName);
    },

    /**
     * Obtener recomendaciones enriquecidas para un cultivo
     */
    async getEnhancedCropInfo(cropName) {
        try {
            // Buscar el cultivo
            const crops = await this.searchCropBySpanishName(cropName);

            if (!crops || crops.length === 0) {
                return null;
            }

            const crop = crops[0];
            const cropId = crop.id;

            // Obtener información detallada
            const [detailedCrop, stats] = await Promise.all([
                this.getCropById(cropId),
                this.getCropStatistics(cropId)
            ]);

            return {
                id: cropId,
                name: crop.attributes?.name || cropName,
                perennial: crop.attributes?.perennial || false,
                wikipediaUrl: crop.attributes?.wikipedia_url,
                communityStats: stats,
                attributes: detailedCrop?.attributes || {}
            };
        } catch (error) {
            console.error('Error obteniendo información enriquecida:', error);
            return null;
        }
    },

    /**
     * Generar recomendaciones basadas en datos de la comunidad
     */
    generateRecommendations(cropInfo, localCropData) {
        const recommendations = [];

        if (!cropInfo || !cropInfo.communityStats) {
            return recommendations;
        }

        const stats = cropInfo.communityStats;

        // Recomendación de tiempo de cultivo
        if (stats.averageDays > 0) {
            recommendations.push({
                type: 'timing',
                title: 'Tiempo de cultivo promedio',
                description: `Según ${stats.totalPlantings} cultivadores en Growstuff, este cultivo toma aproximadamente ${stats.averageDays} días desde la siembra hasta la cosecha.`,
                icon: 'calendar-check'
            });
        }

        // Recomendación de tasa de éxito
        if (stats.successRate > 0) {
            const difficulty = stats.successRate >= 70 ? 'fácil' : stats.successRate >= 50 ? 'moderado' : 'desafiante';
            recommendations.push({
                type: 'success',
                title: 'Tasa de éxito de la comunidad',
                description: `${stats.successRate}% de éxito reportado. Este cultivo es considerado ${difficulty} por la comunidad.`,
                icon: 'graph-up'
            });
        }

        // Información de Wikipedia si está disponible
        if (cropInfo.wikipediaUrl) {
            recommendations.push({
                type: 'info',
                title: 'Más información',
                description: 'Consulta Wikipedia para información detallada sobre este cultivo.',
                link: cropInfo.wikipediaUrl,
                icon: 'info-circle'
            });
        }

        // Si es perenne, agregar nota
        if (cropInfo.perennial) {
            recommendations.push({
                type: 'perennial',
                title: 'Cultivo perenne',
                description: 'Este es un cultivo perenne que puede producir durante varios años.',
                icon: 'arrow-repeat'
            });
        }

        return recommendations;
    }
};

console.log('Growstuff API module loaded');
