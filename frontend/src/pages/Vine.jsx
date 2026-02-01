import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/App.css';

function Vine() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    asin: '',
    name: '',
    etv: '',
    rating: '',
    review_deadline: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const response = await axios.get('http://localhost:3002/api/vine');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching Vine products:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3002/api/vine', {
        ...formData,
        etv: parseFloat(formData.etv),
        rating: parseFloat(formData.rating) || null
      });
      setFormData({ asin: '', name: '', etv: '', rating: '', review_deadline: '' });
      setShowAddForm(false);
      fetchProducts();
    } catch (error) {
      console.error('Error adding Vine product:', error);
    }
  }

  async function updateStatus(id, status) {
    try {
      await axios.put(`http://localhost:3002/api/vine/${id}`, { status });
      fetchProducts();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  }

  if (loading) {
    return <div className="page-content"><p>Loading Vine products...</p></div>;
  }

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>🍇 Vine Products</h2>
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
          + Add Product
        </button>
      </div>

      {showAddForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>Add New Vine Product</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
            <input
              type="text"
              placeholder="ASIN"
              value={formData.asin}
              onChange={(e) => setFormData({...formData, asin: e.target.value})}
              required
              style={{ padding: '0.5rem', border: '1px solid var(--gray-200)', borderRadius: '4px' }}
            />
            <input
              type="text"
              placeholder="Product Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              style={{ padding: '0.5rem', border: '1px solid var(--gray-200)', borderRadius: '4px' }}
            />
            <input
              type="number"
              placeholder="Estimated Tax Value (ETV)"
              value={formData.etv}
              onChange={(e) => setFormData({...formData, etv: e.target.value})}
              required
              step="0.01"
              style={{ padding: '0.5rem', border: '1px solid var(--gray-200)', borderRadius: '4px' }}
            />
            <input
              type="number"
              placeholder="Rating (optional)"
              value={formData.rating}
              onChange={(e) => setFormData({...formData, rating: e.target.value})}
              step="0.1"
              min="1"
              max="5"
              style={{ padding: '0.5rem', border: '1px solid var(--gray-200)', borderRadius: '4px' }}
            />
            <input
              type="date"
              placeholder="Review Deadline"
              value={formData.review_deadline}
              onChange={(e) => setFormData({...formData, review_deadline: e.target.value})}
              required
              style={{ padding: '0.5rem', border: '1px solid var(--gray-200)', borderRadius: '4px' }}
            />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" style={{ backgroundColor: 'var(--success)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
                Add Product
              </button>
              <button type="button" onClick={() => setShowAddForm(false)} style={{ backgroundColor: 'var(--gray-400)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="cards-grid">
        {products.map(product => (
          <div key={product.id} className="card">
            <h3>{product.name}</h3>
            <p><strong>ASIN:</strong> {product.asin}</p>
            <p><strong>ETV:</strong> ${product.etv?.toFixed(2)}</p>
            <p><strong>Tax Liability:</strong> ${product.tax_liability?.toFixed(2)}</p>
            <p><strong>Rating:</strong> {product.rating || 'N/A'}</p>
            <p><strong>Deadline:</strong> {new Date(product.review_deadline).toLocaleDateString()}</p>
            <p><strong>Status:</strong> 
              <span style={{ 
                color: product.status === 'completed' ? 'var(--success)' : 'var(--warning)',
                fontWeight: 'bold'
              }}>
                {product.status}
              </span>
            </p>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              {product.status === 'pending' && (
                <button 
                  onClick={() => updateStatus(product.id, 'completed')}
                  style={{ backgroundColor: 'var(--success)', color: 'white', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  Mark Complete
                </button>
              )}
              {product.status === 'completed' && (
                <button 
                  onClick={() => updateStatus(product.id, 'pending')}
                  style={{ backgroundColor: 'var(--warning)', color: 'white', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  Mark Pending
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-600)' }}>
          No Vine products yet. Click "Add Product" to get started!
        </div>
      )}
    </div>
  );
}

export default Vine;
