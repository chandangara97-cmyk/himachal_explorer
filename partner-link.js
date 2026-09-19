/* Adds a small, quiet "Travel partner login" link to the footer of any page.
   Customers barely notice it; agents and Google find it easily.
   Use: <script src="/partner-link.js" defer></script> before </body>
   (Skipped automatically if the page already has a link marked data-partner-link.) */
(function () {
  'use strict';
  if (document.querySelector('[data-partner-link]')) return;
  if (/agent-(partner|admin)\.html$/.test(location.pathname)) return;

  var css = document.createElement('style');
  css.textContent =
    '.he-partner-link{display:block;text-align:center;padding:10px 16px 18px;font-size:.8rem;line-height:1.4}' +
    '.he-partner-link a{color:inherit;opacity:.6;text-decoration:none;border-bottom:1px dotted currentColor}' +
    '.he-partner-link a:hover,.he-partner-link a:focus-visible{opacity:1}' +
    '@media print{.he-partner-link{display:none}}';
  document.head.appendChild(css);

  var wrap = document.createElement('p');
  wrap.className = 'he-partner-link';
  wrap.style.margin = '0';
  var a = document.createElement('a');
  a.href = '/agent-partner.html';
  a.textContent = 'Travel agent partner login';
  a.title = 'For travel agents and partners';
  a.setAttribute('data-partner-link', '');
  wrap.appendChild(a);

  var footer = document.querySelector('footer');
  (footer || document.body).appendChild(wrap);
})();
