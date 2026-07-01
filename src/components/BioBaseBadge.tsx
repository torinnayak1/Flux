import { Wifi, Battery, Activity } from 'lucide-react'
import { mockBioBase } from '../data/mockData'

export default function BioBaseBadge() {
  const { connected, battery, lastSync, signalQuality } = mockBioBase

  const qualityColor = {
    excellent: 'text-flux-accent',
    good: 'text-flux-cool',
    fair: 'text-flux-sodium',
    poor: 'text-flux-warm',
  }[signalQuality]

  return (
    <div className="flux-card flex items-center gap-3 py-3">
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-flux-accent/10 flex items-center justify-center">
          <Activity size={20} className="text-flux-accent" />
        </div>
        {connected && (
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-flux-accent rounded-full border-2 border-flux-card animate-pulse-slow" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">Flux Patch</span>
          <span className={`text-[10px] font-medium ${qualityColor}`}>
            {signalQuality}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-flux-text-dim mt-0.5">
          <span className="flex items-center gap-1">
            <Wifi size={10} /> Synced {lastSync}
          </span>
          <span className="flex items-center gap-1">
            <Battery size={10} /> {battery}%
          </span>
        </div>
      </div>
    </div>
  )
}
