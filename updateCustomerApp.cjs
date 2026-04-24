const fs = require('fs');
const path = require('path');

const customerFirebaseDest = path.join(__dirname, '../hotel 2/src/firebase.js');
const adminFirebaseSrc = path.join(__dirname, 'src/firebase.js');

// 1. Copy firebase.js
fs.copyFileSync(adminFirebaseSrc, customerFirebaseDest);
console.log('✅ Copied firebase.js to customer app');

// 2. Overwrite customer App.jsx
const customerAppDest = path.join(__dirname, '../hotel 2/src/App.jsx');
const newAppContent = `import React, { useState, useEffect } from 'react';
import { initialMenu } from './data';
import CustomerView from './components/CustomerView';
import { Utensils } from 'lucide-react';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

function App() {
  const [activeTab, setActiveTab] = useState('customer'); // 'customer' or 'admin'
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [menu, setMenu] = useState(initialMenu);

  useEffect(() => {
    // Listen to live dishes from Firestore
    const unsubscribeMenu = onSnapshot(collection(db, 'dishes'), (snapshot) => {
      const dishesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (dishesData.length > 0) {
        setMenu(dishesData);
      }
    });

    // Listen to live orders (so customer sees status updates)
    const qOrders = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
    const unsubscribeOrders = onSnapshot(qOrders, (snapshot) => {
      const dbOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(dbOrders);
    });

    return () => {
      unsubscribeMenu();
      unsubscribeOrders();
    };
  }, []);

  const handlePlaceOrder = async (paymentDetails) => {
    if (cart.length === 0 || !tableNumber) return;

    try {
      await addDoc(collection(db, 'orders'), {
        table_number: tableNumber,
        items: cart.map(item => ({ name: item.name, price: item.price, quantity: item.quantity })),
        total_amount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'pending',
        payment_method: paymentDetails.method || "Online",
        timestamp: new Date().toISOString()
      });
      setCart([]);
      setTableNumber('');
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Failed to place order.");
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    // Readonly on customer side now, handled by admin
  };

  return (
    <div className="app-container">
      <header>
        <h1>
          <Utensils size={32} />
          FlavorFusion
        </h1>
      </header>

      <main>
        <CustomerView 
          menu={menu}
          cart={cart}
          setCart={setCart}
          tableNumber={tableNumber}
          setTableNumber={setTableNumber}
          onPlaceOrder={handlePlaceOrder}
          orders={orders}
        />
      </main>
    </div>
  );
}

export default App;
`;

fs.writeFileSync(customerAppDest, newAppContent);
console.log('✅ Updated Customer App.jsx to use Firestore');
