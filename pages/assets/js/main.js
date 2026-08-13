/* BLACK VOID — Arquivo do Vazio / interactions shared across routes. */
(function () {
  const boot = () => {
    const loader = document.getElementById('loader');
    if (loader) window.setTimeout(() => loader.classList.add('hidden'), 500);

    const nav = document.querySelector('nav');
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    const onScroll = () => nav && nav.classList.toggle('scrolled', window.scrollY > 36);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    if (toggle && links && !toggle.dataset.ready) {
      toggle.dataset.ready = 'true';
      toggle.addEventListener('click', () => {
        const open = links.classList.toggle('open');
        toggle.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(open));
      });
      links.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
        links.classList.remove('open'); toggle.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false');
      }));
    }

    const current = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach((link) => {
      const href = link.getAttribute('href') || '';
      link.classList.toggle('active', href.endsWith(current));
    });

    const reveals = document.querySelectorAll('.reveal:not(.in)');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      }), { threshold: .14 });
      reveals.forEach((element, index) => { element.style.setProperty('--i', index % 10); io.observe(element); });
    } else reveals.forEach((element) => element.classList.add('in'));

    document.querySelectorAll('[data-count]').forEach((element) => {
      const target = Number(element.dataset.count || 0); const suffix = element.dataset.suffix || '';
      const run = () => { const start = performance.now(); const tick = (now) => { const p = Math.min(1, (now - start) / 1100); element.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix; if (p < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); };
      if ('IntersectionObserver' in window) { const io = new IntersectionObserver((entries) => { if (entries[0].isIntersecting) { run(); io.disconnect(); } }); io.observe(element); } else run();
    });

    document.querySelectorAll('[data-accordion]').forEach((item) => item.addEventListener('click', () => item.classList.toggle('open')));
  };
  document.addEventListener('DOMContentLoaded', boot);
  new MutationObserver(() => { const nav = document.querySelector('nav'); if (nav && !nav.dataset.bound) { nav.dataset.bound = 'true'; boot(); } }).observe(document.documentElement, { childList: true, subtree: true });
})();
