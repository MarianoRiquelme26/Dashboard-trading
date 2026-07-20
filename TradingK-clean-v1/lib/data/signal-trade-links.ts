import type { JournalTradeItem, SignalBoardItem, SignalTradeLink, SignalTradeLinkStatus } from "@/types/snapshots"

export const SIGNAL_TRADE_LINK_STATUSES: SignalTradeLinkStatus[] = [
  "unlinked",
  "suggested",
  "auto_linked",
  "manual_linked",
  "ambiguous",
  "rejected",
]

export const ACTIVE_SIGNAL_LINK_FILTER_STATUSES: SignalTradeLinkStatus[] = [
  "unlinked",
  "suggested",
  "auto_linked",
  "ambiguous",
]

export const JOURNAL_LINK_FILTERS = [
  "linked",
  "unlinked",
  "suggested",
  "auto_linked",
  "ambiguous",
] as const

export type JournalLinkFilter = (typeof JOURNAL_LINK_FILTERS)[number]

function aggregateLinkStatus(links: SignalTradeLink[]): SignalTradeLinkStatus | null {
  if (links.length === 0) return null
  const statuses = links.map((link) => link.linkStatus)
  if (statuses.includes("ambiguous")) return "ambiguous"
  if (statuses.includes("suggested")) return "suggested"
  if (statuses.includes("auto_linked")) return "auto_linked"
  if (statuses.includes("manual_linked")) return "manual_linked"
  if (statuses.includes("rejected")) return "rejected"
  return statuses[0] ?? null
}

function linksForSignal(signal: SignalBoardItem) {
  return signal.tradeLinks?.length ? signal.tradeLinks : signal.tradeLink ? [signal.tradeLink] : []
}

function linksForTrade(trade: JournalTradeItem) {
  return trade.tradeLinks?.length ? trade.tradeLinks : trade.tradeLink ? [trade.tradeLink] : []
}

export function hasExplicitTestMetadata(item: { isTest?: boolean; testCaseId?: string | null }) {
  return item.isTest === true && Boolean(item.testCaseId)
}

export function testCaseText(item: { testCaseId?: string | null; testCaseLabel?: string | null }) {
  return `${item.testCaseId ?? "N/D"} ${item.testCaseLabel ?? ""}`.trim()
}

export function linkStatusForSignal(signal: SignalBoardItem): SignalTradeLinkStatus {
  const aggregateStatus = aggregateLinkStatus(linksForSignal(signal))
  if (aggregateStatus) return aggregateStatus
  if (signal.linkedTrade || signal.linkedTradeId) return "auto_linked"
  return "unlinked"
}

export function linkStatusForTrade(trade: JournalTradeItem): SignalTradeLinkStatus {
  const aggregateStatus = aggregateLinkStatus(linksForTrade(trade))
  if (aggregateStatus) return aggregateStatus
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

export function journalLinkFilterLabel(filter: JournalLinkFilter) {
  const labels: Record<JournalLinkFilter, string> = {
    linked: "Con senal vinculada",
    unlinked: "Sin senal vinculada",
    suggested: "Sugerido",
    auto_linked: "Auto-link",
    ambiguous: "Ambiguo",
  }
  return labels[filter]
}

export function tradeMatchesJournalLinkFilter(trade: JournalTradeItem, filter: JournalLinkFilter) {
  const status = linkStatusForTrade(trade)
  if (filter === "linked") return status !== "unlinked"
  return status === filter
}

export function linkTradeId(signal: SignalBoardItem) {
  const links = linksForSignal(signal)
  if (links.length > 1) {
    return links
      .map((link) => link.tradeId ?? link.tradeExecution?.tradeId)
      .filter(Boolean)
      .join(", ")
  }
  const link = links[0]
  return link?.tradeId ?? link?.tradeExecution?.tradeId ?? signal.linkedTrade?.tradeId ?? signal.linkedTradeId
}

function groupLinksBy<T extends string>(
  links: SignalTradeLink[],
  picker: (link: SignalTradeLink) => T | null | undefined,
) {
  const groups = new Map<T, SignalTradeLink[]>()
  links.forEach((link) => {
    const key = picker(link)
    if (!key) return
    groups.set(key, [...(groups.get(key) ?? []), link])
  })
  return groups
}

export function mergeSignalsWithLinks(items: SignalBoardItem[], links: SignalTradeLink[]) {
  const bySignalId = groupLinksBy(links, (link) => link.signalEventId)
  return items.map((item) => {
    const tradeLinks = bySignalId.get(item.eventId) ?? (item.tradeLinks?.length ? item.tradeLinks : [])
    const tradeLink = tradeLinks[0] ?? item.tradeLink ?? null
    return {
      ...item,
      tradeLinks,
      tradeLink,
      linkedTradeId: tradeLinks.length === 1 ? tradeLinks[0].tradeId ?? item.linkedTradeId : item.linkedTradeId,
    }
  })
}

export function mergeTradesWithLinks(items: JournalTradeItem[], links: SignalTradeLink[]) {
  const byTradeId = groupLinksBy(links, (link) => link.tradeId)
  const byPositionId = groupLinksBy(links, (link) => link.positionId)
  return items.map((item) => {
    const tradeLinks =
      byTradeId.get(item.tradeId) ??
      (item.positionId ? byPositionId.get(item.positionId) : undefined) ??
      (item.tradeLinks?.length ? item.tradeLinks : [])
    const tradeLink = tradeLinks[0] ?? item.tradeLink ?? null
    return {
      ...item,
      tradeLinks,
      tradeLink,
      linkedSignalEventId: tradeLinks.length === 1 ? tradeLinks[0].signalEventId ?? item.linkedSignalEventId : item.linkedSignalEventId,
    }
  })
}
