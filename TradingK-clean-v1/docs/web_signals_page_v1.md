# Signals Page v1

## Objetivo

Signals es el tablero principal de oportunidades detectadas por bots y enviadas por Telegram. No es Journal y no muestra resultado final salvo vínculo real con una operación.

## Fuente

La página lee `public/data/signals_board.json`. Los ejemplos de QA viven en `docs/examples/signals_board.example.json`.

## Columnas

- Hora
- Bot
- Estrategia
- Símbolo
- TF
- Dirección
- Score
- Entrada
- SL
- TP
- Telegram
- Estado
- Trade
- Acción

La entrada principal se resuelve buscando `base_id === "base_1"`; si no existe, se usa `entries[0]`.

## Tabs

- Todas
- Pendientes: `operation_status === "pending"`
- Tomadas: `operation_status === "taken"`
- Descartadas: `operation_status === "discarded"`
- Vencidas: `operation_status === "expired"`
- Sin vincular: `linked_trade == null`

Cada tab muestra contador.

## Filtros client-side

Los filtros funcionan localmente sobre los items cargados. No requieren persistencia:

- `strategy_name`
- `bot_name`
- `symbol`
- `timeframe_signal`
- `direction`
- score mínimo
- `telegram_sent`
- `operation_status`
- fecha desde/hasta

Existe acción `Limpiar filtros`. El estado `Snapshot EMPTY` se diferencia de `Sin coincidencias`.

## Navegación desde Dashboard

`openSignal(eventId)` abre Signals, filtra por `event_id`, selecciona automáticamente la señal y muestra el detalle. La pantalla muestra chip del filtro activo y botón `Quitar filtro`. Entrar desde sidebar limpia filtros invisibles de evento.

## Detalle

El detalle muestra:

- Cabecera: `strategy_name`, `symbol`, `direction`, `timeframe_signal`, `score_total`, `operation_status`, `event_id`.
- Telegram original desde `raw_telegram_text`.
- Entries con `base_id`, `label`, `entry_price`, `sl_price`, `tp_price`, `risk_reward`, `risk_percent`, `entry_status`, protección por EMAs y detalle.
- Conditions como array agrupado por `category`: contexto, disparo, ejecución, riesgo y warnings.
- Warnings en panel propio.
- Trade vinculado: `trade_id`, `link_status`, `link_confidence`.
- Debug colapsado con prioridad a `raw_payload_json`.

No se parsea Telegram para calcular entrada, SL o TP.
