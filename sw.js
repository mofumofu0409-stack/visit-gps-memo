'use strict';
const CACHE='visit-gps-log-v0.1.1-icons';
const ASSETS=['./','./index.html','./app.js','./styles.css','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png','./icons/favicon.png','./vendor/leaflet.js','./vendor/leaflet.css'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('visit-gps-log-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{const u=new URL(event.request.url);if(event.request.method!=='GET'||u.origin!==self.location.origin||!ASSETS.some(p=>new URL(p,self.registration.scope).pathname===u.pathname))return;event.respondWith(caches.match(event.request).then(r=>r||fetch(event.request)));});
