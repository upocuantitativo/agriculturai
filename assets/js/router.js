/**
 * Sistema de enrutamiento SPA (Single Page Application)
 * Maneja la navegación entre páginas sin recargar
 */

class Router {
    constructor() {
        // Detectar base path (para GitHub Pages)
        const base = document.querySelector('base');
        this.basePath = base ? base.getAttribute('href') : '/';

        this.routes = {
            '': 'pages/home.html',
            'diagnosis': 'pages/diagnosis.html',
            'crops': 'pages/crops.html',
            'chat': 'pages/chat.html',
            'marketplace': 'pages/marketplace.html',
            'orders': 'pages/orders.html'
        };

        this.contentDiv = document.getElementById('app-content');
        this.currentPath = null;

        this.init();
    }

    init() {
        // Interceptar navegación del navegador (back/forward)
        window.addEventListener('popstate', () => this.loadRoute());

        // Interceptar clicks en enlaces con data-link
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-link]') || e.target.closest('[data-link]')) {
                e.preventDefault();
                const link = e.target.matches('[data-link]') ? e.target : e.target.closest('[data-link]');
                const href = link.getAttribute('href');
                this.navigate(href);
            }
        });

        // Cargar ruta inicial
        this.loadRoute();
    }

    navigate(url) {
        // Construir URL completa con basePath
        let fullUrl = url;
        if (this.basePath !== '/' && !url.startsWith(this.basePath)) {
            // Si la URL es relativa (ej: /diagnosis), agregar basePath
            if (url.startsWith('/')) {
                fullUrl = this.basePath + url.substring(1);
            } else {
                fullUrl = this.basePath + url;
            }
        }

        if (this.currentPath === url) return;

        window.history.pushState(null, null, fullUrl);
        this.loadRoute();
    }

    async loadRoute() {
        let path = window.location.pathname;

        // Remover base path si existe
        if (this.basePath !== '/' && path.startsWith(this.basePath)) {
            path = path.substring(this.basePath.length);
        }

        // Remover slash inicial y final
        path = path.replace(/^\/+|\/+$/g, '');

        this.currentPath = path;

        // Encontrar la ruta correspondiente
        const route = this.routes[path] || this.routes[''];

        // Mostrar loading
        window.utils.showLoading();

        try {
            const response = await fetch(route);

            if (!response.ok) {
                throw new Error(`Error cargando página: ${response.status}`);
            }

            const html = await response.text();
            this.contentDiv.innerHTML = html;

            // Actualizar estado activo en navbar
            this.updateActiveNavLink(path);

            // Ejecutar scripts específicos de la página
            this.executePageScripts(path);

            // Scroll al inicio
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error) {
            console.error('Error cargando ruta:', error);
            this.contentDiv.innerHTML = `
                <div class="container my-5">
                    <div class="alert alert-danger" role="alert">
                        <h4 class="alert-heading">Error 404</h4>
                        <p>Lo sentimos, la página que buscas no existe.</p>
                        <hr>
                        <p class="mb-0">
                            <a href="/" data-link class="alert-link">Volver al inicio</a>
                        </p>
                    </div>
                </div>
            `;
        } finally {
            window.utils.hideLoading();
        }
    }

    updateActiveNavLink(path) {
        // Remover clase active de todos los links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Normalizar el path del link para comparación
        const linkPath = path === '' ? '/' : `/${path}`;

        // Agregar clase active al link actual
        const activeLink = document.querySelector(`.nav-link[href="${linkPath}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    executePageScripts(path) {
        // Mapeo de rutas a funciones de inicialización
        const scriptMap = {
            '': 'initHome',
            'diagnosis': 'initDiagnosis',
            'crops': 'initCrops',
            'chat': 'initChat',
            'marketplace': 'initMarketplace',
            'orders': 'initOrders'
        };

        const initFunction = scriptMap[path];

        // Ejecutar función de inicialización si existe
        if (initFunction && typeof window[initFunction] === 'function') {
            try {
                window[initFunction]();
            } catch (error) {
                console.error(`Error ejecutando ${initFunction}:`, error);
            }
        }
    }

    navigateTo(url) {
        this.navigate(url);
    }
}

// Inicializar router cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.router = new Router();
    });
} else {
    window.router = new Router();
}
