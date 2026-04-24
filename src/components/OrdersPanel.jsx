import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { ref, update } from 'firebase/database';
import { db } from '../firebase';

export default function OrdersPanel({ orders, addToast }) {
  const handleAcceptOrder = async (orderId) => {
    try {
      await update(ref(db, `orders/${orderId}`), { status: 'completed' });
      addToast('Success', `Order #${orderId.slice(-4)} accepted`, 'success');
    } catch (error) {
      console.error(error);
      addToast('Error', 'Failed to update order status.', 'error');
    }
  };

  const handleRejectOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to reject this order?')) {
      try {
        await update(ref(db, `orders/${orderId}`), { status: 'rejected' });
        addToast('Order Rejected', `Order #${orderId.slice(-4)} has been rejected.`, 'error');
      } catch (error) {
        console.error(error);
        addToast('Error', 'Failed to update order status.', 'error');
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="badge badge-veg"><CheckCircle size={14} style={{ marginRight: '4px' }}/> Completed</span>;
      case 'rejected':
        return <span className="badge badge-non-veg"><XCircle size={14} style={{ marginRight: '4px' }}/> Rejected</span>;
      default:
        return <span className="badge" style={{ backgroundColor: 'var(--warning-color)', color: '#000' }}><Clock size={14} style={{ marginRight: '4px' }}/> Pending</span>;
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '24px' }}>Order Management</h2>
      <div className="grid-cards" style={{ gridTemplateColumns: '1fr' }}>
        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No orders found.
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.1rem' }}>Table {order.table_number}</h3>
                    {getStatusBadge(order.status)}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Order ID: #{order.id.slice(-6).toUpperCase()} • {new Date(order.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-blue)', marginBottom: '4px' }}>
                    ₹{order.total_amount || order.total || order.totalAmount || 0}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {order.payment_method}
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-dark)', padding: '16px', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Items Ordered</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(order.items || []).map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                      <span><span style={{ color: 'var(--primary-blue)', marginRight: '8px' }}>{item.quantity}x</span> {item.name}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  {(!order.items || order.items.length === 0) && (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No items details available.</div>
                  )}
                </div>
              </div>

              {order.status === 'pending' && (
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button 
                    className="btn btn-primary" 
                    style={{ flex: 1 }}
                    onClick={() => handleAcceptOrder(order.id)}
                  >
                    Accept Order
                  </button>
                  <button 
                    className="btn btn-outline" 
                    style={{ flex: 1, color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }}
                    onClick={() => handleRejectOrder(order.id)}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
