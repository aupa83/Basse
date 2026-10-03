/* Garde l'application disponible hors connexion. Changer VERSION à chaque mise à jour. */
var VERSION = 'outils-basse-v10';
var SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png',
  'firebase/firebase-app-compat.js', 'firebase/firebase-auth-compat.js', 'firebase/firebase-firestore-compat.js'];
self.addEventListener('install', function(e){
  e.waitUntil(caches.open(VERSION).then(function(c){ return c.addAll(SHELL); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k !== VERSION; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e){
  if(e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  /* Page : le réseau d'abord pour recevoir les mises à jour, le cache si hors connexion. */
  if(e.request.mode === 'navigate'){
    /* Si le site ne répond plus correctement (supprimé, erreur), on garde la copie enregistrée. */
    e.respondWith(fetch(e.request).then(function(r){
      if(!r.ok) return caches.match('index.html').then(function(hit){ return hit || r; });
      var copy = r.clone(); caches.open(VERSION).then(function(c){ c.put('index.html', copy); }); return r;
    }).catch(function(){ return caches.match('index.html'); }));
    return;
  }
  /* Le reste (icônes, polices) : le cache d'abord. */
  if(url.origin === location.origin || /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)){
    e.respondWith(caches.match(e.request).then(function(hit){
      return hit || fetch(e.request).then(function(r){
        if(r.ok || r.type === 'opaque'){ var copy = r.clone(); caches.open(VERSION).then(function(c){ c.put(e.request, copy); }); }
        return r;
      });
    }));
  }
});
