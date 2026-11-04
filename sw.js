const C='pagoda-v2',A=['./','index.html','style.css','app.js','lunar.js','vendor/qrcode.js','icon.svg','manifest.webmanifest','data/suttas.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x))))));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);
 if(u.origin===location.origin)e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
 else if(u.hostname==='suttacentral.net')e.respondWith(fetch(e.request).then(r=>{const cl=r.clone();caches.open(C).then(c=>c.put(e.request,cl));return r}).catch(()=>caches.match(e.request)));});
