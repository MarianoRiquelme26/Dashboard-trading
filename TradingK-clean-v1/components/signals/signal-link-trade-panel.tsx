export function SignalLinkTradePanel({ signal }: { signal: Record<string, unknown> }) {
  const tradeId = typeof signal.linked_trade_id === "string" ? signal.linked_trade_id : null
  return (
    <section className="rounded-lg border border-border p-4">
      <h4 className="font-heading text-sm font-semibold text-foreground">Vinculacion con trade</h4>
      <p className="mt-2 text-sm text-muted-foreground">
        {tradeId ? `Trade vinculado: ${tradeId}` : "Sin trade vinculado. No se infiere resultado desde la senal."}
      </p>
    </section>
  )
}
