import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyA6OnrbBoblF3lQFls9HL_ehrUJ33XZAi4",
    authDomain: "booklii.firebaseapp.com",
    projectId: "booklii",
    storageBucket: "booklii.appspot.com",
    messagingSenderId: "1044871757385",
    appId: "1:1044871757385:web:e6d34a2f7d7d9d7dac0998",
    measurementId: "G-N1H48TPTXS"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore();
  const auth = firebase.auth();

  export { db, auth };
  export {firebase};


