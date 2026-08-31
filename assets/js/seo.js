/* Himachal Explorer — SEO runtime helper
   Static package pages carry crawlable SEO metadata. This helper improves
   share previews for dynamically rendered package/detail views. */
(function(){
  function clean(v){return String(v||'').replace(/\s+/g,' ').trim();}
  function setMeta(name,content){
    if(!content)return;
    var el=document.querySelector('meta[name="'+name+'"]');
    if(!el){el=document.createElement('meta');el.name=name;document.head.appendChild(el);}
    el.content=content;
  }
  function setOG(prop,content){
    if(!content)return;
    var el=document.querySelector('meta[property="'+prop+'"]');
    if(!el){el=document.createElement('meta');el.setAttribute('property',prop);document.head.appendChild(el);}
    el.content=content;
  }
  window.HimachalSEO=function(data){
    data=data||{};
    var name=clean(data.name);
    if(!name)return;
    var title=clean(data.title)||name+' | Himachal Tour Package | Himachal Explorer';
    var desc=clean(data.description)||('Explore '+name+' with a day-wise itinerary, destinations, route and travel details from Himachal Explorer.');
    document.title=title;
    setMeta('description',desc);
    setOG('og:title',title); setOG('og:description',desc); setOG('og:url',location.href);
  };
})();