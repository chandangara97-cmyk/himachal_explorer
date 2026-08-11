/* ============================================================
   SITE CHROME — injects a consistent header + footer on every
   page that includes this script plus <div id="site-header">
   and/or <div id="site-footer"> placeholders.
   ============================================================ */
(function(){
  var NAV_LINKS = [
    {href:'index.html',          label:'Home'},
    {href:'packages.html',       label:'Packages'},
    {href:'explore.html',        label:'Explore Map'},
    {href:'yui.html',            label:'Route Builder'},
    {href:'bike-rental.html',    label:'Bike Rental'},
    {href:'himachal-treks.html', label:'Treks'},
    {href:'taxi-service.html',   label:'Taxi Service'},
    {href:'hotels.html',         label:'Hotels'}
  ];

  var FOOT_LINKS = [
    {href:'index.html',    label:'Home'},
    {href:'explore.html',  label:'Explore'},
    {href:'packages.html', label:'Packages'},
    {href:'yui.html',      label:'Route Builder'},
    {href:'hotels.html',   label:'Hotels'},
    {href:'https://www.instagram.com/himachalexplorer', label:'Instagram', ext:true},
    {href:'https://wa.me/917018138847', label:'WhatsApp', ext:true}
  ];

  function currentFile(){
    var p = location.pathname.split('/').pop();
    return p === '' ? 'index.html' : p;
  }

  function renderHeader(){
    var mount = document.getElementById('site-header');
    if(!mount) return;
    var here = currentFile();

    var linksHTML = NAV_LINKS.map(function(l){
      var active = (l.href === here) ? ' he-active' : '';
      var current = (l.href === here) ? ' aria-current="page"' : '';
      return '<a href="'+l.href+'" class="he-nav-links-item'+active+'"'+current+'>'+l.label+'</a>';
    }).join('');

    mount.innerHTML =
      '<header class="he-header">'+
        '<a href="index.html" class="he-logo">'+
          '<svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">'+
            '<circle cx="16" cy="16" r="16" fill="#f8f5ef" stroke="#b07d3a" stroke-width="1.5"/>'+
            '<path d="M4 24 L10 14 L14 19 L18 11 L28 24Z" fill="#b07d3a" opacity="0.18"/>'+
            '<path d="M4 24 L10 14 L14 19 L18 11 L28 24" stroke="#b07d3a" stroke-width="1.5" stroke-linejoin="round" fill="none"/>'+
            '<circle cx="18" cy="10" r="1.5" fill="#c99248"/>'+
          '</svg>'+
          '<span class="he-logo-text">Himachal <em>Explorer</em></span>'+
        '</a>'+
        '<nav class="he-nav-links" id="he-nav-links" aria-label="Main navigation">'+linksHTML+'</nav>'+
        '<div class="he-right">'+
          '<a href="tel:+917018138847" class="he-phone">'+
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.5 12.36a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.41 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.09 6.09l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>'+
            '+91-70181 38847'+
          '</a>'+
          '<a href="packages.html" class="he-cta">Plan Journey</a>'+
          '<button type="button" class="he-burger" id="he-burger" aria-label="Toggle menu" aria-expanded="false"><span></span><span></span><span></span></button>'+
        '</div>'+
      '</header>'+
      '<div class="he-header-spacer" aria-hidden="true"></div>';

    // header starts hidden (see CSS) and slides/fades in after a short delay
    var headerEl = mount.querySelector('.he-header');
    setTimeout(function(){
      if(headerEl) headerEl.classList.add('he-visible');
    }, 5000);

    var burger = document.getElementById('he-burger');
    var navEl = document.getElementById('he-nav-links');
    burger.addEventListener('click', function(){
      var open = navEl.classList.toggle('he-open');
      burger.classList.toggle('he-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    var navAnchors = navEl.getElementsByTagName('a');
    for(var i=0;i<navAnchors.length;i++){
      navAnchors[i].addEventListener('click', function(){
        navEl.classList.remove('he-open');
        burger.classList.remove('he-open');
        burger.setAttribute('aria-expanded','false');
      });
    }
  }

  function renderFooter(){
    var mount = document.getElementById('site-footer');
    if(!mount) return;
    var linksHTML = FOOT_LINKS.map(function(l){
      var extra = l.ext ? ' target="_blank" rel="noopener"' : '';
      return '<li><a href="'+l.href+'"'+extra+'>'+l.label+'</a></li>';
    }).join('');
    mount.innerHTML =
      '<footer class="he-footer">'+
        '<div class="he-footer-inner">'+
          '<div class="he-foot-brand">Himachal <em>Explorer</em><span>Heritage travel guide · Himachal Pradesh</span></div>'+
          '<ul class="he-foot-links">'+linksHTML+'</ul>'+
          '<div class="he-foot-copy">© 2026 Himachal Explorer · Garg Enterprise · +91-70181 38847</div>'+
        '</div>'+
      '</footer>';
  }

  function init(){
    try{ renderHeader(); }catch(e){}
    try{ renderFooter(); }catch(e){}
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
