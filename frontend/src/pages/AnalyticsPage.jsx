import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/App.css';

function AnalyticsPage() {
  const [summary, setSummary] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [summaryRes, statsRes] = await Promise.all([
        axios.get('http://localhost:3002/api/analytics/summary'),
        axios.get('http://localhost:3002/api/analytics/inventory-stats')
      ]);
      setSummary(summaryRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  }

  const total = summary.reduce((sum, s) => sum + (s.total || 0), 0);

  if (loading) {
    return <div className="page-content"><p>Loading analytics...</p></div>;
  }

  return (
    <div className="page-content">
      <h2>📊 Analytics Dashboard</h2>
      
      <div style={{ marginBottom: '2rem' }}>
        <h3>Income Summary</h3>
        <div className="cards-grid">
          <div className="card">
            <h3>Total Income</h3>
            <div className="big-number">${total.toFixed(2)}</div>
          </div>

          {summary.map(s => (
            <div className="card" key={s.source}>
              <h3>{s.source.charAt(0).toUpperCase() + s.source.slice(1)}</h3>
              <div className="card-value">${s.total?.toFixed(2) || '0.00'}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)', marginTop: '0.5rem' }}>
                {((s.total / total) * 100).toFixed(1)}% of total
              </div>
            </div>
          ))}
        </div>
      </div>

      {stats && (
        <div style={{ marginBottom: '2rem' }}>
          <h3>Inventory Performance</h3>
          <div className="cards-grid">
            <div className="card">
              <h3>Total Items</h3>
              <div className="card-value">{stats.total_items || 0}</div>
            </div>
            <div className="card">
              <h3>Sold Items</h3>
              <div className="card-value">{stats.sold_count || 0}</div>
              {stats.total_items > 0 && (
                <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)', marginTop: '0.5rem' }}>
                  {((stats.sold_count / stats.total_items) * 100).toFixed(1)}% sold rate
                </div>
              )}
            </div>
            <div className="card">
              <h3>Total Profit</h3>
              <div className="card-value">${stats.total_profit?.toFixed(2) || '0.00'}</div>
            </div>
            <div className="card">
              <h3>Average Margin</h3>
              <div className="card-value">{stats.avg_margin?.toFixed(1) || '0'}%</div>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginBottom: '2rem' }}>
        <h3>Performance Insights</h3>
        <div className="cards-grid">
          <div className="card">
            <h3>📈 Growth Opportunity</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
              {stats && stats.sold_count < stats.total_items * 0.5 
                ? `You have ${stats.total_items - stats.sold_count} unsold items. Consider optimizing pricing or expanding to new platforms.`
                : 'Great sales performance! Focus on sourcing more profitable items.'}
            </p>
          </div>
          <div className="card">
            <h3>💡 Profitability Tip</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
              {stats && stats.avg_margin < 25 
                ? 'Average margin is below 25%. Consider negotiating better supplier prices or premium pricing strategies.'
                : 'Excellent profit margins! Maintain current sourcing and pricing strategies.'}
            </p>
          </div>
          <div className="card">
            <h3>🎯 Diversification</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
              {summary.length < 3 
                ? 'Consider diversifying income streams across Vine, resale, and affiliate marketing.'
                : 'Good income diversification! Continue balancing multiple revenue sources.'}
            </p>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button 
          onClick={fetchData}
          style={{
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          🔄 Refresh Analytics
        </button>
      </div>
    </div>
  );
}

export default AnalyticsPage;
