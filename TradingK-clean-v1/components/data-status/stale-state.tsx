import { Clock3 } from "lucide-react"
import { formatArgTime } from "@/lib/data/status"

interface StaleStateProps {
  generatedAtUtc?: string | null
}

export function StaleState({ generatedAtUtc }: StaleStateProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
      <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-300" />
      <div>
        <h3 className="font-heading text-sm font-semibold text-amber-900 dark:text-amber-100">STALE</h3>
        <p className="mt-1 text-sm text-amber-800 dark:text-amber-100/80">
          El snapshot esta vencido. Se muestran los ultimos datos disponibles. Ultima generacion:{" "}
          {formatArgTime(generatedAtUtc)}.
        </p>
      </div>
    </div>
  )
}

export function StaleBanner({ generatedAtUtc }: StaleStateProps) {
  return (
    <div className="mb-4">
      <StaleState generatedAtUtc={generatedAtUtc} />
    </div>
  )
}
