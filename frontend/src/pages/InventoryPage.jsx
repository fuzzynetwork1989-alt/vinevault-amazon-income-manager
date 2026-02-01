import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/App.css';

function InventoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    original_price: '',
    cost_basis: '',
    barcode: ''
  });

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const response = await axios.get('http://localhost:3002/api/inventory');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const originalPrice = parseFloat(formData.original_price);
      const costBasis = parseFloat(formData.cost_basis);
      const discountPercent = 30; // Default 30% discount
      const salePrice = originalPrice * (1 - discountPercent / 100);
      const listingPrice = salePrice * 1.1; // 10% margin
      const minAcceptablePrice = costBasis * 1.2; // 20% minimum profit

      await axios.post('http://localhost:3002/api/inventory', {
        ...formData,
        original_price: originalPrice,
        cost_basis: costBasis,
        discount_percent: discountPercent,
        sale_price: salePrice,
        listing_price: listingPrice,
        min_acceptable_price: minAcceptablePrice
      });
      setFormData({ name: '', category: '', brand: '', original_price: '', cost_basis: '', barcode: '' });
      setShowAddForm(false);
      fetchItems();
    } catch (error) {
      console.error('Error adding inventory item:', error);
    }
  }

  if (loading) {
    return <div className="page-content"><p>Loading inventory items...</p></div>;
  }

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>📦 Inventory Management</h2>
        <button 
          onClick={() => setShowAddForm(true)}
          style={{
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          + Add Item
        </button>
      </div>

      {showAddForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>Add New Inventory Item</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
            <input
              type="text"
              placeholder="Item Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              style={{ padding: '0.5rem', border: '1px solid var(--gray-200)', borderRadius: '4px' }}
            />
            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              required
              style={{ padding: '0.5rem', border: '1px solid var(--gray-200)', borderRadius: '4px' }}
            />
            <input
              type="text"
              placeholder="Brand (optional)"
              value={formData.brand}
              onChange={(e) => setFormData({...formData, brand: e.target.value})}
              style={{ padding: '0.5rem', border: '1px solid var(--gray-200)', borderRadius: '4px' }}
            />
            <input
              type="text"
              placeholder="Barcode/UPC (optional)"
              value={formData.barcode}
              onChange={(e) => setFormData({...formData, barcode: e.target.value})}
              style={{ padding: '0.5rem', border: '1px solid var(--gray-200)', borderRadius: '4px' }}
            />
            <input
              type="number"
              placeholder="Original Price"
              value={formData.original_price}
              onChange={(e) => setFormData({...formData, original_price: e.target.value})}
              required
              step="0.01"
              style={{ padding: '0.5rem', border: '1px solid var(--gray-200)', borderRadius: '4px' }}
            />
            <input
              type="number"
              placeholder="Cost Basis (what you paid)"
              value={formData.cost_basis}
              onChange={(e) => setFormData({...formData, cost_basis: e.target.value})}
              required
              step="0.01"
              style={{ padding: '0.5rem', border: '1px solid var(--gray-200)', borderRadius: '4px' }}
            />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" style={{ backgroundColor: 'var(--success)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
                Add Item
              </button>
              <button type="button" onClick={() => setShowAddForm(false)} style={{ backgroundColor: 'var(--gray-400)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="cards-grid">
        {items.map(item => (
          <div key={item.id} className="card">
            <h3>{item.name}</h3>
            <p><strong>Category:</strong> {item.category}</p>
            {item.brand && <p><strong>Brand:</strong> {item.brand}</p>}
            {item.barcode && <p><strong>Barcode:</strong> {item.barcode}</p>}
            <p><strong>Original Price:</strong> ${item.original_price?.toFixed(2)}</p>
            <p><strong>Cost Basis:</strong> ${item.cost_basis?.toFixed(2)}</p>
            <p><strong>Sale Price:</strong> ${item.sale_price?.toFixed(2)}</p>
            <p><strong>Listing Price:</strong> ${item.listing_price?.toFixed(2)}</p>
            <p><strong>Min Acceptable:</strong> ${item.min_acceptable_price?.toFixed(2)}</p>
            <p><strong>Status:</strong> 
              <span style={{ 
                color: item.status === 'sold' ? 'var(--success)' : item.status === 'listed' ? 'var(--warning)' : 'var(--gray-600)',
                fontWeight: 'bold'
              }}>
                {item.status}
              </span>
            </p>
            {item.profit_margin && (
              <p><strong>Profit Margin:</strong> {item.profit_margin.toFixed(1)}%</p>
            )}
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-600)' }}>
          No inventory items yet. Click "Add Item" to get started!
        </div>
      )}
    </div>
  );
}

export default InventoryPage;
