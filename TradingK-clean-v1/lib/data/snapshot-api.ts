import {
  normalizeJournalTrades,
  normalizeSignalsBoard,
  normalizeSignalsRecent,
  normalizeSystemStatus,
} from "./snapshot-normalizers"

const SNAPSHOT_BASE_URL = process.env.NEXT_PUBLIC_TRADINGK_SNAPSHOT_BASE_URL?.replace(/\/$/, "") ?? ""

const LOCAL_PATHS = {
  "signals-recent": "/data/signals_recent.json",
  "signals-board": "/data/signals_board.json",
  "journal-trades": "/data/journal_trades.json",
  "system-status": "/data/system_status.json",
} as const

type SnapshotEndpoint = keyof typeof LOCAL_PATHS

function endpointUrl(endpoint: SnapshotEndpoint) {
  return SNAPSHOT_BASE_URL ? `${SNAPSHOT_BASE_URL}/${endpoint}` : LOCAL_PATHS[endpoint]
}

function requestHeaders(): HeadersInit | undefined {
  if (!SNAPSHOT_BASE_URL.includes("ngrok-free.dev")) return undefined
  return { "ngrok-skip-browser-warning": "1" }
}

async function fetchSnapshot(endpoint: SnapshotEndpoint): Promise<unknown> {
  const response = await fetch(endpointUrl(endpoint), { cache: "no-store", headers: requestHeaders() })
  if (!response.ok) {
    throw new Error(`${endpoint} fallo con HTTP ${response.status}`)
  }
  return response.json()
}

function localEnvelopeToArray(json: unknown) {
  if (Array.isArray(json)) return json
  if (json && typeof json === "object" && Array.isArray((json as { items?: unknown }).items)) {
    return (json as { items: unknown[] }).items
  }
  return json
}

export async function fetchSignalsRecent() {
  return normalizeSignalsRecent(localEnvelopeToArray(await fetchSnapshot("signals-recent")))
}

export async function fetchSignalsBoard() {
  return normalizeSignalsBoard(localEnvelopeToArray(await fetchSnapshot("signals-board")))
}

export async function fetchJournalTrades() {
  return normalizeJournalTrades(await fetchSnapshot("journal-trades"))
}

export async function fetchSystemStatus() {
  return normalizeSystemStatus(await fetchSnapshot("system-status"))
}

export function isUsingRemoteSnapshotApi() {
  return Boolean(SNAPSHOT_BASE_URL)
}
