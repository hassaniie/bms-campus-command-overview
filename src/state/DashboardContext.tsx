import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react'
import type { CampusState, DashboardScope, TwinLayer } from '@/types'
import { buildScenario, type ScenarioId } from '@/data/scenarios'

export type Phase = 'loading' | 'ready'

interface DashboardStateShape {
  scenarioId: ScenarioId
  phase: Phase
  scope: DashboardScope
  quickInspectOpen: boolean
  campus: CampusState
}

type Action =
  | { type: 'SET_SCENARIO'; id: ScenarioId }
  | { type: 'PHASE_READY' }
  | { type: 'SET_LAYER'; layer: TwinLayer }
  | { type: 'SELECT_BUILDING'; id: string }
  | { type: 'CLEAR_BUILDING' }
  | { type: 'SELECT_SYSTEM'; id: string } // also opens Quick Inspect
  | { type: 'CLEAR_SYSTEM' }
  | { type: 'CLEAR_ALL' }
  | { type: 'OPEN_INSPECT'; id: string }
  | { type: 'INSPECT'; systemId: string; buildingId?: string }
  | { type: 'CLOSE_INSPECT' }

function initState(scenarioId: ScenarioId): DashboardStateShape {
  return {
    scenarioId,
    phase: 'loading',
    scope: { layer: 'health' },
    quickInspectOpen: false,
    campus: buildScenario(scenarioId, Date.now()),
  }
}

function reducer(state: DashboardStateShape, action: Action): DashboardStateShape {
  switch (action.type) {
    case 'SET_SCENARIO': {
      // Rebuild telemetry with a fresh "now"; keep scope, reset transient inspect.
      return {
        ...state,
        scenarioId: action.id,
        phase: 'loading',
        campus: buildScenario(action.id, Date.now()),
      }
    }
    case 'PHASE_READY':
      return { ...state, phase: 'ready' }
    case 'SET_LAYER':
      return { ...state, scope: { ...state.scope, layer: action.layer } }
    case 'SELECT_BUILDING': {
      const same = state.scope.buildingId === action.id
      return {
        ...state,
        scope: { ...state.scope, buildingId: same ? undefined : action.id },
      }
    }
    case 'CLEAR_BUILDING':
      return { ...state, scope: { ...state.scope, buildingId: undefined } }
    case 'SELECT_SYSTEM':
      return {
        ...state,
        scope: { ...state.scope, systemId: action.id },
        quickInspectOpen: true,
      }
    case 'CLEAR_SYSTEM':
      return {
        ...state,
        scope: { ...state.scope, systemId: undefined },
        quickInspectOpen: false,
      }
    case 'CLEAR_ALL':
      return {
        ...state,
        scope: { layer: state.scope.layer },
        quickInspectOpen: false,
      }
    case 'OPEN_INSPECT':
      return {
        ...state,
        scope: { ...state.scope, systemId: action.id },
        quickInspectOpen: true,
      }
    case 'INSPECT':
      // Explicitly focus a system (and optionally a building) from the briefing.
      return {
        ...state,
        scope: {
          ...state.scope,
          buildingId: action.buildingId ?? state.scope.buildingId,
          systemId: action.systemId,
        },
        quickInspectOpen: true,
      }
    case 'CLOSE_INSPECT':
      return { ...state, quickInspectOpen: false }
    default:
      return state
  }
}

interface DashboardContextValue extends DashboardStateShape {
  setScenario: (id: ScenarioId) => void
  setLayer: (layer: TwinLayer) => void
  selectBuilding: (id: string) => void
  clearBuilding: () => void
  selectSystem: (id: string) => void
  clearSystem: () => void
  clearAll: () => void
  openInspect: (id: string) => void
  inspectFromBriefing: (systemId: string, buildingId?: string) => void
  closeInspect: () => void
}

const Ctx = createContext<DashboardContextValue | null>(null)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, 'normal', initState)
  const timerRef = useRef<number | null>(null)

  // Simulate initial load / refetch skeleton whenever the scenario changes.
  useEffect(() => {
    if (state.phase !== 'loading') return
    if (timerRef.current) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => dispatch({ type: 'PHASE_READY' }), 950)
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [state.phase, state.scenarioId])

  const value = useMemo<DashboardContextValue>(
    () => ({
      ...state,
      setScenario: (id) => dispatch({ type: 'SET_SCENARIO', id }),
      setLayer: (layer) => dispatch({ type: 'SET_LAYER', layer }),
      selectBuilding: (id) => dispatch({ type: 'SELECT_BUILDING', id }),
      clearBuilding: () => dispatch({ type: 'CLEAR_BUILDING' }),
      selectSystem: (id) => dispatch({ type: 'SELECT_SYSTEM', id }),
      clearSystem: () => dispatch({ type: 'CLEAR_SYSTEM' }),
      clearAll: () => dispatch({ type: 'CLEAR_ALL' }),
      openInspect: (id) => dispatch({ type: 'OPEN_INSPECT', id }),
      inspectFromBriefing: (systemId, buildingId) =>
        dispatch({ type: 'INSPECT', systemId, buildingId }),
      closeInspect: () => dispatch({ type: 'CLOSE_INSPECT' }),
    }),
    [state],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useDashboard(): DashboardContextValue {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider')
  return ctx
}
