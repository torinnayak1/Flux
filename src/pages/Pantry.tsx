import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import MedicineBottle from '../components/MedicineBottle'
import { useFlux } from '../context/FluxContext'
import {
  categoryLabels,
  categoryColors,
  categoryOrder,
  certificationLabels,
} from '../data/mockData'
import type { PantryItem, ProductCategory, Certification } from '../types'
import {
  Plus,
  Minus,
  X,
  AlertCircle,
  Clock,
  Pill,
  Droplet,
  Cookie,
  FlaskConical,
  CircleDot,
  Beef,
  Coffee,
  Package,
} from 'lucide-react'

const categoryIcons: Record<ProductCategory, typeof Pill> = {
  gel: Cookie,
  drink: Droplet,
  electrolyte: FlaskConical,
  capsule: CircleDot,
  protein: Beef,
  caffeine: Coffee,
  other: Package,
}

export default function PantryPage() {
  const {
    pantry,
    intakeLogs,
    issueReports,
    updateQuantity,
    addPantryItem,
    logIntake,
    reportIssue,
  } = useFlux()

  const [selectedItem, setSelectedItem] = useState<PantryItem | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showIssueForm, setShowIssueForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'cabinet' | 'logs'>('cabinet')

  const groupedByCategory = categoryOrder
    .map((cat) => ({
      category: cat,
      items: pantry.filter((p) => p.category === cat),
    }))
    .filter((g) => g.items.length > 0)

  return (
    <div>
      <PageHeader
        title="Pantry"
        subtitle="Your supplement cabinet"
        action={
          <button
            onClick={() => setShowAddForm(true)}
            className="w-9 h-9 rounded-xl bg-flux-accent/10 flex items-center justify-center text-flux-accent"
          >
            <Plus size={20} />
          </button>
        }
      />

      <div className="px-5">
        <div className="flex gap-1 p-1 bg-flux-surface rounded-xl border border-flux-border mb-5">
          {(['cabinet', 'logs'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === t
                  ? 'bg-flux-accent text-flux-bg'
                  : 'text-flux-text-dim hover:text-flux-text'
              }`}
            >
              {t === 'cabinet' ? 'Cabinet' : 'Intake Log'}
            </button>
          ))}
        </div>

        {activeTab === 'cabinet' && (
          <div className="space-y-4 pb-6">
            <div className="medicine-cabinet p-3 pt-4">
              {/* Cabinet header / mirror strip */}
              <div className="cabinet-mirror rounded-lg px-4 py-3 mb-3 flex flex-col items-center gap-2">
                <div className="cabinet-handle" />
                <span className="text-[10px] text-flux-muted/80 uppercase tracking-[0.2em] font-medium">
                  Flux Pantry
                </span>
              </div>

              {/* Shelves grouped by product type */}
              <div className="space-y-1">
                {groupedByCategory.map(({ category, items }) => {
                  const Icon = categoryIcons[category]
                  const color = categoryColors[category]
                  return (
                    <div key={category}>
                      <div className="cabinet-shelf px-3 pt-3 pb-4">
                        <div className="flex items-center gap-2 shelf-category-label mb-3">
                          <Icon size={11} style={{ color }} />
                          <span style={{ color }}>{categoryLabels[category]}</span>
                          <span className="text-flux-muted/50">· {items.length}</span>
                        </div>
                        <div className="flex flex-wrap gap-x-3 gap-y-4 justify-start px-1">
                          {items.map((item) => (
                            <MedicineBottle
                              key={item.id}
                              item={item}
                              onClick={() => setSelectedItem(item)}
                              onIncrement={() => updateQuantity(item.id, 1)}
                              onDecrement={() => updateQuantity(item.id, -1)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {pantry.length === 0 && (
                <p className="text-xs text-flux-muted text-center py-10">Cabinet is empty</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="space-y-4 pb-6">
            <section>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Clock size={14} /> Recent Intake
              </h3>
              <div className="space-y-2">
                {intakeLogs.map((log) => (
                  <div key={log.id} className="flux-card py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{log.itemName}</p>
                      <p className="text-[10px] text-flux-muted">
                        {new Date(log.timestamp).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                        {' · '}
                        <span className="capitalize">{log.context.replace('-', ' ')}</span>
                      </p>
                    </div>
                    <span className="text-flux-accent font-bold">−{log.quantity}</span>
                  </div>
                ))}
              </div>
            </section>

            {issueReports.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-flux-warm">
                  <AlertCircle size={14} /> Issue Reports
                </h3>
                <div className="space-y-2">
                  {issueReports.map((report) => (
                    <div key={report.id} className="flux-card py-3 border-flux-warm/20">
                      <p className="text-sm font-medium">{report.itemName}</p>
                      <p className="text-xs text-flux-warm capitalize mt-0.5">
                        {report.issue.replace('-', ' ')}
                      </p>
                      <p className="text-[10px] text-flux-muted mt-1">{report.notes}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {/* Item detail modal */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onLogIntake={(qty, ctx) => {
            logIntake(selectedItem.id, qty, ctx)
            setSelectedItem(null)
          }}
          onReportIssue={() => {
            setShowIssueForm(true)
          }}
        />
      )}

      {showIssueForm && selectedItem && (
        <IssueReportModal
          item={selectedItem}
          onClose={() => {
            setShowIssueForm(false)
            setSelectedItem(null)
          }}
          onSubmit={(issue, notes) => {
            reportIssue(selectedItem.id, issue, notes)
            setShowIssueForm(false)
            setSelectedItem(null)
          }}
        />
      )}

      {showAddForm && (
        <AddItemModal
          onClose={() => setShowAddForm(false)}
          onAdd={(item) => {
            addPantryItem(item)
            setShowAddForm(false)
          }}
        />
      )}
    </div>
  )
}

function ItemDetailModal({
  item,
  onClose,
  onLogIntake,
  onReportIssue,
}: {
  item: PantryItem
  onClose: () => void
  onLogIntake: (qty: number, ctx: 'pre-workout' | 'during' | 'post-workout' | 'daily') => void
  onReportIssue: () => void
}) {
  const color = categoryColors[item.category]
  const Icon = categoryIcons[item.category]

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-flux-card rounded-t-3xl border border-flux-border p-5 pb-8 animate-[slideUp_0.3s_ease]">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${color}20` }}
            >
              <Icon size={24} style={{ color }} />
            </div>
            <div>
              <h2 className="font-semibold">{item.name}</h2>
              <p className="text-xs text-flux-muted">{categoryLabels[item.category]}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-flux-muted">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {item.sodiumMg > 0 && (
            <div className="p-2 rounded-lg bg-flux-surface text-center">
              <p className="text-sm font-bold text-flux-sodium">{item.sodiumMg}mg</p>
              <p className="text-[9px] text-flux-muted">Sodium</p>
            </div>
          )}
          {item.carbsG > 0 && (
            <div className="p-2 rounded-lg bg-flux-surface text-center">
              <p className="text-sm font-bold text-flux-carb">{item.carbsG}g</p>
              <p className="text-[9px] text-flux-muted">Carbs</p>
            </div>
          )}
          {item.caffeineMg > 0 && (
            <div className="p-2 rounded-lg bg-flux-surface text-center">
              <p className="text-sm font-bold text-flux-warm">{item.caffeineMg}mg</p>
              <p className="text-[9px] text-flux-muted">Caffeine</p>
            </div>
          )}
          {item.proteinG > 0 && (
            <div className="p-2 rounded-lg bg-flux-surface text-center">
              <p className="text-sm font-bold text-purple-400">{item.proteinG}g</p>
              <p className="text-[9px] text-flux-muted">Protein</p>
            </div>
          )}
        </div>

        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-flux-text-dim">Remaining</span>
            <span className="font-semibold">{item.quantity} / {item.packageSize} {item.servingUnit}s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-flux-text-dim">Tolerance Score</span>
            <span className="font-semibold text-flux-accent">{item.toleranceScore}/10</span>
          </div>
          <div className="flex justify-between">
            <span className="text-flux-text-dim">Certification</span>
            <span className="text-xs">{certificationLabels[item.certification]}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-flux-text-dim">Expires</span>
            <span>{item.expiration}</span>
          </div>
        </div>

        {item.notes && (
          <p className="text-xs text-flux-warm bg-flux-warm/10 p-2 rounded-lg mb-4">{item.notes}</p>
        )}

        <div className="space-y-2">
          <p className="text-xs text-flux-muted uppercase tracking-wider">Log intake</p>
          <div className="grid grid-cols-2 gap-2">
            {(['pre-workout', 'during', 'post-workout', 'daily'] as const).map((ctx) => (
              <button
                key={ctx}
                onClick={() => onLogIntake(1, ctx)}
                className="flux-btn-secondary text-xs py-2 capitalize"
              >
                {ctx.replace('-', ' ')}
              </button>
            ))}
          </div>
          <button
            onClick={onReportIssue}
            className="flux-btn-secondary w-full text-flux-warm border-flux-warm/30 text-sm mt-2"
          >
            <AlertCircle size={14} />
            Report discomfort or issue
          </button>
        </div>
      </div>
    </div>
  )
}

function IssueReportModal({
  item,
  onClose,
  onSubmit,
}: {
  item: PantryItem
  onClose: () => void
  onSubmit: (issue: 'gi-discomfort' | 'jitters' | 'thirst' | 'bloating' | 'other', notes: string) => void
}) {
  const [issue, setIssue] = useState<'gi-discomfort' | 'jitters' | 'thirst' | 'bloating' | 'other'>('gi-discomfort')
  const [notes, setNotes] = useState('')

  const issues = [
    { id: 'gi-discomfort' as const, label: 'GI Discomfort' },
    { id: 'jitters' as const, label: 'Jitters / Anxiety' },
    { id: 'thirst' as const, label: 'Excessive Thirst' },
    { id: 'bloating' as const, label: 'Bloating' },
    { id: 'other' as const, label: 'Other' },
  ]

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-flux-card rounded-t-3xl border border-flux-border p-5 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Report Issue — {item.name}</h2>
          <button onClick={onClose}><X size={20} className="text-flux-muted" /></button>
        </div>
        <div className="space-y-2 mb-4">
          {issues.map((i) => (
            <button
              key={i.id}
              onClick={() => setIssue(i.id)}
              className={`w-full text-left px-4 py-3 rounded-xl border transition-colors ${
                issue === i.id
                  ? 'border-flux-warm bg-flux-warm/10 text-flux-warm'
                  : 'border-flux-border bg-flux-surface'
              }`}
            >
              {i.label}
            </button>
          ))}
        </div>
        <textarea
          className="flux-input resize-none h-20 mb-4"
          placeholder="Additional notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button onClick={() => onSubmit(issue, notes)} className="flux-btn-primary w-full">
          Submit Report
        </button>
      </div>
    </div>
  )
}

function AddItemModal({
  onClose,
  onAdd,
}: {
  onClose: () => void
  onAdd: (item: Omit<PantryItem, 'id'>) => void
}) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState<ProductCategory>('gel')
  const [quantity, setQuantity] = useState(10)
  const [sodium, setSodium] = useState(0)
  const [carbs, setCarbs] = useState(25)
  const [caffeine, setCaffeine] = useState(0)
  const [protein, setProtein] = useState(0)

  const handleSubmit = () => {
    if (!name.trim()) return
    onAdd({
      name: name.trim(),
      category,
      quantity,
      packageSize: quantity,
      servingUnit: category === 'drink' ? 'bottle' : category === 'capsule' ? 'capsule' : category === 'protein' ? 'scoop' : 'serving',
      sodiumMg: sodium,
      carbsG: carbs,
      caffeineMg: caffeine,
      proteinG: protein,
      fluidMl: category === 'drink' ? 500 : 0,
      certification: 'unknown' as Certification,
      expiration: '2027-12',
      toleranceScore: 7,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-flux-card rounded-t-3xl border border-flux-border p-5 pb-8 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Add Supplement</h2>
          <button onClick={onClose}><X size={20} className="text-flux-muted" /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-flux-muted uppercase tracking-wider">Product Name</label>
            <input className="flux-input mt-1" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Maurten Gel 100" />
          </div>

          <div>
            <label className="text-xs text-flux-muted uppercase tracking-wider">Category</label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {(Object.keys(categoryLabels) as ProductCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-2 py-2 rounded-lg text-[10px] font-medium border transition-colors ${
                    category === cat
                      ? 'border-flux-accent bg-flux-accent/10 text-flux-accent'
                      : 'border-flux-border bg-flux-surface'
                  }`}
                >
                  {categoryLabels[cat]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-flux-muted uppercase tracking-wider">Quantity</label>
            <div className="flex items-center gap-3 mt-1">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-xl bg-flux-surface border border-flux-border flex items-center justify-center"><Minus size={16} /></button>
              <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-xl bg-flux-surface border border-flux-border flex items-center justify-center"><Plus size={16} /></button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-flux-muted">Sodium (mg)</label>
              <input type="number" className="flux-input mt-1" value={sodium} onChange={(e) => setSodium(+e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-flux-muted">Carbs (g)</label>
              <input type="number" className="flux-input mt-1" value={carbs} onChange={(e) => setCarbs(+e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-flux-muted">Caffeine (mg)</label>
              <input type="number" className="flux-input mt-1" value={caffeine} onChange={(e) => setCaffeine(+e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-flux-muted">Protein (g)</label>
              <input type="number" className="flux-input mt-1" value={protein} onChange={(e) => setProtein(+e.target.value)} />
            </div>
          </div>

          <button onClick={handleSubmit} className="flux-btn-primary w-full">
            Add to Pantry
          </button>
        </div>
      </div>
    </div>
  )
}
