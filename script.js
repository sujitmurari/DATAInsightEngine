(function () {
  document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("page-ready");

    initTransitions();
    initMatrix();
    animateCounters();
    animateSkills();
    initTerminalLogs();
    validateContactForm();
  });

  function initTransitions() {
    document.querySelectorAll('a[href$=".html"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (!href || href.startsWith("http") || link.target === "_blank") return;
        e.preventDefault();
        document.body.classList.add("page-leave");
        setTimeout(() => {
          window.location.href = href;
        }, 180);
      });
    });
  }

  function initMatrix() {
    const canvas = document.getElementById("matrix");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const letters = "01ABCDEF1234567890<>[]{}#%$";
    let w = window.innerWidth;
    let h = window.innerHeight;
    const size = 14;
    let columns = Math.floor(w / size);
    let drops = new Array(columns).fill(1);

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      columns = Math.floor(w / size);
      drops = new Array(columns).fill(1);
    }

    function draw() {
      ctx.fillStyle = "rgba(6,6,8,0.08)";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#00ff41";
      ctx.font = `${size}px monospace`;

      for (let i = 0; i < drops.length; i += 1) {
        const ch = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(ch, i * size, drops[i] * size);
        if (drops[i] * size > h && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 1;
      }
    }

    resize();
    window.addEventListener("resize", resize);
    setInterval(draw, 45);
  }

  function animateCounters() {
    const counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;

    const ob = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const target = Number(el.dataset.count || 0);
        const suffix = el.dataset.suffix || "";
        let current = 0;
        const step = Math.max(1, Math.floor(target / 50));

        const t = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(t);
          }
          el.textContent = current + suffix;
        }, 25);

        observer.unobserve(el);
      });
    }, { threshold: 0.35 });

    counters.forEach((c) => ob.observe(c));
  }

  function animateSkills() {
    const fills = document.querySelectorAll(".skill-fill[data-level]");
    if (!fills.length) return;

    const ob = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.style.width = `${entry.target.dataset.level}%`;
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.3 });

    fills.forEach((fill) => ob.observe(fill));
  }

  function initTerminalLogs() {
    const line = document.querySelector("[data-terminal-log]");
    if (!line) return;

    const logs = [
      "Pipeline check complete...",
      "Data anomaly monitor online...",
      "Insight engine active for recruiter view..."
    ];

    let msg = 0;
    let idx = 0;

    function type() {
      line.textContent = logs[msg].slice(0, idx);
      idx += 1;

      if (idx <= logs[msg].length) {
        setTimeout(type, 45);
        return;
      }

      setTimeout(() => {
        idx = 0;
        msg = (msg + 1) % logs.length;
        type();
      }, 1200);
    }

    type();
  }

  function validateContactForm() {
    const form = document.querySelector("form[data-contact]");
    if (!form) return;

    const name = form.querySelector("#name");
    const email = form.querySelector("#email");
    const message = form.querySelector("#message");

    form.addEventListener("submit", (e) => {
      let ok = true;
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      form.querySelector("#nameErr").textContent = "";
      form.querySelector("#emailErr").textContent = "";
      form.querySelector("#messageErr").textContent = "";

      if (!name.value.trim()) {
        form.querySelector("#nameErr").textContent = "Name required.";
        ok = false;
      }

      if (!re.test(email.value.trim())) {
        form.querySelector("#emailErr").textContent = "Valid email required.";
        ok = false;
      }

      if (message.value.trim().length < 10) {
        form.querySelector("#messageErr").textContent = "Message must be at least 10 characters.";
        ok = false;
      }

      if (!ok) {
        e.preventDefault();
        return;
      }

      const btn = form.querySelector("button[type='submit']");
      btn.textContent = "TRANSMITTING...";
      btn.disabled = true;
    });
  }
})();
