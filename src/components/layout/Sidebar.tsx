import { NavLink } from 'react-router-dom';
import {
  Bookmark,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Settings,
  StickyNote,
  X,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const NAV_ITEMS = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/tasks', label: 'My Tasks', icon: CheckSquare, end: false },
  { to: '/notes', label: 'Notes', icon: StickyNote, end: false },
  { to: '/bookmarks', label: 'Bookmarks', icon: Bookmark, end: false },
  { to: '/settings', label: 'Settings', icon: Settings, end: false },
];

export function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const { preferences, toggleSidebar, tasks } = useApp();
  const collapsed = preferences.sidebarCollapsed;
  const pendingCount = tasks.filter((t) => !t.completed).length;

  const renderNavLinks = (isCollapsed: boolean) => (
    <nav aria-label="Main navigation" className="flex-1 space-y-1 px-3 py-4">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onCloseMobile}
            title={isCollapsed ? item.label : undefined}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs dark:bg-indigo-600 dark:text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-100'
              } ${isCollapsed ? 'justify-center px-2' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`h-[18px] w-[18px] shrink-0 transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-200'
                  }`}
                />
                {!isCollapsed && (
                  <span className="flex-1 truncate">{item.label}</span>
                )}
                {!isCollapsed && item.to === '/tasks' && pendingCount > 0 && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {pendingCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex lg:flex-col lg:shrink-0 border-r border-slate-200/90 bg-white transition-all duration-200 dark:border-slate-800 dark:bg-slate-900 ${
          collapsed ? 'lg:w-[74px]' : 'lg:w-64'
        }`}
      >
        <div
          className={`flex h-16 items-center border-b border-slate-100 px-4 dark:border-slate-800/80 ${
            collapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          <NavLink
            to="/"
            className="flex items-center gap-2.5 overflow-hidden focus:outline-none"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white shadow-xs dark:bg-indigo-600">
              <Layers className="h-4 w-4" />
            </div>
            {!collapsed && (
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                DayFlow
              </span>
            )}
          </NavLink>
          {!collapsed && (
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        {renderNavLinks(collapsed)}

        <div className="border-t border-slate-100 p-3 dark:border-slate-800/80">
          {collapsed ? (
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Expand sidebar"
              title="Expand sidebar"
              className="flex w-full items-center justify-center rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <div className="rounded-lg bg-slate-50 px-3 py-2.5 dark:bg-slate-800/50">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                Local Workspace
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                All data saved in browser
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-[1px] lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation Drawer */}
      <aside
        aria-label="Mobile navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-200 ease-out dark:border-slate-800 dark:bg-slate-900 lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-4 dark:border-slate-800/80">
          <NavLink
            to="/"
            onClick={onCloseMobile}
            className="flex items-center gap-2.5"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-indigo-600">
              <Layers className="h-4 w-4" />
            </div>
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              DayFlow
            </span>
          </NavLink>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation menu"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {renderNavLinks(false)}
      </aside>
    </>
  );
}

