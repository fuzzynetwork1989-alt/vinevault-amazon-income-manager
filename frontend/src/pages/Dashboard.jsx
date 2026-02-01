import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/App.css';

function Dashboard() {
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
        axios.get('/api/analytics/summary'),
        axios.get('/api/analytics/inventory-stats')
      ]);
      setSummary(summaryRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const total = summary.reduce((sum, s) => sum + (s.total || 0), 0);

  if (loading) {
    return <div className="page-content"><p>Loading dashboard...</p></div>;
  }

  return (
    <div className="page-content">
      <h2>Weekly Income Overview</h2>
      
      <div className="cards-grid">
        <div className="card">
          <h3>Total Income</h3>
          <div className="big-number">${total.toFixed(2)}</div>
        </div>

        {summary.map(s => (
          <div className="card" key={s.source}>
            <h3>{s.source}</h3>
            <div className="card-value">${s.total?.toFixed(2) || '0.00'}</div>
          </div>
        ))}

        {stats && (
          <>
            <div className="card">
              <h3>Inventory</h3>
              <div className="card-value">{stats.total_items} items</div>
            </div>
            <div className="card">
              <h3>Sold</h3>
              <div className="card-value">{stats.sold_count} items</div>
            </div>
            <div className="card">
              <h3>Total Profit</h3>
              <div className="card-value">${stats.total_profit?.toFixed(2) || '0.00'}</div>
            </div>
            <div className="card">
              <h3>Avg Margin</h3>
              <div className="card-value">{stats.avg_margin?.toFixed(1) || '0'}%</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
