// ─── State ────────────────────────────────────────────────────────────────────
let refreshCountdown = 300;
let isLoading = false;
let currentFilter = 'all';
let lastState = null;

// Abbreviation map for instrument avatar (2 chars)
function getAvatar(name) {
  const map = {
    'EURUSD': 'EU', 'GBPUSD': 'GU', 'USDJPY': 'UJ', 'AUDUSD': 'AU',
    'USDCAD': 'UC', 'USDCHF': 'US', 'NZDUSD': 'NU', 'EURJPY': 'EJ',
    'GBPJPY': 'GJ', 'EURGBP': 'EG', 'XAUUSD': 'AU', 'XAGUSD': 'AG',
    'BTC': 'BT', 'WTI': 'OI',
    '#US30': 'DJ', '#USSPX500': 'SP', '#USNDAQ100': 'NQ',
    '#Garmany40': 'DE', '#UK100': 'UK', '#france40': 'FR',
  };
  if (map[name]) return map[name];
  return name.replace(/[^A-Z0-9]/gi, '').substring(0, 2).toUpperCase();
}

// Generate a deterministic-looking mini SVG sparkline
function generateSparkline(name, isDanger) {
  const color = isDanger ? '#f43f5e' : '#10b981';
  const seed = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const r = (n) => ((seed * (n + 1) * 9301 + 49297) % 233280) / 233280;
  const pts = Array.from({ length: 8 }, (_, i) => r(i) * 16 + 2);
  let d = `M0 ${pts[0]}`;
  pts.forEach((y, i) => {
    if (i === 0) return;
    const x = (i / (pts.length - 1)) * 100;
    d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
  });
  return `<svg viewBox="0 0 100 20" preserveAspectRatio="none" class="w-full h-full">
    <path d="${d}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

// ─── Clock & Countdown ────────────────────────────────────────────────────────
function updateClocks() {
  const now = new Date();
  const el = document.getElementById('local-time');
  if (el) el.textContent = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  if (refreshCountdown > 0) {
    refreshCountdown--;
  } else {
    refreshCountdown = 300;
    fetchNewsData();
  }

  const m = Math.floor(refreshCountdown / 60);
  const s = refreshCountdown % 60;
  const rt = document.getElementById('refresh-time');
  if (rt) rt.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ─── Loader helpers ───────────────────────────────────────────────────────────
function showLoader(msg, isError = false) {
  const loader = document.getElementById('loader');
  const cont = document.getElementById('instruments-container');
  if (loader) {
    loader.textContent = msg || 'Cargando datos del mercado...';
    loader.style.display = 'block';
    loader.className = isError ? 'text-center py-16 text-sm error' : 'text-center py-16 text-on-surface-variant text-sm';
  }
  if (cont) cont.style.display = 'none';
}

function hideLoader() {
  const loader = document.getElementById('loader');
  const cont = document.getElementById('instruments-container');
  if (loader) loader.style.display = 'none';
  if (cont) cont.style.display = 'block';
}

// ─── Fetch ────────────────────────────────────────────────────────────────────
async function fetchNewsData() {
  if (isLoading) return;
  isLoading = true;

  showLoader('Cargando datos del mercado...');

  try {
    const res = await fetch('/api/state');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const state = await res.json();

    if (!state?.groups || Object.keys(state.groups).length === 0) {
      throw new Error('Respuesta sin grupos del servidor');
    }

    lastState = state;
    renderAll(state);
    hideLoader();
    refreshCountdown = 300;

    const syncEl = document.getElementById('last-sync-label');
    if (syncEl && state.lastUpdate) {
      const d = new Date(state.lastUpdate);
      syncEl.textContent = `Actualizado ${d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    }

    console.log(`[UI] OK — Grupos: ${Object.keys(state.groups).length}, Peligro: [${state.dangerCurrencies?.join(', ') || 'ninguno'}]`);

  } catch (err) {
    console.error('[UI] Error:', err.message);
    showLoader('Error al cargar datos. Reintentando...', true);
    setTimeout(() => { isLoading = false; fetchNewsData(); }, 10000);
    return;
  }

  isLoading = false;
}

// ─── Filter ───────────────────────────────────────────────────────────────────
window.setFilter = function(filter) {
  currentFilter = filter;
  ['all', 'affected', 'safe'].forEach(f => {
    const btn = document.getElementById(`filter-${f}`);
    if (btn) btn.classList.toggle('active', f === filter);
  });
  if (lastState) renderGroups(lastState.groups, new Set(lastState.dangerCurrencies || []));
};

// ─── Render all ───────────────────────────────────────────────────────────────
function renderAll(state) {
  renderGroups(state.groups, new Set(state.dangerCurrencies || []));
  renderNews(state.todayNews || []);
  renderSentiment(state.dangerCurrencies || []);
}

// ─── Render Groups ────────────────────────────────────────────────────────────
function renderGroups(groups, dangerCurrencies) {
  const container = document.getElementById('instruments-container');
  if (!container) return;
  container.innerHTML = '';

  Object.entries(groups).forEach(([groupName, instruments]) => {
    // Apply filter
    const entries = Object.entries(instruments).filter(([name, currencies]) => {
      const isDanger = currencies.some(c => dangerCurrencies.has(c));
      if (currentFilter === 'affected') return !isDanger;
      if (currentFilter === 'safe') return !isDanger;
      return true;
    });

    if (entries.length === 0) return;

    // Group wrapper
    const groupDiv = document.createElement('div');
    groupDiv.className = 'mb-8';

    // Group header
    groupDiv.innerHTML = `
      <div class="flex items-center gap-3 mb-4">
        <h3 class="font-headline text-sm font-semibold text-on-surface uppercase tracking-wider">${groupName}</h3>
        <span class="text-xs text-on-surface-variant">· Elige 1 de este grupo</span>
        <div class="flex-1 h-px bg-white/5"></div>
      </div>`;

    // Cards grid
    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4';

    entries.forEach(([name, currencies]) => {
      const isDanger = currencies.some(c => dangerCurrencies.has(c));
      const avatar = getAvatar(name);

      const card = document.createElement('div');
      card.className = `instrument-card bg-surface-glass backdrop-blur-md rounded-xl p-5 border flex flex-col gap-3 cursor-default ${
        isDanger
          ? 'danger border-danger-rose/60 shadow-[0_0_20px_rgba(244,63,94,0.12)]'
          : 'border-white/5'
      }`;

      const statusBadge = isDanger
        ? `<span class="px-2 py-0.5 rounded bg-danger-rose text-white text-[10px] font-bold tracking-wider uppercase animate-pulse">AFECTADO</span>`
        : `<span class="px-2 py-0.5 rounded bg-success-emerald/20 text-success-emerald text-[10px] font-bold tracking-wider uppercase">SEGURO</span>`;

      const avatarStyle = isDanger
        ? 'border border-danger-rose/40 text-danger-rose'
        : 'text-on-surface';

      const subtitleText = currencies.join(' / ');

      card.innerHTML = `
        <!-- Card Header -->
        <div class="flex justify-between items-start">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-xs font-bold ${avatarStyle}">${avatar}</div>
            <div>
              <div class="font-headline text-base font-semibold text-on-surface leading-tight flex items-center gap-2">
                ${name}
                <span class="material-symbols-outlined text-[14px] text-on-surface-variant hover:text-primary cursor-pointer transition-colors">notifications</span>
              </div>
              <div class="text-xs text-on-surface-variant mt-0.5">${subtitleText}</div>
            </div>
          </div>
          ${statusBadge}
        </div>

        <!-- Mini Sparkline -->
        <div class="w-full h-8">
          ${generateSparkline(name, isDanger)}
        </div>

        <!-- Footer -->
        <div class="flex justify-between items-end pt-1 ${isDanger ? 'border-t border-danger-rose/20' : 'border-t border-white/5'}">
          <div>
            <div class="text-[10px] font-bold uppercase tracking-wider ${isDanger ? 'text-danger-rose/70' : 'text-on-surface-variant'} mb-0.5">
              ${isDanger ? 'Spread Bloqueado' : 'Spread'}
            </div>
            <div class="font-mono-data text-sm text-on-surface">— <span class="text-on-surface-variant text-xs">pips</span></div>
          </div>
          <div class="text-right">
            <div class="text-[10px] font-bold uppercase tracking-wider ${isDanger ? 'text-danger-rose/70' : 'text-on-surface-variant'} mb-0.5">
              ${isDanger ? 'Volatilidad Esperada' : 'Volatilidad'}
            </div>
            <div class="font-mono-data text-sm font-bold ${isDanger ? 'text-danger-rose' : 'text-secondary'}">
              ${isDanger ? 'Extrema' : 'Baja'}
            </div>
          </div>
        </div>
        ${isDanger ? `<div class="absolute inset-0 bg-danger-rose/[0.03] rounded-xl pointer-events-none"></div>` : ''}
      `;

      if (isDanger) card.style.position = 'relative';

      grid.appendChild(card);
    });

    groupDiv.appendChild(grid);
    container.appendChild(groupDiv);
  });
}

// ─── Render News ──────────────────────────────────────────────────────────────
function renderNews(newsList) {
  const container = document.getElementById('news-list');
  if (!container) return;
  container.innerHTML = '';

  if (!newsList || newsList.length === 0) {
    container.innerHTML = `
      <div class="flex items-center gap-3 py-4 text-on-surface-variant text-sm">
        <span class="material-symbols-outlined text-success-emerald text-[20px]">check_circle</span>
        Sin noticias de alto impacto para hoy.
      </div>`;
    return;
  }

  const now = new Date();

  newsList.forEach(news => {
    const isImminent = isNewsImminent(news, now);
    const relativeTime = getRelativeTime(news, now);
    const row = document.createElement('div');
    row.className = `news-row flex gap-4 p-3 rounded-lg ${isImminent ? 'bg-danger-rose/10 border border-danger-rose/20' : ''}`;
    row.innerHTML = `
      <div class="flex flex-col items-center justify-center border-r ${isImminent ? 'border-danger-rose/20' : 'border-white/10'} pr-4 min-w-[70px]">
        <span class="font-mono-data text-sm ${isImminent ? 'text-danger-rose font-bold' : 'text-on-surface-variant'}">${news.time}</span>
        ${relativeTime ? `<span class="text-[10px] ${isImminent ? 'text-danger-rose/70' : 'text-on-surface-variant'} mt-0.5">${relativeTime}</span>` : ''}
      </div>
      <div class="flex-1 flex justify-between items-start">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="px-2 py-0.5 rounded-sm bg-surface-container-highest font-mono-data text-[11px] text-on-surface border border-white/10">${news.country}</span>
            <span class="w-2 h-2 rounded-full ${isImminent ? 'bg-danger-rose animate-pulse' : 'bg-danger-rose'}"></span>
          </div>
          <p class="text-sm ${isImminent ? 'text-on-surface font-medium' : 'text-on-surface-variant'} leading-tight">${news.title}</p>
        </div>
        <span class="material-symbols-outlined text-[16px] text-on-surface-variant hover:text-primary cursor-pointer mt-1 ml-3 flex-shrink-0">notifications</span>
      </div>`;
    container.appendChild(row);
  });
}

function isNewsImminent(news, now) {
  try {
    // Parse time format like "8:30am" EST → compare to now
    const timeStr = news.time?.toString().toLowerCase();
    if (!timeStr || timeStr === 'all day' || timeStr === 'tentative') return false;
    const match = timeStr.match(/(\d+):(\d+)(am|pm)/);
    if (!match) return false;
    let h = parseInt(match[1]);
    const min = parseInt(match[2]);
    if (match[3] === 'pm' && h < 12) h += 12;
    if (match[3] === 'am' && h === 12) h = 0;
    // EST is UTC-5
    const dateStr = news.date?.toString();
    if (!dateStr) return false;
    const [m, d, y] = dateStr.split('-');
    const eventUTC = new Date(`${y}-${m}-${d}T${String(h).padStart(2,'0')}:${String(min).padStart(2,'0')}:00-05:00`);
    const diffMin = (eventUTC - now) / 60000;
    return Math.abs(diffMin) <= 60;
  } catch { return false; }
}

function getRelativeTime(news, now) {
  try {
    const timeStr = news.time?.toString().toLowerCase();
    if (!timeStr || timeStr === 'all day' || timeStr === 'tentative') return '';
    const match = timeStr.match(/(\d+):(\d+)(am|pm)/);
    if (!match) return '';
    let h = parseInt(match[1]);
    const min = parseInt(match[2]);
    if (match[3] === 'pm' && h < 12) h += 12;
    if (match[3] === 'am' && h === 12) h = 0;
    const dateStr = news.date?.toString();
    if (!dateStr) return '';
    const [m, d, y] = dateStr.split('-');
    const eventUTC = new Date(`${y}-${m}-${d}T${String(h).padStart(2,'0')}:${String(min).padStart(2,'0')}:00-05:00`);
    const diffMin = Math.round((eventUTC - now) / 60000);
    if (diffMin > 0 && diffMin <= 120) return `En ${diffMin} min`;
    if (diffMin < 0 && diffMin >= -60) return `Hace ${Math.abs(diffMin)} min`;
    return '';
  } catch { return ''; }
}

// ─── Render Sentiment ─────────────────────────────────────────────────────────
function renderSentiment(dangerCurrencies) {
  const container = document.getElementById('sentiment-bars');
  if (!container) return;

  // Build sentiment from danger currencies (simple heuristic)
  const currencies = ['EUR', 'USD', 'GBP', 'JPY', 'AUD', 'CHF'];
  container.innerHTML = '';

  currencies.forEach(cur => {
    const isAffected = dangerCurrencies.includes(cur);
    // Generate pseudo-sentiment based on name hash
    const seed = cur.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const bullish = isAffected
      ? 20 + (seed % 20)
      : 45 + (seed % 35);
    const bearish = 100 - bullish;

    const row = document.createElement('div');
    row.className = 'flex items-center gap-4';
    row.innerHTML = `
      <div class="w-10 font-mono-data text-sm text-on-surface">${cur}</div>
      <div class="flex-1 h-2.5 bg-surface-container-highest rounded-full overflow-hidden flex">
        <div class="bg-success-emerald h-full sentiment-bar" style="width:${bullish}%"></div>
        <div class="bg-danger-rose h-full sentiment-bar" style="width:${bearish}%"></div>
      </div>
      <div class="w-10 text-right font-mono-data text-sm ${bullish >= 50 ? 'text-success-emerald' : 'text-danger-rose'}">${bullish}%</div>`;
    container.appendChild(row);
  });

  // Header labels
  const header = document.querySelector('#sentiment-section .flex.justify-between');
  if (!header) {
    const h = document.createElement('div');
    h.className = 'flex justify-between px-14 text-[10px] font-bold tracking-wider text-on-surface-variant mb-2 uppercase';
    h.innerHTML = `<span class="text-success-emerald">Alcista</span><span class="text-danger-rose">Bajista</span>`;
    container.parentElement.insertBefore(h, container);
  }
}

// ─── Manual refresh button ─────────────────────────────────────────────────────
document.getElementById('btn-refresh')?.addEventListener('click', () => {
  refreshCountdown = 0;
});

// ─── Init ─────────────────────────────────────────────────────────────────────
function init() {
  setInterval(updateClocks, 1000);
  updateClocks();
  fetchNewsData();
}

document.addEventListener('DOMContentLoaded', init);
