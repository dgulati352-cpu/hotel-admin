import React, { useState, useEffect } from 'react';
import './App.css'; // Just keeping it empty to not break vite's default if we left import
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import OrdersPanel from './components/OrdersPanel';
import MenuManager from './components/MenuManager';
import Toast from './components/Toast';
import { db } from './firebase';
import { ref, onValue } from 'firebase/database';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dishes, setDishes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [toasts, setToasts] = useState([]);

  const addToast = (title, message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    // Listen to orders
    const ordersRef = ref(db, 'orders');
    const unsubscribeOrders = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        let newOrders = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        newOrders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setOrders(newOrders);
      } else {
        setOrders([]);
      }
    });

    // Listen to dishes
    const dishesRef = ref(db, 'dishes');
    const unsubscribeDishes = onValue(dishesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        let newDishes = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setDishes(newDishes);
      } else {
        setDishes([]);
      }
    });

    return () => {
      unsubscribeOrders();
      unsubscribeDishes();
    };
  }, []); 

  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard orders={orders} />;
      case 'orders':
        return <OrdersPanel orders={orders} setOrders={setOrders} addToast={addToast} />;
      case 'menu':
        return <MenuManager dishes={dishes} setDishes={setDishes} addToast={addToast} />;
      case 'settings':
        return (
          <div className="card">
            <h2>Settings</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '16px' }}>Settings page configuration goes here.</p>
          </div>
        );
      default:
        return <Dashboard orders={orders} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        <Topbar 
          title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace(/([A-Z])/g, ' $1').trim()} 
          pendingOrdersCount={pendingOrdersCount} 
        />
        <div className="content-area">
          {renderContent()}
        </div>
      </main>
      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default App;
