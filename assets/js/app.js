/**
 * Inicialización principal de la aplicación AgriculturaI
 */

// Configuración global de la app
window.appConfig = {
    version: '1.0.0',
    appName: 'AgriculturaI',
    apiEndpoints: {
        // Se cargarán desde archivos de configuración cuando se necesiten
    },
    features: {
        diagnosis: true,
        crops: true,
        chatbot: true,
        marketplace: true,
        orders: true
    }
};

// Inicializar carrito de compras
const initCart = () => {
    const cart = window.utils.storage.get('shoppingCart') || [];
    updateCartBadge(cart.length);

    // Escuchar eventos de actualización del carrito
    window.addEventListener('cartUpdated', (e) => {
        const { items } = e.detail;
        updateCartBadge(items.length);
    });
};

const updateCartBadge = (count) => {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        if (count > 0) {
            badge.textContent = count;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    }
};

// Verificar soporte del navegador
const checkBrowserSupport = () => {
    const features = {
        localStorage: typeof(Storage) !== "undefined",
        fetch: typeof(fetch) !== "undefined",
        promises: typeof(Promise) !== "undefined"
    };

    const unsupported = Object.entries(features)
        .filter(([key, value]) => !value)
        .map(([key]) => key);

    if (unsupported.length > 0) {
        console.warn('Funcionalidades no soportadas:', unsupported);
        window.utils.showToast(
            'Tu navegador no soporta todas las funcionalidades. Por favor, actualiza a una versión más reciente.',
            'warning'
        );
    }
};

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    console.log(`%c🌱 ${window.appConfig.appName} v${window.appConfig.version}`,
        'color: #28a745; font-size: 16px; font-weight: bold;');

    // Verificar soporte del navegador
    checkBrowserSupport();

    // Inicializar carrito
    initCart();

    // Cerrar automáticamente el navbar en mobile cuando se hace click en un link
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    toggle: true
                });
            }
        });
    });

    // Service Worker (PWA) - Activar en producción
    // if ('serviceWorker' in navigator) {
    //     navigator.serviceWorker.register('/service-worker.js')
    //         .then(reg => console.log('Service Worker registrado'))
    //         .catch(err => console.error('Error registrando Service Worker:', err));
    // }
});

// Manejo global de errores
window.addEventListener('error', (e) => {
    console.error('Error global:', e.error);
    // En producción, aquí se podría enviar a un servicio de logging
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Promise rechazada:', e.reason);
    // En producción, aquí se podría enviar a un servicio de logging
});
