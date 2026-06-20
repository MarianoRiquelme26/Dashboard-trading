# TradingK Clean v1 - Corrective Frontend QA Report

## Hallazgos iniciales

- `types/snapshots.ts` mantenia `SnapshotRecord` y `Record<string, unknown>` como contrato dominante, lo que ocultaba errores de campo frente a los snapshots reales esperados por DevOps.
- `useSnapshot()` solo validaba `schema_version`, `items` y `source_status`; no habia validacion minima especifica por snapshot ni refetch/stale check periodico.
- `DataState` trataba `STALE` como estado terminal y ocultaba datos disponibles, contrario al comportamiento requerido.
- Las horas visibles se formateaban en UTC o quedaban como ISO crudo en varias tablas/cards; faltaba salida operativa en `America/Argentina/Buenos_Aires` con sufijo `ARG`.
- Signals usaba aliases no normalizados (`signal_time_utc`, `strategy`, `timeframe`, `score`, `entry`, `sl`, `tp`, `rr`, `ema_protected`) en vez del contrato final (`bar_close_time_*`, `strategy_name`, `timeframe_signal`, `score_total`, `entry_price`, `sl_price`, `tp_price`, `risk_reward`, `sl_protected_by_emas`).
- `conditions` estaba tratado como objeto agrupado; el contrato real lo define como array de `SignalCondition`.
- Los tabs de Signals no tenian contadores y `Sin vincular` dependia de estado operativo, no de `linked_trade == null`.
- Los filtros de Signals estaban deshabilitados y no filtraban client-side.
- La navegacion desde Dashboard a Signals filtraba por `event_id`, pero no seleccionaba automaticamente la senal ni mostraba chip/boton para quitar el filtro.
- Dashboard mostraba el banner de snapshots como si `system_status` fuera estado global; faltaba separar `signals_recent` y `system_status`.
- Journal, Watchlist y Recent Signals usaban aliases viejos o campos genericos (`strategy`, `name`, `description`, etc.) en lugar de contratos normalizados.
- `package.json` conservaba `next start`, no tenia `typecheck` ni `preview`, y la metadata heredada no correspondia a TradingK Clean v1.
- El responsive dependia de margen fijo de sidebar (`ml-64`) incluso en mobile, generando riesgo de viewport inutilizable.

## Correcciones realizadas

- Se reemplazo el contrato generico por tipos especificos para `signals_board`, `signals_recent`, `journal_trades`, `system_status`, `analytics_summary`, `watchlist_groups` y `playbook_strategies`.
- `system_status.json` quedo con envoltorio consistente y `items: []`.
- `useSnapshot()` ahora soporta validacion por snapshot, refetch y recalculo periodico de `STALE`.
- `STALE` quedo como warning no terminal: muestra aviso y conserva el contenido disponible.
- Los horarios visibles se formatean en `America/Argentina/Buenos_Aires` con sufijo `ARG`.
- Dashboard separa estado de `signals_recent` y `system_status`, y las filas de Recent Signals navegan a Signals con filtro por `event_id`.
- Signals usa campos normalizados, tabs con contadores, filtros client-side, chip para quitar filtro `event_id`, detalle autoseleccionado, paneles de entradas, condiciones, trade vinculado, Telegram y debug.
- Journal muestra solo operaciones tomadas con campos normalizados, sin inventar metricas de performance.
- Analytics se mantiene bloqueado honestamente hasta datos confiables de `trade_results`.
- Watchlist muestra grupos y simbolos desde contrato normalizado, sin CRUD ni precios ficticios.
- Playbook conserva estado `PARTIAL` y agrega reglas operativas solicitadas para SixJetSet, SimpleFlow y Pendulo.
- Se ajusto responsive de sidebar/main para 375, 768 y 1440 px.
- Tooling actualizado: `dev`, `build`, `typecheck`, `lint`, `preview`; se retiro `next start`.
- Se agregaron ejemplos versionados en `docs/examples/` y se actualizo la documentacion de contrato y Signals.
- Observacion fuera de alcance registrada en `C:\ChatGPT-Cosas\Github\TradingK-Framework\TradingK-Framework\docs\framework_v2_backlog.md`: automatizar smoke visual V2 contra Render/fixtures.

## Validaciones

- `npm ci`: OK. Se conservan warnings/vulnerabilidades heredadas de dependencias existentes.
- `npm run typecheck`: OK.
- `npm run lint`: OK.
- `npm run build`: OK. Build estatico generado correctamente.
- Smoke local limpio en `http://localhost:3002`: Dashboard, Signals, Journal y Watchlist sin errores de consola.
- QA visual con Playwright/Chrome:
  - EMPTY: Dashboard y Journal en 1440, 768 y 375 px.
  - REAL con fixtures: Dashboard, Signals, filtro por `event_id`, detalle de señal y Journal.
  - STALE con fixtures: warning visible y contenido disponible preservado.
  - ERROR con fixture forzada: Signals muestra estado terminal. Los unicos errores de consola en esa prueba fueron los `500` esperados por la simulacion.
- Capturas generadas en `docs/qa-captures/`:
  - `dashboard-empty-1440.png`
  - `dashboard-empty-768.png`
  - `dashboard-empty-375.png`
  - `journal-empty-1440.png`
  - `journal-empty-768.png`
  - `journal-empty-375.png`
  - `dashboard-real-1440.png`
  - `signals-filtered-event-1440.png`
  - `signals-real-1440.png`
  - `signal-detail-real-1440.png`
  - `journal-real-1440.png`
  - `dashboard-stale-1440.png`
  - `signals-error-1440.png`

## Limitaciones pendientes

- No se realizo deploy en esta tarea. El smoke contra `https://dashboard-trading-1.onrender.com/` debe repetirse despues del deploy de esta version.
- La prueba ERROR usa una respuesta `500` interceptada localmente para validar el estado terminal; no representa falla real del backend.
- Las capturas REAL usan fixtures controladas desde `docs/examples/` y no se copiaron a `public/data`, para mantener `public/data` como snapshots de produccion/local reales.

## Verificación posterior en Render - 2026-06-19

- Deploy verificado en `https://dashboard-trading-1.onrender.com/`: HTTP 200 y aplicación `TradingK-clean-v1` visible.
- Dashboard, Signals, Journal, Analytics, Watchlist y Playbook navegables en el deploy publicado.
- Consola sin errores ni warnings durante el recorrido de las vistas.
- Los siete snapshots públicos responden HTTP 200: `signals_recent`, `signals_board`, `journal_trades`, `system_status`, `analytics_summary`, `watchlist_groups` y `playbook_strategies`.
- Desktop 1440 px: sidebar y contenido sin solapamiento.
- Tablet 768 px: layout sin overflow horizontal del documento.
- Mobile 375 px: sidebar oculta, header móvil visible, selector de navegación funcional y documento sin overflow horizontal.
- Los estados EMPTY se muestran de forma controlada y sin datos financieros inventados.
