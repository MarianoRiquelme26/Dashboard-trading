import type { DataSourceStatus } from "@/types/snapshots"
import { EmptyState } from "./empty-state"
import { ErrorState } from "./error-state"
import { StaleState } from "./stale-state"

interface DataStateProps {
  status: DataSourceStatus
  error?: string | null
  generatedAtUtc?: string | null
  emptyTitle?: string
  emptyDescription?: string
  children: React.ReactNode
}

export function DataState({
  status,
  error,
  generatedAtUtc,
  emptyTitle,
  emptyDescription,
  children,
}: DataStateProps) {
  if (status === "ERROR") return <ErrorState message={error} />
  if (status === "STALE") return <StaleState generatedAtUtc={generatedAtUtc} />
  if (status === "EMPTY") return <EmptyState title={emptyTitle} description={emptyDescription} />
  return <>{children}</>
}
