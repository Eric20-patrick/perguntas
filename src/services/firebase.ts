// Importação correta do Firebase v9+
import { initializeApp } from "firebase/app"; // Função de inicialização do Firebase
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Função de autenticação e provider do Google
import { getDatabase } from "firebase/database"; // Função para banco de dados em tempo real

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD0BYkeQPwnRUpeL8vjVJP1YLpafsBd-8g",
  authDomain: "lete-88508.firebaseapp.com",
  databaseURL: "https://lete-88508-default-rtdb.firebaseio.com",
  projectId: "lete-88508",
  storageBucket: "lete-88508.firebasestorage.app",
  messagingSenderId: "605033880967",
  appId: "1:605033880967:web:9886ddfc014845d1104722"
};


const app = initializeApp(firebaseConfig);


const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const database = getDatabase(app);

export { auth, provider, database }; 
