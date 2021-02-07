importScripts('https://www.gstatic.com/firebasejs/8.2.5/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.5/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: 'AIzaSyB8746JQGyjagRfPCUboKcWnzP--OmUckU',
  authDomain: 'trailstatusapp-production.firebaseapp.com',
  projectId: 'trailstatusapp-production',
  storageBucket: 'trailstatusapp-production.appspot.com',
  messagingSenderId: '329321943885',
  appId: '1:329321943885:web:a90c95fab8a047ef129d04',
  measurementId: 'G-0PJ811WMHN',
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload,
  );
  // Customize notification here
  // const notificationTitle = payload.notification.title;
  // const notificationOptions = {
  //   body: payload.notification.body,
  //   icon: payload.notification.image,
  // };

  // self.registration.showNotification(notificationTitle, notificationOptions);
});
