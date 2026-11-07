const CACHE='chudu-demo-8.7-94ecb9fbda';
const base=self.registration.scope;
const shell=new URL('index.html',base).href;
const legalFiles=['privacy.html','cookies.html','demo-terms.html'];
const essentials=['index.html','manifest.json','pwa.js','pwa.js?v=8.7',...legalFiles,'icon-192.png','icon-512.png','apple-touch-icon.png'].map(name=>new URL(name,base).href);
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(essentials.map(url=>new Request(url,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('chudu-demo-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(base))return;
 if(event.request.mode==='navigate'){
  const path=url.pathname.slice(new URL(base).pathname.length);
  const isLegal=legalFiles.includes(path);
  const isApp=path===''||path==='index.html'||/^demo-v[\d.]+\.html$/.test(path)||/^CHUDU_86_App_v[\d_]+\.html$/.test(path);
  if(!isLegal&&!isApp)return;
  // Legal documents get their own cache entry and never replace the app shell.
  const key=isLegal?new URL(path,base).href:shell;
  event.respondWith((async()=>{const cache=await caches.open(CACHE);try{const response=await fetch(new Request(event.request,{cache:'no-cache'}));if(response.ok){await cache.put(key,response.clone());return response}const fallback=await cache.match(key);return fallback||response}catch(error){const fallback=await cache.match(key);return fallback||Response.error()}})());return;
 }
 if(essentials.includes(url.href)){event.respondWith(caches.open(CACHE).then(async cache=>{const cached=await cache.match(event.request);return cached||fetch(event.request)}))}
});
