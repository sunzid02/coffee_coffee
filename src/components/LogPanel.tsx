import { useEffect, useRef } from 'react'
import { LogEntry } from '../types.ts'

interface LogPanelProps {
  log: LogEntry[]
}

export default function LogPanel({ log }: LogPanelProps) {
  const listRef = useRef<HTMLDivElement>(null)

  // auto-scroll to bottom on every new entry
  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [log])

  return (
    <section className="log-panel">
      <h3 className="log-panel-title">Event Log</h3>
      <div className="log-list" ref={listRef} role="log" aria-live="polite">
        {log.map((entry) => (
          <div key={entry.id} className={`log-entry log-entry--${entry.category}`}>
            <span className="log-time">{formatTime(entry.timestamp)}</span>
            <span className="log-message">{entry.message}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  const h = d.getHours().toString().padStart(2, '0')
  const m = d.getMinutes().toString().padStart(2, '0')
  const s = d.getSeconds().toString().padStart(2, '0')
  return `${h}:${m}:${s}`
}
