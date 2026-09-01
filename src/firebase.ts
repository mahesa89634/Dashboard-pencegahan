import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBESvQ5s6Y1sxKHcbSpEXQhc8nlY-tgbNs",
  authDomain: "gen-lang-client-0386375318.firebaseapp.com",
  projectId: "gen-lang-client-0386375318",
  storageBucket: "gen-lang-client-0386375318.firebasestorage.app",
  messagingSenderId: "857042174758",
  appId: "1:857042174758:web:df5c2243f85a7393d8b7e7"
};

const app = initializeApp(firebaseConfig);

// Use the specific firestore database ID from config
export const db = getFirestore(app, "ai-studio-pencegahandamkar-91ebfc4a-70e8-4ebf-a8c6-acbe00f5db29");
