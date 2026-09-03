import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrnV4gD46LpYjD3Qmg6uWo5sMVoQ-3wts",
  authDomain: "dashbord-pencegahan.firebaseapp.com",
  projectId: "dashbord-pencegahan",
  storageBucket: "dashbord-pencegahan.firebasestorage.app",
  messagingSenderId: "422888991159",
  appId: "1:422888991159:web:f41cc5b6849d07c5dd6032"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
