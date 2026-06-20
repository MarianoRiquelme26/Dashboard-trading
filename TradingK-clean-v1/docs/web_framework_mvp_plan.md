# TradingK Web Framework MVP Plan

## Orden de implementación

1. DataStatus global.
2. Signals.
3. Dashboard con Recent Signals y System Status.
4. Journal EMPTY/real.
5. Analytics bloqueado.
6. Watchlist JSON sin CRUD falso.
7. Playbook real.

## Principios de fase 1

- Claridad operativa sobre estética.
- No inventar trades, win rate, profit factor, net profit, equity curve, spreads, tendencias ni rankings.
- Separar estrictamente `Signals`, `Journal` y `Analytics`.
- Mostrar estados honestos: `EMPTY`, `ERROR` o `STALE` cuando corresponda.
- Mantener la web preparada para snapshots futuros sin fingir datos actuales.

## Separación conceptual

```text
Signals = inventario real de señales generadas por bots.
Journal = solo operaciones tomadas.
Analytics = solo resultados reales; bloqueado hasta trade_results.
Dashboard = vista rápida: noticias, sistema, últimas señales.
```

## Fuente y despliegue

La app consume exclusivamente snapshots JSON publicados junto al Static Site. Render no se conecta directamente a SQLite.

```text
Root Directory: TradingK-clean-v1
Build Command: npm ci && npm run build
Publish Directory: out
```

Los archivos productivos viven en `public/data`. Las fixtures de QA viven en `docs/examples` y no son consumidas por la app.
