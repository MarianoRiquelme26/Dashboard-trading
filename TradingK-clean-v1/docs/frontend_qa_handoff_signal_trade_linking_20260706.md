# TradingK Frontend QA Handoff - signal_trade_linking_v1

Fecha: 2026-07-06

## Objetivo del handoff

Este documento resume el trabajo realizado por Frontend/QA sobre `TradingK-clean-v1` para que el proximo agente pueda revisar la UI, continuar QA y validar Render sin reconstruir contexto desde cero.

## Repos y ramas relevantes

- Web repo: `C:\ChatGPT-Cosas\Github\TradingK-Web\dashboard\Dashboard-trading`
- App limpia: `C:\ChatGPT-Cosas\Github\TradingK-Web\dashboard\Dashboard-trading\TradingK-clean-v1`
- Branch web: `develop`
- Remote web: `https://github.com/MarianoRiquelme26/Dashboard-trading.git`
- Deploy Render: `https://dashboard-trading-1.onrender.com/`
- Framework repo: `C:\ChatGPT-Cosas\Github\TradingK-Framework\TradingK-Framework`

Nota: Framework tenia cambios previos ajenos sin stage. No fueron tocados por este trabajo.

## Commits relevantes

- `6e7c42d feat: prepare snapshot v1 linking UI`
  - Base previa donde ya existia la UI preparada para consumir snapshots v1 y `signal-trade-links`.
- `b4637b2 feat: harden signal trade linking UI QA`
  - Commit final pusheado a `develop` con correcciones P1/P2, normalizadores, filtros, detalles Signals/Journal e informe QA.

## Principios aplicados

- No inventar datos.
- Separar `Senal detectada != Operacion ejecutada != Resultado final`.
- No inferir links desde frontend por simbolo/hora.
- No tocar SQLite desde frontend.
- No agregar endpoints POST.
- No habilitar manual linking productivo.
- No implementar Analytics, win rate, profit factor, equity curve ni metricas agregadas.
- Tratar `source_status=EMPTY/items=[]` como estado valido, no como error.

## Trabajo frontend/QA realizado

### Snapshot API y linking read-only

- Se mantuvo consumo read-only de:
  - `/signals-recent-v1`
  - `/signals-board-v1`
  - `/journal-trades-v1`
  - `/system-status-v1`
  - `/signal-trade-links`
- Se mantuvo soporte de `ngrok-skip-browser-warning:true` para ngrok.
- Se confirmo consumo de headers `X-Snapshot-*`.
- Se confirmo envelope v1 con `schema_version`, `generated_at_utc`, `source_status`, `snapshot_age_seconds`, `snapshot_stale_after_seconds`, `snapshot_status`, `error_message`, `items`.

### Tipos y normalizadores

Se ampliaron tipos y normalizadores para `signal_trade_links.v1`:

- `matched_by_symbol`
- `matched_by_direction`
- `matched_by_time_window`
- `matched_by_entry_distance`
- `matched_by_strategy`
- `matched_by_account`
- `is_test`
- `test_case_id`
- `test_case_label`

Tambien se mantuvo compatibilidad con campos legacy:

- `match_symbol`
- `match_direction`
- `match_time`
- `match_entry_price`
- `matched_by_price_distance`

### Nulls y formato visual

- Todo valor ausente visible en flujo principal fue normalizado a `N/D`.
- Se elimino el caso visible `Edad snapshot: N/Ds`.
- `formatPrice`, `formatNumber` y `formatPercent` devuelven `N/D` cuando no hay numero valido.
- Se removieron usos visibles de `-`, `null`, `undefined` y vacios como representacion de ausencia en Dashboard, Signals y Journal.

### Timestamps

- Se usa formato ARG con timezone `America/Argentina/Buenos_Aires`.
- Si hay timestamp, se muestra como:

```text
DD/MM/YYYY HH:mm ARG
```

- Si hay datos visibles pero falta `generated_at_utc`, se muestra:

```text
Fuente real activa - timestamp no informado
```

- Si no hay timestamp ni datos suficientes, se muestra `N/D`.
- Playbook ya no muestra `Ultimo snapshot: sin generar`; ahora muestra `Fuente parcial documentada`.

### STALE global

- STALE se mantiene como warning no bloqueante.
- No se ocultan datos por STALE.
- No se convierte STALE en ERROR.
- El banner global muestra, si existen:
  - ultima actualizacion
  - edad
  - umbral stale

### Signals

- Se ajustaron filtros de vinculo a estados productivos esperados:
  - `Sin vincular`
  - `Sugerido`
  - `Auto-link`
  - `Ambiguo`
- `Manual` y `Rechazado` quedan soportados por tipos, pero no se exponen como filtros productivos principales.
- El detalle de senal muestra:
  - estado de vinculo
  - `Trade ID`
  - `Position ID`
  - tipo de vinculo
  - confianza
  - score
  - motivos de matching
  - test case si aplica
  - plan sugerido vs ejecucion real cuando existe link real/test
- Si no hay link:

```text
Sin vinculo senal-trade disponible.
```

- No se inventa comparacion cuando no hay link.
- Se muestra mensaje explicito de manual linking pendiente de backend seguro, sin boton activo.

### Journal

- Se ajustaron filtros:
  - `Con senal vinculada`
  - `Sin senal vinculada`
  - `Sugerido`
  - `Auto-link`
  - `Ambiguo`
- El detalle de Journal muestra plan sugerido vs ejecucion real solo si existe `signal_trade_links.v1`.
- Si no hay link:

```text
Trade sin senal vinculada.
```

- No se infiere vinculo desde frontend.
- Se agrego badge `TEST` cuando `is_test=true`.

### Manual linking

- No hay botones activos de:
  - `Vincular`
  - `Rechazar`
  - `Confirmar link`
- El copy visible indica que la vinculacion manual queda pendiente de backend seguro.

### Datos test

- Si `is_test=true`, la UI muestra badge `TEST`.
- Se muestran `test_case_id` y `test_case_label` cuando vienen desde backend.
- Los datos test no se mezclan visualmente como si fueran productivos.

## Validaciones ejecutadas

En esta sesion `npm` no estaba disponible en PATH. Se usaron los binarios equivalentes locales con Node del runtime Codex.

```text
tsc --noEmit: OK
eslint .: OK
next build: OK
```

Build observado:

```text
Next.js 16.2.6
Compiled successfully
Route /
Route /_not-found
Route /icon.svg
```

## Auditoria responsive local

Servidor local usado:

```text
http://localhost:3002
```

Viewports auditados:

```text
375 x 812
768 x 1024
1440 x 1000
```

Vistas auditadas:

```text
Dashboard
Signals
Journal
Playbook
```

Resultado:

- Sin errores de consola.
- Sin overflow horizontal del documento.
- Sin `N/Ds`.
- Sin `sin generar`.
- Sin `undefined`.
- Sin `null`.
- Sin botones manuales activos.

## Validacion Render y DevOps

Antes de la correccion DevOps, Render cargaba HTTP 200 pero la Snapshot API fallaba por CORS contra ngrok.

DevOps corrigio `snapshot_read_api_v1` en n8n. Validacion posterior:

- `OPTIONS /system-status-v1`: HTTP 204.
- `GET /system-status-v1`: HTTP 200.
- `GET /signals-recent-v1`: HTTP 200.
- `Access-Control-Allow-Origin`: `https://dashboard-trading-1.onrender.com`.
- `Content-Type`: `application/json; charset=utf-8`.
- Headers `X-Snapshot-*`: OK.
- Envelope v1: OK.

Despues del push `b4637b2`, Render fue revalidado:

- HTTP 200.
- Sin errores de consola.
- Sin requests fallidos.
- Sin `N/Ds`.
- Sin `sin generar`.
- Snapshot API responde desde el navegador.

## Estado actual esperado en Render

URL:

```text
https://dashboard-trading-1.onrender.com/
```

Debe observarse:

- Dashboard cargando datos reales desde Snapshot API.
- Sin errores CORS.
- System Status sin `N/Ds`.
- Timestamps ARG o fallback honesto.
- Signals y Journal navegables.
- `signal_trade_links` puede estar `EMPTY/items=[]` sin romper UI.

## Limitaciones conocidas

- `signal_trade_links.v1` todavia puede venir vacio en datos reales. En ese caso no se puede validar punta a punta plan vs ejecucion.
- La matriz TC-01..TC-10 requiere seed QA aplicado por DevOps/Data.
- Mojibake historico en textos persistidos, si aparece, debe limpiarse en datos/SQLite, no caso por caso en frontend.
- `Access-Control-Allow-Methods` fue observado como `OPTIONS, GET, OPTIONS`; funciona, pero DevOps podria dejarlo prolijo como `GET, OPTIONS`.

## Pendientes para el proximo QA

1. Revalidar Render luego de cualquier nuevo deploy.
2. Ir a Dashboard y confirmar:
   - sin `N/Ds`
   - sin `sin generar`
   - banner STALE como warning si aplica
   - sin errores consola
3. Ir a Signals:
   - validar filtros de vinculo
   - abrir detalle
   - confirmar ausencia honesta cuando no hay link
   - confirmar que no hay botones manuales activos
4. Ir a Journal:
   - validar filtros de vinculo
   - abrir detalle
   - confirmar `Trade sin senal vinculada` cuando no hay link
5. Cuando DevOps aplique seed TC-01..TC-10:
   - confirmar badges `TEST`
   - confirmar estados `auto_linked`, `suggested`, `ambiguous`
   - confirmar motivos de matching
   - confirmar comparacion plan sugerido vs ejecucion real
6. Repetir responsive 375, 768, 1440 en Render con datos reales.

## Archivos clave para revisar

- `components/signals/signal-link-trade-panel.tsx`
- `components/journal/trade-detail-panel.tsx`
- `components/signals/signals-view.tsx`
- `components/journal/journal-view.tsx`
- `components/dashboard/system-status-card.tsx`
- `components/dashboard/snapshot-status-banner.tsx`
- `lib/data/snapshot-normalizers.ts`
- `lib/data/signal-trade-links.ts`
- `lib/data/status.ts`
- `lib/data/format.ts`
- `types/snapshot-api.ts`
- `types/snapshots.ts`

## Comandos utiles

Si `npm` esta disponible:

```text
npm run typecheck
npm run lint
npm run build
```

Si `npm` no esta en PATH, usar binarios locales con Node disponible en PATH:

```text
.\node_modules\.bin\tsc.cmd --noEmit
.\node_modules\.bin\eslint.cmd .
.\node_modules\.bin\next.cmd build
```

## Cierre

El frontend quedo preparado para `signal_trade_linking_v1` read-only. El siguiente hito QA real depende de que DevOps/Data entregue links no vacios o seed TC-01..TC-10 para validar todo el flujo:

```text
Senal detectada -> trade candidato -> vinculo -> comparacion plan sugerido vs ejecucion real
```
