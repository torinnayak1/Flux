import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { mockLiveReadings, mockReports } from '../data/mockData'
import {
  Activity,
  Droplets,
  Thermometer,
  Heart,
  TrendingUp,
  FileText,
  ChevronRight,
  Calendar,
} from 'lucide-react'

type Tab = 'sensors' | 'history' | 'reports'

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>('sensors')

  const tabs: { id: Tab; label: string }[] = [
    { id: 'sensors', label: 'Sensors' },
    { id: 'history', label: 'History' },
    { id: 'reports', label: 'Reports' },
  ]

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Analytics & sensor data" />

      <div className="px-5">
        <div className="flex gap-1 p-1 bg-flux-surface rounded-xl border border-flux-border mb-5">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                tab === t.id
                  ? 'bg-flux-accent text-flux-bg'
                  : 'text-flux-text-dim hover:text-flux-text'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'sensors' && (
          <div className="space-y-5 pb-6">
            {/* Mini charts - cosmetic bar visualizations */}
            {[
              { label: 'Lactate', key: 'lactate' as const, unit: 'mmol/L', color: '#ff6b4a', icon: Activity },
              { label: 'Sweat Rate', key: 'sweatRate' as const, unit: 'L/hr', color: '#4a9eff', icon: Droplets },
              { label: 'Sweat Sodium', key: 'sweatSodium' as const, unit: 'mEq/L', color: '#f5c542', icon: Droplets },
              { label: 'Skin Temp', key: 'skinTemp' as const, unit: '°F', color: '#ff8c42', icon: Thermometer },
              { label: 'SpO₂', key: 'spo2' as const, unit: '%', color: '#00d4aa', icon: Heart },
            ].map(({ label, key, unit, color, icon: Icon }) => {
              const values = mockLiveReadings.map((r) => r[key])
              const max = Math.max(...values)
              const min = Math.min(...values)
              const latest = values[values.length - 1]
              return (
                <section key={key} className="flux-card">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icon size={16} style={{ color }} />
                      <h3 className="font-semibold text-sm">{label}</h3>
                    </div>
                    <span className="text-lg font-bold" style={{ color }}>
                      {latest}
                      <span className="text-xs font-normal text-flux-muted ml-1">{unit}</span>
                    </span>
                  </div>
                  <div className="flex items-end gap-1.5 h-16">
                    {mockLiveReadings.map((r, i) => {
                      const val = r[key]
                      const height = ((val - min) / (max - min || 1)) * 100
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className="w-full rounded-t-md transition-all"
                            style={{
                              height: `${Math.max(height, 8)}%`,
                              backgroundColor: color,
                              opacity: 0.7 + (i / mockLiveReadings.length) * 0.3,
                            }}
                          />
                          <span className="text-[9px] text-flux-muted">{r.timestamp}</span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex justify-between text-[10px] text-flux-muted mt-2">
                    <span>Min: {min}</span>
                    <span>Max: {max}</span>
                  </div>
                </section>
              )
            })}

            <section className="flux-card">
              <h3 className="font-semibold text-sm mb-2">Motion / Contact Quality</h3>
              <div className="h-2 bg-flux-surface rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-flux-accent to-flux-cool rounded-full"
                  style={{ width: '85%' }}
                />
              </div>
              <p className="text-xs text-flux-text-dim mt-2">
                85% — Sensor readings are trustworthy for this session
              </p>
            </section>
          </div>
        )}

        {tab === 'history' && (
          <div className="space-y-3 pb-6">
            <p className="text-sm text-flux-text-dim mb-2">Recent workout sessions</p>
            {mockReports.map((session) => (
              <div key={session.id} className="flux-card">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm">{session.workoutTitle}</h3>
                    <p className="text-xs text-flux-text-dim flex items-center gap-1 mt-0.5">
                      <Calendar size={10} />
                      {new Date(session.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-flux-accent">{session.responseScore}</span>
                    <p className="text-[10px] text-flux-muted">Response</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-flux-border/50">
                  <div className="text-center">
                    <p className="text-sm font-semibold">{session.energy}/10</p>
                    <p className="text-[10px] text-flux-muted">Energy</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold">{session.giComfort}/10</p>
                    <p className="text-[10px] text-flux-muted">GI Comfort</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold">{session.adherence}/10</p>
                    <p className="text-[10px] text-flux-muted">Adherence</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'reports' && (
          <div className="space-y-4 pb-6">
            <section className="flux-card">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={16} className="text-flux-accent" />
                <h3 className="font-semibold">Monthly Trends</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-flux-surface">
                  <p className="text-[10px] text-flux-muted uppercase">Avg Response</p>
                  <p className="text-2xl font-bold text-flux-accent mt-1">79</p>
                  <p className="text-[10px] text-flux-accent">+4 vs last month</p>
                </div>
                <div className="p-3 rounded-xl bg-flux-surface">
                  <p className="text-[10px] text-flux-muted uppercase">Plan Adherence</p>
                  <p className="text-2xl font-bold mt-1">86%</p>
                  <p className="text-[10px] text-flux-accent">+12% improvement</p>
                </div>
                <div className="p-3 rounded-xl bg-flux-surface">
                  <p className="text-[10px] text-flux-muted uppercase">Late Fade Reports</p>
                  <p className="text-2xl font-bold text-flux-warm mt-1">2</p>
                  <p className="text-[10px] text-flux-text-dim">Down from 5</p>
                </div>
                <div className="p-3 rounded-xl bg-flux-surface">
                  <p className="text-[10px] text-flux-muted uppercase">Sessions Planned</p>
                  <p className="text-2xl font-bold mt-1">18</p>
                  <p className="text-[10px] text-flux-text-dim">This month</p>
                </div>
              </div>
            </section>

            <section className="flux-card">
              <h3 className="font-semibold text-sm mb-3">Fatigue Pattern</h3>
              <p className="text-sm text-flux-text-dim">
                Your primary limiter this month is <span className="text-flux-warm font-medium">thermal + sodium strain</span> during
                sessions over 60 minutes in temps above 75°F. Lactate remains stable until the fade window.
              </p>
            </section>

            <section className="flux-card">
              <h3 className="font-semibold text-sm mb-3">Nutrition Response</h3>
              <div className="space-y-2">
                {[
                  { product: 'Maurten Gel 100', score: 8, note: 'Works well in heat' },
                  { product: 'GU Roctane Gel', score: 6, note: 'GI issues when taken late' },
                  { product: 'LMNT Citrus', score: 8, note: 'Good sodium replacement' },
                ].map((item) => (
                  <div key={item.product} className="flex items-center justify-between py-2 border-b border-flux-border/50 last:border-0">
                    <div>
                      <p className="text-sm">{item.product}</p>
                      <p className="text-[10px] text-flux-muted">{item.note}</p>
                    </div>
                    <span className="text-sm font-bold text-flux-accent">{item.score}/10</span>
                  </div>
                ))}
              </div>
            </section>

            {mockReports.map((report) => (
              <div key={report.id} className="flux-card flex items-center gap-3 cursor-pointer hover:border-flux-accent/30 transition-colors">
                <FileText size={18} className="text-flux-muted shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{report.workoutTitle} Report</p>
                  <p className="text-xs text-flux-text-dim">{report.notes}</p>
                </div>
                <ChevronRight size={16} className="text-flux-muted shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
