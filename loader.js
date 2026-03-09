(function () {
  const logs = [
    "DATANEXUS v2.0",
    "Initializing analytics kernel...",
    "Loading modules...",
    "tableau.connector",
    "sql.engine",
    "python.analytics",
    "Dashboard environment ready",
    "SYSTEM READY"
  ];

  const boot = document.querySelector("[data-boot]");
  if (!boot) {
    document.body.classList.add("booted");
    return;
  }

  const list = boot.querySelector("[data-boot-log]");
  const bar = boot.querySelector("[data-boot-progress]");
  const percent = boot.querySelector("[data-boot-percent]");

  let progress = 0;
  let logIndex = 0;

  const timer = setInterval(() => {
    progress += 2;
    if (progress > 100) progress = 100;

    if (bar) bar.style.width = progress + "%";
    if (percent) percent.textContent = progress + "%";

    const targetLogIndex = Math.floor((progress / 100) * logs.length);
    while (logIndex < targetLogIndex && logIndex < logs.length) {
      const li = document.createElement("li");
      li.textContent = "> " + logs[logIndex];
      if (list) list.appendChild(li);
      logIndex += 1;
    }

    if (progress >= 100) {
      clearInterval(timer);
      setTimeout(() => {
        boot.classList.add("hidden");
        document.body.classList.add("booted");
        setTimeout(() => {
          boot.style.display = "none";
        }, 750);
      }, 350);
    }
  }, 50);
})();
