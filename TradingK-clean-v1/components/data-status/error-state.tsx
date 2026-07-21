import { AlertTriangle } from "lucide-react"

interface ErrorStateProps {
  title?: string
  message?: string | null
  onRetry?: () => void
}

export function ErrorState({ title = "ERROR", message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-lg border border-red-300 bg-red-50 p-6 text-center dark:border-red-500/30 dark:bg-red-500/10">
      <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-red-600 dark:text-red-300" />
      <h3 className="font-heading text-base font-semibold text-red-900 dark:text-red-100">{title}</h3>
      <p className="mx-auto mt-1 max-w-xl text-sm text-red-800 dark:text-red-100/80">
        {message ?? "No se pudo cargar o parsear el snapshot."}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-md border border-red-400 px-3 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600 dark:border-red-300/40 dark:text-red-50 dark:hover:bg-red-400/10 dark:focus-visible:outline-red-200"
        >
          Reintentar
        </button>
      )}
    </div>
  )
}
