const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, push } = require('firebase/database');

const firebaseConfig = {
  apiKey: "AIzaSyDPOCPfX1-tB0BfSfku8Oer4tY9foqGE8s",
  authDomain: "hotel-frontend-d7ed9.firebaseapp.com",
  projectId: "hotel-frontend-d7ed9",
  storageBucket: "hotel-frontend-d7ed9.appspot.com",
  messagingSenderId: "367253457199",
  appId: "1:367253457199:web:df21590fc3673ab2c40c83",
  databaseURL: "https://hotel-frontend-d7ed9-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function test() {
  try {
    const newOrderRef = push(ref(db, "orders"));
    await set(newOrderRef, { test: "success" });
    console.log("RTDB written!");
    process.exit(0);
  } catch(e) {
    console.error("RTDB error:", e);
    process.exit(1);
  }
}

test();
