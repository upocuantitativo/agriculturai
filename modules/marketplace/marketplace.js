/**
 * Módulo de Marketplace - Catálogo de Productos
 * Muestra productos y recomendaciones basadas en diagnóstico
 */

window.initMarketplace = function() {
    console.log('=== INICIO initMarketplace ===');

    setTimeout(() => {
        const productsContainer = document.getElementById('products-container');
        const searchInput = document.getElementById('search-products');
        const categoryFilter = document.getElementById('category-filter');
        const recommendedSection = document.getElementById('recommended-section');
        const recommendedContainer = document.getElementById('recommended-products');

        let allProducts = [];
        let filteredProducts = [];

        // Cargar productos desde el JSON
        async function loadProducts() {
            try {
                console.log('Cargando productos...');
                const response = await fetch('data/products-catalog.json');
                const data = await response.json();
                allProducts = data.products;
                filteredProducts = [...allProducts];

                console.log(`${allProducts.length} productos cargados`);

                // Verificar si hay diagnóstico reciente con recomendaciones
                checkDiagnosisRecommendations();

                // Mostrar todos los productos
                displayProducts(filteredProducts);
            } catch (error) {
                console.error('Error cargando productos:', error);
                productsContainer.innerHTML = `
                    <div class="col-12">
                        <div class="alert alert-danger">
                            Error al cargar productos. Intenta recargar la página.
                        </div>
                    </div>
                `;
            }
        }

        // Verificar si hay recomendaciones de diagnóstico
        function checkDiagnosisRecommendations() {
            if (!window.utils || !window.utils.storage) return;

            const diagnosis = window.utils.storage.get('lastDiagnosis');
            console.log('Diagnóstico encontrado:', diagnosis);

            if (diagnosis && diagnosis.recommendedProducts && diagnosis.recommendedProducts.length > 0) {
                // Mostrar sección de recomendaciones
                const recommendedProds = allProducts.filter(p =>
                    diagnosis.recommendedProducts.includes(p.id)
                );

                if (recommendedProds.length > 0) {
                    showRecommendations(recommendedProds, diagnosis);
                }
            }
        }

        // Mostrar productos recomendados
        function showRecommendations(products, diagnosis) {
            console.log('Mostrando recomendaciones para:', diagnosis.disease);

            recommendedSection.style.display = 'block';

            const diseaseInfo = document.getElementById('disease-info');
            if (diseaseInfo) {
                const confidence = Math.round(diagnosis.confidence * 100);
                diseaseInfo.innerHTML = `
                    <div class="alert alert-info">
                        <h5><i class="bi bi-lightbulb-fill me-2"></i>Productos recomendados para:</h5>
                        <p class="mb-0"><strong>${diagnosis.disease}</strong> (Confianza: ${confidence}%)</p>
                    </div>
                `;
            }

            recommendedContainer.innerHTML = '';
            products.forEach(product => {
                recommendedContainer.appendChild(createProductCard(product, true));
            });
        }

        // Mostrar productos
        function displayProducts(products) {
            console.log(`Mostrando ${products.length} productos`);
            productsContainer.innerHTML = '';

            if (products.length === 0) {
                productsContainer.innerHTML = `
                    <div class="col-12">
                        <div class="alert alert-warning">
                            No se encontraron productos que coincidan con la búsqueda.
                        </div>
                    </div>
                `;
                return;
            }

            products.forEach(product => {
                productsContainer.appendChild(createProductCard(product));
            });
        }

        // Crear tarjeta de producto
        function createProductCard(product, isRecommended = false) {
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4';

            const card = document.createElement('div');
            card.className = `card h-100 product-card ${isRecommended ? 'recommended-product' : ''}`;

            // Determinar precio (simulado basado en categoría)
            const price = getPriceEstimate(product);

            card.innerHTML = `
                ${isRecommended ? '<div class="recommended-badge"><i class="bi bi-star-fill"></i> Recomendado</div>' : ''}
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="badge bg-${getCategoryColor(product.category)}">${formatCategory(product.category)}</span>
                        ${product.certification ? '<span class="badge bg-success"><i class="bi bi-check-circle"></i> Ecológico</span>' : ''}
                    </div>

                    <h5 class="card-title">${product.name}</h5>
                    <p class="text-muted small mb-2"><strong>${product.brand}</strong></p>
                    <p class="card-text small">${product.description}</p>

                    <div class="mb-2">
                        <strong class="text-primary">Ingrediente activo:</strong>
                        <p class="small mb-0">${product.activeIngredient}</p>
                    </div>

                    <div class="mb-2">
                        <strong>Presentación:</strong> ${product.unit}
                    </div>

                    <div class="mb-3">
                        <strong>Dosificación:</strong>
                        <p class="small mb-0">${product.dosage || 'Ver ficha técnica'}</p>
                    </div>

                    ${product.safetyInterval ? `
                        <div class="alert alert-warning py-1 px-2 small mb-2">
                            <i class="bi bi-exclamation-triangle"></i> Intervalo de seguridad: ${product.safetyInterval}
                        </div>
                    ` : ''}

                    <div class="d-flex justify-content-between align-items-center mt-auto">
                        <div>
                            <span class="h5 text-success mb-0">$${price.toLocaleString('es-CL')}</span>
                            <small class="text-muted d-block">Precio estimado</small>
                        </div>
                        <button class="btn btn-primary btn-sm" onclick="window.viewProductDetail('${product.id}')">
                            <i class="bi bi-eye"></i> Ver detalles
                        </button>
                    </div>
                </div>
            `;

            col.appendChild(card);
            return col;
        }

        // Obtener precio estimado (simulado)
        function getPriceEstimate(product) {
            const basePrice = {
                'fertilizantes': 15000,
                'fungicidas': 12000,
                'insecticidas': 10000
            };

            const base = basePrice[product.category] || 10000;
            const variation = Math.floor(Math.random() * 5000);
            return base + variation;
        }

        // Color de categoría
        function getCategoryColor(category) {
            const colors = {
                'fertilizantes': 'success',
                'fungicidas': 'warning',
                'insecticidas': 'danger'
            };
            return colors[category] || 'secondary';
        }

        // Formatear nombre de categoría
        function formatCategory(category) {
            const names = {
                'fertilizantes': 'Fertilizantes',
                'fungicidas': 'Fungicidas',
                'insecticidas': 'Insecticidas'
            };
            return names[category] || category.charAt(0).toUpperCase() + category.slice(1);
        }

        // Buscar productos
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                const searchTerm = searchInput.value.toLowerCase();
                filterProducts(searchTerm, categoryFilter ? categoryFilter.value : 'all');
            });
        }

        // Filtrar por categoría
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
                filterProducts(searchTerm, categoryFilter.value);
            });
        }

        // Función de filtrado
        function filterProducts(searchTerm, category) {
            filteredProducts = allProducts.filter(product => {
                const matchesSearch = !searchTerm ||
                    product.name.toLowerCase().includes(searchTerm) ||
                    product.description.toLowerCase().includes(searchTerm) ||
                    product.activeIngredient.toLowerCase().includes(searchTerm);

                const matchesCategory = category === 'all' || product.category === category;

                return matchesSearch && matchesCategory;
            });

            displayProducts(filteredProducts);
        }

        // Función global para ver detalles (se puede expandir)
        window.viewProductDetail = function(productId) {
            const product = allProducts.find(p => p.id === productId);
            if (product) {
                alert(`Ficha técnica de: ${product.name}\n\n${product.description}\n\nDosificación: ${product.dosage}\n\nEsta funcionalidad se puede expandir en el futuro con un modal detallado.`);
            }
        };

        // Inicializar
        loadProducts();

        console.log('=== initMarketplace completado ===');
    }, 100);
};
