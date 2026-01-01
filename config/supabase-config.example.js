/**
 * Ejemplo de configuración de Supabase
 *
 * IMPORTANTE:
 * 1. Copia este archivo como 'supabase-config.js'
 * 2. Completa con tus credenciales de Supabase
 * 3. NUNCA subas supabase-config.js a Git (ya está en .gitignore)
 */

export const SUPABASE_CONFIG = {
    // URL de tu proyecto Supabase
    // Formato: https://[proyecto-id].supabase.co
    // Obtener en: Project Settings > API > Project URL
    url: 'https://hfqcjzadsbpmocgsqpmy.supabase.co',

    // Anon (public) key de tu proyecto
    // Es segura para usar en el frontend
    // Obtener en: Project Settings > API > Project API keys > anon public
    anonKey: 'sb_publishable_A1iDMGieankyeFYkWs6LYA_AhAwcj7K',

    // Configuración opcional
    options: {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        }
    }
};

// Exportar configuración por defecto
export default SUPABASE_CONFIG;

/**
 * PASOS PARA CONFIGURAR SUPABASE:
 *
 * 1. Crear cuenta en https://supabase.com
 * 2. Crear nuevo proyecto
 * 3. Ir a SQL Editor y ejecutar el siguiente script para crear tablas:
 *
 * -- Tabla de productos
 * CREATE TABLE products (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   name VARCHAR(255) NOT NULL,
 *   category VARCHAR(100),
 *   subcategory VARCHAR(100),
 *   active_ingredient VARCHAR(255),
 *   description TEXT,
 *   unit VARCHAR(50),
 *   supplier_id UUID REFERENCES suppliers(id),
 *   image_url TEXT,
 *   created_at TIMESTAMP DEFAULT NOW()
 * );
 *
 * -- Tabla de proveedores
 * CREATE TABLE suppliers (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   name VARCHAR(255) NOT NULL,
 *   contact_email VARCHAR(255),
 *   contact_phone VARCHAR(50),
 *   address TEXT,
 *   city VARCHAR(100),
 *   delivery_available BOOLEAN DEFAULT true,
 *   min_order_amount DECIMAL(10,2),
 *   created_at TIMESTAMP DEFAULT NOW()
 * );
 *
 * -- Tabla de precios
 * CREATE TABLE product_prices (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   product_id UUID REFERENCES products(id),
 *   supplier_id UUID REFERENCES suppliers(id),
 *   price DECIMAL(10,2) NOT NULL,
 *   currency VARCHAR(10) DEFAULT 'CLP',
 *   last_updated TIMESTAMP DEFAULT NOW()
 * );
 *
 * -- Tabla de pedidos
 * CREATE TABLE orders (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   user_name VARCHAR(255),
 *   user_email VARCHAR(255) NOT NULL,
 *   user_phone VARCHAR(50),
 *   items JSONB NOT NULL,
 *   total_price DECIMAL(10,2),
 *   currency VARCHAR(10),
 *   delivery_address TEXT,
 *   delivery_date DATE,
 *   payment_method VARCHAR(50),
 *   status VARCHAR(50) DEFAULT 'pending',
 *   notes TEXT,
 *   created_at TIMESTAMP DEFAULT NOW(),
 *   updated_at TIMESTAMP DEFAULT NOW()
 * );
 *
 * -- Índices
 * CREATE INDEX idx_products_category ON products(category);
 * CREATE INDEX idx_orders_email ON orders(user_email);
 * CREATE INDEX idx_orders_status ON orders(status);
 * CREATE INDEX idx_orders_created ON orders(created_at DESC);
 *
 * -- Row Level Security
 * ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE products ENABLE ROW LEVEL SECURITY;
 *
 * -- Políticas
 * CREATE POLICY "Anyone can create orders"
 *   ON orders FOR INSERT
 *   WITH CHECK (true);
 *
 * CREATE POLICY "Public read products"
 *   ON products FOR SELECT
 *   USING (true);
 *
 * 4. Copiar URL y anon key a este archivo
 * 5. Guardar como supabase-config.js
 */
