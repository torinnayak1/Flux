import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import MetricPill from '../components/MetricPill'
import { useFlux } from '../context/FluxContext'
import { mockLiveReadings } from '../data/mockData'
import {
  Play,
  Square,
  Clock,
  MapPin,
  Thermometer,
  Zap,
  Droplets,
  ChevronDown,
  ChevronUp,
  Navigation,
  ChevronLeft,
} from 'lucide-react'

export default function WorkoutDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getWorkout, startWorkout, endWorkout } = useFlux()
  const [showDetails, setShowDetails] = useState(true)
  const [elapsedMin, setElapsedMin] = useState(32)

  const workout = id ? getWorkout(id) : undefined

  if (!workout) {
    return (
      <div className="px-5 pt-20 text-center">
        <p className="text-flux-text-dim">Workout not found.</p>
        <button onClick={() => navigate('/workout')} className="flux-btn-secondary mt-4">
          Back to Workouts
        </button>
      </div>
    )
  }

  const isLive = workout.status === 'live'
  const isCompleted = workout.status === 'completed'
  const latestReading = mockLiveReadings[mockLiveReadings.length - 1]

  const scheduledTime = new Date(workout.scheduledAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })

  const handleStart = () => {
    startWorkout(workout.id)
    setElapsedMin(0)
  }

  return (
    <div>
      <PageHeader
        title={isLive ? 'Live Session' : workout.title}
        subtitle={
          isLive
            ? `${elapsedMin} min elapsed`
            : isCompleted
              ? 'Session completed'
              : `${scheduledTime} · ${workout.durationMin} min`
        }
        action={
          <div className="flex items-center gap-2">
            {isLive && (
              <span className="flex items-center gap-1.5 text-xs font-medium text-flux-warm bg-flux-warm/10 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-flux-warm rounded-full animate-pulse" />
                LIVE
              </span>
            )}
            <button
              onClick={() => navigate('/workout')}
              className="w-9 h-9 rounded-xl bg-flux-surface border border-flux-border flex items-center justify-center text-flux-muted"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
        }
      />

      <div className="px-5 space-y-5 pb-6">
        {!isLive && (
          <section className="flux-card">
            <h2 className="font-semibold text-lg">{workout.title}</h2>
            <div className="flex flex-wrap gap-3 mt-3 text-sm text-flux-text-dim">
              <span className="flex items-center gap-1.5">
                <Clock size={14} /> {scheduledTime} · {workout.durationMin} min
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={14} /> {workout.sport}
              </span>
              <span className="flex items-center gap-1.5">
                <Thermometer size={14} /> {workout.environment.tempF}°F
              </span>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-flux-surface border border-flux-border">
              <p className="text-[11px] text-flux-muted uppercase tracking-wider">Predicted Limiter</p>
              <p className="text-sm mt-1">{workout.predictedLimiter}</p>
            </div>
            {!isCompleted && (
              <button onClick={handleStart} className="flux-btn-primary w-full mt-4">
                <Play size={18} fill="currentColor" />
                Start Workout
              </button>
            )}
          </section>
        )}

        {isLive && (
          <>
            <section className="flux-card shadow-glow border-flux-accent/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold flex items-center gap-2">
                  <Zap size={16} className="text-flux-accent" />
                  Flux Sensors
                </h2>
                <span className="text-[10px] text-flux-muted">Updated live</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <MetricPill label="Lactate" value={latestReading.lactate} unit="mmol" color="#ff6b4a" />
                <MetricPill label="Sweat Na⁺" value={latestReading.sweatSodium} unit="mEq" color="#f5c542" />
                <MetricPill label="Skin Temp" value={latestReading.skinTemp} unit="°F" color="#ff8c42" />
                <MetricPill label="Sweat Rate" value={latestReading.sweatRate} unit="L/h" color="#4a9eff" />
                <MetricPill label="SpO₂" value={latestReading.spo2} unit="%" color="#00d4aa" />
                <MetricPill label="Signal" value={latestReading.motionQuality} unit="%" color="#a78bfa" />
              </div>
            </section>

            <section className="flux-card border-flux-accent/40 bg-gradient-to-br from-flux-accent/5 to-transparent">
              <div className="flex items-center gap-2 mb-2">
                <Navigation size={18} className="text-flux-accent" />
                <h2 className="font-semibold">Next Move</h2>
              </div>
              <p className="text-lg font-medium">
                Drink to the halfway mark on Bottle A over the next 20 minutes
              </p>
              <p className="text-sm text-flux-text-dim mt-2">
                Heat and sodium loss rising — high-sweat sodium session detected. Use high-sodium bottle first.
              </p>
              <div className="flex gap-2 mt-4">
                <button className="flux-btn-primary flex-1 text-sm py-2.5">Done</button>
                <button className="flux-btn-secondary flex-1 text-sm py-2.5">Snooze 5m</button>
              </div>
            </section>

            <section className="flux-card">
              <h3 className="font-semibold text-sm mb-3">Limiter Map</h3>
              <div className="space-y-2">
                {[
                  { label: 'Metabolic strain', level: 65, color: '#ff6b4a' },
                  { label: 'Thermal load', level: 78, color: '#ff8c42' },
                  { label: 'Sodium loss', level: 72, color: '#f5c542' },
                  { label: 'Fuel demand', level: 45, color: '#4a9eff' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-flux-text-dim">{item.label}</span>
                      <span style={{ color: item.color }}>{item.level}%</span>
                    </div>
                    <div className="h-1.5 bg-flux-surface rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${item.level}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <button onClick={() => endWorkout(workout.id)} className="flux-btn-secondary w-full border-flux-warm/40 text-flux-warm">
              <Square size={16} fill="currentColor" />
              End Workout
            </button>
          </>
        )}

        <section className="flux-card">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center justify-between w-full"
          >
            <h2 className="font-semibold">Pack Plan</h2>
            {showDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {showDetails && (
            <div className="mt-3 space-y-3">
              {workout.packPlan.map((item) => (
                <div key={item.itemId} className="p-3 rounded-xl bg-flux-surface border border-flux-border">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{item.name}</span>
                    <span className="text-flux-accent font-bold text-sm">{item.quantity}×</span>
                  </div>
                  <p className="text-xs text-flux-text-dim mt-1">{item.reason}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="flux-card">
          <h2 className="font-semibold mb-4">Timing Plan</h2>
          <div className="relative">
            <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-flux-border" />
            <div className="space-y-4">
              {workout.timingPlan.map((event, i) => {
                const isPast = isLive && event.minute <= elapsedMin
                const isCurrent = isLive && event.minute <= elapsedMin && (workout.timingPlan[i + 1]?.minute ?? 999) > elapsedMin
                return (
                  <div key={i} className="flex gap-4 relative">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 z-10 ${
                        isCurrent
                          ? 'bg-flux-accent text-flux-bg ring-4 ring-flux-accent/20'
                          : isPast
                            ? 'bg-flux-accent/30 text-flux-accent'
                            : 'bg-flux-surface border border-flux-border text-flux-muted'
                      }`}
                    >
                      {event.minute === 0 ? 'Pre' : `${event.minute}'`}
                    </div>
                    <div className={`pb-1 ${isCurrent ? 'opacity-100' : isPast ? 'opacity-60' : 'opacity-80'}`}>
                      <p className="text-sm font-medium">{event.action}</p>
                      {event.item && (
                        <p className="text-xs text-flux-text-dim flex items-center gap-1 mt-0.5">
                          <Droplets size={10} /> {event.item}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
