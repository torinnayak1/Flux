import type { PantryItem, ProductCategory } from '../types'
import { categoryColors } from '../data/mockData'
import { AlertCircle, Plus, Minus } from 'lucide-react'

interface MedicineBottleProps {
  item: PantryItem
  onClick: () => void
  onIncrement: () => void
  onDecrement: () => void
}

const bottleShapes: Record<ProductCategory, 'tube' | 'bottle' | 'tub' | 'pill' | 'packet' | 'can'> = {
  gel: 'tube',
  drink: 'bottle',
  electrolyte: 'packet',
  capsule: 'pill',
  protein: 'tub',
  caffeine: 'tube',
  other: 'can',
}

export default function MedicineBottle({ item, onClick, onIncrement, onDecrement }: MedicineBottleProps) {
  const color = categoryColors[item.category]
  const shape = bottleShapes[item.category]
  const lowStock = item.quantity <= 3
  const fillPercent = Math.min(100, (item.quantity / item.packageSize) * 100)

  return (
    <div className="flex flex-col items-center group">
      <button onClick={onClick} className="relative flex flex-col items-center w-[72px] transition-transform active:scale-95">
        {lowStock && (
          <span className="absolute -top-1 -right-1 z-20 w-4 h-4 bg-flux-warm rounded-full flex items-center justify-center shadow-lg">
            <AlertCircle size={10} className="text-white" />
          </span>
        )}

        {/* Bottle visual */}
        <div className="relative h-[88px] flex items-end justify-center">
          {shape === 'bottle' && (
            <div className="bottle-sports" style={{ '--bottle-color': color } as React.CSSProperties}>
              <div className="bottle-sports-neck" />
              <div className="bottle-sports-body">
                <div className="bottle-fill" style={{ height: `${fillPercent}%`, backgroundColor: `${color}88` }} />
                <span className="bottle-label">{item.quantity}</span>
              </div>
            </div>
          )}
          {shape === 'tube' && (
            <div className="bottle-tube" style={{ '--bottle-color': color } as React.CSSProperties}>
              <div className="bottle-tube-cap" />
              <div className="bottle-tube-body">
                <div className="bottle-fill" style={{ height: `${fillPercent}%`, backgroundColor: `${color}88` }} />
                <span className="bottle-label">{item.quantity}</span>
              </div>
            </div>
          )}
          {shape === 'pill' && (
            <div className="bottle-pill" style={{ '--bottle-color': color } as React.CSSProperties}>
              <div className="bottle-pill-cap" />
              <div className="bottle-pill-body">
                <div className="bottle-fill pill-fill" style={{ height: `${fillPercent}%` }} />
                <span className="bottle-label">{item.quantity}</span>
              </div>
            </div>
          )}
          {shape === 'tub' && (
            <div className="bottle-tub" style={{ '--bottle-color': color } as React.CSSProperties}>
              <div className="bottle-tub-lid" />
              <div className="bottle-tub-body">
                <div className="bottle-fill" style={{ height: `${fillPercent}%`, backgroundColor: `${color}66` }} />
                <span className="bottle-label">{item.quantity}</span>
              </div>
            </div>
          )}
          {shape === 'packet' && (
            <div className="bottle-packet" style={{ '--bottle-color': color } as React.CSSProperties}>
              <div className="bottle-packet-top" />
              <div className="bottle-packet-body">
                <span className="bottle-label">{item.quantity}</span>
              </div>
            </div>
          )}
          {shape === 'can' && (
            <div className="bottle-can" style={{ '--bottle-color': color } as React.CSSProperties}>
              <div className="bottle-can-body">
                <div className="bottle-fill" style={{ height: `${fillPercent}%`, backgroundColor: `${color}88` }} />
                <span className="bottle-label">{item.quantity}</span>
              </div>
            </div>
          )}
        </div>

        <p className="text-[9px] font-medium text-center leading-tight mt-2 line-clamp-2 w-full px-0.5 text-flux-text-dim group-hover:text-flux-text transition-colors">
          {item.name}
        </p>
      </button>

      <div className="flex gap-1 mt-1.5">
        <button
          onClick={(e) => { e.stopPropagation(); onDecrement() }}
          className="w-6 h-6 rounded-md bg-flux-surface/80 border border-flux-border flex items-center justify-center hover:border-flux-warm/40"
        >
          <Minus size={10} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onIncrement() }}
          className="w-6 h-6 rounded-md bg-flux-surface/80 border border-flux-border flex items-center justify-center hover:border-flux-accent/40"
        >
          <Plus size={10} />
        </button>
      </div>
    </div>
  )
}
