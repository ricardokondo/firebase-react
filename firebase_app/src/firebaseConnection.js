//Importação das bibliotecas de configuração do firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configurações encontradas no console do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCXi8k317M3WzCQv-1SqqxJrGSACb-IM7Y",
  authDomain: "progweb-facom.firebaseapp.com",
  projectId: "progweb-facom",
  storageBucket: "progweb-facom.appspot.com",
  messagingSenderId: "907724247718",
  appId: "1:907724247718:web:035d4386e9cda287e7da67",
  measurementId: "G-L71E27QKYG",
};

//Inicialização do firebase
const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export { db };
