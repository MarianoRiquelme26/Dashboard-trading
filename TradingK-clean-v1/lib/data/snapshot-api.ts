import {
  normalizeJournalTrades,
  normalizeSignalTradeLinks,
  normalizeSignalsBoard,
  normalizeSignalsRecent,
  normalizeSystemStatus,
} from "./snapshot-normalizers"
import type { SnapshotResponseMeta, SnapshotResponsePayload } from "@/types/snapshot-api"

const SNAPSHOT_BASE_URL = process.env.NEXT_PUBLIC_TRADINGK_SNAPSHOT_BASE_URL?.replace(/\/$/, "") ?? ""

const LOCAL_PATHS = {
  signalsRecent: "/data/signals_recent.json",
  signalsBoard: "/data/signals_board.json",
  journalTrades: "/data/journal_trades.json",
  signalTradeLinks: "/data/signal_trade_links.json",
  systemStatus: "/data/system_status.json",
} as const

const REMOTE_ENDPOINTS = {
  signalsRecent: "signals-recent-v1",
  signalsBoard: "signals-board-v1",
  journalTrades: "journal-trades-v1",
  signalTradeLinks: "signal-trade-links",
  systemStatus: "system-status-v1",
} as const

type SnapshotEndpoint = keyof typeof LOCAL_PATHS

function endpointUrl(endpoint: SnapshotEndpoint) {
  return SNAPSHOT_BASE_URL ? `${SNAPSHOT_BASE_URL}/${REMOTE_ENDPOINTS[endpoint]}` : LOCAL_PATHS[endpoint]
}

function requestHeaders(): HeadersInit | undefined {
  if (!SNAPSHOT_BASE_URL.includes("ngrok-free.dev")) return undefined
  return { "ngrok-skip-browser-warning": "true" }
}

function headerNumber(response: Response, header: string) {
  const value = response.headers.get(header)
  if (!value) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function responseMeta(response: Response): SnapshotResponseMeta {
  return {
    headerGeneratedAtUtc: response.headers.get("X-Snapshot-Generated-At"),
    headerAgeSeconds: headerNumber(response, "X-Snapshot-Age-Seconds"),
    headerStaleAfterSeconds: headerNumber(response, "X-Snapshot-Stale-After-Seconds"),
    headerStatus: response.headers.get("X-Snapshot-Status"),
  }
}

async function fetchSnapshot(endpoint: SnapshotEndpoint): Promise<SnapshotResponsePayload> {
  const response = await fetch(endpointUrl(endpoint), { cache: "no-store", headers: requestHeaders() })
  if (!response.ok) {
    throw new Error(`${REMOTE_ENDPOINTS[endpoint]} fallo con HTTP ${response.status}`)
  }
  return { body: await response.json(), meta: responseMeta(response) }
}

export async function fetchSignalsRecent() {
  return normalizeSignalsRecent(await fetchSnapshot("signalsRecent"))
}

export async function fetchSignalsBoard() {
  return normalizeSignalsBoard(await fetchSnapshot("signalsBoard"))
}

export async function fetchJournalTrades() {
  return normalizeJournalTrades(await fetchSnapshot("journalTrades"))
}

export async function fetchSignalTradeLinks() {
  return normalizeSignalTradeLinks(await fetchSnapshot("signalTradeLinks"))
}

export async function fetchSystemStatus() {
  return normalizeSystemStatus(await fetchSnapshot("systemStatus"))
}

export function isUsingRemoteSnapshotApi() {
  return Boolean(SNAPSHOT_BASE_URL)
}
