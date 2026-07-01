import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type {
  PantryItem,
  IntakeLog,
  IssueReport,
  WorkoutPlan,
  UserProfile,
  MedicalCondition,
  WorkoutType,
} from '../types'
import {
  mockPantry,
  mockIntakeLogs,
  mockIssueReports,
  mockWorkouts,
  mockProfile,
} from '../data/mockData'

interface FluxContextValue {
  pantry: PantryItem[]
  intakeLogs: IntakeLog[]
  issueReports: IssueReport[]
  workouts: WorkoutPlan[]
  profile: UserProfile
  getWorkout: (id: string) => WorkoutPlan | undefined
  getNextWorkout: () => WorkoutPlan | undefined
  updateQuantity: (id: string, delta: number) => void
  addPantryItem: (item: Omit<PantryItem, 'id'>) => void
  logIntake: (itemId: string, quantity: number, context: IntakeLog['context']) => void
  reportIssue: (itemId: string, issue: IssueReport['issue'], notes: string) => void
  startWorkout: (id: string) => void
  endWorkout: (id: string) => void
  addWorkout: (workout: Omit<WorkoutPlan, 'id' | 'packPlan' | 'timingPlan' | 'predictedLimiter' | 'status'>) => string
  updateProfile: (updates: Partial<UserProfile>) => void
  addCondition: (condition: Omit<MedicalCondition, 'id'>) => void
  removeCondition: (id: string) => void
}

const FluxContext = createContext<FluxContextValue | null>(null)

function generatePackPlan(type: WorkoutType): WorkoutPlan['packPlan'] {
  const plans: Record<WorkoutType, WorkoutPlan['packPlan']> = {
    'zone-2': [
      { itemId: 'p2', name: 'Gatorade 500mL', quantity: 1, reason: 'Light hydration for aerobic session' },
    ],
    'long-run': [
      { itemId: 'p2', name: 'Gatorade 500mL', quantity: 2, reason: 'Fluid + carbs for extended effort' },
      { itemId: 'p1', name: 'Maurten Gel 100', quantity: 2, reason: 'Carb fuel during session' },
      { itemId: 'p3', name: 'Sodium Capsule 250mg', quantity: 1, reason: 'Sodium replacement' },
    ],
    threshold: [
      { itemId: 'p2', name: 'Gatorade 500mL', quantity: 1, reason: 'Hydration for hard effort' },
      { itemId: 'p6', name: 'GU Roctane Gel', quantity: 1, reason: 'Optional caffeine boost' },
    ],
    hills: [
      { itemId: 'p2', name: 'Gatorade 500mL', quantity: 2, reason: 'Fluid for climbing efforts' },
      { itemId: 'p1', name: 'Maurten Gel 100', quantity: 2, reason: 'Fuel before climbs' },
      { itemId: 'p3', name: 'Sodium Capsule 250mg', quantity: 1, reason: 'High sweat sodium session' },
    ],
    tennis: [
      { itemId: 'p2', name: 'Gatorade 500mL', quantity: 2, reason: 'Changeover hydration' },
      { itemId: 'p4', name: 'LMNT Citrus', quantity: 1, reason: 'Electrolyte at changeovers' },
      { itemId: 'p1', name: 'Maurten Gel 100', quantity: 1, reason: 'Mid-match fuel' },
    ],
  }
  return plans[type]
}

function generateTimingPlan(type: WorkoutType): WorkoutPlan['timingPlan'] {
  const plans: Record<WorkoutType, WorkoutPlan['timingPlan']> = {
    'zone-2': [
      { minute: 0, action: 'Sip sports drink as needed', item: 'Gatorade 500mL' },
    ],
    'long-run': [
      { minute: 0, action: 'Sip electrolyte pre-start', item: 'LMNT Citrus' },
      { minute: 35, action: 'Take gel 1', item: 'Maurten Gel 100' },
      { minute: 65, action: 'Take gel 2 if pace holds', item: 'Maurten Gel 100' },
    ],
    threshold: [
      { minute: 0, action: 'Caffeine gel 15 min pre-start', item: 'GU Roctane Gel' },
      { minute: 30, action: 'Sip between intervals', item: 'Gatorade 500mL' },
    ],
    hills: [
      { minute: 0, action: 'Electrolyte sip pre-start', item: 'LMNT Citrus' },
      { minute: 25, action: 'Gel before first climb', item: 'Maurten Gel 100' },
      { minute: 50, action: 'Sodium capsule if needed', item: 'Sodium Capsule' },
    ],
    tennis: [
      { minute: 0, action: 'Electrolyte pre-match', item: 'LMNT Citrus' },
      { minute: 45, action: 'Sports drink at changeover', item: 'Gatorade 500mL' },
      { minute: 90, action: 'Gel if match extends', item: 'Maurten Gel 100' },
    ],
  }
  return plans[type]
}

function generateLimiter(type: WorkoutType): string {
  const limiters: Record<WorkoutType, string> = {
    'zone-2': 'Aerobic sustainability — keep effort conversational',
    'long-run': 'Heat & sodium loss in second half',
    threshold: 'Metabolic strain on final intervals',
    hills: 'Sodium loss and lactate on climbs',
    tennis: 'Heat & sodium loss during long rallies',
  }
  return limiters[type]
}

export function FluxProvider({ children }: { children: ReactNode }) {
  const [pantry, setPantry] = useState(mockPantry)
  const [intakeLogs, setIntakeLogs] = useState(mockIntakeLogs)
  const [issueReports, setIssueReports] = useState(mockIssueReports)
  const [workouts, setWorkouts] = useState(mockWorkouts)
  const [profile, setProfile] = useState(mockProfile)

  const getWorkout = useCallback(
    (id: string) => workouts.find((w) => w.id === id),
    [workouts]
  )

  const getNextWorkout = useCallback(() => {
    return workouts
      .filter((w) => w.status === 'upcoming')
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0]
  }, [workouts])

  const updateQuantity = useCallback((id: string, delta: number) => {
    setPantry((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      )
    )
  }, [])

  const addPantryItem = useCallback((item: Omit<PantryItem, 'id'>) => {
    const newItem: PantryItem = { ...item, id: `p${Date.now()}` }
    setPantry((prev) => [...prev, newItem])
  }, [])

  const logIntake = useCallback(
    (itemId: string, quantity: number, context: IntakeLog['context']) => {
      const item = pantry.find((p) => p.id === itemId)
      if (!item) return
      const log: IntakeLog = {
        id: `i${Date.now()}`,
        itemId,
        itemName: item.name,
        timestamp: new Date().toISOString(),
        quantity,
        context,
      }
      setIntakeLogs((prev) => [log, ...prev])
      setPantry((prev) =>
        prev.map((p) =>
          p.id === itemId
            ? { ...p, quantity: Math.max(0, p.quantity - quantity) }
            : p
        )
      )
    },
    [pantry]
  )

  const reportIssue = useCallback(
    (itemId: string, issue: IssueReport['issue'], notes: string) => {
      const item = pantry.find((p) => p.id === itemId)
      if (!item) return
      const report: IssueReport = {
        id: `r${Date.now()}`,
        itemId,
        itemName: item.name,
        timestamp: new Date().toISOString(),
        issue,
        notes,
      }
      setIssueReports((prev) => [report, ...prev])
      if (issue === 'gi-discomfort' || issue === 'bloating') {
        setPantry((prev) =>
          prev.map((p) =>
            p.id === itemId
              ? { ...p, toleranceScore: Math.max(1, p.toleranceScore - 1) }
              : p
          )
        )
      }
    },
    [pantry]
  )

  const startWorkout = useCallback((id: string) => {
    setWorkouts((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: 'live' } : w))
    )
  }, [])

  const endWorkout = useCallback((id: string) => {
    setWorkouts((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: 'completed' } : w))
    )
  }, [])

  const addWorkout = useCallback(
    (workout: Omit<WorkoutPlan, 'id' | 'packPlan' | 'timingPlan' | 'predictedLimiter' | 'status'>) => {
      const id = `w${Date.now()}`
      const newWorkout: WorkoutPlan = {
        ...workout,
        id,
        status: 'upcoming',
        predictedLimiter: generateLimiter(workout.type),
        packPlan: generatePackPlan(workout.type),
        timingPlan: generateTimingPlan(workout.type),
      }
      setWorkouts((prev) => [...prev, newWorkout])
      return id
    },
    []
  )

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }))
  }, [])

  const addCondition = useCallback((condition: Omit<MedicalCondition, 'id'>) => {
    setProfile((prev) => ({
      ...prev,
      conditions: [...prev.conditions, { ...condition, id: `c${Date.now()}` }],
    }))
  }, [])

  const removeCondition = useCallback((id: string) => {
    setProfile((prev) => ({
      ...prev,
      conditions: prev.conditions.filter((c) => c.id !== id),
    }))
  }, [])

  return (
    <FluxContext.Provider
      value={{
        pantry,
        intakeLogs,
        issueReports,
        workouts,
        profile,
        getWorkout,
        getNextWorkout,
        updateQuantity,
        addPantryItem,
        logIntake,
        reportIssue,
        startWorkout,
        endWorkout,
        addWorkout,
        updateProfile,
        addCondition,
        removeCondition,
      }}
    >
      {children}
    </FluxContext.Provider>
  )
}

export function useFlux() {
  const ctx = useContext(FluxContext)
  if (!ctx) throw new Error('useFlux must be used within FluxProvider')
  return ctx
}
