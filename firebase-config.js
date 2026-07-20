const firebaseConfig = {
  apiKey: "AIzaSyB98QjJdlekwjVmDPdBdpU-CIBqaOzDJQI",
  authDomain: "aisuraksha.firebaseapp.com",
  projectId: "aisuraksha",
  storageBucket: "aisuraksha.firebasestorage.app",
  messagingSenderId: "381308863189",
  appId: "1:381308863189:android:6ae2cd34f015722913185c"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
