-- VineVault PostgreSQL Database Initialization
-- This script runs when the PostgreSQL container starts

-- Create database extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- VINE PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS vine_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asin VARCHAR(20) UNIQUE NOT NULL,
    name TEXT NOT NULL,
    brand VARCHAR(255),
    category VARCHAR(100),
    subcategory VARCHAR(100),
    etv DECIMAL(10,2) NOT NULL,
    rating DECIMAL(3,1),
    review_deadline DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    quality_rating INTEGER,
    tax_liability DECIMAL(10,2) GENERATED ALWAYS AS (etv * 0.25) STORED,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INVENTORY ITEMS TABLE
CREATE TABLE IF NOT EXISTS inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    sku VARCHAR(100),
    barcode VARCHAR(50),
    brand VARCHAR(255),
    category VARCHAR(100),
    subcategory VARCHAR(100),
    source VARCHAR(50) DEFAULT 'manual',
    acquired_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    original_price DECIMAL(10,2) NOT NULL,
    cost_basis DECIMAL(10,2) NOT NULL,
    discount_percent INTEGER DEFAULT 30,
    sale_price DECIMAL(10,2) GENERATED ALWAYS AS (original_price * (1 - discount_percent/100)) STORED,
    listing_price DECIMAL(10,2) GENERATED ALWAYS AS (original_price * (1 - discount_percent/100) * 1.1) STORED,
    min_acceptable_price DECIMAL(10,2) GENERATED ALWAYS AS (cost_basis * 1.2) STORED,
    recommended_platforms JSONB DEFAULT '[]',
    listed_platforms JSONB DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'draft',
    net_profit DECIMAL(10,2) GENERATED ALWAYS AS (CASE WHEN status = 'sold' THEN (original_price * (1 - discount_percent/100) - cost_basis) ELSE 0 END) STORED,
    profit_margin DECIMAL(5,2) GENERATED ALWAYS AS (CASE WHEN status = 'sold' AND cost_basis > 0 THEN ((original_price * (1 - discount_percent/100) - cost_basis) / cost_basis * 100) ELSE 0 END) STORED,
    primary_photo TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MONETIZATION LINKS TABLE
CREATE TABLE IF NOT EXISTS monetization_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program VARCHAR(50) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    name TEXT NOT NULL,
    url TEXT UNIQUE NOT NULL,
    short_url TEXT UNIQUE,
    content_type VARCHAR(50),
    target_audience TEXT,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    commission_type VARCHAR(50),
    commission_amount DECIMAL(10,2),
    earnings DECIMAL(10,2) DEFAULT 0,
    potential_earnings DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INCOME EVENTS TABLE
CREATE TABLE IF NOT EXISTS income_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_date DATE NOT NULL,
    source VARCHAR(50) NOT NULL,
    source_id UUID,
    description TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- EXPENSES TABLE
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_date DATE NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50),
    receipt_url TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vine_products_asin ON vine_products(asin);
CREATE INDEX IF NOT EXISTS idx_vine_products_deadline ON vine_products(review_deadline);
CREATE INDEX IF NOT EXISTS idx_vine_products_status ON vine_products(status);

CREATE INDEX IF NOT EXISTS idx_inventory_items_status ON inventory_items(status);
CREATE INDEX IF NOT EXISTS idx_inventory_items_category ON inventory_items(category);
CREATE INDEX IF NOT EXISTS idx_inventory_items_barcode ON inventory_items(barcode);
CREATE INDEX IF NOT EXISTS idx_inventory_items_brand ON inventory_items(brand);

CREATE INDEX IF NOT EXISTS idx_monetization_platform ON monetization_links(platform);
CREATE INDEX IF NOT EXISTS idx_monetization_program ON monetization_links(program);

CREATE INDEX IF NOT EXISTS idx_income_date ON income_events(event_date);
CREATE INDEX IF NOT EXISTS idx_income_source ON income_events(source);

CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vine_products_updated_at BEFORE UPDATE ON vine_products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_items_updated_at BEFORE UPDATE ON inventory_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_monetization_links_updated_at BEFORE UPDATE ON monetization_links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO vine_products (asin, name, etv, rating, review_deadline) VALUES
('B08N5WRWNW', 'Test Product', 25.99, 4.5, '2026-02-15')
ON CONFLICT (asin) DO NOTHING;

INSERT INTO inventory_items (name, category, brand, original_price, cost_basis) VALUES
('Test Item', 'Electronics', 'TestBrand', 49.99, 25.00)
ON CONFLICT DO NOTHING;

INSERT INTO monetization_links (program, platform, name, url, content_type) VALUES
('Amazon Associates', 'TikTok', 'Test Link', 'https://amazon.com/test', 'Video')
ON CONFLICT (url) DO NOTHING;

INSERT INTO income_events (event_date, source, description, amount) VALUES
('2026-01-15', 'vine', 'Test vine review completed', 25.99),
('2026-01-14', 'affiliate', 'Amazon affiliate commission', 15.50)
ON CONFLICT DO NOTHING;

-- Grant permissions to the vinevault user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO vinevault;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO vinevault;
