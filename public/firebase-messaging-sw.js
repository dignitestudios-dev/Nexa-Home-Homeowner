importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyDEuT-YrRoiTouezxyGHgZMMCcU5s4nTLU",
  authDomain: "nexahome-5d42f.firebaseapp.com",
  projectId: "nexahome-5d42f",
  storageBucket: "nexahome-5d42f.firebasestorage.app",
  messagingSenderId: "707682138709",
  appId: "1:707682138709:web:a2691aa6f20948abd5b2dc",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Background Message", payload);

  const notificationTitle =
    payload.notification?.title || "New Notification";

  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "/logo.png",
  };

  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});