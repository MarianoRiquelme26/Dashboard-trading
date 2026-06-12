# Signals Page v1

## Objetivo

Signals es el tablero principal de oportunidades detectadas por bots y enviadas por Telegram. No es Journal y no debe mostrar resultados de operaciones salvo que exista un trade vinculado real.

## Fuente

La pagina lee:

```text
public/data/signals_board.json
```

Si el snapshot falta, esta vacio, no parsea o esta vencido, la UI muestra `ERROR`, `EMPTY` o `STALE`.

## Columnas

- Hora senal
- Bot
- Estrategia
- Simbolo
- TF
- Direccion
- Score
- Entrada
- SL
- TP
- Telegram
- Estado
- Trade
- Accion preparada por seleccion de fila

## Tabs

- Todas
- Pendientes
- Tomadas
- Descartadas
- Vencidas
- Sin vincular

## Filtros

La UI deja preparados filtros por estrategia, bot, simbolo, timeframe, direccion, score, Telegram enviado, fecha y estado. En fase 1 quedan deshabilitados hasta que el snapshot declare opciones y persistencia real.

## Drawer de detalle

Al seleccionar una senal, el detalle muestra:

- Telegram original (`raw_telegram_text`) como evidencia.
- Plan sugerido desde `entries`.
- Condiciones tecnicas agrupadas por contexto, disparo, ejecucion, riesgo y warnings.
- Vinculacion con trade.
- Debug payload colapsado por defecto.

## Estados de senal

La UI espera estos grupos:

```text
signal_status:
detected, validated, invalidated, duplicate, error

operation_status:
pending, taken, discarded, missed, expired, linked, unlinked, ambiguous

result_status:
none, open, closed, unknown
```

## Vinculacion con trade

Signals puede mostrar `linked_trade_id` o `signal_event_id` cuando venga del snapshot. No calcula win/loss ni resultado final desde una senal. El resultado pertenece a `Journal`/`Analytics` y depende de trades reales.
