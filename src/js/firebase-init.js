// Konfigurasi Firebase kamu
const firebaseConfig = {
    apiKey: "AIzaSyBltHfOIzB_MC3LE8S1nT8JvMQnJlLAnes",
    authDomain: "personalvisitor-7bbdb.firebaseapp.com",
    databaseURL: "https://personalvisitor-7bbdb-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "personalvisitor-7bbdb",
    storageBucket: "personalvisitor-7bbdb.appspot.com",
    messagingSenderId: "558526780219",
    appId: "1:558526780219:web:47cc4febc551e2e4f99d1e"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();