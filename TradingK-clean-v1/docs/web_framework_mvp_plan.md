# TradingK Web Framework MVP Plan

## Orden de implementacion

1. DataStatus global.
2. Signals.
3. Dashboard con Recent Signals y System Status.
4. Journal EMPTY/real.
5. Analytics bloqueado.
6. Watchlist JSON sin CRUD falso.
7. Playbook real.

## Principios de fase 1

- Claridad operativa sobre estetica.
- No inventar trades, win rate, profit factor, net profit, equity curve, spreads, tendencias ni rankings.
- Separar estrictamente `Signals`, `Journal` y `Analytics`.
- Mostrar estados honestos: `EMPTY`, `ERROR` o `STALE` cuando corresponda.
- Mantener la web preparada para snapshots futuros sin fingir datos actuales.

## Separacion conceptual

```text
Signals = inventario real de senales generadas por bots.
Journal = solo operaciones tomadas.
Analytics = solo resultados reales; bloqueado hasta trade_results.
Dashboard = vista rapida: noticias, sistema, ultimas senales.
```
