import React, { useState } from 'react';
import '../styles/App.css';

function SettingsPage() {
  const [settings, setSettings] = useState({
    currency: 'USD',
    taxRate: 25,
    defaultPlatform: 'eBay',
    notifications: true,
    darkMode: false,
    autoBackup: true,
    language: 'en'
  });

  function handleChange(field, value) {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  }

  function handleSave() {
    localStorage.setItem('vinevault-settings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  }

  function handleReset() {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      setSettings({
        currency: 'USD',
        taxRate: 25,
        defaultPlatform: 'eBay',
        notifications: true,
        darkMode: false,
        autoBackup: true,
        language: 'en'
      });
    }
  }

  return (
    <div className="page-content">
      <h2>⚙️ Settings</h2>
      
      <div className="cards-grid">
        <div className="card">
          <h3>Financial Settings</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Currency:
              </label>
              <select
                value={settings.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.5rem', 
                  border: '1px solid var(--gray-200)', 
                  borderRadius: '4px' 
                }}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD ($)</option>
                <option value="AUD">AUD ($)</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Vine Tax Rate (%):
              </label>
              <input
                type="number"
                value={settings.taxRate}
                onChange={(e) => handleChange('taxRate', parseInt(e.target.value))}
                min="0"
                max="100"
                style={{ 
                  width: '100%', 
                  padding: '0.5rem', 
                  border: '1px solid var(--gray-200)', 
                  borderRadius: '4px' 
                }}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Platform Preferences</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Default Selling Platform:
              </label>
              <select
                value={settings.defaultPlatform}
                onChange={(e) => handleChange('defaultPlatform', e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.5rem', 
                  border: '1px solid var(--gray-200)', 
                  borderRadius: '4px' 
                }}
              >
                <option value="eBay">eBay</option>
                <option value="facebook">Facebook Marketplace</option>
                <option value="mercari">Mercari</option>
                <option value="poshmark">Poshmark</option>
                <option value="offerup">OfferUp</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Notifications</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => handleChange('notifications', e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              Enable notifications
            </label>
            
            <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>
              Get notified about review deadlines, price drops, and sales opportunities.
            </p>
          </div>
        </div>

        <div className="card">
          <h3>Appearance</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={(e) => handleChange('darkMode', e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              Dark mode (coming soon)
            </label>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Language:
              </label>
              <select
                value={settings.language}
                onChange={(e) => handleChange('language', e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.5rem', 
                  border: '1px solid var(--gray-200)', 
                  borderRadius: '4px' 
                }}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Data & Privacy</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.autoBackup}
                onChange={(e) => handleChange('autoBackup', e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              Auto-backup data
            </label>
            
            <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>
              Your data is stored locally in your browser. Enable auto-backup to prevent data loss.
            </p>
          </div>
        </div>

        <div className="card">
          <h3>About</h3>
          <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
            <p><strong>VineVault</strong> v1.0.0</p>
            <p>Secure Your Amazon Income Streams</p>
            <p style={{ marginTop: '1rem' }}>
              Built with ❤️ using React, Node.js, and modern web technologies.
            </p>
            <p style={{ marginTop: '1rem' }}>
              <strong>Features:</strong>
            </p>
            <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li>Vine product tracking</li>
              <li>Inventory management</li>
              <li>Monetization link tracking</li>
              <li>Analytics dashboard</li>
              <li>AI-powered assistance</li>
            </ul>
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginTop: '2rem', 
        justifyContent: 'center' 
      }}>
        <button
          onClick={handleSave}
          style={{
            backgroundColor: 'var(--success)',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          💾 Save Settings
        </button>
        <button
          onClick={handleReset}
          style={{
            backgroundColor: 'var(--danger)',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          🔄 Reset to Defaults
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;
