import { NavLink } from 'react-router-dom';

const ROUTES = [
  { to: '/', label: 'Today', end: true },
  { to: '/guide', label: 'Guide', end: false },
  { to: '/history', label: 'History', end: false },
];

export function Nav() {
  return (
    <header className="border-b border-grey-200 bg-white">
      <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <span className="text-grey-900">Operator’s Guide</span>

        <nav aria-label="Main">
          <ul className="flex items-center gap-1">
            {ROUTES.map((route) => (
              <li key={route.to}>
                <NavLink
                  to={route.to}
                  end={route.end}
                  className={({ isActive }) =>
                    `block rounded-control px-3 py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-grey-200 ${
                      isActive
                        ? 'bg-grey-50 text-grey-900'
                        : 'text-grey-500 hover:bg-grey-50 hover:text-grey-700'
                    }`
                  }
                >
                  {route.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
