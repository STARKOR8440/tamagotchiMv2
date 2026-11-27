// src/firebaseConfig.js
export const FIREBASE_DB_URL = 'https://tamagotchim-8b6b8-default-rtdb.firebaseio.com';

export const isFirebaseConfigured = () =>
  typeof FIREBASE_DB_URL === 'string' && FIREBASE_DB_URL.startsWith('https://');