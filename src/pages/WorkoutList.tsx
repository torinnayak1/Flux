import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { useFlux } from '../context/FluxContext'
import type { WorkoutType } from '../types'
import {
  Plus,
  ChevronRight,
  Clock,
  MapPin,
  Thermometer,
  X,
  Calendar,
} from 'lucide-react'

const workoutTypes: { id: WorkoutType; label: string }[] = [
  { id: 'zone-2', label: 'Zone 2' },
  { id: 'long-run', label: 'Long Run/Ride' },
  { id: 'threshold', label: 'Threshold' },
  { id: 'hills', label: 'Hills' },
  { id: 'tennis', label: 'Tennis Match' },
]

export default function WorkoutListPage() {
  const { workouts } = useFlux()
  const navigate = useNavigate()
  const [showCreate, setShowCreate] = useState(false)

  const upcoming = workouts
    .filter((w) => w.status === 'upcoming' || w.status === 'live')
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())

  const completed = workouts
    .filter((w) => w.status === 'completed')
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())

  return (
    <div>
      <PageHeader
        title="Workouts"
        subtitle="Upcoming sessions & plans"
        action={
          <button
            onClick={() => setShowCreate(true)}
            className="w-9 h-9 rounded-xl bg-flux-accent/10 flex items-center justify-center text-flux-accent"
          >
            <Plus size={20} />
          </button>
        }
      />

      <div className="px-5 space-y-5 pb-6">
        {upcoming.length > 0 && (
          <section>
            <h2 className="text-xs text-flux-muted uppercase tracking-wider mb-3">Upcoming</h2>
            <div className="space-y-3">
              {upcoming.map((workout) => (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  onClick={() => navigate(`/workout/${workout.id}`)}
                />
              ))}
            </div>
          </section>
        )}

        {upcoming.length === 0 && (
          <div className="flux-card text-center py-8">
            <p className="text-flux-text-dim text-sm">No upcoming workouts</p>
            <button onClick={() => setShowCreate(true)} className="flux-btn-primary mt-4 text-sm">
              <Plus size={16} />
              Create Workout
            </button>
          </div>
        )}

        {completed.length > 0 && (
          <section>
            <h2 className="text-xs text-flux-muted uppercase tracking-wider mb-3">Completed</h2>
            <div className="space-y-3">
              {completed.map((workout) => (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  onClick={() => navigate(`/workout/${workout.id}`)}
                  muted
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {showCreate && (
        <CreateWorkoutModal
          onClose={() => setShowCreate(false)}
          onCreated={(id) => {
            setShowCreate(false)
            navigate(`/workout/${id}`)
          }}
        />
      )}
    </div>
  )
}

function WorkoutCard({
  workout,
  onClick,
  muted,
}: {
  workout: { id: string; title: string; sport: string; durationMin: number; scheduledAt: string; status: string; environment: { tempF: number }; intensity: string }
  onClick: () => void
  muted?: boolean
}) {
  const scheduledTime = new Date(workout.scheduledAt).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <button
      onClick={onClick}
      className={`flux-card w-full text-left hover:border-flux-accent/40 transition-colors ${muted ? 'opacity-60' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold truncate">{workout.title}</h3>
            {workout.status === 'live' && (
              <span className="text-[10px] font-bold text-flux-warm bg-flux-warm/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-flux-warm rounded-full animate-pulse" />
                LIVE
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-xs text-flux-text-dim">
            <span className="flex items-center gap-1">
              <Calendar size={11} /> {scheduledTime}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} /> {workout.durationMin} min
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={11} /> {workout.sport}
            </span>
            <span className="flex items-center gap-1">
              <Thermometer size={11} /> {workout.environment.tempF}°F
            </span>
          </div>
          <span className="inline-block text-[10px] px-2 py-0.5 rounded-lg bg-flux-surface border border-flux-border mt-2 capitalize">
            {workout.intensity}
          </span>
        </div>
        <ChevronRight className="text-flux-muted shrink-0 ml-2" size={20} />
      </div>
    </button>
  )
}

function CreateWorkoutModal({
  onClose,
  onCreated,
}: {
  onClose: () => void
  onCreated: (id: string) => void
}) {
  const { addWorkout } = useFlux()
  const [title, setTitle] = useState('')
  const [type, setType] = useState<WorkoutType>('long-run')
  const [sport, setSport] = useState('Running')
  const [durationMin, setDurationMin] = useState(60)
  const [intensity, setIntensity] = useState<'easy' | 'moderate' | 'hard' | 'race'>('moderate')
  const [tempF, setTempF] = useState(75)
  const [humidity, setHumidity] = useState(60)
  const [indoor, setIndoor] = useState(false)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('06:30')

  const handleSubmit = () => {
    if (!title.trim() || !date) return
    const scheduledAt = new Date(`${date}T${time}:00`).toISOString()
    const id = addWorkout({
      title: title.trim(),
      type,
      sport,
      durationMin,
      intensity,
      scheduledAt,
      environment: { tempF, humidity, indoor },
    })
    onCreated(id)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-flux-card rounded-t-3xl border border-flux-border p-5 pb-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">New Workout</h2>
          <button onClick={onClose}><X size={20} className="text-flux-muted" /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-flux-muted uppercase tracking-wider">Title</label>
            <input className="flux-input mt-1" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Morning Long Run" />
          </div>

          <div>
            <label className="text-xs text-flux-muted uppercase tracking-wider">Workout Type</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {workoutTypes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setType(t.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                    type === t.id
                      ? 'border-flux-accent bg-flux-accent/10 text-flux-accent'
                      : 'border-flux-border bg-flux-surface'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-flux-muted">Sport</label>
              <input className="flux-input mt-1" value={sport} onChange={(e) => setSport(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-flux-muted">Duration (min)</label>
              <input type="number" className="flux-input mt-1" value={durationMin} onChange={(e) => setDurationMin(+e.target.value)} />
            </div>
          </div>

          <div>
            <label className="text-xs text-flux-muted uppercase tracking-wider">Intensity</label>
            <div className="flex gap-2 mt-1">
              {(['easy', 'moderate', 'hard', 'race'] as const).map((i) => (
                <button
                  key={i}
                  onClick={() => setIntensity(i)}
                  className={`flex-1 py-2 rounded-xl text-xs font-medium border capitalize ${
                    intensity === i
                      ? 'border-flux-accent bg-flux-accent/10 text-flux-accent'
                      : 'border-flux-border bg-flux-surface'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-flux-muted">Date</label>
              <input type="date" className="flux-input mt-1" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-flux-muted">Time</label>
              <input type="time" className="flux-input mt-1" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-flux-muted">Temp °F</label>
              <input type="number" className="flux-input mt-1" value={tempF} onChange={(e) => setTempF(+e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-flux-muted">Humidity %</label>
              <input type="number" className="flux-input mt-1" value={humidity} onChange={(e) => setHumidity(+e.target.value)} />
            </div>
            <div className="flex flex-col justify-end">
              <button
                onClick={() => setIndoor(!indoor)}
                className={`flux-btn-secondary text-xs py-3 ${indoor ? 'border-flux-accent text-flux-accent' : ''}`}
              >
                {indoor ? 'Indoor' : 'Outdoor'}
              </button>
            </div>
          </div>

          <button onClick={handleSubmit} className="flux-btn-primary w-full">
            Create & View Plan
          </button>
        </div>
      </div>
    </div>
  )
}
