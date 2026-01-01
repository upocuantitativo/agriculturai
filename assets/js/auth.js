/**
 * Authentication Module
 * Maneja autenticación, sesión y control de acceso
 */

class AuthManager {
    constructor() {
        this.CREDENTIALS = {
            username: 'manuel',
            password: '1977Bienvenida'
        };
        this.SESSION_KEY = 'agriculturai_session';
    }

    /**
     * Verifica si el usuario está autenticado
     */
    isAuthenticated() {
        const session = this.getSession();
        if (!session) return false;

        // Verificar si la sesión ha expirado (24 horas)
        const now = Date.now();
        const sessionAge = now - session.loginTime;
        const maxAge = 24 * 60 * 60 * 1000; // 24 horas

        if (sessionAge > maxAge) {
            this.logout();
            return false;
        }

        return true;
    }

    /**
     * Intenta autenticar al usuario
     */
    login(username, password) {
        // Validar credenciales
        if (username === this.CREDENTIALS.username && password === this.CREDENTIALS.password) {
            // Crear sesión
            const session = {
                username: username,
                loginTime: Date.now()
            };

            // Guardar sesión
            sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));

            return true;
        }

        return false;
    }

    /**
     * Cierra la sesión del usuario
     */
    logout() {
        sessionStorage.removeItem(this.SESSION_KEY);

        // Redirigir a login
        if (window.router) {
            window.router.navigateTo('/login');
        }
    }

    /**
     * Obtiene la sesión actual
     */
    getSession() {
        const sessionData = sessionStorage.getItem(this.SESSION_KEY);
        if (!sessionData) return null;

        try {
            return JSON.parse(sessionData);
        } catch (e) {
            return null;
        }
    }

    /**
     * Obtiene el nombre del usuario autenticado
     */
    getUsername() {
        const session = this.getSession();
        return session ? session.username : null;
    }

    /**
     * Verifica si una ruta requiere autenticación
     */
    requiresAuth(path) {
        // La única ruta pública es /login
        return path !== '/login';
    }
}

// Exportar instancia global
window.auth = new AuthManager();
