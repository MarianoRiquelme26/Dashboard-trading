import { Inbox } from "lucide-react"

interface EmptyStateProps {
  title?: string
  description?: string
}

export function EmptyState({
  title = "EMPTY",
  description = "No hay registros disponibles para este snapshot.",
}: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-6 text-center">
      <Inbox className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
      <h3 className="font-heading text-base font-semibold text-foreground">{title}</h3>
      <p className="mx-auto mt-1 max-w-xl text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
