"use client"

import type { SignalBoardItem } from "@/types/snapshots"
import { SIGNAL_TRADE_LINK_STATUSES, linkStatusLabel } from "@/lib/data/signal-trade-links"

export interface SignalFilters {
  strategyName: string
  botName: string
  symbol: string
  timeframeSignal: string
  direction: string
  minScore: string
  telegramSent: string
  operationStatus: string
  linkStatus: string
  dateFrom: string
  dateTo: string
}

export const emptySignalFilters: SignalFilters = {
  strategyName: "",
  botName: "",
  symbol: "",
  timeframeSignal: "",
  direction: "",
  minScore: "",
  telegramSent: "",
  operationStatus: "",
  linkStatus: "",
  dateFrom: "",
  dateTo: "",
}

function unique(items: SignalBoardItem[], picker: (item: SignalBoardItem) => string | null | undefined) {
  return Array.from(new Set(items.map(picker).filter(Boolean) as string[])).sort()
}

function SelectFilter({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] uppercase tracking-wide text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 w-full rounded-md border border-border bg-card px-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <option value="">Todas</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

export function SignalsFilters({
  items,
  filters,
  onChange,
  onClear,
}: {
  items: SignalBoardItem[]
  filters: SignalFilters
  onChange: (filters: SignalFilters) => void
  onClear: () => void
}) {
  const update = (key: keyof SignalFilters, value: string) => onChange({ ...filters, [key]: value })

  return (
    <div className="glass rounded-lg p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-heading text-sm font-semibold text-foreground">Filtros</h3>
        <button
          type="button"
          onClick={onClear}
          className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        >
          Limpiar filtros
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <SelectFilter label="Estrategia" value={filters.strategyName} options={unique(items, (item) => item.strategyName)} onChange={(value) => update("strategyName", value)} />
        <SelectFilter label="Bot" value={filters.botName} options={unique(items, (item) => item.botName)} onChange={(value) => update("botName", value)} />
        <SelectFilter label="Simbolo" value={filters.symbol} options={unique(items, (item) => item.symbol)} onChange={(value) => update("symbol", value)} />
        <SelectFilter label="Timeframe" value={filters.timeframeSignal} options={unique(items, (item) => item.timeframeSignal)} onChange={(value) => update("timeframeSignal", value)} />
        <SelectFilter label="Direccion" value={filters.direction} options={unique(items, (item) => item.direction)} onChange={(value) => update("direction", value)} />
        <label className="block">
          <span className="mb-1 block text-[11px] uppercase tracking-wide text-muted-foreground">Score minimo</span>
          <input
            type="number"
            value={filters.minScore}
            onChange={(event) => update("minScore", event.target.value)}
            className="h-9 w-full rounded-md border border-border bg-card px-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </label>
        <SelectFilter label="Telegram enviado" value={filters.telegramSent} options={["Si", "No"]} onChange={(value) => update("telegramSent", value)} />
        <SelectFilter label="Estado" value={filters.operationStatus} options={unique(items, (item) => item.operationStatus ?? item.signalStatus)} onChange={(value) => update("operationStatus", value)} />
        <SelectFilter
          label="Vinculo trade"
          value={filters.linkStatus}
          options={SIGNAL_TRADE_LINK_STATUSES.map(linkStatusLabel)}
          onChange={(value) => update("linkStatus", value)}
        />
        <label className="block">
          <span className="mb-1 block text-[11px] uppercase tracking-wide text-muted-foreground">Fecha desde</span>
          <input type="date" value={filters.dateFrom} onChange={(event) => update("dateFrom", event.target.value)} className="h-9 w-full rounded-md border border-border bg-card px-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary" />
        </label>
        <label className="block">
          <span className="mb-1 block text-[11px] uppercase tracking-wide text-muted-foreground">Fecha hasta</span>
          <input type="date" value={filters.dateTo} onChange={(event) => update("dateTo", event.target.value)} className="h-9 w-full rounded-md border border-border bg-card px-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary" />
        </label>
      </div>
    </div>
  )
}
