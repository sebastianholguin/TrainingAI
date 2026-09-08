import { LayoutGrid, Users } from 'lucide-react'
import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: '/employees', label: 'Employees', icon: Users },
]

/** Top bar + left sidebar, matching `Employee Directory.png`. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-3 border-b bg-white px-6 py-4">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
            <path
              d="M4 20V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v15M15 20V9h4a1 1 0 0 1 1 1v10M4 20h16M7 8h2M7 11h2M7 14h2"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h1 className="text-lg font-bold tracking-tight">HR Systems - Workshop Session 1</h1>
      </header>

      <div className="flex">
        <aside className="w-64 shrink-0 px-6 py-6">
          <div className="px-3">
            <p className="font-bold">HR Portal</p>
            <p className="text-sm text-muted-foreground">Foundation Layer</p>
          </div>

          <nav className="mt-6 space-y-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent/50',
                  )
                }
              >
                <Icon className="size-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex-1 px-8 py-6">{children}</main>
      </div>
    </div>
  )
}
