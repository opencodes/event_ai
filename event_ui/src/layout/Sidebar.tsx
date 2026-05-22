import { useState } from 'react';
import { Calendar, ChevronDown, Home, LogOut, Plus, Settings, Shield, UserCog, Users, UsersRound, CheckSquare, Zap, MessageSquare, Shirt, UtensilsCrossed, Briefcase, DollarSign, Gift } from 'lucide-react';
import { useAuth } from '@/core/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { canAccessModule } from '@/core/user/permissions';
import { ThemeLogo } from '@/layout';
import { useEventWorkspace } from '@/modules/events/context';

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  mobileOpen: boolean;
  onMobileToggle: () => void;
  isCollapsed?: boolean;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/', module: 'dashboard' },
  { id: 'guests', label: 'Guests', icon: UsersRound, path: '/guests', module: 'contacts' },
  { id: 'checkpoints', label: 'Checkpoints', icon: CheckSquare, path: '/checkpoints', module: 'dashboard' },
  { id: 'rituals', label: 'Rituals', icon: Zap, path: '/rituals', module: 'dashboard' },
  { id: 'rsvp', label: 'RSVP', icon: MessageSquare, path: '/rsvp', module: 'dashboard' },
  { id: 'clothing', label: 'Clothing', icon: Shirt, path: '/clothing', module: 'dashboard' },
  { id: 'bhoj', label: 'Bhoj', icon: UtensilsCrossed, path: '/bhoj', module: 'dashboard' },
  { id: 'vendors', label: 'Vendors', icon: Briefcase, path: '/vendors', module: 'dashboard' },
  { id: 'budget', label: 'Budget', icon: DollarSign, path: '/budget', module: 'dashboard' },
  { id: 'gifting', label: 'Gifting', icon: Gift, path: '/gifting', module: 'dashboard' },
];

export default function Sidebar({ mobileOpen, onMobileToggle, isCollapsed = false }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { events, selectedEventId, isLoadingEvents, setSelectedEventId } = useEventWorkspace();
  const [eventsOpen, setEventsOpen] = useState(true);
  const rootNavItems = [
    { id: 'root-permissions', label: 'Permissions', icon: Shield, path: '/root/permissions' },
    { id: 'root-roles', label: 'Roles', icon: UserCog, path: '/root/roles' },
    { id: 'root-users', label: 'Users', icon: Users, path: '/root/users' },
    { id: 'root-groups', label: 'Groups', icon: UsersRound, path: '/root/groups' },
  ];
  const items = user?.role === 'root'
    ? rootNavItems
    : navItems.filter((item) => item.module === 'dashboard' || canAccessModule(user, item.module));
  const finalItems = items;
  const showWorkspaceAccordions = user?.role !== 'root';
  const canUseEvents = canAccessModule(user, 'events');

  const getInitials = (name: string) => {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={onMobileToggle}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-[100]
        w-60 ${isCollapsed ? 'md:w-[72px]' : 'md:w-60'} border-r border-[var(--panel-border)] glass-black-surface
        transform transition-all duration-200 ease-in-out
        md:transition-[width] md:duration-200
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col
      `}>
        {/* Logo */}
        <div className={`border-b border-[var(--panel-border)] h-[64px] flex items-center justify-between ${isCollapsed ? 'px-3 py-2.5' : 'px-4 py-3'}`}>
          <div className={`flex items-center gap-3 ${isCollapsed ? 'md:justify-center md:w-full' : ''}`}>
            <ThemeLogo className="w-9 h-9 min-w-9 min-h-9" />
            <div className={`${isCollapsed ? 'md:hidden' : ''}`}>
              <p className="text-[15px] font-bold text-[var(--app-fg)] leading-tight tracking-[-0.02em]">Admin</p>
              <p className="text-[10px] text-[var(--app-fg-muted)] leading-tight mt-0.5">App Admin</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1">
          {finalItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.path);
                  if (mobileOpen) onMobileToggle();
                }}
                className={`nav-item ${isActive ? 'nav-item-active' : ''} ${isCollapsed ? 'md:justify-center md:px-2' : ''}`}
                aria-label={item.label}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className={`${isCollapsed ? 'md:hidden' : ''} truncate`}>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {showWorkspaceAccordions && (
          <div className={`border-t border-[var(--panel-border)] px-2.5 py-3 space-y-2 ${isCollapsed ? 'md:px-2' : ''}`}>
            {canUseEvents && (
              <div>
                <button
                  onClick={() => {
                    if (isCollapsed) {
                      navigate('/events');
                    } else {
                      setEventsOpen((open) => !open);
                    }
                  }}
                  className={`nav-item w-full ${location.pathname.startsWith('/events') ? 'nav-item-active' : ''} ${isCollapsed ? 'md:justify-center md:px-2' : ''}`}
                  aria-label="Events"
                >
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span className={`${isCollapsed ? 'md:hidden' : ''} truncate flex-1 text-left`}>Events</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${eventsOpen ? 'rotate-180' : ''} ${isCollapsed ? 'md:hidden' : ''}`} />
                </button>
                {/* 
                {eventsOpen && !isCollapsed && (
                  <div className="mt-1 pl-3 space-y-1">
                    <button
                      onClick={() => {
                        navigate('/events/new');
                        if (mobileOpen) onMobileToggle();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-semibold text-[var(--app-fg-muted)] hover:text-[var(--app-fg)] hover:bg-[var(--surface-muted)] transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Event</span>
                    </button>

                    {isLoadingEvents ? (
                      <p className="px-3 py-2 text-[12px] text-[var(--app-fg-muted)]">Loading events...</p>
                    ) : events.length === 0 ? (
                      <p className="px-3 py-2 text-[12px] text-[var(--app-fg-muted)]">No events yet</p>
                    ) : (
                      <div className="space-y-1 max-h-[210px] overflow-y-auto pr-1">
                        {events.map((event) => (
                          <button
                            key={event.id}
                            onClick={() => {
                              setSelectedEventId(event.id);
                              if (mobileOpen) onMobileToggle();
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-[12px] transition-colors ${selectedEventId === event.id
                              ? 'bg-[var(--primary-light)] text-[var(--primary-text)] font-semibold'
                              : 'text-[var(--app-fg-muted)] hover:text-[var(--app-fg)] hover:bg-[var(--surface-muted)]'
                              }`}
                          >
                            <span className="block truncate">{event.title}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )} */}
              </div>
            )}

            <button
              onClick={() => {
                navigate('/events');
                if (mobileOpen) onMobileToggle();
              }}
              className={`nav-item w-full ${location.pathname.startsWith('/events') ? 'nav-item-active' : ''} ${isCollapsed ? 'md:justify-center md:px-2' : ''}`}
              aria-label="Events"
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span className={`${isCollapsed ? 'md:hidden' : ''} truncate`}>Events</span>
            </button>
            <button
              onClick={() => {
                navigate('/settings');
                if (mobileOpen) onMobileToggle();
              }}
              className={`nav-item w-full ${location.pathname.startsWith('/settings') ? 'nav-item-active' : ''} ${isCollapsed ? 'md:justify-center md:px-2' : ''}`}
              aria-label="Settings"
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span className={`${isCollapsed ? 'md:hidden' : ''} truncate`}>Settings</span>
            </button>
          </div>
        )}

        {/* User section */}
        <div className={`border-t border-[var(--panel-border)] ${isCollapsed ? 'p-2' : 'p-3'}`}>
          <div className={`flex items-center gap-2.5 p-2.5 rounded-lg border border-[var(--panel-border)] bg-[var(--surface-muted)] ${isCollapsed ? 'md:justify-center md:gap-0 md:p-2' : ''}`}>
            <div className={`rounded-full ai-gradient-icon flex items-center justify-center text-white font-semibold text-[11px] ${isCollapsed ? 'md:w-8 md:h-8' : 'w-9 h-9'} shrink-0`}>
              {user?.full_name ? getInitials(user.full_name) : 'U'}
            </div>
            <div className={`flex-1 min-w-0 ${isCollapsed ? 'md:hidden' : ''}`}>
              <p className="text-[13px] font-semibold text-[var(--app-fg)] truncate leading-tight">
                {user?.full_name || 'User'}
              </p>
              <p className="text-[11px] text-[var(--app-fg-muted)] truncate leading-tight mt-0.5">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium text-[var(--app-fg-muted)] hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/15 transition-all duration-200 mt-2 ${isCollapsed ? 'md:justify-center md:px-2' : ''}`}
            aria-label="Logout"
          >
            <LogOut className="w-[15px] h-[15px]" />
            <span className={`${isCollapsed ? 'md:hidden' : ''}`}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
