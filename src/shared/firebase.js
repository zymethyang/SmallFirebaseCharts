const firebase = require('firebase/app');

const firebaseConfig = {
    apiKey: "AIzaSyC9DLTWUj9oLj9-XcyHv8JOOG6BFYhVuK0",
    authDomain: "esp8266-7742b.firebaseapp.com",
    databaseURL: "https://esp8266-7742b.firebaseio.com",
    projectId: "esp8266-7742b",
    storageBucket: "esp8266-7742b.appspot.com",
    messagingSenderId: "15790064489",
    appId: "1:15790064489:web:c40dbe848d5bd380b2f3f8"
};
// Initialize Firebase

module.exports = firebase.initializeApp(firebaseConfig);