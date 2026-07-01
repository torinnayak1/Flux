import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { useFlux } from '../context/FluxContext'
import {
  User,
  Mail,
  Scale,
  Shield,
  CreditCard,
  Plus,
  X,
  Heart,
  AlertTriangle,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react'

export default function ProfilePage() {
  const { profile, updateProfile, addCondition, removeCondition } = useFlux()
  const [showAddCondition, setShowAddCondition] = useState(false)
  const [newConditionName, setNewConditionName] = useState('')
  const [newConditionNotes, setNewConditionNotes] = useState('')
  const [newConditionSeverity, setNewConditionSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild')

  const handleAddCondition = () => {
    if (!newConditionName.trim()) return
    addCondition({
      name: newConditionName.trim(),
      severity: newConditionSeverity,
      notes: newConditionNotes,
    })
    setNewConditionName('')
    setNewConditionNotes('')
    setShowAddCondition(false)
  }

  return (
    <div>
      <PageHeader title="Profile" subtitle="Health, account & billing" />

      <div className="px-5 space-y-5 pb-6">
        {/* Avatar & basic info */}
        <section className="flux-card flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-flux-accent to-flux-cool flex items-center justify-center">
            <User size={28} className="text-flux-bg" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">{profile.name}</h2>
            <p className="text-sm text-flux-text-dim flex items-center gap-1">
              <Mail size={12} /> {profile.email}
            </p>
          </div>
        </section>

        {/* Body & sports */}
        <section className="flux-card">
          <h3 className="font-semibold text-sm mb-3">Athlete Profile</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-flux-text-dim flex items-center gap-2">
                <Scale size={14} /> Body Mass
              </span>
              <span className="font-medium">{profile.bodyMassKg} kg</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-flux-text-dim">Sports</span>
              <div className="flex gap-1">
                {profile.sports.map((s) => (
                  <span key={s} className="text-[10px] px-2 py-1 rounded-lg bg-flux-surface border border-flux-border">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-flux-text-dim">Caffeine Sensitivity</span>
              <span className="text-sm capitalize">{profile.caffeineSensitivity}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-flux-text-dim">GI Tolerance</span>
              <span className="text-sm capitalize">{profile.giTolerance}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-flux-text-dim flex items-center gap-2">
                <Shield size={14} /> Competition-Safe Mode
              </span>
              <button
                onClick={() => updateProfile({ competitionMode: !profile.competitionMode })}
                className="text-flux-accent"
              >
                {profile.competitionMode ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-flux-muted" />}
              </button>
            </div>
          </div>
        </section>

        {/* Medical conditions */}
        <section className="flux-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Heart size={14} className="text-flux-warm" />
              Life Conditions & Medical Issues
            </h3>
            <button
              onClick={() => setShowAddCondition(true)}
              className="w-7 h-7 rounded-lg bg-flux-accent/10 flex items-center justify-center text-flux-accent"
            >
              <Plus size={14} />
            </button>
          </div>
          <p className="text-xs text-flux-text-dim mb-3">
            Flux uses this to personalize supplement recommendations and safety guardrails.
          </p>
          <div className="space-y-2">
            {profile.conditions.map((condition) => (
              <div
                key={condition.id}
                className="p-3 rounded-xl bg-flux-surface border border-flux-border"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">{condition.name}</p>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded mt-1 inline-block ${
                        condition.severity === 'severe'
                          ? 'bg-flux-warm/20 text-flux-warm'
                          : condition.severity === 'moderate'
                            ? 'bg-flux-sodium/20 text-flux-sodium'
                            : 'bg-flux-accent/10 text-flux-accent'
                      }`}
                    >
                      {condition.severity}
                    </span>
                    {condition.notes && (
                      <p className="text-xs text-flux-text-dim mt-1">{condition.notes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeCondition(condition.id)}
                    className="text-flux-muted p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
            {profile.conditions.length === 0 && (
              <p className="text-sm text-flux-muted text-center py-4">No conditions added</p>
            )}
          </div>
        </section>

        {/* Billing */}
        <section className="flux-card">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <CreditCard size={14} />
            Account & Billing
          </h3>
          <div className="p-4 rounded-xl bg-gradient-to-r from-flux-accent/10 to-flux-cool/10 border border-flux-accent/20 mb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold capitalize">{profile.plan} Plan</p>
                <p className="text-xs text-flux-text-dim mt-0.5">Flux Optimizer + Pantry</p>
              </div>
              <span className="text-lg font-bold text-flux-accent">
                {profile.plan === 'pro' ? '$14.99' : '$4.99'}
                <span className="text-xs font-normal text-flux-muted">/mo</span>
              </span>
            </div>
          </div>
          {[
            { label: 'Payment Method', value: 'Visa •••• 4242' },
            { label: 'Next Billing', value: 'Jul 15, 2026' },
            { label: 'Flux Patch', value: 'Connected · Serial FLX-2847' },
          ].map((row) => (
            <button
              key={row.label}
              className="flex items-center justify-between w-full py-3 border-b border-flux-border/50 last:border-0"
            >
              <span className="text-sm text-flux-text-dim">{row.label}</span>
              <span className="text-sm flex items-center gap-1">
                {row.value}
                <ChevronRight size={14} className="text-flux-muted" />
              </span>
            </button>
          ))}
        </section>

        {/* Safety notice */}
        <section className="flux-card border-flux-border bg-flux-surface/50">
          <div className="flex gap-3">
            <AlertTriangle size={16} className="text-flux-sodium shrink-0 mt-0.5" />
            <p className="text-xs text-flux-text-dim leading-relaxed">
              Flux provides performance and wellness guidance — not medical diagnosis or treatment.
              Supplement recommendations are based on estimated needs from your physiology and pantry inventory.
            </p>
          </div>
        </section>
      </div>

      {showAddCondition && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-flux-card rounded-t-3xl border border-flux-border p-5 pb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Add Condition</h2>
              <button onClick={() => setShowAddCondition(false)}>
                <X size={20} className="text-flux-muted" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                className="flux-input"
                placeholder="Condition name"
                value={newConditionName}
                onChange={(e) => setNewConditionName(e.target.value)}
              />
              <div className="flex gap-2">
                {(['mild', 'moderate', 'severe'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setNewConditionSeverity(s)}
                    className={`flex-1 py-2 rounded-xl text-xs font-medium border capitalize ${
                      newConditionSeverity === s
                        ? 'border-flux-accent bg-flux-accent/10 text-flux-accent'
                        : 'border-flux-border bg-flux-surface'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <textarea
                className="flux-input resize-none h-20"
                placeholder="Notes (optional)"
                value={newConditionNotes}
                onChange={(e) => setNewConditionNotes(e.target.value)}
              />
              <button onClick={handleAddCondition} className="flux-btn-primary w-full">
                Add Condition
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
