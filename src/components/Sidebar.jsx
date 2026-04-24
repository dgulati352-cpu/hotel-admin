import React from 'react';
import { LayoutDashboard, ShoppingBag, UtensilsCrossed, Settings, LogOut } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onLogout }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag size={20} /> },
    { id: 'menu', label: 'Menu Manager', icon: <UtensilsCrossed size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>FlavorAdmin</h2>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <a
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
      <div className="sidebar-footer" style={{ padding: '16px 0', borderTop: '1px solid var(--border-color)' }}>
        <a className="nav-item" onClick={onLogout} style={{ cursor: 'pointer' }}>
          <LogOut size={20} />
          <span>Logout</span>
        </a>
      </div>
    </aside>
  );
}
