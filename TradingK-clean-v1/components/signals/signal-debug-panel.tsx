export function SignalDebugPanel({ signal }: { signal: Record<string, unknown> }) {
  return (
    <details className="rounded-lg border border-border p-4">
      <summary className="cursor-pointer font-heading text-sm font-semibold text-foreground">Debug payload</summary>
      <pre className="mt-3 max-h-80 overflow-auto rounded-md bg-secondary/40 p-3 text-xs text-foreground/80">
        {JSON.stringify(signal, null, 2)}
      </pre>
    </details>
  )
}
