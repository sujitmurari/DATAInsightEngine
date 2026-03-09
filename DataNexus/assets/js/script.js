// ============================================
// DATANEXUS - MAIN SCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- CUSTOM CURSOR ----
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (dot && ring) {
    document.addEventListener('mousemove', e => {
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
      ring.style.left = e.clientX + 'px';
      ring.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('a,button,.glass-card,.connect-node').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
    });
  }

  // ---- MATRIX RAIN ----
  const canvas = document.getElementById('matrix-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, cols, drops;

    function initMatrix() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      const fontSize = 13;
      cols = Math.floor(W / fontSize);
      drops = Array(cols).fill(1);
    }
    initMatrix();
    window.addEventListener('resize', initMatrix);

    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ∑∞∫∂∇αβγδεζηθ<>{}[]|';
    function drawMatrix() {
      ctx.fillStyle = 'rgba(8,12,20,0.05)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#00f5ff';
      ctx.font = '13px Share Tech Mono, monospace';
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * 13, drops[i] * 13);
        if (drops[i] * 13 > H && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }
    setInterval(drawMatrix, 50);
  }

  // ---- NAV ACTIVE STATE ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // ---- HAMBURGER MENU ----
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileClose = document.getElementById('mobile-nav-close');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.add('open');
      document.body.classList.add('menu-open');
    });
    if (mobileClose) mobileClose.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      document.body.classList.remove('menu-open');
    });
  }

  // ---- SCROLL ANIMATIONS ----
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); }
      });
    }, { threshold: 0.12 });
    fadeEls.forEach(el => obs.observe(el));
  }

  // ---- SKILL BARS ----
  const skillBars = document.querySelectorAll('.skill-fill');
  if (skillBars.length) {
    const sbObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const target = e.target.dataset.width;
          e.target.style.width = target;
          sbObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    skillBars.forEach(bar => sbObs.observe(bar));
  }

  // ---- KPI COUNTER ANIMATION ----
  function animateCounter(el, target, suffix = '') {
    let start = 0;
    const duration = 1800;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const cObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const target = parseInt(e.target.dataset.count);
          const suffix = e.target.dataset.suffix || '';
          animateCounter(e.target, target, suffix);
          cObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cObs.observe(c));
  }

  // ---- CONTACT FORM ----
  const form = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = '> TRANSMITTING...';
      btn.disabled = true;

      const data = new FormData(form);
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          formStatus.textContent = '> [SUCCESS] Message transmitted. Response incoming.';
          formStatus.className = 'form-status success';
          form.reset();
        } else {
          formStatus.textContent = '> [ERROR] Transmission failed. Retry required.';
          formStatus.className = 'form-status error';
        }
      } catch {
        formStatus.textContent = '> [ERROR] Connection refused. Check network.';
        formStatus.className = 'form-status error';
      }
      btn.textContent = '> TRANSMIT MESSAGE';
      btn.disabled = false;
    });
  }

  // ---- TERMINAL TYPEWRITER (ABOUT PAGE) ----
  const terminalBody = document.getElementById('terminal-typewriter');
  if (terminalBody) {
    const lines = terminalBody.querySelectorAll('.type-line');
    let delay = 400;
    lines.forEach(line => {
      line.style.opacity = '0';
      setTimeout(() => {
        line.style.opacity = '1';
        line.style.transition = 'opacity 0.4s';
      }, delay);
      delay += 300;
    });
  }

  // ---- LIVE CLOCK IN NAV ----
  const clockEl = document.getElementById('nav-clock');
  if (clockEl) {
    function updateClock() {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      clockEl.textContent = `${h}:${m}:${s}`;
    }
    updateClock();
    setInterval(updateClock, 1000);
  }

});
