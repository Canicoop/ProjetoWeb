const firebaseConfig = {
  apiKey: "AIzaSyBfpx120DARepBfmmo-x1dxC5cNUl4rtw0",
  authDomain: "livraria-central.firebaseapp.com",
  projectId: "livraria-central",
  storageBucket: "livraria-central.firebasestorage.app",
  messagingSenderId: "31758858553",
  appId: "1:31758858553:web:2339e17872b14291ca10e8"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
