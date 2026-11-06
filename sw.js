const CACHE='chudu-demo-8.4-fcfd69d96d';
const base=self.registration.scope;
const shell=new URL('index.html',base).href;
const essentials=['index.html','manifest.json','pwa.js','pwa.js?v=8.4','icon-192.png','icon-512.png','apple-touch-icon.png'].map(name=>new URL(name,base).href);
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(essentials.map(url=>new Request(url,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('chudu-demo-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(base))return;
 if(event.request.mode==='navigate'){
  event.respondWith((async()=>{const cache=await caches.open(CACHE);try{const response=await fetch(new Request(event.request,{cache:'no-cache'}));if(response.ok){await cache.put(shell,response.clone());return response}const fallback=await cache.match(shell);return fallback||response}catch(error){const fallback=await cache.match(shell);return fallback||Response.error()}})());return;
 }
 if(essentials.includes(url.href)){event.respondWith(caches.open(CACHE).then(async cache=>{const cached=await cache.match(event.request);return cached||fetch(event.request)}))}
});
