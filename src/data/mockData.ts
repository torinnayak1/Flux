import type {
  PantryItem,
  IntakeLog,
  IssueReport,
  WorkoutPlan,
  SensorReading,
  SessionReport,
  UserProfile,
  BioBaseStatus,
  Readiness,
} from '../types'

export const mockPantry: PantryItem[] = [
  {
    id: 'p1',
    name: 'Maurten Gel 100',
    category: 'gel',
    quantity: 12,
    packageSize: 30,
    servingUnit: 'gel',
    sodiumMg: 65,
    carbsG: 25,
    caffeineMg: 0,
    proteinG: 0,
    fluidMl: 0,
    certification: 'nsf',
    expiration: '2027-03',
    toleranceScore: 8,
  },
  {
    id: 'p2',
    name: 'Gatorade 500mL',
    category: 'drink',
    quantity: 9,
    packageSize: 36,
    servingUnit: 'bottle',
    sodiumMg: 270,
    carbsG: 34,
    caffeineMg: 0,
    proteinG: 0,
    fluidMl: 500,
    certification: 'personal',
    expiration: '2026-08',
    toleranceScore: 9,
  },
  {
    id: 'p3',
    name: 'Sodium Capsule 250mg',
    category: 'capsule',
    quantity: 24,
    packageSize: 100,
    servingUnit: 'capsule',
    sodiumMg: 250,
    carbsG: 0,
    caffeineMg: 0,
    proteinG: 0,
    fluidMl: 0,
    certification: 'informed-sport',
    expiration: '2026-12',
    toleranceScore: 7,
  },
  {
    id: 'p4',
    name: 'LMNT Citrus',
    category: 'electrolyte',
    quantity: 6,
    packageSize: 30,
    servingUnit: 'packet',
    sodiumMg: 1000,
    carbsG: 0,
    caffeineMg: 0,
    proteinG: 0,
    fluidMl: 0,
    certification: 'nsf',
    expiration: '2026-06',
    toleranceScore: 8,
  },
  {
    id: 'p5',
    name: 'ON Whey Gold Standard',
    category: 'protein',
    quantity: 41,
    packageSize: 75,
    servingUnit: 'scoop',
    sodiumMg: 130,
    carbsG: 4,
    caffeineMg: 0,
    proteinG: 24,
    fluidMl: 0,
    certification: 'personal',
    expiration: '2027-01',
    toleranceScore: 9,
  },
  {
    id: 'p6',
    name: 'GU Roctane Gel',
    category: 'caffeine',
    quantity: 8,
    packageSize: 24,
    servingUnit: 'gel',
    sodiumMg: 125,
    carbsG: 25,
    caffeineMg: 35,
    proteinG: 0,
    fluidMl: 0,
    certification: 'unknown',
    expiration: '2026-09',
    toleranceScore: 6,
    notes: 'Caffeine sensitivity — use before 2pm',
  },
]

export const mockIntakeLogs: IntakeLog[] = [
  { id: 'i1', itemId: 'p1', itemName: 'Maurten Gel 100', timestamp: '2026-06-30T07:15:00', quantity: 1, context: 'pre-workout' },
  { id: 'i2', itemId: 'p2', itemName: 'Gatorade 500mL', timestamp: '2026-06-30T08:45:00', quantity: 1, context: 'during' },
  { id: 'i3', itemId: 'p5', itemName: 'ON Whey Gold Standard', timestamp: '2026-06-30T10:30:00', quantity: 1, context: 'post-workout' },
  { id: 'i4', itemId: 'p4', itemName: 'LMNT Citrus', timestamp: '2026-06-29T06:00:00', quantity: 1, context: 'daily' },
]

export const mockIssueReports: IssueReport[] = [
  { id: 'r1', itemId: 'p6', itemName: 'GU Roctane Gel', timestamp: '2026-06-28T14:00:00', issue: 'jitters', notes: 'Felt anxious during threshold set' },
]

export const mockWorkouts: WorkoutPlan[] = [
  {
    id: 'w1',
    title: 'Long Run — Hills',
    type: 'long-run',
    sport: 'Running',
    durationMin: 90,
    intensity: 'moderate',
    scheduledAt: '2026-07-01T06:30:00',
    status: 'upcoming',
    environment: { tempF: 78, humidity: 65, indoor: false },
    predictedLimiter: 'Heat & sodium loss after mile 5',
    packPlan: [
      { itemId: 'p2', name: 'Gatorade 500mL', quantity: 2, reason: 'Fluid + carbs for 90 min effort' },
      { itemId: 'p1', name: 'Maurten Gel 100', quantity: 2, reason: 'Carb fuel at min 35 & 65' },
      { itemId: 'p3', name: 'Sodium Capsule 250mg', quantity: 1, reason: 'High sweat sodium session' },
    ],
    timingPlan: [
      { minute: 0, action: 'Sip electrolyte — 10 min pre-start', item: 'LMNT Citrus' },
      { minute: 35, action: 'Take gel 1 before climb', item: 'Maurten Gel 100' },
      { minute: 60, action: 'Drink to halfway mark on Bottle A', item: 'Gatorade 500mL' },
      { minute: 65, action: 'Take gel 2 if pace holds', item: 'Maurten Gel 100' },
      { minute: 75, action: 'Sodium capsule if heat high + water available', item: 'Sodium Capsule' },
    ],
  },
  {
    id: 'w2',
    title: 'Threshold Intervals',
    type: 'threshold',
    sport: 'Cycling',
    durationMin: 60,
    intensity: 'hard',
    scheduledAt: '2026-07-02T17:00:00',
    status: 'upcoming',
    environment: { tempF: 72, humidity: 50, indoor: true },
    predictedLimiter: 'Metabolic strain on final intervals',
    packPlan: [
      { itemId: 'p2', name: 'Gatorade 500mL', quantity: 1, reason: 'Hydration for 60 min indoor effort' },
      { itemId: 'p6', name: 'GU Roctane Gel', quantity: 1, reason: 'Caffeine boost pre-interval block' },
    ],
    timingPlan: [
      { minute: 0, action: 'Caffeine gel 15 min pre-start', item: 'GU Roctane Gel' },
      { minute: 20, action: 'Sip sports drink during warmup', item: 'Gatorade 500mL' },
      { minute: 45, action: 'Small sip between intervals', item: 'Gatorade 500mL' },
    ],
  },
  {
    id: 'w3',
    title: 'Tennis Match',
    type: 'tennis',
    sport: 'Tennis',
    durationMin: 120,
    intensity: 'moderate',
    scheduledAt: '2026-07-04T09:00:00',
    status: 'upcoming',
    environment: { tempF: 85, humidity: 70, indoor: false },
    predictedLimiter: 'Heat & sodium loss during long rallies',
    packPlan: [
      { itemId: 'p2', name: 'Gatorade 500mL', quantity: 2, reason: 'Changeover hydration' },
      { itemId: 'p4', name: 'LMNT Citrus', quantity: 2, reason: 'High sodium for hot outdoor match' },
      { itemId: 'p1', name: 'Maurten Gel 100', quantity: 1, reason: 'Mid-match fuel' },
    ],
    timingPlan: [
      { minute: 0, action: 'Electrolyte sip pre-match', item: 'LMNT Citrus' },
      { minute: 30, action: 'Gel at changeover if set 1 long', item: 'Maurten Gel 100' },
      { minute: 60, action: 'Sports drink at changeover', item: 'Gatorade 500mL' },
      { minute: 90, action: 'LMNT packet if cramping risk', item: 'LMNT Citrus' },
    ],
  },
]

export const mockLiveReadings: SensorReading[] = [
  { timestamp: '0:00', lactate: 1.8, sweatRate: 0.8, sweatSodium: 42, skinTemp: 98.2, spo2: 98, motionQuality: 95 },
  { timestamp: '15:00', lactate: 2.4, sweatRate: 1.1, sweatSodium: 48, skinTemp: 99.1, spo2: 97, motionQuality: 92 },
  { timestamp: '30:00', lactate: 3.1, sweatRate: 1.4, sweatSodium: 55, skinTemp: 100.2, spo2: 97, motionQuality: 88 },
  { timestamp: '45:00', lactate: 3.8, sweatRate: 1.6, sweatSodium: 62, skinTemp: 101.0, spo2: 96, motionQuality: 85 },
]

export const mockReports: SessionReport[] = [
  { id: 's1', date: '2026-06-30', workoutTitle: 'Threshold Intervals', responseScore: 82, energy: 8, giComfort: 7, adherence: 9, limiterMatched: true, notes: 'Sodium plan helped on final rep' },
  { id: 's2', date: '2026-06-28', workoutTitle: 'Zone 2 Ride', responseScore: 91, energy: 9, giComfort: 9, adherence: 10, limiterMatched: true, notes: 'Felt strong throughout' },
  { id: 's3', date: '2026-06-26', workoutTitle: 'Hill Repeats', responseScore: 68, energy: 6, giComfort: 5, adherence: 7, limiterMatched: false, notes: 'Caffeine gel too late — GI discomfort' },
  { id: 's4', date: '2026-06-24', workoutTitle: 'Tennis Match', responseScore: 75, energy: 7, giComfort: 8, adherence: 8, limiterMatched: true, notes: 'Changeover plan worked well' },
]

export const mockProfile: UserProfile = {
  name: 'Alex Rivera',
  email: 'alex.rivera@email.com',
  bodyMassKg: 72,
  sports: ['Running', 'Cycling', 'Tennis'],
  caffeineSensitivity: 'moderate',
  giTolerance: 'moderate',
  competitionMode: false,
  conditions: [
    { id: 'c1', name: 'Exercise-induced asthma', severity: 'mild', notes: 'Uses inhaler pre-race only' },
    { id: 'c2', name: 'Mild lactose sensitivity', severity: 'mild', notes: 'Avoid whey on hard sessions' },
  ],
  plan: 'pro',
}

export const mockBioBase: BioBaseStatus = {
  connected: true,
  battery: 78,
  lastSync: '2 min ago',
  signalQuality: 'excellent',
}

export const mockReadiness: Readiness = {
  score: 84,
  lactateBaseline: 1.6,
  sweatSodium: 48,
  skinTemp: 97.8,
  spo2: 98,
  trend: 'stable',
}

import type { ProductCategory } from '../types'

export const categoryOrder: ProductCategory[] = [
  'gel', 'drink', 'electrolyte', 'capsule', 'protein', 'caffeine', 'other',
]

export const categoryLabels: Record<string, string> = {
  gel: 'Gels',
  drink: 'Sports Drinks',
  electrolyte: 'Electrolytes',
  capsule: 'Capsules',
  protein: 'Protein',
  caffeine: 'Caffeine',
  other: 'Other',
}

export const categoryColors: Record<string, string> = {
  gel: '#ff8c42',
  drink: '#4a9eff',
  electrolyte: '#f5c542',
  capsule: '#00d4aa',
  protein: '#a78bfa',
  caffeine: '#ff6b4a',
  other: '#6b7a90',
}

export const certificationLabels: Record<string, string> = {
  nsf: 'NSF Certified',
  'informed-sport': 'Informed Sport',
  'team-approved': 'Team Approved',
  personal: 'Personal Use',
  unknown: 'Unknown',
}
