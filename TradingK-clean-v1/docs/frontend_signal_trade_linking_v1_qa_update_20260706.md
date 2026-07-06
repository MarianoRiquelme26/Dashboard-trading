# TradingK Frontend QA Update - signal_trade_linking_v1

Fecha: 2026-07-06

## Estado

La UI queda preparada para consumir `signal_trade_linking_v1` en modo read-only y cerrar el puente Signals -> Journal sin inventar datos ni ejecutar acciones manuales.

## Cambios integrados

- Nulls visibles normalizados a `N/D` en Dashboard, Signals, detalle de senal, Journal, detalle de Journal y System Status.
- Timestamps visibles en formato ARG; si hay datos visibles sin `generated_at_utc`, se muestra `Fuente real activa - timestamp no informado`.
- System Status ya no muestra `Edad snapshot: N/Ds`; muestra segundos si existen, calcula desde timestamp si aplica, o `N/D`.
- Playbook ya no muestra `Ultimo snapshot: sin generar`; queda como `Fuente parcial documentada`.
- Tipos y normalizadores ampliados para `signal_trade_links.v1`:
  - `matched_by_symbol`
  - `matched_by_direction`
  - `matched_by_time_window`
  - `matched_by_entry_distance`
  - `matched_by_strategy`
  - `matched_by_account`
  - `is_test`
  - `test_case_id`
  - `test_case_label`
- Signals muestra estado de vinculo, motivos de matching, score/confianza, test case y plan sugerido vs ejecucion real solo cuando existe link real/test.
- Journal muestra plan sugerido vs ejecucion real solo cuando existe `signal_trade_links.v1`; si no, muestra `Trade sin senal vinculada`.
- Filtros ajustados:
  - Signals: sin vincular, suggested, auto_linked, ambiguous.
  - Journal: con senal vinculada, sin senal vinculada, suggested, auto_linked, ambiguous.
- No se agregaron endpoints POST, SQLite directo, botones activos de link manual, Analytics ni metricas agregadas.

## Validacion local

Servidor probado en:

```text
http://localhost:3002
```

Vistas auditadas:

```text
Dashboard
Signals
Journal
Playbook
```

Viewports auditados:

```text
375 x 812
768 x 1024
1440 x 1000
```

Resultado:

- Sin errores de consola.
- Sin overflow horizontal del documento.
- Sin `N/Ds`.
- Sin `sin generar`.
- Sin `undefined`.
- Sin `null`.
- Sin mojibake visible en el flujo auditado.
- Sin botones manuales activos como `Vincular`, `Rechazar` o `Confirmar link`.

## Validacion Render / Snapshot API

Validacion post-correccion DevOps contra:

```text
https://dashboard-trading-1.onrender.com/
```

Resultado observado:

- Render responde HTTP 200.
- El navegador ya no muestra errores CORS.
- Sin requests fallidos hacia Snapshot API.
- El frontend publicado apunta a:

```text
https://brisant-branden-nontelephonically.ngrok-free.dev/webhook/tradingk/snapshots
```

Endpoints verificados desde navegador:

```text
/system-status-v1 -> HTTP 200
/signals-recent-v1 -> HTTP 200
```

Validacion directa con Origin `https://dashboard-trading-1.onrender.com`:

```text
OPTIONS /system-status-v1 -> HTTP 204
GET /system-status-v1 -> HTTP 200
```

Envelope `system-status-v1` observado:

```text
schema_version: system_status.v1
source_status: OK
snapshot_status: OK
items: 1
X-Snapshot-* headers: OK
```

Nota: antes de este push, Render todavia mostraba `N/Ds` porque estaba sirviendo el bundle frontend anterior. Este commit contiene la correccion frontend que debe reemplazar ese comportamiento tras el deploy.

## Validaciones de build

En esta sesion `npm` no estaba disponible en PATH, por lo que se ejecutaron los binarios equivalentes del proyecto con Node del runtime Codex:

```text
tsc --noEmit: OK
eslint .: OK
next build: OK
```

## Pendientes QA

- Repetir smoke post-deploy en Render para confirmar que desaparece `N/Ds` del bundle publicado.
- Validar Signals y Journal con `signal_trade_links.v1` no vacio cuando DevOps/Data aplique seed QA o existan links reales.
- Confirmar visualmente badges `TEST`, estados `suggested`, `auto_linked`, `ambiguous` y comparacion plan vs ejecucion con TC-01..TC-10.

## Pendientes DevOps/Data

- Regenerar snapshots con `signal_trade_links.v1` no vacio para validar TC-01..TC-10 punta a punta.
- Mantener `source_status=EMPTY/items=[]` como estado valido cuando no haya links.
- Resolver mojibake historico desde SQLite/datos, no con reemplazos caso por caso en frontend.
- Opcional no bloqueante: normalizar `Access-Control-Allow-Methods` a `GET, OPTIONS` para evitar duplicado `OPTIONS`.
