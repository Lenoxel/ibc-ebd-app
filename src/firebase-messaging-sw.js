importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const messaging = getMessaging(initializeApp({ 
    apiKey: "AIzaSyCvugUvnxTW1Agmbl_l3Ax49fTk3r33tjg", 
    authDomain: "minha-ebd.firebaseapp.com", 
    projectId: "minha-ebd", 
    storageBucket: "minha-ebd.appspot.com", 
    messagingSenderId: "170193242677", 
    appId: "1:170193242677:web:642b56bd882a44fbe73f7c", 
    measurementId: "G-Y3CG1V8TPH" 
}));

onBackgroundMessage(messaging, (payload) => {
    console.log("on background message payload: ", payload);
})