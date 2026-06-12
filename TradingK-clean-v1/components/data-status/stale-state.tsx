import { Clock3 } from "lucide-react"

interface StaleStateProps {
  generatedAtUtc?: string | null
}

export function StaleState({ generatedAtUtc }: StaleStateProps) {
  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-6 text-center">
      <Clock3 className="mx-auto mb-3 h-8 w-8 text-amber-300" />
      <h3 className="font-heading text-base font-semibold text-amber-100">STALE</h3>
      <p className="mx-auto mt-1 max-w-xl text-sm text-amber-100/80">
        El snapshot esta vencido. Ultima generacion: {generatedAtUtc ?? "sin fecha"}.
      </p>
    </div>
  )
}
