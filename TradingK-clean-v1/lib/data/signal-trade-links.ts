import type { JournalTradeItem, SignalBoardItem, SignalTradeLink, SignalTradeLinkStatus } from "@/types/snapshots"

export const SIGNAL_TRADE_LINK_STATUSES: SignalTradeLinkStatus[] = [
  "unlinked",
  "suggested",
  "auto_linked",
  "manual_linked",
  "ambiguous",
  "rejected",
]

export function linkStatusForSignal(signal: SignalBoardItem): SignalTradeLinkStatus {
  if (signal.tradeLink) return signal.tradeLink.linkStatus
  if (signal.linkedTrade || signal.linkedTradeId) return "auto_linked"
  return "unlinked"
}

export function linkStatusForTrade(trade: JournalTradeItem): SignalTradeLinkStatus {
  if (trade.tradeLink) return trade.tradeLink.linkStatus
  if (trade.linkedSignalEventId) return "auto_linked"
  return "unlinked"
}

export function linkStatusLabel(status: SignalTradeLinkStatus) {
  const labels: Record<SignalTradeLinkStatus, string> = {
    unlinked: "Sin vincular",
    suggested: "Sugerido",
    auto_linked: "Auto-link",
    manual_linked: "Manual",
    ambiguous: "Ambiguo",
    rejected: "Rechazado",
  }
  return labels[status]
}

export function linkStatusTone(status: SignalTradeLinkStatus) {
  if (status === "auto_linked" || status === "manual_linked") return "success"
  if (status === "suggested" || status === "ambiguous") return "warning"
  if (status === "rejected") return "danger"
  return "neutral"
}

export function linkTradeId(signal: SignalBoardItem) {
  return signal.tradeLink?.tradeId ?? signal.tradeLink?.tradeExecution?.tradeId ?? signal.linkedTrade?.tradeId ?? signal.linkedTradeId
}

export function mergeSignalsWithLinks(items: SignalBoardItem[], links: SignalTradeLink[]) {
  const bySignalId = new Map(links.filter((link) => link.signalEventId).map((link) => [link.signalEventId as string, link]))
  return items.map((item) => {
    const tradeLink = bySignalId.get(item.eventId) ?? item.tradeLink ?? null
    return {
      ...item,
      tradeLink,
      linkedTradeId: tradeLink?.tradeId ?? item.linkedTradeId,
    }
  })
}

export function mergeTradesWithLinks(items: JournalTradeItem[], links: SignalTradeLink[]) {
  const byTradeId = new Map(links.filter((link) => link.tradeId).map((link) => [link.tradeId as string, link]))
  const byPositionId = new Map(links.filter((link) => link.positionId).map((link) => [link.positionId as string, link]))
  return items.map((item) => {
    const tradeLink = byTradeId.get(item.tradeId) ?? (item.positionId ? byPositionId.get(item.positionId) : undefined) ?? item.tradeLink ?? null
    return {
      ...item,
      tradeLink,
      linkedSignalEventId: tradeLink?.signalEventId ?? item.linkedSignalEventId,
    }
  })
}
