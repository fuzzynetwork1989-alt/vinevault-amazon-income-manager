-- VINE PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS vine_products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  asin TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  brand TEXT,
  category TEXT,
  etv REAL NOT NULL,
  rating REAL,
  review_deadline TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  quality_rating TEXT,
  tax_liability REAL,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vine_status ON vine_products(status);
CREATE INDEX IF NOT EXISTS idx_vine_deadline ON vine_products(review_deadline);

-- INVENTORY ITEMS TABLE
CREATE TABLE IF NOT EXISTS inventory_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  sku TEXT UNIQUE,
  barcode TEXT UNIQUE,
  brand TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  source TEXT,
  acquired_date TEXT NOT NULL,
  original_price REAL NOT NULL,
  cost_basis REAL NOT NULL,
  discount_percent REAL DEFAULT 30,
  sale_price REAL NOT NULL,
  listing_price REAL NOT NULL,
  min_acceptable_price REAL NOT NULL,
  recommended_platforms TEXT,
  listed_platforms TEXT,
  status TEXT DEFAULT 'draft',
  listed_date TEXT,
  sold_date TEXT,
  sold_price REAL,
  sold_platform TEXT,
  view_count INTEGER DEFAULT 0,
  inquiry_count INTEGER DEFAULT 0,
  net_profit REAL DEFAULT 0,
  profit_margin REAL DEFAULT 0,
  primary_photo TEXT,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inventory_status ON inventory_items(status);
CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory_items(category);

-- MONETIZATION LINKS TABLE
CREATE TABLE IF NOT EXISTS monetization_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  program TEXT NOT NULL,
  platform TEXT NOT NULL,
  name TEXT NOT NULL,
  url TEXT UNIQUE NOT NULL,
  short_url TEXT UNIQUE,
  content_type TEXT,
  target_audience TEXT,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  commission_type TEXT,
  commission_amount REAL,
  earnings REAL DEFAULT 0,
  potential_earnings REAL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_monetization_platform ON monetization_links(platform);

-- INCOME EVENTS TABLE
CREATE TABLE IF NOT EXISTS income_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_date TEXT NOT NULL,
  source TEXT NOT NULL,
  source_id INTEGER,
  description TEXT,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_income_date ON income_events(event_date);
CREATE INDEX IF NOT EXISTS idx_income_source ON income_events(source);

-- EXPENSES TABLE
CREATE TABLE IF NOT EXISTS expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  expense_date TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  tax_deductible BOOLEAN DEFAULT 1,
  inventory_item_id INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
