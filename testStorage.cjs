const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadString, getDownloadURL } = require('firebase/storage');

const firebaseConfig = {
  apiKey: "AIzaSyDPOCPfX1-tB0BfSfku8Oer4tY9foqGE8s",
  authDomain: "hotel-frontend-d7ed9.firebaseapp.com",
  projectId: "hotel-frontend-d7ed9",
  storageBucket: "hotel-frontend-d7ed9.appspot.com",
  messagingSenderId: "367253457199",
  appId: "1:367253457199:web:df21590fc3673ab2c40c83"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

async function testUpload() {
  try {
    const storageRef = ref(storage, 'test.txt');
    await uploadString(storageRef, 'Hello World');
    const url = await getDownloadURL(storageRef);
    console.log("Success! URL:", url);
  } catch (e) {
    console.error("Storage failed:", e.message);
  }
}

testUpload();
