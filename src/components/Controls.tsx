import { MachineState, BrewMode, TARGET_MIN, TARGET_MAX, TARGET_STEP } from '../types.ts'

interface ControlsProps {
  machineState:   MachineState
  targetVolume:   number
  mode:           BrewMode
  onStartBrew:    () => void
  onRefill:       () => void
  onResume:       () => void
  onReset:        () => void
  onTargetChange: (val: number) => void
  onModeChange:   (m: BrewMode) => void
}

export default function Controls({
  machineState,
  targetVolume,
  mode,
  onStartBrew,
  onRefill,
  onResume,
  onReset,
  onTargetChange,
  onModeChange,
}: ControlsProps) {
  const canStart      = machineState === 'IDLE'
  const canResume     = machineState === 'PAUSED_LOW_WATER'
  const canRefill     = machineState !== 'EXTRACTING' && machineState !== 'HEATING'
  const canEditInputs = machineState === 'IDLE'

  return (
    <section className="controls">
      {/* ── target volume ── */}
      <div className="controls-settings">
        <label className="input-group">
          <span className="input-label">Target cup</span>
          <input
            type="number"
            className="input-number"
            min={TARGET_MIN}
            max={TARGET_MAX}
            step={TARGET_STEP}
            value={targetVolume}
            disabled={!canEditInputs}
            onChange={(e) => {
              const v = Number(e.target.value)
              if (!isNaN(v)) onTargetChange(Math.min(TARGET_MAX, Math.max(TARGET_MIN, v)))
            }}
          />
          <span className="input-unit">ml</span>
        </label>
      </div>

      {/* ── mode toggle ── */}
      <div className="mode-toggle">
        <span className="mode-toggle-label">Behavior after refill</span>
        <div className="mode-options">
          <label className={`mode-option ${mode === 'resume' ? 'active' : ''}`}>
            <input
              type="radio"
              name="brew-mode"
              value="resume"
              checked={mode === 'resume'}
              onChange={() => onModeChange('resume')}
            />
            <span className="mode-option-text">
              <strong>↻ Resume</strong> — continue from last state
            </span>
          </label>
          <label className={`mode-option ${mode === 'restart' ? 'active' : ''}`}>
            <input
              type="radio"
              name="brew-mode"
              value="restart"
              checked={mode === 'restart'}
              onChange={() => onModeChange('restart')}
            />
            <span className="mode-option-text">
              <strong>↺ Restart</strong> — begin extraction over
            </span>
          </label>
        </div>
      </div>

      {/* ── educational note ── */}
      <div className="edu-note">
        {mode === 'resume' ? (
          <p>Resume continues extraction from where it stopped — keeping the flavour profile consistent.</p>
        ) : (
          <p>Restart resets extraction to zero. The early phase pulls different compounds, which changes the taste.</p>
        )}
      </div>

      {/* ── action buttons ── */}
      <div className="controls-actions">
        <button className="btn btn--primary"   disabled={!canStart}  onClick={onStartBrew}>
          ▶ Start Brew
        </button>

        {canResume && (
          <button className="btn btn--resume" onClick={onResume}>
            {mode === 'restart' ? '↺ Restart Brewing' : '↻ Resume Brewing'}
          </button>
        )}

        <button className="btn btn--secondary" disabled={!canRefill} onClick={onRefill}>
          💧 Refill +150 ml
        </button>

        <button className="btn btn--ghost" onClick={onReset}>
          Reset
        </button>
      </div>
    </section>
  )
}
