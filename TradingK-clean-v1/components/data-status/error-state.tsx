import { AlertTriangle } from "lucide-react"

interface ErrorStateProps {
  title?: string
  message?: string | null
}

export function ErrorState({ title = "ERROR", message }: ErrorStateProps) {
  return (
    <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-center">
      <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-red-300" />
      <h3 className="font-heading text-base font-semibold text-red-100">{title}</h3>
      <p className="mx-auto mt-1 max-w-xl text-sm text-red-100/80">
        {message ?? "No se pudo cargar o parsear el snapshot."}
      </p>
    </div>
  )
}
