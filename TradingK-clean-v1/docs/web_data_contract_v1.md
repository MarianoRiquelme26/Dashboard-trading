# TradingK Web Data Contract v1

## Arquitectura

La web es read-only y no se conecta directo a SQLite Atlas:

```text
Atlas / n8n / SQLite
        ->
snapshots JSON
        ->
Render Static Site / Dashboard
```

Render publica la app como Static Site. Los archivos productivos viven en `public/data`; los ejemplos de QA viven en `docs/examples` y no son consumidos por producción.

## Envelope común

Todos los snapshots deben cumplir:

```ts
{
  schema_version: string
  generated_at_utc: string | null
  source_status: "REAL" | "PARTIAL" | "MOCK" | "EMPTY" | "ERROR" | "STALE"
  source_name?: string
  stale_after_seconds?: number
  error_message?: string | null
  items: unknown[]
}
```

`STALE` se calcula en frontend cuando `now - generated_at_utc > stale_after_seconds`. Si el snapshot está vencido pero contiene datos, la UI muestra warning STALE y conserva los últimos datos disponibles.

## Estados

- `REAL`: snapshot válido desde fuente real.
- `PARTIAL`: dato real incompleto.
- `MOCK`: placeholder visible como mock; no usar para producción.
- `EMPTY`: fuente real o pendiente sin registros.
- `ERROR`: fetch, parse o validación falló.
- `STALE`: snapshot vencido.

## Snapshots

### `signals_recent.json`

Propósito: resumen compacto de señales recientes para Dashboard. Origen: generador de snapshots desde `bot_signals`. Frecuencia sugerida: 1-5 min. `stale_after_seconds`: 900.

Campos requeridos por item: `event_id`, `bar_close_time_utc`, `bot_name`, `strategy_name`, `symbol`, `timeframe_signal`, `direction`, `signal_status`, `telegram_sent`.

Campos opcionales: `bar_close_time_local`, `score_total`, `score_label`, `operation_status`, `linked_trade`, `primary_entry`.

Ejemplo: `docs/examples/signals_recent.example.json`.

### `signals_board.json`

Propósito: tablero operativo de señales detectadas por bots. Origen: `bot_signals`, `signal_entries`, `signal_conditions` y vínculo opcional con trades. Frecuencia sugerida: 1-5 min. `stale_after_seconds`: 900.

Campos requeridos por item: `event_id`, `created_at_utc`, `bar_close_time_utc`, `platform`, `environment`, `bot_name`, `symbol`, `timeframe_signal`, `strategy_name`, `direction`, `signal_status`, `telegram_sent`, `entries`, `conditions`.

Campos opcionales: `bar_close_time_local`, `asset_class`, `strategy_family`, `strategy_variant`, `setup_type`, `score_total`, `score_label`, `operation_status`, `result_status`, `raw_telegram_text`, `linked_trade`, `warnings`, `raw_payload_json`.

Ejemplo: `docs/examples/signals_board.example.json`.

### `journal_trades.json`

Propósito: operaciones ejecutadas. No contiene inventario de oportunidades. Origen futuro: `trade_ingest_v1`. Frecuencia sugerida: 5-15 min. `stale_after_seconds`: 3600.

Campos requeridos por item: `trade_id`, `platform`, `environment`, `symbol`, `direction`, `entry_time_utc`, `entry_price`, `trade_status`.

Campos opcionales: `strategy_name`, `initial_sl_price`, `initial_tp_price`, `linked_signal`, `signal_plan`, `execution_delta`, `result`, `review`.

Ejemplo: `docs/examples/journal_trades.example.json`.

### `system_status.json`

Propósito: salud de n8n, SQLite y snapshot generator. Origen: tablas/logs operativos. Frecuencia sugerida: 1-5 min. `stale_after_seconds`: 900.

Campos requeridos: `overall_status`, `services`, `recent_errors`, `items: []`.

Servicios requeridos cuando existan datos reales: `n8n`, `sqlite`, `snapshot_generator`, cada uno con `name`, `status`, fechas `last_seen_utc`/`last_insert_utc`/`last_generated_utc` y `message`.

Ejemplo: `docs/examples/system_status.example.json`.

### `analytics_summary.json`

Propósito: resumen de resultados finales. Origen futuro: `trade_result_ingest_v1`. Estado actual: bloqueado hasta `trade_results` confiables. Frecuencia sugerida: 15-60 min. `stale_after_seconds`: 3600.

Campos requeridos: envelope común. Campos opcionales: `blocked_reason`, `trade_results_available`.

### `watchlist_groups.json`

Propósito: configuración read-only de grupos de watchlist. Origen: snapshot de configuración. Frecuencia sugerida: 15-60 min. `stale_after_seconds`: 3600.

Campos requeridos por item: `group_id`, `group_name`, `asset_symbols`, `is_active`.

Campos opcionales: `news_currencies`, `correlation_theme`, `priority`, `notes`.

Ejemplo: `docs/examples/watchlist_groups.example.json`.

### `playbook_strategies.json`

Propósito: reglas base TradingK visibles para consulta. Origen actual: seed parcial. Frecuencia sugerida: manual hasta fuente oficial. `stale_after_seconds`: 86400.

Campos requeridos por item: `strategy_id`, `name`, `rules`. Cada regla usa `section` y `description`.

Debe mantenerse `source_status = PARTIAL` hasta que el Playbook esté versionado y validado como fuente oficial.

## EMPTY, ERROR y STALE

- `EMPTY`: usar `items: []`, `error_message: null`, `generated_at_utc: null` cuando todavía no hay fuente activa.
- `ERROR`: conservar envelope si se puede y completar `error_message`; si el fetch/parse falla, la UI muestra error.
- `STALE`: no debe ocultar datos válidos. Debe mostrar warning y renderizar últimos datos.
