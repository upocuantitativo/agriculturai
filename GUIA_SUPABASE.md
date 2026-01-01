# 🗄️ Guía para Configurar Supabase

Esta guía te ayudará a configurar Supabase para el sistema de pedidos de AgriculturaI.

## ¿Qué es Supabase?

Supabase es una alternativa open-source a Firebase que nos proporciona:
- ✅ Base de datos PostgreSQL
- ✅ API REST automática
- ✅ Almacenamiento de archivos
- ✅ Autenticación de usuarios (opcional)
- ✅ **100% GRATIS** para proyectos pequeños

**Plan gratuito incluye:**
- 500 MB de base de datos
- 1 GB de almacenamiento de archivos
- 2 GB de transferencia de datos/mes
- 50,000 usuarios activos mensuales

## Paso 1: Crear Cuenta y Proyecto

### 1.1 Registrarse en Supabase

1. **Ve a:** https://supabase.com
2. **Click en "Start your project"** o "Sign Up"
3. **Usa tu cuenta de GitHub** (más rápido) o email

### 1.2 Crear Organización

Ya tienes una organización creada:
- **Nombre:** `upocuantitativo`
- **Plan:** Free

### 1.3 Crear Proyecto

Ya tienes un proyecto:
- **Nombre:** `upocuantitativo's Project`
- **Contraseña de base de datos:** `dray*J3q-HLt3qU` (¡guárdala bien!)
- **Región:** Selecciona la más cercana (South America - São Paulo recomendado)

**Espera 2-3 minutos** mientras Supabase configura tu base de datos.

## Paso 2: Crear las Tablas

Una vez que el proyecto esté listo:

### 2.1 Abrir SQL Editor

1. En el panel de Supabase, click en **"SQL Editor"** (icono 📝 en menú lateral)
2. Click en **"New query"**

### 2.2 Ejecutar Script de Creación de Tablas

Copia y pega este SQL completo:

```sql
-- =====================================================
-- SCRIPT DE CREACIÓN DE TABLAS - AGRICULTURAI
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

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_name ON products USING gin(to_tsvector('spanish', name));
CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(name);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(user_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_prices_product ON product_prices(product_id);

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
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number = 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 4, '0');
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

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

-- Políticas: Solo el usuario puede ver sus propios pedidos
-- (Requiere autenticación - por ahora permitimos lectura por email)
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (true); -- Cambiar a: user_email = auth.email() si implementas autenticación

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
-- Las tablas están listas para usar!
```

3. **Click en "Run"** (▶️) o presiona **Ctrl + Enter**
4. Deberías ver: **"Success. No rows returned"**

## Paso 3: Insertar Datos Iniciales (Opcional)

Puedes insertar algunos datos de prueba para verificar que funciona:

```sql
-- Insertar proveedor de ejemplo
INSERT INTO suppliers (name, type, location, phone, email, delivery_available, min_order_amount)
VALUES
  ('Agroferretería El Campo', 'Distribuidor', 'Santiago, RM', '+56223456789', 'ventas@agrielcampo.cl', true, 50000);

-- Insertar producto de ejemplo
INSERT INTO products (name, category, brand, description, unit, supplier_id)
VALUES
  ('Fertilizante NPK 15-15-15', 'fertilizantes', 'Anasac', 'Fertilizante balanceado para todas las etapas', 'saco 25 kg',
   (SELECT id FROM suppliers WHERE name = 'Agroferretería El Campo' LIMIT 1));
```

## Paso 4: Obtener Credenciales

### 4.1 Ir a Project Settings

1. Click en **"Settings"** (⚙️ icono en menú lateral)
2. Click en **"API"**

### 4.2 Copiar Credenciales

Encontrarás dos datos importantes:

**Project URL:**
```
https://xxxxxxxxxxxxxxxxx.supabase.co
```

**anon public (API Key):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsIn...
```

## Paso 5: Configurar en la Aplicación

### 5.1 Crear Archivo de Configuración

En tu proyecto local:

1. **Copia el archivo de ejemplo:**
   ```bash
   cp config/supabase-config.example.js config/supabase-config.js
   ```

2. **Edita `config/supabase-config.js`:**
   ```javascript
   export const SUPABASE_CONFIG = {
       url: 'https://TU_PROJECT_URL.supabase.co', // ← Pega tu URL aquí
       anonKey: 'eyJ...' // ← Pega tu anon key aquí
   };

   export default SUPABASE_CONFIG;
   ```

3. **Guarda el archivo**

### 5.2 Integrar Supabase JS Client

El archivo `modules/orders/supabase.js` ya está preparado. Solo necesitas descomentar y actualizar:

```javascript
// modules/orders/supabase.js
import SUPABASE_CONFIG from '../../config/supabase-config.js';

// Nota: Necesitarás incluir la librería de Supabase
// Agregar al index.html ANTES de tus scripts:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

const { createClient } = supabase;

export const supabaseClient = createClient(
    SUPABASE_CONFIG.url,
    SUPABASE_CONFIG.anonKey
);

// Funciones ya implementadas...
```

### 5.3 Agregar Supabase JS al HTML

Edita `index.html` y agrega ANTES de tus scripts:

```html
<!-- Supabase JS Client -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<!-- App Scripts -->
<script src="assets/js/utils.js"></script>
...
```

## Paso 6: Probar la Integración

### 6.1 Prueba Manual en Supabase

1. **Ve a "Table Editor"** en Supabase
2. Selecciona la tabla **"orders"**
3. Click en **"Insert row"**
4. Completa los campos:
   - user_name: "Test Usuario"
   - user_email: "test@example.com"
   - items: `[{"name": "Producto test", "quantity": 1, "price": 10000}]`
   - total_price: 10000
5. **Click "Save"**
6. Deberías ver el registro en la tabla

### 6.2 Prueba desde la Aplicación

1. **Abre tu aplicación** (local o en GitHub Pages)
2. **Ve al Marketplace**
3. **Agrega productos al carrito**
4. **Ve a Pedidos**
5. **Click en "Proceder al Pago"**
6. **Completa el formulario**
7. **Confirma el pedido**
8. **Verifica en Supabase** (Table Editor > orders) que se creó el registro

## Paso 7: Ver y Gestionar Pedidos

### Desde Supabase Dashboard:

1. **Table Editor > orders**
2. Aquí verás todos los pedidos
3. Puedes:
   - Ver detalles de cada pedido
   - Cambiar el status manualmente
   - Exportar a CSV
   - Eliminar pedidos de prueba

### Consultas SQL Útiles:

**Ver pedidos recientes:**
```sql
SELECT order_number, user_name, user_email, total_price, status, created_at
FROM orders
ORDER BY created_at DESC
LIMIT 10;
```

**Ver pedidos pendientes:**
```sql
SELECT * FROM orders WHERE status = 'pending';
```

**Total de ventas:**
```sql
SELECT SUM(total_price) as total_sales FROM orders WHERE status = 'completed';
```

## Funciones Avanzadas (Opcional)

### Email de Confirmación

Para enviar emails automáticos al crear pedidos:

1. **Ve a "Edge Functions"** en Supabase
2. **Crea nueva función** "send-order-email"
3. Usa servicios como SendGrid, Resend, o el SMTP de Supabase
4. Configura un trigger que se ejecute al insertar en `orders`

### Autenticación de Usuarios

Si quieres que los usuarios se registren:

1. **Ve a "Authentication"** en Supabase
2. **Habilita Email/Password** o proveedores sociales
3. **Implementa login/register** en la aplicación
4. **Actualiza políticas RLS** para usar `auth.uid()`

## Solución de Problemas

### ❌ Error: "Failed to fetch" al hacer requests

**Causa:** CORS no configurado

**Solución:**
- Por defecto Supabase permite cualquier origen
- Si tienes problemas, ve a Settings > API > CORS y agrega tu dominio

### ❌ Error: "Row Level Security policy violated"

**Causa:** Las políticas RLS están muy restrictivas

**Solución:**
- Ve a Authentication > Policies
- Verifica que las políticas permitan las operaciones
- Temporalmente puedes deshabilitar RLS para testing (NO en producción)

### ❌ No puedo ver los pedidos desde la app

**Causa:** La consulta no está filtrando correctamente

**Solución:**
```javascript
// En modules/orders/supabase.js
async getUserOrders(email) {
    const { data, error } = await supabaseClient
        .from('orders')
        .select('*')
        .eq('user_email', email)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error:', error);
        return [];
    }
    return data;
}
```

## Límites del Plan Gratuito

**500 MB de base de datos:**
- Suficiente para ~50,000 pedidos
- ~10,000 productos

**2 GB de transferencia/mes:**
- Suficiente para ~10,000 visitas/mes

**Si excedes los límites:**
- Supabase te notificará
- Puedes pasar al plan Pro ($25/mes)
- O optimizar queries y datos

## Backup y Seguridad

### Backup Automático

Supabase hace backup automático diario en el plan gratuito.

### Backup Manual

**Exportar base de datos:**
1. Settings > Database > Connection string
2. Usa `pg_dump` con esa URL
3. O desde Table Editor: Export to CSV

### Seguridad

- ✅ NUNCA expongas el service_role key (solo anon key en frontend)
- ✅ Usa Row Level Security siempre
- ✅ Valida datos en el frontend Y backend
- ✅ Cambia la contraseña de la base de datos periódicamente

## Recursos Adicionales

- **Documentación:** https://supabase.com/docs
- **Tutoriales:** https://supabase.com/docs/guides
- **Comunidad:** https://github.com/supabase/supabase/discussions
- **Videos:** https://www.youtube.com/@Supabase

---

**¡Tu base de datos Supabase está lista!** 🎉

Ahora puedes gestionar pedidos, productos y proveedores de forma profesional y escalable.
