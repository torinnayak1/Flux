import PageHeader from '../components/PageHeader'
import ProgressRing from '../components/ProgressRing'
import BioBaseBadge from '../components/BioBaseBadge'
import MetricPill from '../components/MetricPill'
import { useFlux } from '../context/FluxContext'
import { mockReadiness } from '../data/mockData'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  ChevronRight,
  Droplets,
  Flame,
  Package,
  TrendingUp,
} from 'lucide-react'

export default function TodayPage() {
  const { getNextWorkout } = useFlux()
  const navigate = useNavigate()
  const readiness = mockReadiness
  const workout = getNextWorkout()

  if (!workout) {
    return (
      <div>
        <PageHeader title="Today" subtitle={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} />
        <div className="px-5">
          <BioBaseBadge />
          <p className="text-flux-text-dim text-sm mt-5 text-center">No upcoming workouts scheduled.</p>
        </div>
      </div>
    )
  }

  const scheduledTime = new Date(workout.scheduledAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <div>
      <PageHeader
        title="Today"
        subtitle={new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })}
      />

      <div className="px-5 space-y-5">
        <BioBaseBadge />

        {/* Flux Vitals */}
        <section className="flux-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Flux Vitals</h2>
            <span className="flex items-center gap-1 text-xs text-flux-accent">
              <TrendingUp size={12} />
              {readiness.trend}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <ProgressRing value={readiness.score} label="Score" />
            <div className="flex-1 grid grid-cols-2 gap-2">
              <MetricPill label="Lactate" value={readiness.lactateBaseline} unit="mmol" color="#ff6b4a" />
              <MetricPill label="Sweat Na⁺" value={readiness.sweatSodium} unit="mEq" color="#f5c542" />
              <MetricPill label="Skin Temp" value={readiness.skinTemp} unit="°F" color="#ff8c42" />
              <MetricPill label="SpO₂" value={readiness.spo2} unit="%" color="#00d4aa" />
            </div>
          </div>
        </section>

        {/* Today's Limiter */}
        <section className="flux-card border-flux-warm/30 bg-flux-warm/5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-flux-warm/15 flex items-center justify-center shrink-0">
              <AlertTriangle size={18} className="text-flux-warm" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Today's Predicted Limiter</h3>
              <p className="text-flux-text-dim text-sm mt-1">{workout.predictedLimiter}</p>
              <p className="text-[11px] text-flux-muted mt-2">
                Based on lactate trends, sweat sodium, and {workout.environment.tempF}°F conditions
              </p>
            </div>
          </div>
        </section>

        {/* Next Workout */}
        <section
          className="flux-card cursor-pointer hover:border-flux-accent/40 transition-colors"
          onClick={() => navigate(`/workout/${workout.id}`)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-flux-accent font-medium uppercase tracking-wider">
                Next Session
              </p>
              <h3 className="font-semibold text-lg mt-1">{workout.title}</h3>
              <p className="text-flux-text-dim text-sm mt-0.5">
                {scheduledTime} · {workout.durationMin} min · {workout.sport}
              </p>
            </div>
            <ChevronRight className="text-flux-muted" size={20} />
          </div>
          <div className="flex gap-2 mt-4">
            <span className="text-[10px] px-2 py-1 rounded-lg bg-flux-surface border border-flux-border">
              {workout.intensity}
            </span>
            <span className="text-[10px] px-2 py-1 rounded-lg bg-flux-surface border border-flux-border">
              {workout.environment.tempF}°F · {workout.environment.humidity}% humidity
            </span>
          </div>
        </section>

        {/* Quick Pack Plan */}
        <section className="flux-card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold flex items-center gap-2">
              <Package size={16} className="text-flux-accent" />
              Quick Pack Plan
            </h2>
            <button
              onClick={() => navigate(`/workout/${workout.id}`)}
              className="text-xs text-flux-accent font-medium"
            >
              View full plan
            </button>
          </div>
          <div className="space-y-2">
            {workout.packPlan.map((item) => (
              <div
                key={item.itemId}
                className="flex items-center justify-between py-2 border-b border-flux-border/50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-flux-accent/10 text-flux-accent text-xs font-bold flex items-center justify-center">
                    {item.quantity}×
                  </span>
                  <span className="text-sm">{item.name}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Environment snapshot */}
        <section className="grid grid-cols-2 gap-3 pb-4">
          <div className="flux-card flex items-center gap-3">
            <Flame size={20} className="text-flux-warm" />
            <div>
              <p className="text-[10px] text-flux-muted uppercase">Thermal Load</p>
              <p className="font-semibold">Moderate</p>
            </div>
          </div>
          <div className="flux-card flex items-center gap-3">
            <Droplets size={20} className="text-flux-cool" />
            <div>
              <p className="text-[10px] text-flux-muted uppercase">Est. Sweat Loss</p>
              <p className="font-semibold">1.2 L/hr</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
