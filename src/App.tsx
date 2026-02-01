import { useState, useRef, useCallback } from 'react'
import StatusCard from './components/StatusCard.tsx'
import Controls from './components/Controls.tsx'
import LogPanel from './components/LogPanel.tsx'
import {
  MachineState,
  BrewMode,
  LogEntry,
  TANK_MAX,
  REFILL_AMOUNT,
  EXTRACT_INTERVAL_MS,
  EXTRACT_STEP_ML,
  HEATING_DURATION_MS,
  DEFAULT_TARGET,
  DEFAULT_TANK,
} from './types.ts'

// ── helpers ──────────────────────────────────────────
let logIdCounter = 0
function makeLog(message: string, category: LogEntry['category']): LogEntry {
  return { id: logIdCounter++, timestamp: Date.now(), message, category }
}

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val))
}

export default function App() {
  // ── state ──────────────────────────────────────────
  const [machineState, setMachineState] = useState<MachineState>('IDLE')
  const [targetVolume, setTargetVolume] = useState(DEFAULT_TARGET)
  const [brewedMl, setBrewedMl] = useState(0)
  const [tankMl, setTankMl] = useState(DEFAULT_TANK)
  const [mode, setMode] = useState<BrewMode>('resume')
  const [log, setLog] = useState<LogEntry[]>([makeLog('Machine ready.', 'info')])

  // ── refs for timer safety ──────────────────────────
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // working refs so interval callback always sees current values
  const brewedRef = useRef(brewedMl)
  const tankRef = useRef(tankMl)
  const targetRef = useRef(targetVolume)

  // keep refs in sync with state
  brewedRef.current = brewedMl
  tankRef.current = tankMl
  targetRef.current = targetVolume

  // ── log helper ─────────────────────────────────────
  const appendLog = useCallback((entry: LogEntry) => {
    setLog((prev) => [...prev, entry])
  }, [])

  // ── clear timers ───────────────────────────────────
  const clearTimers = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  // ── start extraction interval ──────────────────────
  const startExtracting = useCallback(() => {
    setMachineState('EXTRACTING')
    intervalRef.current = setInterval(() => {
      const currentTank = tankRef.current
      const currentBrewed = brewedRef.current
      const target = targetRef.current

      // not enough water for next tick
      if (currentTank < EXTRACT_STEP_ML) {
        clearInterval(intervalRef.current!)
        intervalRef.current = null
        setMachineState('PAUSED_LOW_WATER')
        appendLog(makeLog('Paused: low water.', 'warning'))
        return
      }

      const nextBrewed = currentBrewed + EXTRACT_STEP_ML
      const nextTank = currentTank - EXTRACT_STEP_ML

      setBrewedMl(nextBrewed)
      setTankMl(nextTank)
      appendLog(makeLog(`Extracting: +${EXTRACT_STEP_ML} ml`, 'extract'))

      // reached target
      if (nextBrewed >= target) {
        clearInterval(intervalRef.current!)
        intervalRef.current = null
        setMachineState('FINISHED')
        appendLog(makeLog('Finished! Enjoy your brew.', 'success'))
      }
    }, EXTRACT_INTERVAL_MS)
  }, [appendLog])

  // ── actions ────────────────────────────────────────
  const handleStartBrew = useCallback(() => {
    if (machineState !== 'IDLE') return
    clearTimers()
    setBrewedMl(0)
    setMachineState('HEATING')
    appendLog(makeLog('Heating…', 'info'))

    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null
      appendLog(makeLog('Extracting…', 'info'))
      startExtracting()
    }, HEATING_DURATION_MS)
  }, [machineState, clearTimers, appendLog, startExtracting])

  const handleRefill = useCallback(() => {
    const newTank = clamp(tankMl + REFILL_AMOUNT, 0, TANK_MAX)
    const added = newTank - tankMl
    setTankMl(newTank)
    appendLog(makeLog(`Refilled: +${added} ml`, 'info'))
  }, [tankMl, appendLog])

  const handleResume = useCallback(() => {
    if (machineState !== 'PAUSED_LOW_WATER') return
    clearTimers()

    if (mode === 'restart') {
      // restart mode: reset brewed to 0, heat again
      setBrewedMl(0)
      setMachineState('HEATING')
      appendLog(makeLog('Restarting from beginning…', 'warning'))
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null
        appendLog(makeLog('Extracting…', 'info'))
        startExtracting()
      }, HEATING_DURATION_MS)
    } else {
      // resume mode: continue from current brewed
      appendLog(makeLog('Resumed.', 'success'))
      startExtracting()
    }
  }, [machineState, mode, clearTimers, appendLog, startExtracting])

  const handleReset = useCallback(() => {
    clearTimers()
    setMachineState('IDLE')
    setBrewedMl(0)
    setTankMl(DEFAULT_TANK)
    logIdCounter = 0
    setLog([makeLog('Machine ready.', 'info')])
  }, [clearTimers])

  const handleTargetChange = useCallback((val: number) => {
    setTargetVolume(val)
  }, [])

  const handleModeChange = useCallback((m: BrewMode) => {
    setMode(m)
  }, [])

  // ── derived ────────────────────────────────────────
  const remainingMl = Math.max(0, targetVolume - brewedMl)
  const progressPercent = Math.min(100, (brewedMl / targetVolume) * 100)
  const tankPercent = tankMl / TANK_MAX

  // ── render ─────────────────────────────────────────
  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Brew Resume Simulator</h1>
        <p className="app-subtitle">Sarker pod machine prototype</p>
      </header>

      <main className="app-main">
        <StatusCard
          machineState={machineState}
          brewedMl={brewedMl}
          remainingMl={remainingMl}
          tankMl={tankMl}
          tankPercent={tankPercent}
          progressPercent={progressPercent}
          targetVolume={targetVolume}
        />

        <Controls
          machineState={machineState}
          targetVolume={targetVolume}
          mode={mode}
          onStartBrew={handleStartBrew}
          onRefill={handleRefill}
          onResume={handleResume}
          onReset={handleReset}
          onTargetChange={handleTargetChange}
          onModeChange={handleModeChange}
        />

        <LogPanel log={log} />
      </main>
    </div>
  )
}
