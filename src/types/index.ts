export type ProductCategory =
  | 'gel'
  | 'drink'
  | 'electrolyte'
  | 'capsule'
  | 'protein'
  | 'caffeine'
  | 'other'

export type Certification =
  | 'nsf'
  | 'informed-sport'
  | 'team-approved'
  | 'personal'
  | 'unknown'

export interface PantryItem {
  id: string
  name: string
  category: ProductCategory
  quantity: number
  packageSize: number
  servingUnit: string
  sodiumMg: number
  carbsG: number
  caffeineMg: number
  proteinG: number
  fluidMl: number
  certification: Certification
  expiration: string
  toleranceScore: number
  notes?: string
}

export interface IntakeLog {
  id: string
  itemId: string
  itemName: string
  timestamp: string
  quantity: number
  context: 'pre-workout' | 'during' | 'post-workout' | 'daily'
}

export interface IssueReport {
  id: string
  itemId: string
  itemName: string
  timestamp: string
  issue: 'gi-discomfort' | 'jitters' | 'thirst' | 'bloating' | 'other'
  notes: string
}

export type WorkoutType =
  | 'zone-2'
  | 'long-run'
  | 'threshold'
  | 'hills'
  | 'tennis'

export type WorkoutStatus = 'upcoming' | 'live' | 'completed'

export interface WorkoutPlan {
  id: string
  title: string
  type: WorkoutType
  sport: string
  durationMin: number
  intensity: 'easy' | 'moderate' | 'hard' | 'race'
  scheduledAt: string
  status: WorkoutStatus
  environment: {
    tempF: number
    humidity: number
    indoor: boolean
  }
  predictedLimiter: string
  packPlan: PackItem[]
  timingPlan: TimingEvent[]
}

export interface PackItem {
  itemId: string
  name: string
  quantity: number
  reason: string
}

export interface TimingEvent {
  minute: number
  action: string
  item?: string
}

export interface SensorReading {
  timestamp: string
  lactate: number
  sweatRate: number
  sweatSodium: number
  skinTemp: number
  spo2: number
  motionQuality: number
}

export interface SessionReport {
  id: string
  date: string
  workoutTitle: string
  responseScore: number
  energy: number
  giComfort: number
  adherence: number
  limiterMatched: boolean
  notes: string
}

export interface UserProfile {
  name: string
  email: string
  bodyMassKg: number
  sports: string[]
  caffeineSensitivity: 'low' | 'moderate' | 'high'
  giTolerance: 'low' | 'moderate' | 'high'
  competitionMode: boolean
  conditions: MedicalCondition[]
  plan: 'pro' | 'basic'
}

export interface MedicalCondition {
  id: string
  name: string
  severity: 'mild' | 'moderate' | 'severe'
  notes: string
}

export interface BioBaseStatus {
  connected: boolean
  battery: number
  lastSync: string
  signalQuality: 'excellent' | 'good' | 'fair' | 'poor'
}

export interface Readiness {
  score: number
  lactateBaseline: number
  sweatSodium: number
  skinTemp: number
  spo2: number
  trend: 'rising' | 'stable' | 'declining'
}
