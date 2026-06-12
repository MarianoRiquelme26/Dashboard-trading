# TradingK Web Data Contract v1

## Arquitectura

La web no se conecta directo a SQLite Atlas. La arquitectura aprobada es:

```text
Atlas / n8n / SQLite
        ->
snapshots JSON
        ->
Render / Dashboard
```

Render solo debe leer archivos publicados en `public/data`. Cualquier integracion directa Render -> SQLite queda prohibida para esta fase.

## Estado de fuente

Cada seccion debe mostrar un badge visible con uno de estos estados:

```ts
export type DataSourceStatus =
  | "REAL"
  | "PARTIAL"
  | "MOCK"
  | "EMPTY"
  | "ERROR"
  | "STALE"
```

- `REAL`: snapshot valido generado desde fuente real.
- `PARTIAL`: dato real pero incompleto.
- `MOCK`: dato placeholder o de diseno. Debe ser imposible de confundir con real.
- `EMPTY`: fuente real o pendiente, sin registros.
- `ERROR`: no se pudo cargar o parsear.
- `STALE`: snapshot viejo segun `stale_after_seconds`.

## Estructura minima

Cada snapshot debe incluir como minimo:

```json
{
  "schema_version": "string",
  "generated_at_utc": "string | null",
  "source_status": "REAL | PARTIAL | MOCK | EMPTY | ERROR | STALE",
  "source_name": "string opcional",
  "stale_after_seconds": 900,
  "error_message": null,
  "items": []
}
```

Si `generated_at_utc` es `null`, la UI no debe marcar el dato como `REAL`.

## Regla de stale

La UI calcula `STALE` cuando:

```text
now - generated_at_utc > stale_after_seconds
```

Si el JSON no existe, no parsea, no tiene `schema_version`, no tiene `items`, o usa un `source_status` desconocido, la UI muestra `ERROR`.

## Snapshots esperados

- `public/data/signals_recent.json`
- `public/data/signals_board.json`
- `public/data/journal_trades.json`
- `public/data/system_status.json`
- `public/data/analytics_summary.json`
- `public/data/watchlist_groups.json`
- `public/data/playbook_strategies.json`
