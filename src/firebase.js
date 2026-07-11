import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let db = null;
let auth = null;
let isFirebaseActive = false;

// Resilient check to prevent app crashes when environment variables are not yet populated
if (firebaseConfig.projectId && firebaseConfig.apiKey && firebaseConfig.projectId !== 'seu_project_id') {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    isFirebaseActive = true;
    console.log("Firebase conectado com sucesso!");
  } catch (error) {
    console.warn("Falha ao inicializar o Firebase. Rodando em modo de cache local.", error);
  }
} else {
  console.log("Variáveis do Firebase não detectadas. Rodando em modo de cache local.");
}

export { db, auth, isFirebaseActive };
export default db;
