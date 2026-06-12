"use client"

import type { SignalBoardItem } from "@/types/snapshots"

export interface SignalFilters {
  strategyName: string
  botName: string
  symbol: string
  timeframeSignal: string
  direction: string
  minScore: string
  telegramSent: string
  operationStatus: string
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
        <SelectFilter label="Estrategia" value={filters.strategyName} options={unique(items, (item) => item.strategy_name)} onChange={(value) => update("strategyName", value)} />
        <SelectFilter label="Bot" value={filters.botName} options={unique(items, (item) => item.bot_name)} onChange={(value) => update("botName", value)} />
        <SelectFilter label="Símbolo" value={filters.symbol} options={unique(items, (item) => item.symbol)} onChange={(value) => update("symbol", value)} />
        <SelectFilter label="Timeframe" value={filters.timeframeSignal} options={unique(items, (item) => item.timeframe_signal)} onChange={(value) => update("timeframeSignal", value)} />
        <SelectFilter label="Dirección" value={filters.direction} options={unique(items, (item) => item.direction)} onChange={(value) => update("direction", value)} />
        <label className="block">
          <span className="mb-1 block text-[11px] uppercase tracking-wide text-muted-foreground">Score mínimo</span>
          <input
            type="number"
            value={filters.minScore}
            onChange={(event) => update("minScore", event.target.value)}
            className="h-9 w-full rounded-md border border-border bg-card px-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </label>
        <SelectFilter label="Telegram enviado" value={filters.telegramSent} options={["Sí", "No"]} onChange={(value) => update("telegramSent", value)} />
        <SelectFilter label="Estado" value={filters.operationStatus} options={unique(items, (item) => item.operation_status ?? item.signal_status)} onChange={(value) => update("operationStatus", value)} />
        <label className="block">
          <span className="mb-1 block text-[11px] uppercase tracking-wide text-muted-foreground">Fecha desde</span>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(event) => update("dateFrom", event.target.value)}
            className="h-9 w-full rounded-md border border-border bg-card px-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-[11px] uppercase tracking-wide text-muted-foreground">Fecha hasta</span>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(event) => update("dateTo", event.target.value)}
            className="h-9 w-full rounded-md border border-border bg-card px-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </label>
      </div>
    </div>
  )
}
