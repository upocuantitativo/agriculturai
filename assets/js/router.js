/**
 * Sistema de enrutamiento SPA (Single Page Application)
 * Maneja la navegación entre páginas sin recargar
 */

class Router {
    constructor() {
        this.routes = {
            '/': 'pages/home.html',
            '/diagnosis': 'pages/diagnosis.html',
            '/crops': 'pages/crops.html',
            '/chat': 'pages/chat.html',
            '/marketplace': 'pages/marketplace.html',
            '/orders': 'pages/orders.html',
            '/login': 'pages/login.html'
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
        if (this.currentPath === url) return;

        window.history.pushState(null, null, url);
        this.loadRoute();
    }

    async loadRoute() {
        const path = window.location.pathname;
        this.currentPath = path;

        // Verificar autenticación
        if (window.auth && window.auth.requiresAuth(path) && !window.auth.isAuthenticated()) {
            // Redirigir a login
            window.history.pushState(null, null, '/login');
            this.currentPath = '/login';
            const route = this.routes['/login'];

            window.utils.showLoading();

            try {
                const response = await fetch(route);
                if (!response.ok) throw new Error(`Error cargando login: ${response.status}`);

                const html = await response.text();
                this.contentDiv.innerHTML = html;
                this.hideNavbar();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (error) {
                console.error('Error cargando login:', error);
            } finally {
                window.utils.hideLoading();
            }
            return;
        }

        // Encontrar la ruta correspondiente
        const route = this.routes[path] || this.routes['/'];

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

            // Mostrar/ocultar navbar según autenticación
            if (path === '/login') {
                this.hideNavbar();
            } else {
                this.showNavbar();
                this.updateUserInfo();
            }

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

        // Agregar clase active al link actual
        const activeLink = document.querySelector(`.nav-link[href="${path}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    executePageScripts(path) {
        // Mapeo de rutas a funciones de inicialización
        const scriptMap = {
            '/': 'initHome',
            '/diagnosis': 'initDiagnosis',
            '/crops': 'initCrops',
            '/chat': 'initChat',
            '/marketplace': 'initMarketplace',
            '/orders': 'initOrders'
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

    hideNavbar() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.style.display = 'none';
        }
    }

    showNavbar() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.style.display = 'block';
        }
    }

    updateUserInfo() {
        if (!window.auth || !window.auth.isAuthenticated()) return;

        const username = window.auth.getUsername();

        // Buscar o crear el botón de usuario en la navbar
        const navbar = document.querySelector('.navbar-nav');
        if (!navbar) return;

        // Verificar si ya existe el botón de logout
        let userButton = document.getElementById('userDropdown');

        if (!userButton) {
            // Crear dropdown de usuario
            const userDropdownHTML = `
                <li class="nav-item dropdown ms-auto">
                    <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-person-circle"></i> ${username}
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                        <li><a class="dropdown-item" href="#" id="logoutBtn"><i class="bi bi-box-arrow-right"></i> Cerrar Sesión</a></li>
                    </ul>
                </li>
            `;
            navbar.insertAdjacentHTML('beforeend', userDropdownHTML);

            // Agregar evento de logout
            document.getElementById('logoutBtn').addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
                    window.auth.logout();
                }
            });
        }
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
