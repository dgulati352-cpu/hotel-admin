import React from 'react';
import { Bell, User } from 'lucide-react';

export default function Topbar({ title, pendingOrdersCount }) {
  return (
    <header className="topbar">
      <div className="topbar-title">
        {title}
      </div>
      <div className="topbar-actions">
        <div className="notification-bell">
          <Bell size={24} />
          {pendingOrdersCount > 0 && (
            <span className="notification-badge">{pendingOrdersCount}</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={20} color="white" />
          </div>
          <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>Admin</span>
        </div>
      </div>
    </header>
  );
}
