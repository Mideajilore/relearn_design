import { NavLink } from 'react-router-dom';
import { CalendarIcon, CompassIcon, SunIcon } from './icons';
import type { IconComponent } from './icons';

const ROUTES: { to: string; label: string; end: boolean; icon: IconComponent }[] = [
  { to: '/', label: 'Today', end: true, icon: SunIcon },
  { to: '/guide', label: 'Guide', end: false, icon: CompassIcon },
  { to: '/history', label: 'History', end: false, icon: CalendarIcon },
];

export function Nav() {
  return (
    <header className="border-b border-grey-200 bg-white">
      <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <span className="text-grey-900">Operator’s Guide</span>

        <nav aria-label="Main">
          <ul className="flex items-center gap-1">
            {ROUTES.map(({ to, label, end, icon: Glyph }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-control px-3 py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-grey-200 ${
                      isActive
                        ? 'bg-grey-50 text-grey-900'
                        : 'text-grey-500 hover:bg-grey-50 hover:text-grey-700'
                    }`
                  }
                >
                  <Glyph className="h-5 w-5 shrink-0" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
