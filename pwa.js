(() => {
 const VERSION='8.5';let deferredPrompt=null;
 const widget=()=>document.getElementById('chudu-tilda-site')?.shadowRoot;
 function setState(text){widget()?.querySelectorAll('[data-install-status]').forEach(n=>n.textContent=text)}
 const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
 const isIOS=()=>/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
 window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredPrompt=event;setState('Можно установить на это устройство')});
 window.addEventListener('appinstalled',()=>{deferredPrompt=null;setState('Приложение добавлено на устройство')});
 window.chuduInstall=async(options={})=>{
  if(standalone()&&!options.instructionsOnly){setState('Вы уже открыли веб-приложение');return}
  if(deferredPrompt&&!options.instructionsOnly){const event=deferredPrompt;deferredPrompt=null;await event.prompt();const result=await event.userChoice;setState(result.outcome==='accepted'?'Установка подтверждена':'Установить можно позже');return}
  const root=widget(),dialog=root?.getElementById('install-dialog');if(!dialog)return;
  const list=root.getElementById('install-steps');
  const ios=options.platform?options.platform==='ios':isIOS();
  root.querySelectorAll('[data-install-platform]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.installPlatform===(ios?'ios':'android'))));
  list.innerHTML=ios?'<li>Откройте этот сайт в Safari.</li><li>Нажмите «Поделиться» или меню страницы.</li><li>Выберите «На экран Домой» и включите «Открывать как веб-приложение», если такая настройка показана.</li><li>Нажмите «Добавить». Иконка CHUDU_86 появится на экране.</li>':'<li>Откройте сайт в Chrome или другом браузере с поддержкой установки.</li><li>В меню браузера выберите «Установить приложение» или «Добавить на главный экран».</li><li>Если такой команды нет, этот браузер не предлагает установку. Сайт продолжит работать по ссылке.</li>';
  if(!dialog.open)dialog.showModal();
 };
 const secure=location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1';
 if('serviceWorker' in navigator&&secure){navigator.serviceWorker.register(new URL('sw.js',location.href),{scope:'./',updateViaCache:'none'}).then(()=>navigator.serviceWorker.ready).then(()=>{document.documentElement.dataset.chuduPwaReady=VERSION;setState(standalone()?'Открыто как приложение':'Версия 8.5 сохранена для повторного открытия')}).catch(()=>setState('Сайт работает онлайн; установка зависит от браузера'))}
 else setState('Для установки откройте опубликованную HTTPS-ссылку');
})();
