import React from 'react';
import { DollarSign, ShoppingBag, TrendingUp, Users } from 'lucide-react';

export default function Dashboard({ orders }) {
  const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <div>
      <div className="grid-cards" style={{ marginBottom: '32px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '16px', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: 'var(--primary-blue)' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Total Revenue</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>₹{totalRevenue}</div>
          </div>
        </div>
        
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '16px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: 'var(--success-green)' }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Total Orders</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{totalOrders}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '16px', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', color: '#f59e0b' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Pending Orders</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{pendingOrders}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', color: 'var(--danger-red)' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Active Tables</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{new Set(orders.map(o => o.table_number)).size}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '20px', fontSize: '1.1rem' }}>Recent Orders</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
              <th style={{ padding: '12px 0', fontWeight: '500' }}>Order ID</th>
              <th style={{ padding: '12px 0', fontWeight: '500' }}>Table</th>
              <th style={{ padding: '12px 0', fontWeight: '500' }}>Amount</th>
              <th style={{ padding: '12px 0', fontWeight: '500' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map(order => (
              <tr key={order.id} style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.5)' }}>
                <td style={{ padding: '16px 0', fontWeight: '500' }}>{order.id}</td>
                <td style={{ padding: '16px 0' }}>{order.table_number}</td>
                <td style={{ padding: '16px 0' }}>₹{order.total_amount}</td>
                <td style={{ padding: '16px 0' }}>
                  <span className={`badge badge-${order.status}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
