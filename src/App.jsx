import React, { useState, useEffect, useRef } from 'react';
import './App.css'; // Just keeping it empty to not break vite's default if we left import
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import OrdersPanel from './components/OrdersPanel';
import MenuManager from './components/MenuManager';
import Toast from './components/Toast';
import Login from './components/Login';
import Settings from './components/Settings';
import { db } from './firebase';
import { ref, onValue } from 'firebase/database';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAdminAuthenticated') === 'true';
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dishes, setDishes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [toasts, setToasts] = useState([]);
  
  const isFirstLoad = useRef(true);
  const prevOrderIds = useRef(new Set());

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
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Listen to orders
    const ordersRef = ref(db, 'orders');
    const unsubscribeOrders = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        let newOrders = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        newOrders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        if (!isFirstLoad.current) {
          newOrders.forEach(order => {
            if (order.status === 'pending' && !prevOrderIds.current.has(order.id)) {
              addToast('New Order!', `Table ${order.table_number} placed an order for ₹${order.total_amount}`, 'success');
              
              const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
              audio.play().catch(e => console.log("Audio autoplay blocked by browser"));

              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('New Order Received!', {
                  body: `Table ${order.table_number} placed an order for ₹${order.total_amount}`,
                  icon: '/vite.svg'
                });
              }
            }
          });
        }
        
        prevOrderIds.current = new Set(newOrders.map(o => o.id));
        setOrders(newOrders);
        isFirstLoad.current = false;
      } else {
        setOrders([]);
        isFirstLoad.current = false;
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
        return <Settings addToast={addToast} />;
      default:
        return <Dashboard orders={orders} />;
    }
  };

  const handleLogin = () => {
    localStorage.setItem('isAdminAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
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
