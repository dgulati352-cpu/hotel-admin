const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDPOCPfX1-tB0BfSfku8Oer4tY9foqGE8s",
  authDomain: "hotel-frontend-d7ed9.firebaseapp.com",
  projectId: "hotel-frontend-d7ed9",
  storageBucket: "hotel-frontend-d7ed9.appspot.com",
  messagingSenderId: "367253457199",
  appId: "1:367253457199:web:df21590fc3673ab2c40c83"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  try {
    const docRef = await addDoc(collection(db, "orders"), {
      table_number: "Test Table 1",
      items: [{ name: "Test Dish", price: 10, quantity: 1 }],
      total_amount: 10,
      status: "pending",
      payment_method: "Cash",
      timestamp: new Date().toISOString()
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

test();
