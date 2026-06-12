import type { SignalBoardItem } from "@/types/snapshots"

export function SignalTelegramPanel({ signal }: { signal: SignalBoardItem }) {
  return (
    <section className="rounded-lg border border-border p-4">
      <h4 className="font-heading text-sm font-semibold text-foreground">Telegram original</h4>
      <pre className="mt-3 whitespace-pre-wrap rounded-md bg-secondary/40 p-3 text-xs text-foreground/80">
        {signal.raw_telegram_text ?? "Sin Telegram original en snapshot."}
      </pre>
    </section>
  )
}
