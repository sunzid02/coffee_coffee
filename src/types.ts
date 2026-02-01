export type MachineState =
  | 'IDLE'
  | 'HEATING'
  | 'EXTRACTING'
  | 'PAUSED_LOW_WATER'
  | 'FINISHED'

export type BrewMode = 'resume' | 'restart'

export interface LogEntry {
  id: number
  timestamp: number
  message: string
  category: 'info' | 'warning' | 'success' | 'extract'
}

export interface BrewState {
  machineState: MachineState
  targetVolume: number
  brewedMl: number
  tankMl: number
  mode: BrewMode
  log: LogEntry[]
}

// ── constants ────────────────────────────────────────
export const TANK_MAX = 500
export const REFILL_AMOUNT = 150
export const EXTRACT_INTERVAL_MS = 200
export const EXTRACT_STEP_ML = 5
export const HEATING_DURATION_MS = 2000
export const TARGET_MIN = 50
export const TARGET_MAX = 500
export const TARGET_STEP = 10
export const DEFAULT_TARGET = 200
export const DEFAULT_TANK = 300
