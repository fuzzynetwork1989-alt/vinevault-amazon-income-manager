import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Vine from './pages/Vine';
import Monetization from './pages/Monetization';
import InventoryPage from './pages/InventoryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AssistantPage from './pages/AssistantPage';
import SettingsPage from './pages/SettingsPage';
import './styles/App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-root">
        <header className="app-header">
          <div className="header-content">
            <h1>🍇 VineVault</h1>
            <p>Amazon Income & Inventory Management</p>
          </div>
        </header>

        <nav className="nav-tabs">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
            Dashboard
          </NavLink>
          <NavLink to="/vine" className={({ isActive }) => isActive ? 'active' : ''}>
            Vine
          </NavLink>
          <NavLink to="/monetization" className={({ isActive }) => isActive ? 'active' : ''}>
            Monetization
          </NavLink>
          <NavLink to="/inventory" className={({ isActive }) => isActive ? 'active' : ''}>
            Inventory
          </NavLink>
          <NavLink to="/analytics" className={({ isActive }) => isActive ? 'active' : ''}>
            Analytics
          </NavLink>
          <NavLink to="/assistant" className={({ isActive }) => isActive ? 'active' : ''}>
            AI Assistant
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>
            Settings
          </NavLink>
        </nav>

        <main className="app-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vine" element={<Vine />} />
            <Route path="/monetization" element={<Monetization />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/assistant" element={<AssistantPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>&copy; 2026 VineVault. Built with React & Node.js.</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
