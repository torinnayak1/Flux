interface MetricPillProps {
  label: string
  value: string | number
  unit?: string
  color?: string
}

export default function MetricPill({ label, value, unit, color = '#00d4aa' }: MetricPillProps) {
  return (
    <div className="flux-card flex flex-col items-center py-3 px-2 min-w-[72px]">
      <span className="text-[10px] text-flux-muted uppercase tracking-wider">{label}</span>
      <span className="text-lg font-bold mt-1" style={{ color }}>
        {value}
        {unit && <span className="text-xs font-normal text-flux-text-dim ml-0.5">{unit}</span>}
      </span>
    </div>
  )
}
