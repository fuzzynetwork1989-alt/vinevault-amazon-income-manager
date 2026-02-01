import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/App.css';

function Monetization() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    program: '',
    platform: '',
    name: '',
    url: '',
    content_type: ''
  });

  useEffect(() => {
    fetchLinks();
  }, []);

  async function fetchLinks() {
    try {
      const response = await axios.get('http://localhost:3002/api/monetization/links');
      setLinks(response.data);
    } catch (error) {
      console.error('Error fetching monetization links:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3002/api/monetization/links', formData);
      setFormData({ program: '', platform: '', name: '', url: '', content_type: '' });
      setShowAddForm(false);
      fetchLinks();
    } catch (error) {
      console.error('Error adding monetization link:', error);
    }
  }

  if (loading) {
    return <div className="page-content"><p>Loading monetization links...</p></div>;
  }

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>💰 Monetization Links</h2>
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
          + Add Link
        </button>
      </div>

      {showAddForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>Add New Monetization Link</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
            <select
              value={formData.program}
              onChange={(e) => setFormData({...formData, program: e.target.value})}
              required
              style={{ padding: '0.5rem', border: '1px solid var(--gray-200)', borderRadius: '4px' }}
            >
              <option value="">Select Program</option>
              <option value="Amazon Associates">Amazon Associates</option>
              <option value="Influity">Influity</option>
              <option value="ClickBank">ClickBank</option>
              <option value="ShareASale">ShareASale</option>
            </select>
            <select
              value={formData.platform}
              onChange={(e) => setFormData({...formData, platform: e.target.value})}
              required
              style={{ padding: '0.5rem', border: '1px solid var(--gray-200)', borderRadius: '4px' }}
            >
              <option value="">Select Platform</option>
              <option value="TikTok">TikTok</option>
              <option value="YouTube">YouTube</option>
              <option value="Instagram">Instagram</option>
              <option value="Twitter">Twitter</option>
              <option value="Blog">Blog</option>
            </select>
            <input
              type="text"
              placeholder="Link Name/Description"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              style={{ padding: '0.5rem', border: '1px solid var(--gray-200)', borderRadius: '4px' }}
            />
            <input
              type="url"
              placeholder="Affiliate URL"
              value={formData.url}
              onChange={(e) => setFormData({...formData, url: e.target.value})}
              required
              style={{ padding: '0.5rem', border: '1px solid var(--gray-200)', borderRadius: '4px' }}
            />
            <select
              value={formData.content_type}
              onChange={(e) => setFormData({...formData, content_type: e.target.value})}
              required
              style={{ padding: '0.5rem', border: '1px solid var(--gray-200)', borderRadius: '4px' }}
            >
              <option value="">Select Content Type</option>
              <option value="Video">Video</option>
              <option value="Post">Post</option>
              <option value="Story">Story</option>
              <option value="Review">Review</option>
              <option value="Tutorial">Tutorial</option>
            </select>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" style={{ backgroundColor: 'var(--success)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
                Add Link
              </button>
              <button type="button" onClick={() => setShowAddForm(false)} style={{ backgroundColor: 'var(--gray-400)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="cards-grid">
        {links.map(link => (
          <div key={link.id} className="card">
            <h3>{link.name}</h3>
            <p><strong>Program:</strong> {link.program}</p>
            <p><strong>Platform:</strong> {link.platform}</p>
            <p><strong>Type:</strong> {link.content_type}</p>
            <p><strong>Clicks:</strong> {link.clicks || 0}</p>
            <p><strong>Conversions:</strong> {link.conversions || 0}</p>
            <p><strong>Earnings:</strong> ${link.earnings?.toFixed(2) || '0.00'}</p>
            <a 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                display: 'inline-block', 
                marginTop: '0.5rem', 
                color: 'var(--primary)', 
                textDecoration: 'none',
                fontSize: '0.9rem'
              }}
            >
              Visit Link →
            </a>
          </div>
        ))}
      </div>

      {links.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-600)' }}>
          No monetization links yet. Click "Add Link" to get started!
        </div>
      )}
    </div>
  );
}

export default Monetization;
