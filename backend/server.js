require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { query } = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ==================== VINE ENDPOINTS ====================

app.get('/api/vine', async (req, res) => {
  try {
    const result = await query('SELECT * FROM vine_products ORDER BY review_deadline ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/vine', async (req, res) => {
  const { asin, name, etv, rating, review_deadline } = req.body;
  
  if (!asin || !name || !etv) {
    return res.status(400).json({ error: 'ASIN, name, and ETV required' });
  }

  try {
    const tax_liability = etv * 0.25;
    const result = await query(
      `INSERT INTO vine_products (asin, name, etv, rating, review_deadline, tax_liability, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending') RETURNING id, tax_liability`,
      [asin, name, etv, rating, review_deadline, tax_liability]
    );
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Product already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/vine/:id', async (req, res) => {
  const { status, rating } = req.body;
  
  try {
    const result = await query(
      'UPDATE vine_products SET status = $1, rating = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [status, rating, req.params.id]
    );
    res.json({ changed: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== INVENTORY ENDPOINTS ====================

app.get('/api/inventory', async (req, res) => {
  try {
    const result = await query('SELECT * FROM inventory_items ORDER BY created_at DESC LIMIT 100');
    const parsed = result.rows.map(r => ({
      ...r,
      recommended_platforms: r.recommended_platforms || [],
      listed_platforms: r.listed_platforms || []
    }));
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/inventory', async (req, res) => {
  const item = req.body;
  
  try {
    const result = await query(
      `INSERT INTO inventory_items
       (name, category, subcategory, source, barcode, brand, original_price, cost_basis,
        discount_percent, recommended_platforms, listed_platforms, status, acquired_date, primary_photo, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
      [
        item.name,
        item.category || '',
        item.subcategory || '',
        item.source || 'manual',
        item.barcode || '',
        item.brand || '',
        item.original_price,
        item.cost_basis,
        item.discount_percent || 30,
        item.recommended_platforms || [],
        item.listed_platforms || [],
        item.status || 'draft',
        item.acquired_date || new Date().toISOString(),
        item.primary_photo || '',
        item.notes || ''
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/inventory/:id', async (req, res) => {
  const item = req.body;
  
  try {
    const result = await query(
      `UPDATE inventory_items SET
         status = $1,
         listed_platforms = $2,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [
        item.status,
        item.listed_platforms || [],
        req.params.id
      ]
    );
    res.json({ changed: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== MONETIZATION ENDPOINTS ====================

app.get('/api/monetization/links', async (req, res) => {
  try {
    const result = await query('SELECT * FROM monetization_links ORDER BY earnings DESC LIMIT 100');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/monetization/links', async (req, res) => {
  const { program, platform, name, url, content_type } = req.body;
  
  try {
    const result = await query(
      `INSERT INTO monetization_links (program, platform, name, url, content_type)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [program, platform, name, url, content_type]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/monetization/links/:id', async (req, res) => {
  const { clicks, conversions, earnings } = req.body;
  
  try {
    const result = await query(
      `UPDATE monetization_links SET clicks = $1, conversions = $2, earnings = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4`,
      [clicks, conversions, earnings, req.params.id]
    );
    res.json({ changed: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== ANALYTICS ENDPOINTS ====================

app.get('/api/analytics/summary', async (req, res) => {
  try {
    const result = await query('SELECT source, SUM(amount) as total FROM income_events GROUP BY source');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/analytics/inventory-stats', async (req, res) => {
  try {
    const result = await query(
      `SELECT 
         COUNT(*) as total_items,
         SUM(CASE WHEN status = 'sold' THEN 1 ELSE 0 END) as sold_count,
         SUM(net_profit) as total_profit,
         AVG(profit_margin) as avg_margin
       FROM inventory_items`
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== AI ENDPOINTS ====================

app.post('/api/ai/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt required' });
    }

    const ollamaUrl = process.env.OLLAMA_API_URL || 'http://localhost:11434';
    
    const response = await axios.post(`${ollamaUrl}/api/generate`, {
      model: 'mistral',
      prompt,
      stream: false
    });

    res.json({ text: response.data.response });
  } catch (err) {
    console.error('AI error:', err.message);
    res.status(500).json({ 
      error: 'AI service unavailable. Is Ollama running?',
      details: err.message 
    });
  }
});

// ==================== INCOME ENDPOINTS ====================

app.post('/api/income-events', async (req, res) => {
  const { source, amount, description, event_date } = req.body;
  
  try {
    const result = await query(
      `INSERT INTO income_events (event_date, source, description, amount)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [event_date || new Date().toISOString(), source, description, amount]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/income-events', async (req, res) => {
  try {
    const result = await query('SELECT * FROM income_events ORDER BY event_date DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== EBAY ENDPOINTS ====================

app.get('/api/ebay/pricing/:productName', async (req, res) => {
  try {
    const productName = decodeURIComponent(req.params.productName);
    
    // Mock eBay pricing for now
    // In production, use eBay Finding API
    const mockPricing = {
      avgPrice: (Math.random() * 400 + 50).toFixed(2),
      minPrice: (Math.random() * 200 + 20).toFixed(2),
      maxPrice: (Math.random() * 600 + 200).toFixed(2),
      sampleSize: Math.floor(Math.random() * 50 + 10)
    };
    
    res.json(mockPricing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==================== ERROR HANDLING ====================

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// ==================== START SERVER ====================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 VineVault API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
