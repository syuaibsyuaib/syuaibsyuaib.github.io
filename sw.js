importScripts("https://www.gstatic.com/firebasejs/11.2.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.2.0/firebase-messaging-compat.js");

const CACHE_NAME = "pwa-cache-v2";
const CACHE_FILES = [
  "./",
  "./index.html",
  "./lagioff.html",
  "./script.js",
  "./style.css",
  "./template.js",
  "./manifest.json",
  "./icons/android/android-launchericon-96-96.png",
  "./icons/windows11/Square44x44Logo.targetsize-32.png",
  "./icons/windows11/Square44x44Logo.targetsize-16.png"
];

const HOSTNAME_WHITELIST = [
  self.location.hostname,
  "fonts.googleapis.com",
  "fonts.gstatic.com",
  "cdn.jsdelivr.net",
  "code.jquery.com",
  "unpkg.com",
  "www.gstatic.com"
];

/**
 *  @Lifecycle Install
 */
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Caching Files");
      return cache.addAll(CACHE_FILES);
    })
  );
  self.skipWaiting();
});

/**
 *  @Lifecycle Activate
 */
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activated");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Service Worker: Clearing Old Cache", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

/**
 *  @Functional Fetch
 */
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests that are not in whitelist
  const requestUrl = new URL(event.request.url);
  if (!HOSTNAME_WHITELIST.includes(requestUrl.hostname)) {
    return;
  }

  // Handle navigation requests (HTML)
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match("./lagioff.html");
      })
    );
    return;
  }

  // Cache-first strategy for other assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        // Only cache successful same-origin responses
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type === "basic" &&
          event.request.method === "GET"
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // If fetch fails (offline) and not in cache, just return error
        // except for images maybe? For now, just let it fail.
      });
    })
  );
});


// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCtr4PH8snb07hHNpq0dzTFGI6pFLOTkns",
  authDomain: "adakah-ddd65.firebaseapp.com",
  projectId: "adakah-ddd65",
  storageBucket: "adakah-ddd65.appspot.com",
  messagingSenderId: "96528323807",
  appId: "1:96528323807:web:d25f87552c42c3c520c56a",
  measurementId: "G-2Y0EQNQPDT",
};

firebase.initializeApp(firebaseConfig);

// Inisialisasi Firebase Messaging
const messaging = firebase.messaging();

// Tangani notifikasi saat aplikasi di background
messaging.onBackgroundMessage((payload) => {
  const { title, body, image } = payload.notification;

  self.registration.showNotification(title, {
    body,
    image: image || "/icons/windows11/LargeTile.scale-100.png",
    vibrate: [200, 100, 200, 100, 200, 100, 200],
    requireInteraction: true
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.click_action));
});
