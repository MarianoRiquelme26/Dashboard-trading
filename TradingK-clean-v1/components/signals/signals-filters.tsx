export function SignalsFilters() {
  const filters = ["Estrategia", "Bot", "Simbolo", "Timeframe", "Direccion", "Score", "Telegram enviado", "Fecha", "Estado"]

  return (
    <div className="glass rounded-lg p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-9">
        {filters.map((filter) => (
          <label key={filter} className="block">
            <span className="mb-1 block text-[11px] uppercase tracking-wide text-muted-foreground">{filter}</span>
            <input
              disabled
              placeholder="Snapshot"
              className="h-9 w-full rounded-md border border-border bg-secondary/30 px-3 text-sm text-muted-foreground outline-none"
            />
          </label>
        ))}
      </div>
    </div>
  )
}
