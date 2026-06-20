# TradingK Web

Frontend operativo read-only de TradingK. La versión vigente vive en `TradingK-clean-v1` y consume snapshots JSON generados por la capa DevOps.

## Arquitectura

```text
Atlas / n8n / SQLite
        ->
snapshots JSON
        ->
Render Static Site / Dashboard
```

Render no se conecta directamente a SQLite. La separación funcional es:

```text
Signals   = señales detectadas por bots.
Journal   = operaciones realmente tomadas.
Analytics = resultados finales confiables.
Dashboard = vista rápida del sistema, noticias y últimas señales.
```

No se publican precios, trades, métricas ni señales mock como datos reales.

## Desarrollo local

```bash
cd TradingK-clean-v1
npm ci
npm run dev
```

La app local queda disponible en `http://localhost:3002`.

Validaciones requeridas:

```bash
npm run typecheck
npm run lint
npm run build
```

## Render Static Site

```text
Root Directory: TradingK-clean-v1
Build Command: npm ci && npm run build
Publish Directory: out
```

El proyecto usa export estático de Next.js. No usar `next start` en producción.

Deploy de revisión: https://dashboard-trading-1.onrender.com/

## Snapshots

Los snapshots productivos se sirven desde `TradingK-clean-v1/public/data/`:

```text
signals_recent.json
signals_board.json
journal_trades.json
system_status.json
analytics_summary.json
watchlist_groups.json
playbook_strategies.json
```

Los ejemplos de contrato están en `TradingK-clean-v1/docs/examples/` y no son consumidos por la aplicación.

Documentación principal:

- `TradingK-clean-v1/docs/web_data_contract_v1.md`
- `TradingK-clean-v1/docs/web_framework_mvp_plan.md`
- `TradingK-clean-v1/docs/web_signals_page_v1.md`
- `TradingK-clean-v1/docs/frontend_qa_corrective_report.md`
