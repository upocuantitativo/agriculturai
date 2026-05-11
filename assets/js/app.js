/**
 * Inicialización principal de la aplicación AgriculturaI
 */

// Configuración global de la app
window.appConfig = {
    version: '1.1.0',
    appName: 'AgriculturaI',
    apiEndpoints: {},
    features: {
        diagnosis: true,
        crops: true,
        chatbot: true,
        marketplace: true,
        orders: true
    }
};

// ---------- Carrito ----------
const initCart = () => {
    const cart = window.utils.storage.get('shoppingCart') || [];
    updateCartUI(cart);

    window.addEventListener('cartUpdated', (e) => {
        const { items } = e.detail;
        updateCartUI(items);
    });
};

const updateCartUI = (cart) => {
    updateCartBadge(cart.length);
    renderCartPreview(cart);
};

const updateCartBadge = (count) => {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;
    if (count > 0) {
        badge.textContent = count;
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }
};

const renderCartPreview = (cart) => {
    const container = document.getElementById('cart-preview-items');
    if (!container) return;

    if (!cart.length) {
        container.innerHTML = '<p class="text-muted small text-center my-3 mb-0">El carrito está vacío</p>';
        return;
    }

    const fmt = window.utils.formatCurrency;
    const top = cart.slice(0, 4);
    const more = cart.length - top.length;
    const subtotal = cart.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);

    container.innerHTML = `
        ${top.map(item => `
            <div class="cart-preview-item">
                <span class="cart-preview-name" title="${item.name || ''}">${item.name || 'Producto'}</span>
                <span class="cart-preview-qty">×${item.quantity || 1}</span>
            </div>
        `).join('')}
        ${more > 0 ? `<div class="cart-preview-more">+ ${more} más</div>` : ''}
        <div class="cart-preview-subtotal">
            <span>Subtotal</span>
            <strong>${fmt(subtotal)}</strong>
        </div>
    `;
};

// Mostrar/ocultar dropdown del carrito en hover (desktop) y click (móvil)
const initCartDropdown = () => {
    const wrapper = document.getElementById('cart-dropdown-wrapper');
    const link = document.getElementById('cart-link');
    const preview = document.getElementById('cart-preview');
    if (!wrapper || !preview || !link) return;

    let hoverTimer;
    const show = () => {
        clearTimeout(hoverTimer);
        preview.classList.add('show');
    };
    const hide = () => {
        hoverTimer = setTimeout(() => preview.classList.remove('show'), 200);
    };

    // Desktop: hover
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        wrapper.addEventListener('mouseenter', show);
        wrapper.addEventListener('mouseleave', hide);
        preview.addEventListener('mouseenter', show);
        preview.addEventListener('mouseleave', hide);
    }

    // Móvil/teclado: shift+click o long-press abre el preview en vez de navegar
    let pressTimer;
    link.addEventListener('touchstart', () => {
        pressTimer = setTimeout(() => {
            preview.classList.add('show');
        }, 500);
    });
    link.addEventListener('touchend', () => clearTimeout(pressTimer));

    // Cerrar al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) {
            preview.classList.remove('show');
        }
    });
};

// ---------- Tema (claro/oscuro) ----------
const initTheme = () => {
    const toggle = document.getElementById('theme-toggle');
    const icon = document.getElementById('theme-toggle-icon');
    const meta = document.getElementById('theme-color-meta');
    if (!toggle) return;

    const apply = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        try { localStorage.setItem('agriai-theme', theme); } catch (e) {}
        if (icon) {
            icon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
        }
        toggle.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
        if (meta) {
            meta.setAttribute('content', theme === 'dark' ? '#1a1a1a' : '#28a745');
        }
    };

    const current = document.documentElement.getAttribute('data-theme') || 'light';
    apply(current);

    toggle.addEventListener('click', () => {
        const next = (document.documentElement.getAttribute('data-theme') === 'dark') ? 'light' : 'dark';
        apply(next);
    });
};

// ---------- Back to top ----------
const initBackToTop = () => {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    const toggleVisibility = () => {
        if (window.scrollY > 400) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
};

// ---------- Soporte del navegador ----------
const checkBrowserSupport = () => {
    const features = {
        localStorage: typeof(Storage) !== 'undefined',
        fetch: typeof(fetch) !== 'undefined',
        promises: typeof(Promise) !== 'undefined'
    };

    const unsupported = Object.entries(features)
        .filter(([, value]) => !value)
        .map(([key]) => key);

    if (unsupported.length > 0) {
        console.warn('Funcionalidades no soportadas:', unsupported);
        window.utils.showToast(
            'Tu navegador no soporta todas las funcionalidades. Por favor, actualiza a una versión más reciente.',
            'warning'
        );
    }
};

// ---------- Service Worker ----------
const registerServiceWorker = () => {
    if (!('serviceWorker' in navigator)) return;
    // No registrar en file:// (abrir directamente el HTML)
    if (window.location.protocol === 'file:') return;

    window.addEventListener('load', () => {
        const swPath = (document.querySelector('base')?.getAttribute('href') || './') + 'service-worker.js';
        navigator.serviceWorker.register(swPath)
            .then((reg) => console.log('[PWA] Service Worker registrado:', reg.scope))
            .catch((err) => console.warn('[PWA] No se pudo registrar el Service Worker:', err));
    });
};

// ---------- Prompt de instalación PWA ----------
const initPwaInstall = () => {
    let deferredPrompt = null;
    const banner = document.getElementById('pwa-install-banner');
    const installBtn = document.getElementById('pwa-install-btn');
    const dismissBtn = document.getElementById('pwa-install-dismiss');
    if (!banner || !installBtn || !dismissBtn) return;

    // Si ya rechazó hace poco, no mostrar
    const dismissedAt = window.utils.storage.get('pwa-install-dismissed');
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const recentlyDismissed = dismissedAt && (Date.now() - dismissedAt) < oneWeek;

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (!recentlyDismissed) {
            setTimeout(() => { banner.style.display = 'flex'; }, 3000);
        }
    });

    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log('[PWA] Instalación:', outcome);
        deferredPrompt = null;
        banner.style.display = 'none';
    });

    dismissBtn.addEventListener('click', () => {
        banner.style.display = 'none';
        window.utils.storage.set('pwa-install-dismissed', Date.now());
    });

    window.addEventListener('appinstalled', () => {
        banner.style.display = 'none';
        console.log('[PWA] App instalada');
    });
};

// ---------- Atajos de teclado ----------
const initShortcuts = () => {
    document.addEventListener('keydown', (e) => {
        // Ignorar si el usuario está escribiendo
        const tag = (e.target.tagName || '').toLowerCase();
        if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;

        // "/" enfoca el input del chat si está visible
        if (e.key === '/') {
            const chatInput = document.getElementById('chat-input');
            if (chatInput) {
                e.preventDefault();
                chatInput.focus();
            }
        }

        // "g" + tecla para navegación rápida: g d (diagnosis), g c (crops), etc.
        if (e.key === 'g' && !e.metaKey && !e.ctrlKey) {
            const onNext = (ev) => {
                document.removeEventListener('keydown', onNext, true);
                const map = { d: '/diagnosis', c: '/crops', a: '/chat', m: '/marketplace', p: '/orders', h: '/' };
                const target = map[ev.key];
                if (target && window.router) {
                    ev.preventDefault();
                    window.router.navigate(target);
                }
            };
            document.addEventListener('keydown', onNext, true);
        }
    });
};

// ---------- Inicialización principal ----------
document.addEventListener('DOMContentLoaded', () => {
    console.log(`%c🌱 ${window.appConfig.appName} v${window.appConfig.version}`,
        'color: #28a745; font-size: 16px; font-weight: bold;');

    checkBrowserSupport();
    initCart();
    initCartDropdown();
    initTheme();
    initBackToTop();
    initPwaInstall();
    initShortcuts();

    // Cerrar navbar al click en mobile
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                new bootstrap.Collapse(navbarCollapse, { toggle: true });
            }
        });
    });
});

// Service Worker se registra fuera de DOMContentLoaded
registerServiceWorker();

// Manejo global de errores
window.addEventListener('error', (e) => {
    console.error('Error global:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Promise rechazada:', e.reason);
});
