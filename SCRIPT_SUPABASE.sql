-- =====================================================
-- SCRIPT DE CREACIÓN DE TABLAS - AGRICULTURAI
-- =====================================================
-- Ejecuta este script completo en el SQL Editor de Supabase
-- (Copia todo y pega en SQL Editor > New Query > Run)
-- =====================================================

-- Tabla de proveedores
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  location VARCHAR(255),
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  website VARCHAR(255),
  delivery_available BOOLEAN DEFAULT true,
  delivery_zones TEXT[],
  min_order_amount DECIMAL(10,2),
  payment_methods TEXT[],
  business_hours VARCHAR(255),
  specialization TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  subcategory VARCHAR(100),
  brand VARCHAR(100),
  active_ingredient VARCHAR(500),
  description TEXT,
  composition JSONB,
  unit VARCHAR(50),
  presentation VARCHAR(100),
  application TEXT,
  dosage TEXT,
  safety_interval VARCHAR(100),
  storage TEXT,
  toxicity VARCHAR(100),
  precautions TEXT,
  certification VARCHAR(100),
  manufacturer VARCHAR(255),
  registration_number VARCHAR(100),
  supplier_id UUID REFERENCES suppliers(id),
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de precios
CREATE TABLE IF NOT EXISTS product_prices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'CLP',
  last_updated TIMESTAMP DEFAULT NOW()
);

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE,
  user_name VARCHAR(255),
  user_email VARCHAR(255) NOT NULL,
  user_phone VARCHAR(50),
  items JSONB NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'CLP',
  delivery_address TEXT,
  delivery_city VARCHAR(100),
  delivery_region VARCHAR(100),
  delivery_date DATE,
  payment_method VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA MEJOR RENDIMIENTO
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_name ON products USING gin(to_tsvector('spanish', name));
CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(name);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(user_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_prices_product ON product_prices(product_id);

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para generar número de pedido automáticamente
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number = 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 4, '0');
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_order_number BEFORE INSERT ON orders
    FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Políticas: Lectura pública para productos y proveedores
CREATE POLICY "Public read suppliers"
  ON suppliers FOR SELECT
  USING (true);

CREATE POLICY "Public read products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Public read product_prices"
  ON product_prices FOR SELECT
  USING (true);

-- Políticas: Cualquiera puede crear pedidos
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Políticas: Todos pueden ver pedidos (cambiar después si quieres restricción)
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (true);

-- =====================================================
-- DATOS DE PRUEBA (OPCIONAL)
-- =====================================================

-- Insertar proveedores de ejemplo
INSERT INTO suppliers (name, type, location, phone, email, delivery_available, min_order_amount)
VALUES
  ('Agroferretería El Campo', 'Distribuidor', 'Santiago, RM', '+56223456789', 'ventas@agrielcampo.cl', true, 50000),
  ('Semillas y Fertilizantes del Sur', 'Mayorista', 'Temuco, Araucanía', '+56452234567', 'info@semillassur.cl', true, 30000),
  ('Agroquímicos La Cosecha', 'Proveedor', 'Rancagua, O''Higgins', '+56722345678', 'contacto@lacosecha.cl', true, 40000)
ON CONFLICT DO NOTHING;

-- Insertar productos de ejemplo
INSERT INTO products (name, category, brand, active_ingredient, description, unit, presentation, dosage, supplier_id)
VALUES
  (
    'Fertilizante NPK 15-15-15',
    'fertilizantes',
    'Anasac',
    'Nitrógeno 15%, Fósforo 15%, Potasio 15%',
    'Fertilizante balanceado para todas las etapas del cultivo',
    'saco',
    '25 kg',
    '200-300 kg/ha',
    (SELECT id FROM suppliers WHERE name = 'Agroferretería El Campo' LIMIT 1)
  ),
  (
    'Fungicida Cúprico Kocide 2000',
    'fungicidas',
    'Dupont',
    'Hidróxido de cobre 35%',
    'Fungicida preventivo y curativo de amplio espectro',
    'bolsa',
    '1 kg',
    '150-250 g/100L agua',
    (SELECT id FROM suppliers WHERE name = 'Agroferretería El Campo' LIMIT 1)
  ),
  (
    'Insecticida Karate Zeon',
    'insecticidas',
    'Syngenta',
    'Lambda-cihalotrina 5%',
    'Insecticida de contacto e ingestión',
    'litro',
    '1 L',
    '75-100 ml/ha',
    (SELECT id FROM suppliers WHERE name = 'Agroquímicos La Cosecha' LIMIT 1)
  )
ON CONFLICT DO NOTHING;

-- Insertar precios
INSERT INTO product_prices (product_id, supplier_id, price, currency)
SELECT
  p.id,
  s.id,
  CASE p.name
    WHEN 'Fertilizante NPK 15-15-15' THEN 28990
    WHEN 'Fungicida Cúprico Kocide 2000' THEN 15990
    WHEN 'Insecticida Karate Zeon' THEN 42990
  END,
  'CLP'
FROM products p
CROSS JOIN suppliers s
WHERE p.supplier_id = s.id
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMENTARIOS EN TABLAS (Documentación)
-- =====================================================

COMMENT ON TABLE suppliers IS 'Proveedores de productos agrícolas';
COMMENT ON TABLE products IS 'Catálogo de productos agrícolas';
COMMENT ON TABLE product_prices IS 'Precios de productos por proveedor';
COMMENT ON TABLE orders IS 'Pedidos de clientes';

-- =====================================================
-- FINALIZADO
-- =====================================================

SELECT 'Tablas creadas exitosamente!' as mensaje;
SELECT COUNT(*) as total_suppliers FROM suppliers;
SELECT COUNT(*) as total_products FROM products;
SELECT COUNT(*) as total_prices FROM product_prices;
