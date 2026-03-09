// ============================================
// DATANEXUS - BOOT LOADER
// ============================================

const bootLines = [
  { text: 'DATANEXUS v2.0 — ANALYTICS INTELLIGENCE SYSTEM', cls: 'cyan' },
  { text: '> Initializing analytics kernel...', cls: 'green' },
  { text: '> Loading modules:', cls: 'white' },
  { text: '  [✓] tableau.connector', cls: 'green' },
  { text: '  [✓] sql.engine', cls: 'green' },
  { text: '  [✓] python.analytics', cls: 'green' },
  { text: '  [✓] excel.processor', cls: 'green' },
  { text: '  [✓] pandas.core', cls: 'green' },
  { text: '> Mounting dashboard environment...', cls: 'white' },
  { text: '> All systems nominal.', cls: 'white' },
  { text: '██ SYSTEM READY ██', cls: 'ready' },
];

function runBoot() {
  const terminal = document.getElementById('boot-terminal');
  const fill = document.getElementById('boot-fill');
  const pct = document.getElementById('boot-pct');
  const screen = document.getElementById('boot-screen');
  if (!terminal || !screen) return;

  let i = 0;
  let progress = 0;
  const totalLines = bootLines.length;

  function showNextLine() {
    if (i >= totalLines) {
      setTimeout(finishBoot, 600);
      return;
    }
    const line = document.createElement('div');
    line.className = 'boot-line ' + bootLines[i].cls;
    line.textContent = bootLines[i].text;
    terminal.appendChild(line);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { line.classList.add('visible'); });
    });
    progress = Math.round(((i + 1) / totalLines) * 100);
    fill.style.width = progress + '%';
    pct.textContent = progress + '%';
    i++;
    setTimeout(showNextLine, 180);
  }

  setTimeout(showNextLine, 300);

  function finishBoot() {
    screen.classList.add('fade-out');
    setTimeout(() => {
      screen.style.display = 'none';
      document.body.style.cursor = '';
    }, 800);
  }
}

document.addEventListener('DOMContentLoaded', runBoot);
