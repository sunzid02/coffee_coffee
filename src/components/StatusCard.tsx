import { MachineState } from '../types.ts'
import TassimoMachine from './TassimoMachine.tsx'
import WaterTank      from './WaterTank.tsx'
import CoffeeMug      from './CoffeeMug.tsx'

interface StatusCardProps {
  machineState:   MachineState
  brewedMl:       number
  remainingMl:    number
  tankMl:         number
  tankPercent:    number   // 0-1
  progressPercent: number  // 0-100
  targetVolume:   number
}

const STATE_LABELS: Record<MachineState, string> = {
  IDLE:             'Ready',
  HEATING:          'Heating…',
  EXTRACTING:       'Extracting',
  PAUSED_LOW_WATER: '⚠ Low Water — Paused',
  FINISHED:         '✓ Done',
}

const STATE_CLASSES: Record<MachineState, string> = {
  IDLE:             'state-idle',
  HEATING:          'state-heating',
  EXTRACTING:       'state-extracting',
  PAUSED_LOW_WATER: 'state-paused',
  FINISHED:         'state-finished',
}

export default function StatusCard({
  machineState,
  brewedMl,
  remainingMl,
  tankMl,
  tankPercent,
  progressPercent,
  targetVolume,
}: StatusCardProps) {
  return (
    <section className="status-card">
      {/* state badge */}
      <div className={`state-badge ${STATE_CLASSES[machineState]}`}>
        {STATE_LABELS[machineState]}
      </div>

      {/* ── illustration scene ── */}
      <div className="scene">
        <div className="scene-item">
          <WaterTank tankPercent={tankPercent} />
          <span className="scene-label">Water Tank</span>
        </div>
        <div className="scene-item">
          <TassimoMachine state={machineState} tankPercent={tankPercent} />
          <span className="scene-label">Tassimo Machine</span>
        </div>
        <div className="scene-item">
          <CoffeeMug fillPercent={progressPercent} finished={machineState === 'FINISHED'} />
          <span className="scene-label">Your Cup</span>
        </div>
      </div>

      {/* ── live metrics ── */}
      <div className="metrics-row">
        <Metric label="Brewed"    value={brewedMl}    unit="ml" />
        <Metric label="Remaining" value={remainingMl} unit="ml" />
        <Metric label="Tank"      value={tankMl}      unit="ml" />
        <Metric label="Target"    value={targetVolume} unit="ml" />
      </div>

      {/* ── progress bar ── */}
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${progressPercent}%` }}
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Brew progress"
        />
      </div>
      <div className="progress-label">{Math.round(progressPercent)}% brewed</div>
    </section>
  )
}

function Metric({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="metric">
      <span className="metric-label">{label}</span>
      <span className="metric-value">
        {value}<span className="metric-unit">{unit}</span>
      </span>
    </div>
  )
}
