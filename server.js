require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { XMLParser } = require('fast-xml-parser');
const path = require('path');
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');
const moment = require('moment-timezone');

const app = express();
app.use(cors());

// ─── 1. Dependencias que se usan en fetchNews (deben declararse primero) ───────
// IMPORTANTE: fetch y parser deben estar definidos ANTES de fetchNews
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const parser = new XMLParser({ ignoreAttributes: false, cdataPropName: '__cdata' });

// ─── 2. Telegram Bot ───────────────────────────────────────────────────────────
const token = process.env.TELEGRAM_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
let bot = null;
if (token && chatId) {
  bot = new TelegramBot(token, { polling: false });
  console.log('[Telegram] Bot configurado correctamente.');
} else {
  console.warn('[Telegram] Token o ChatID no configurados. Modo mock activado.');
}

function sendTelegramMessage(message) {
  if (bot && chatId) {
    bot.sendMessage(chatId, message).catch(err => console.error('Telegram Error:', err.message));
  } else {
    console.log('[Telegram Mock]', message);
  }
}

// ─── 3. Cargar configuración de grupos ────────────────────────────────────────
let GROUPS = {};
try {
  GROUPS = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
  console.log('[Config] Grupos cargados:', Object.keys(GROUPS).join(', '));
} catch (e) {
  console.error('[Config] Error cargando config.json:', e.message);
  GROUPS = { 'Principal': { 'XAUUSD': ['USD'] } };
}

// ─── 4. Estado interno ────────────────────────────────────────────────────────
const DANGER_WINDOW_MINUTES = 60;
const EVAL_INTERVAL_MINUTES = 5;
let instrumentState = {};
let latestNews = [];
let lastEvalTime = null;
let frontendState = {
  lastUpdate: null,
  groups: GROUPS,
  dangerCurrencies: [],
  todayNews: [],
  nextEvalIn: null,
  error: null
};

// ─── 5. Función para parsear tiempo de eventos ────────────────────────────────
function parseEventTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null;
  const t = typeof timeStr === 'string' ? timeStr.toLowerCase() : '';
  if (t === 'all day' || t === 'tentative') return null;
  try {
    const format = 'MM-DD-YYYY h:mma';
    const estTime = moment.tz(`${dateStr} ${timeStr}`, format, 'America/New_York');
    return estTime.isValid() ? estTime.toDate() : null;
  } catch (e) {
    return null;
  }
}

// ─── 6. Función principal: obtener noticias de ForexFactory ───────────────────
async function fetchNews(retries = 3) {
  const url = 'https://nfs.faireconomy.media/ff_calendar_thisweek.xml';
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`[API] Fetching ForexFactory (intento ${i + 1}/${retries})...`);
      const response = await fetch(url, {
        signal: AbortSignal.timeout(15000),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/xml, application/xml, */*'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      }

      const xmlData = await response.text();
      console.log(`[API] XML recibido: ${xmlData.length} bytes`);

      const jsonObj = parser.parse(xmlData);

      // Soporte para diferentes estructuras del XML parseado
      let events = jsonObj?.weeklyevents?.event || [];
      if (!Array.isArray(events)) {
        events = [events]; // Si hay un solo evento, fast-xml-parser lo devuelve como objeto
      }

      // Normalizar campos CDATA si aplica
      events = events.map(e => ({
        title:   e.title?.__cdata   ?? e.title   ?? '',
        country: e.country?.__cdata ?? e.country ?? '',
        date:    e.date?.__cdata    ?? e.date    ?? '',
        time:    e.time?.__cdata    ?? e.time    ?? '',
        impact:  e.impact?.__cdata  ?? e.impact  ?? '',
        forecast: e.forecast?.__cdata ?? e.forecast ?? '',
        previous: e.previous?.__cdata ?? e.previous ?? '',
        url:     e.url?.__cdata     ?? e.url     ?? ''
      }));

      console.log(`[API] Eventos totales: ${events.length}, Alto impacto: ${events.filter(e => e.impact === 'High').length}`);
      return events;

    } catch (error) {
      console.error(`[API] Error intento ${i + 1}/${retries}:`, error.message);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
  }
  return null; // Todos los intentos fallaron
}

// ─── 7. Evaluación principal del estado ───────────────────────────────────────
async function evaluateState() {
  console.log(`[Eval] Iniciando evaluación... (${new Date().toISOString()})`);

  const events = await fetchNews();

  if (!events) {
    const errMsg = 'No se pudieron obtener noticias de ForexFactory. Revisá la conexión.';
    console.error('[Eval]', errMsg);
    frontendState = {
      ...frontendState,
      lastUpdate: new Date().toISOString(),
      error: errMsg
    };

    // Si no hay cache, reintenta en 1 minuto
    if (latestNews.length === 0) {
      console.log('[Eval] Sin cache. Reintentando en 60 segundos...');
      setTimeout(evaluateState, 60000);
    }
    return;
  }

  latestNews = events;
  const now = new Date();

  // Filtrar noticias de Alto Impacto de HOY
  const todayNews = events.filter(event => {
    if (event.impact !== 'High') return false;
    const eventTime = parseEventTime(event.date, event.time);
    if (!eventTime) return false;
    return (
      eventTime.getDate() === now.getDate() &&
      eventTime.getMonth() === now.getMonth() &&
      eventTime.getFullYear() === now.getFullYear()
    );
  });

  todayNews.sort((a, b) => parseEventTime(a.date, a.time) - parseEventTime(b.date, b.time));
  console.log(`[Eval] Noticias de alto impacto HOY: ${todayNews.length}`);

  // Identificar monedas en PELIGRO ahora mismo
  const dangerCurrencies = new Set();
  todayNews.forEach(news => {
    const eventTime = parseEventTime(news.date, news.time);
    if (!eventTime) return;
    const diffMinutes = (eventTime - now) / (1000 * 60);
    if (Math.abs(diffMinutes) <= DANGER_WINDOW_MINUTES) {
      dangerCurrencies.add(news.country);
    }
  });

  // Evaluar cada instrumento y disparar alertas Telegram si cambia estado
  Object.entries(GROUPS).forEach(([groupName, instruments]) => {
    Object.entries(instruments).forEach(([name, currencies]) => {
      const isDanger = currencies.some(c => dangerCurrencies.has(c));
      const newState = isDanger ? 'NO OPERAR' : 'SEGURO';
      const prevState = instrumentState[name];

      if (prevState && prevState !== newState) {
        if (newState === 'NO OPERAR') {
          const causes = todayNews.filter(n =>
            currencies.includes(n.country) &&
            Math.abs((parseEventTime(n.date, n.time) - now) / 60000) <= DANGER_WINDOW_MINUTES
          );
          const causeString = [...new Set(causes.map(c => c.country))].join(', ');
          sendTelegramMessage(`🔴 [ALERTA] ${name} ha entrado en ventana de riesgo por noticia de alto impacto (${causeString}).`);
        } else {
          sendTelegramMessage(`🟢 [LIBRE] ${name} ya es operativo. Ventana de volatilidad finalizada.`);
        }
      }
      instrumentState[name] = newState;
    });
  });

  lastEvalTime = new Date();
  frontendState = {
    lastUpdate: lastEvalTime.toISOString(),
    groups: GROUPS,
    dangerCurrencies: Array.from(dangerCurrencies),
    todayNews: todayNews,
    nextEvalIn: EVAL_INTERVAL_MINUTES * 60,
    error: null
  };

  console.log(`[Eval] Estado actualizado. Monedas en peligro: [${Array.from(dangerCurrencies).join(', ') || 'ninguna'}]`);
}

// ─── 8. Reporte diario 09:00 ART ──────────────────────────────────────────────
cron.schedule('0 9 * * *', async () => {
  console.log('[Cron] Generando reporte diario...');
  const events = await fetchNews();
  if (!events) return;

  const now = new Date();
  const todayNews = events.filter(event => {
    if (event.impact !== 'High') return false;
    const eventTime = parseEventTime(event.date, event.time);
    if (!eventTime) return false;
    return (
      eventTime.getDate() === now.getDate() &&
      eventTime.getMonth() === now.getMonth() &&
      eventTime.getFullYear() === now.getFullYear()
    );
  });

  if (todayNews.length === 0) {
    sendTelegramMessage('📋 Resumen de Operatividad Diaria:\nHoy NO hay noticias de alto impacto. Todos los instrumentos son "Safe". ¡Buen trading!');
    return;
  }

  const affectedCurrencies = new Set(todayNews.map(n => n.country));
  let riskInstruments = [];
  let safeInstruments = [];

  Object.entries(GROUPS).forEach(([groupName, instruments]) => {
    Object.entries(instruments).forEach(([name, currencies]) => {
      const isAffectedToday = currencies.some(c => affectedCurrencies.has(c));
      if (isAffectedToday) {
        const times = todayNews
          .filter(n => currencies.includes(n.country))
          .map(n => {
            const d = parseEventTime(n.date, n.time);
            return d ? moment(d).tz('America/Argentina/Buenos_Aires').format('HH:mm') : n.time;
          });
        const uniqueTimes = [...new Set(times)].join(', ');
        riskInstruments.push(`- ${name}: ${uniqueTimes} hs`);
      } else {
        safeInstruments.push(`- ${name}`);
      }
    });
  });

  let message = `📋 Resumen de Operatividad Diaria:\n\n`;
  message += `⚠️ Instrumentos con riesgo hoy (Horas críticas ART):\n`;
  message += riskInstruments.length ? riskInstruments.join('\n') : 'Ninguno';
  message += `\n\n✅ Instrumentos "Safe" para la sesión:\n`;
  message += safeInstruments.length ? safeInstruments.join('\n') : 'Ninguno';

  sendTelegramMessage(message);
}, { timezone: 'America/Argentina/Buenos_Aires' });

// ─── 9. Cron cada 5 minutos ───────────────────────────────────────────────────
cron.schedule('*/5 * * * *', () => {
  console.log(`[Cron] Evaluando estado (${new Date().toISOString()})...`);
  evaluateState();
});

// ─── 10. Endpoints de la API ──────────────────────────────────────────────────

// Devuelve el estado actual con countdown real hasta la próxima evaluación
app.get('/api/state', (req, res) => {
  const now = new Date();
  let nextEvalIn = EVAL_INTERVAL_MINUTES * 60; // default
  if (lastEvalTime) {
    const elapsed = Math.floor((now - lastEvalTime) / 1000);
    nextEvalIn = Math.max(0, EVAL_INTERVAL_MINUTES * 60 - elapsed);
  }
  res.json({ ...frontendState, nextEvalIn });
});

// Devuelve la configuración de grupos e instrumentos para el frontend
app.get('/api/config', (req, res) => {
  // Construye la lista de instrumentos con metadatos para el dashboard
  const instruments = [];
  Object.entries(GROUPS).forEach(([groupName, groupInstruments]) => {
    Object.entries(groupInstruments).forEach(([ticker, currencies]) => {
      instruments.push({ ticker, groupName, currencies });
    });
  });
  res.json({ groups: GROUPS, instruments });
});

// Endpoint de diagnóstico (útil para debuggear)
app.get('/api/debug', async (req, res) => {
  try {
    const events = await fetchNews(1); // 1 intento solo
    res.json({
      apiReachable: events !== null,
      eventCount: events ? events.length : 0,
      highImpactCount: events ? events.filter(e => e.impact === 'High').length : 0,
      sample: events ? events.filter(e => e.impact === 'High').slice(0, 3) : [],
      frontendStateSummary: {
        lastUpdate: frontendState.lastUpdate,
        todayNewsCount: frontendState.todayNews.length,
        dangerCurrencies: frontendState.dangerCurrencies,
        error: frontendState.error
      }
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── 11. Archivos estáticos (build de producción Next.js export) ──────────────
app.use(express.static(path.join(__dirname, 'out')));

// Catch-all: para rutas de Next.js static export, sirve index.html
app.get('/{*path}', (req, res) => {
  const indexPath = path.join(__dirname, 'out', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(503).json({ error: 'Frontend no compilado. Ejecuta npm run build.' });
  }
});

// ─── 12. Arrancar servidor y hacer evaluación inicial ─────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`[Server] Corriendo en puerto ${PORT}`);
  // Evaluación inicial al arrancar (con await para que los datos estén listos)
  await evaluateState();
  console.log('[Server] Evaluación inicial completada. Sistema listo.');
});
