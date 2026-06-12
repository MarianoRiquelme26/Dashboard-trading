export type DataSourceStatus =
  | "REAL"
  | "PARTIAL"
  | "MOCK"
  | "EMPTY"
  | "ERROR"
  | "STALE"

export interface SnapshotBase<TItem = unknown> {
  schema_version: string
  generated_at_utc: string | null
  source_status: DataSourceStatus
  source_name?: string
  stale_after_seconds?: number
  error_message?: string | null
  items: TItem[]
}

export type SnapshotRecord = SnapshotBase<Record<string, unknown>> & Record<string, unknown>

export interface SnapshotLoadResult<TSnapshot extends SnapshotBase = SnapshotBase> {
  data: TSnapshot | null
  status: DataSourceStatus
  error: string | null
  isLoading: boolean
  isStale: boolean
}
