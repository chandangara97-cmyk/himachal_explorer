// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  }

  // Lightweight hero video: only fetch the video file once it's needed,
  // and skip it entirely on slow connections / data-saver mode.
  const heroVideo = document.querySelector('.hero-media[data-src]');
  if (heroVideo) {
    const saveData = navigator.connection && (navigator.connection.saveData ||
      ['slow-2g', '2g'].includes(navigator.connection.effectiveType));
    if (!saveData) {
      heroVideo.src = heroVideo.dataset.src;
      heroVideo.load();
      heroVideo.play().catch(() => {}); // autoplay may be blocked; poster image covers that
    }
  }

  // Gentle scroll-reveal for section content
  const revealEls = document.querySelectorAll('.reveal');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (revealEls.length && 'IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }
});

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str || '';
  return d.innerHTML;
}

function formatDate(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}
