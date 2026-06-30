import type { DataSourceStatus, UiDataStatus } from "@/types/snapshots"
import { EmptyState } from "./empty-state"
import { ErrorState } from "./error-state"
import { StaleBanner } from "./stale-state"

interface DataStateProps {
  status: DataSourceStatus | UiDataStatus
  error?: string | null
  generatedAtUtc?: string | null
  emptyTitle?: string
  emptyDescription?: string
  onRetry?: () => void
  children: React.ReactNode
}

export function DataState({
  status,
  error,
  generatedAtUtc,
  emptyTitle,
  emptyDescription,
  onRetry,
  children,
}: DataStateProps) {
  if (status === "ERROR" || status === "error") return <ErrorState message={error} onRetry={onRetry} />
  if (status === "EMPTY" || status === "empty") return <EmptyState title={emptyTitle} description={emptyDescription} />
  return (
    <>
      {(status === "STALE" || status === "stale") && <StaleBanner generatedAtUtc={generatedAtUtc} />}
      {children}
    </>
  )
}
