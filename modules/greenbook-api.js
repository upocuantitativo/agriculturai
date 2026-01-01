/**
 * Módulo de integración con Greenbook API
 * Proporciona información de productos agrícolas (pesticidas, herbicidas, fungicidas)
 *
 * NOTA: Greenbook API requiere credenciales de acceso.
 * Para obtener acceso, visita: https://www.greenbook.net/
 *
 * Fuentes:
 * - https://www.greenbook.net/
 * - https://apitemple.com/api/greenbook
 * - https://www.programmableweb.com/api/greenbook-rest-api-v10
 */

window.GreenbookAPI = {
    // CONFIGURACIÓN - Reemplazar con credenciales reales
    apiKey: '', // Obtener de Greenbook
    baseUrl: 'https://api.greenbook.net/v1', // URL base (ejemplo)

    hasCredentials: false,

    /**
     * Verificar si hay credenciales configuradas
     */
    checkCredentials() {
        this.hasCredentials = !!this.apiKey;
        return this.hasCredentials;
    },

    /**
     * Buscar productos en Greenbook
     * @param {string} query - Término de búsqueda (nombre de producto, ingrediente activo, etc.)
     * @param {object} filters - Filtros opcionales (categoría, fabricante, etc.)
     */
    async searchProducts(query, filters = {}) {
        if (!this.checkCredentials()) {
            console.warn('Greenbook API: No hay credenciales configuradas. Usando datos de demostración.');
            return this.mockSearchProducts(query, filters);
        }

        try {
            const params = new URLSearchParams({
                q: query,
                ...filters
            });

            const response = await fetch(`${this.baseUrl}/products/search?${params}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Greenbook API error: ${response.status}`);
            }

            const data = await response.json();
            return this.normalizeProducts(data);

        } catch (error) {
            console.error('Error en Greenbook API:', error);
            return [];
        }
    },

    /**
     * Obtener detalles de un producto específico
     */
    async getProductDetails(productId) {
        if (!this.checkCredentials()) {
            return this.mockGetProductDetails(productId);
        }

        try {
            const response = await fetch(`${this.baseUrl}/products/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Greenbook API error: ${response.status}`);
            }

            const data = await response.json();
            return this.normalizeProduct(data);

        } catch (error) {
            console.error('Error obteniendo detalles del producto:', error);
            return null;
        }
    },

    /**
     * Normalizar datos de productos al formato de la aplicación
     */
    normalizeProducts(greenbookData) {
        // Adaptar estructura de Greenbook al formato de nuestra app
        if (!greenbookData || !greenbookData.products) {
            return [];
        }

        return greenbookData.products.map(p => this.normalizeProduct(p));
    },

    /**
     * Normalizar un producto individual
     */
    normalizeProduct(product) {
        return {
            id: `gb-${product.id}`,
            name: product.name || product.productName,
            brand: product.manufacturer || product.brand,
            category: this.mapCategory(product.category || product.type),
            activeIngredient: product.activeIngredient || product.ingredients?.join(', '),
            description: product.description || `${product.name} - ${product.manufacturer}`,
            unit: product.packSize || product.size,
            dosage: product.applicationRate || product.dosage,
            safetyInterval: product.reentryInterval || product.phi,
            compatibleCrops: product.crops || [],
            targetDiseases: product.targets || product.pests || [],
            certification: product.organicCertified || false,
            epaNumber: product.epaRegistrationNumber,
            sdsUrl: product.sdsLink,
            labelUrl: product.labelLink,
            source: 'greenbook'
        };
    },

    /**
     * Mapear categorías de Greenbook a las de nuestra app
     */
    mapCategory(greenbookCategory) {
        const mapping = {
            'fungicide': 'fungicidas',
            'insecticide': 'insecticidas',
            'herbicide': 'herbicidas',
            'fertilizer': 'fertilizantes',
            'pesticide': 'insecticidas'
        };

        const category = greenbookCategory?.toLowerCase();
        return mapping[category] || 'otros';
    },

    // ========== FUNCIONES DE DEMOSTRACIÓN (Mock) ==========

    /**
     * Búsqueda simulada (para cuando no hay credenciales)
     */
    mockSearchProducts(query, filters = {}) {
        console.log('Greenbook MOCK: Buscando productos para:', query);

        const mockProducts = [
            {
                id: 'gb-001',
                name: 'Champion WP',
                manufacturer: 'Nufarm',
                category: 'fungicide',
                activeIngredient: 'Copper Hydroxide 77%',
                description: 'Fungicida preventivo para control de enfermedades fúngicas y bacterianas',
                packSize: '2.5 kg',
                applicationRate: '1-2 kg/ha',
                reentryInterval: '24 horas',
                crops: ['tomate', 'papa', 'vid', 'cítricos'],
                targets: ['Tizón tardío', 'Mildiu', 'Sarna'],
                organicCertified: false,
                epaRegistrationNumber: '55146-1'
            },
            {
                id: 'gb-002',
                name: 'Movento OD',
                manufacturer: 'Bayer',
                category: 'insecticide',
                activeIngredient: 'Spirotetramat 15%',
                description: 'Insecticida sistémico para control de insectos chupadores',
                packSize: '1 L',
                applicationRate: '0.5-1 L/ha',
                reentryInterval: '12 horas',
                crops: ['tomate', 'pimiento', 'cítricos', 'frutas'],
                targets: ['Mosca blanca', 'Pulgones', 'Cochinillas'],
                organicCertified: false,
                epaRegistrationNumber: '264-1050'
            },
            {
                id: 'gb-003',
                name: 'BotaniGard 22 WP',
                manufacturer: 'BioWorks',
                category: 'insecticide',
                activeIngredient: 'Beauveria bassiana 22%',
                description: 'Insecticida biológico para control de insectos plaga',
                packSize: '500 g',
                applicationRate: '250-500 g/ha',
                reentryInterval: '4 horas',
                crops: ['tomate', 'lechuga', 'fresas', 'ornamentales'],
                targets: ['Mosca blanca', 'Trips', 'Áfidos'],
                organicCertified: true,
                epaRegistrationNumber: '82701-1'
            },
            {
                id: 'gb-004',
                name: 'Ridomil Gold MZ',
                manufacturer: 'Syngenta',
                category: 'fungicide',
                activeIngredient: 'Metalaxil-M 4% + Mancozeb 64%',
                description: 'Fungicida sistémico y de contacto para control de oomicetos',
                packSize: '5 kg',
                applicationRate: '2-3 kg/ha',
                reentryInterval: '48 horas',
                crops: ['papa', 'tomate', 'vid', 'cucurbitáceas'],
                targets: ['Tizón tardío', 'Mildiu velloso'],
                organicCertified: false,
                epaRegistrationNumber: '100-796'
            },
            {
                id: 'gb-005',
                name: 'Actigard 50 WG',
                manufacturer: 'Syngenta',
                category: 'fungicide',
                activeIngredient: 'Acibenzolar-S-methyl 50%',
                description: 'Inductor de resistencia sistémica adquirida en plantas',
                packSize: '200 g',
                applicationRate: '50-75 g/ha',
                reentryInterval: '12 horas',
                crops: ['tomate', 'pimiento', 'tabaco', 'cucurbitáceas'],
                targets: ['Virus', 'Bacterias', 'Hongos'],
                organicCertified: false,
                epaRegistrationNumber: '100-1098'
            }
        ];

        // Filtrar por query
        let results = mockProducts;
        if (query) {
            const q = query.toLowerCase();
            results = results.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.activeIngredient.toLowerCase().includes(q) ||
                p.targets.some(t => t.toLowerCase().includes(q))
            );
        }

        // Filtrar por categoría si se especifica
        if (filters.category) {
            results = results.filter(p => p.category === filters.category);
        }

        return results.map(p => this.normalizeProduct(p));
    },

    /**
     * Obtener detalles simulados de un producto
     */
    mockGetProductDetails(productId) {
        const products = this.mockSearchProducts('');
        return products.find(p => p.id === productId) || null;
    },

    /**
     * Mostrar diálogo de búsqueda de productos Greenbook
     */
    showProductSearchDialog(callback) {
        const modalHtml = `
            <div class="modal fade" id="greenbookSearchModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="bi bi-search me-2"></i>
                                Buscar Productos en Greenbook
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            ${!this.checkCredentials() ? `
                                <div class="alert alert-warning">
                                    <i class="bi bi-exclamation-triangle me-2"></i>
                                    <strong>Modo demostración:</strong> Las credenciales de Greenbook API no están configuradas.
                                    Mostrando productos de ejemplo. Para acceso real, obtén credenciales en
                                    <a href="https://www.greenbook.net/" target="_blank">greenbook.net</a>
                                </div>
                            ` : ''}

                            <div class="mb-3">
                                <label class="form-label">Buscar producto</label>
                                <div class="input-group">
                                    <input type="text" class="form-control" id="greenbook-search-input"
                                           placeholder="Ingrediente activo, nombre comercial, enfermedad...">
                                    <button class="btn btn-primary" id="greenbook-search-btn">
                                        <i class="bi bi-search"></i> Buscar
                                    </button>
                                </div>
                            </div>

                            <div id="greenbook-results" class="mt-3">
                                <p class="text-muted text-center">Ingresa un término de búsqueda</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insertar modal si no existe
        if (!document.getElementById('greenbookSearchModal')) {
            document.body.insertAdjacentHTML('beforeend', modalHtml);
        }

        const modal = new bootstrap.Modal(document.getElementById('greenbookSearchModal'));
        modal.show();

        // Manejar búsqueda
        document.getElementById('greenbook-search-btn').addEventListener('click', async () => {
            const query = document.getElementById('greenbook-search-input').value;
            if (!query) return;

            const resultsDiv = document.getElementById('greenbook-results');
            resultsDiv.innerHTML = '<div class="text-center"><div class="spinner-border"></div><p>Buscando...</p></div>';

            const products = await this.searchProducts(query);

            if (products.length === 0) {
                resultsDiv.innerHTML = '<p class="text-muted text-center">No se encontraron productos</p>';
                return;
            }

            resultsDiv.innerHTML = products.map(p => `
                <div class="card mb-2">
                    <div class="card-body">
                        <h6 class="card-title">${p.name}</h6>
                        <p class="small mb-1"><strong>${p.brand}</strong> - ${p.activeIngredient}</p>
                        <p class="small mb-2">${p.description}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="badge bg-${p.category === 'fungicidas' ? 'warning' : p.category === 'insecticidas' ? 'danger' : 'success'}">
                                ${p.category}
                            </span>
                            <button class="btn btn-sm btn-primary add-greenbook-product" data-product='${JSON.stringify(p)}'>
                                <i class="bi bi-plus-circle"></i> Agregar
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');

            // Event listeners para agregar productos
            document.querySelectorAll('.add-greenbook-product').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const productData = JSON.parse(e.currentTarget.dataset.product);
                    modal.hide();
                    if (callback) {
                        callback(productData);
                    }
                });
            });
        });

        // Enter para buscar
        document.getElementById('greenbook-search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('greenbook-search-btn').click();
            }
        });
    }
};

console.log('Greenbook API module loaded');
