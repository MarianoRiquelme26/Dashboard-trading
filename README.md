# ScalpingFilter — Terminal de Instrumentos

[![Node.js](https://img.shields.io/badge/Node.js-22-green)](https://nodejs.org)
[![Vite](https://img.shields.io/badge/Vite-8-purple)](https://vitejs.dev)
[![License](https://img.shields.io/badge/license-ISC-blue)](#)

Dashboard web en tiempo real para traders que necesitan saber **cuándo es seguro operar** cada instrumento, basándose en el calendario económico de alto impacto de ForexFactory.

![Dashboard](https://raw.githubusercontent.com/placeholder/scalpingfilter/main/preview.png)

---

## ¿Qué hace?

ScalpingFilter monitorea el [calendario económico de ForexFactory](https://www.forexfactory.com/calendar) y determina automáticamente el estado de operatividad de cada instrumento según las noticias de alto impacto del día.

### Lógica principal
- Cada **5 minutos** consulta el XML de ForexFactory (`ff_calendar_thisweek.xml`)
- Filtra los eventos de **Alto Impacto** del día
- Define una **ventana de riesgo de ±60 minutos** alrededor de cada noticia
- Si alguna moneda del instrumento está en esa ventana → **NO OPERAR** (alerta roja)
- Si no hay noticias activas → **SEGURO** (verde)
- Envía alertas automáticas por **Telegram** cuando el estado de un instrumento cambia

---

## Stack técnico

| Capa | Tecnología |
|---|---|
| Backend | Node.js + Express |
| Frontend | Vite + Vanilla JS + Tailwind CSS |
| Datos | ForexFactory XML feed (nfs.faireconomy.media) |
| Alertas | Telegram Bot API |
| Deploy | Docker / PM2 |

---

## Características actuales

- ✅ Dashboard en tiempo real con countdown de próxima actualización
- ✅ Agrupación de instrumentos por categoría (Forex, Índices, Metales, Cripto)
- ✅ Tarjetas con estado visual: SEGURO (verde) / NO OPERAR (rojo + glow animado)
- ✅ Sección de Market News con tiempo relativo ("En 13 min")
- ✅ Filtros: Ver Todos / Ocultar Afectados / Solo Seguros
- ✅ Barras de Sentiment por moneda
- ✅ Alertas Telegram automáticas al cambio de estado
- ✅ Resumen diario a las 09:00 ART por Telegram
- ✅ Configuración de instrumentos y grupos vía `config.json` (sin tocar código)
- ✅ Soporte Docker y PM2 para producción

---

## Instalación

### Requisitos
- Node.js 18+
- Una cuenta de Telegram + bot creado via `@BotFather`

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/scalpingfilter.git
cd scalpingfilter

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tu TELEGRAM_TOKEN y TELEGRAM_CHAT_ID

# 4. Levantar en modo desarrollo
npm run dev
```

El servidor corre en `http://localhost:3000` y el frontend en `http://localhost:5173`.

### Producción con PM2

```bash
npm run build
pm2 start ecosystem.config.js
```

### Producción con Docker

```bash
docker build -t scalpingfilter .
docker run -d -p 3000:3000 --env-file .env scalpingfilter
```

---

## Configuración de instrumentos

Editá `config.json` para agregar, quitar o reorganizar instrumentos sin tocar código:

```json
{
  "Forex USD": {
    "EURUSD": ["EUR", "USD"],
    "GBPUSD": ["GBP", "USD"]
  },
  "Metales & Energía": {
    "XAUUSD": ["USD"],
    "WTI":    ["USD"]
  }
}
```

Cada instrumento lista las **monedas que lo afectan**. Si cualquiera de esas monedas tiene una noticia de alto impacto, el instrumento entra en zona de riesgo.

---

## Variables de entorno

| Variable | Descripción |
|---|---|
| `TELEGRAM_TOKEN` | Token del bot de Telegram |
| `TELEGRAM_CHAT_ID` | ID del chat donde se envían las alertas |
| `PORT` | Puerto del servidor Express (default: 3000) |

---

## Endpoints API

| Endpoint | Descripción |
|---|---|
| `GET /api/state` | Estado actual de todos los instrumentos |
| `GET /api/debug` | Diagnóstico: conectividad con ForexFactory y conteo de eventos |

---

## Roadmap — Evolución planificada

### 🔜 Próximas features (v2)

- [ ] **Datos de mercado en tiempo real** — Integrar una API de precios (Twelve Data, Alpha Vantage, o broker propio) para mostrar spread real, precio actual y variación diaria en cada tarjeta
- [ ] **Volatilidad real** — Calcular ATR (Average True Range) o usar el índice de volatilidad implícita de la moneda para mostrar "Baja / Media / Alta / Extrema" con datos reales
- [ ] **Tendencia real** — Mostrar la dirección del precio (alcista/bajista) basada en EMAs o la posición del precio respecto a soportes/resistencias clave
- [ ] **Mini-chart real** — Reemplazar el sparkline decorativo actual por un chart con los últimos 30 precios de cierre de vela horaria del instrumento
- [ ] **Indicador de sesión de mercado** — Mostrar en cada tarjeta si el mercado está abierto o cerrado (calculado por zona horaria de la sesión correspondiente: Sydney / Tokyo / Londres / Nueva York)
- [ ] **Historial de alertas** — Sección "History" que registre en base de datos (SQLite) cada cambio de estado con timestamp para análisis posterior
- [ ] **Sistema de favoritos** — Permitir al usuario marcar instrumentos favoritos y guardar la preferencia en localStorage

### 🔮 Futuro (v3)

- [ ] **Multi-usuario** — Autenticación simple para que cada usuario tenga su propia configuración de instrumentos y favoritos
- [ ] **Estrategia SimpleFlow integrada** — Mostrar señales de entrada basadas en la lógica EMA + RSI + Fibonacci directamente en el dashboard
- [ ] **Backtesting rápido** — Visualizar el historial de señales del día/semana con P&L estimado
- [ ] **App móvil** — PWA (Progressive Web App) o app nativa para recibir notificaciones push además de Telegram
- [ ] **Integración con broker** — Conectar con cTrader/MT5 para ver posiciones abiertas en tiempo real y ejecutar cierre de trades desde el dashboard

---

## Preguntas frecuentes

**¿La línea (sparkline) que aparece en las tarjetas es real?**  
No, actualmente es decorativa. Está generada algorítmicamente de forma determinista a partir del nombre del instrumento. El objetivo del roadmap es reemplazarla por datos reales de precio.

**¿Se puede saber desde ForexFactory si el mercado está abierto?**  
ForexFactory no expone ese dato directamente. Se puede calcular localmente con las zonas horarias de cada sesión (Forex abre domingo 10pm UTC y cierra viernes 10pm UTC). Está planificado para v2.

**¿Dónde obtengo el spread y la volatilidad real?**  
Necesitaríamos integrar una API de datos de mercado. Las opciones viables son: Twelve Data (gratuito con límite), Alpha Vantage, o directamente el feed de un broker (MetaTrader, cTrader WebAPI).

---

## Licencia

ISC © 2026
