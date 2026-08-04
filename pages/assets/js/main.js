/* ============================================================
   BLACK VOID — Core interactions (shared across all pages)
   ============================================================ */

// ----- Loader -----
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) setTimeout(() => loader.classList.add('hidden'), 650);
});

// ----- Custom cursor -----
(function cursor(){
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring || matchMedia('(pointer:coarse)').matches) return;
  let rx=0, ry=0, mx=0, my=0;
  window.addEventListener('mousemove', e=>{
    mx=e.clientX; my=e.clientY;
    dot.style.left=mx+'px'; dot.style.top=my+'px';
  });
  (function loop(){
    rx += (mx-rx)*.18; ry += (my-ry)*.18;
    ring.style.left=rx+'px'; ring.style.top=ry+'px';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a, button, .card, .orbit-node').forEach(el=>{
    el.addEventListener('mouseenter', ()=>ring.classList.add('hover'));
    el.addEventListener('mouseleave', ()=>ring.classList.remove('hover'));
  });
})();

// ----- Nav scroll state + mobile toggle -----
(function nav(){
  const nav = document.querySelector('nav');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  window.addEventListener('scroll', ()=>{
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
  if (toggle && links){
    toggle.addEventListener('click', ()=>{
      links.classList.toggle('open');
      toggle.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>{
      links.classList.remove('open'); toggle.classList.remove('open');
    }));
  }
})();

// ----- Scroll reveal -----
(function reveal(){
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold:.15 });
  items.forEach((el,i)=>{ el.style.setProperty('--i', i%10); io.observe(el); });
})();

// ----- Void particle field (lightweight canvas, used on interior pages) -----
(function voidField(){
  const canvas = document.querySelector('.void-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w,h,particles=[];
  const DENSITY = 9000;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.min(140, Math.floor((w*h)/DENSITY));
    particles = Array.from({length:count}, ()=>({
      x: Math.random()*w, y: Math.random()*h,
      z: Math.random()*1 + .2,
      vx: (Math.random()-.5)*.15, vy: (Math.random()-.5)*.15,
      r: Math.random()*1.4 + .3
    }));
  }
  window.addEventListener('resize', resize);
  resize();

  let mx = w/2, my = h/2;
  window.addEventListener('mousemove', e=>{ mx=e.clientX; my=e.clientY; });

  function tick(){
    ctx.clearRect(0,0,w,h);
    const px = (mx - w/2) / w;
    const py = (my - h/2) / h;
    particles.forEach(p=>{
      p.x += p.vx + px*p.z*.3;
      p.y += p.vy + py*p.z*.3;
      if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r*p.z, 0, Math.PI*2);
      ctx.fillStyle = `rgba(244,242,236,${.12*p.z})`;
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }
  tick();
})();

// ----- Counter animation (numbers ticking up when in view) -----
(function counters(){
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;
  const io = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dur = 1400; const start = performance.now();
      function step(t){
        const p = Math.min(1, (t-start)/dur);
        const eased = 1 - Math.pow(1-p, 3);
        el.textContent = (target*eased).toFixed(target % 1 !== 0 ? 1 : 0) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, {threshold:.6});
  els.forEach(el=>io.observe(el));
})();
