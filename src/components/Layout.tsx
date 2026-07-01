import { NavLink, Outlet } from 'react-router-dom'
import { Home, Dumbbell, BarChart3, Package, User } from 'lucide-react'

const tabs = [
  { to: '/', icon: Home, label: 'Today' },
  { to: '/workout', icon: Dumbbell, label: 'Workout' },
  { to: '/dashboard', icon: BarChart3, label: 'Data' },
  { to: '/pantry', icon: Package, label: 'Pantry' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export default function Layout() {
  return (
    <div className="mobile-shell flex flex-col">
      <main className="flex-1 overflow-y-auto pb-24">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-flux-surface/95 backdrop-blur-lg border-t border-flux-border z-50">
        <div className="flex items-center justify-around px-2 py-2">
          {tabs.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors ${
                  isActive ? 'tab-active' : 'text-flux-muted'
                }`
              }
            >
              <Icon size={22} strokeWidth={2} />
              <span className="text-[10px] font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
