export interface NavItem {
  path: string
  label: string
  icon: string
}

export interface NavSection {
  title: string
  items: NavItem[]
}

export const DASHBOARD_NAV: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: 'fa-gauge-high' },
      { path: '/dashboard/events', label: 'My Events', icon: 'fa-calendar-days' },
    ],
  },
  {
    title: 'Planning',
    items: [
      { path: '/dashboard/rituals', label: 'Rituals', icon: 'fa-om' },
      { path: '/dashboard/rsvp', label: 'RSVP & Guests', icon: 'fa-users' },
      { path: '/dashboard/checkpoints', label: 'Checkpoints', icon: 'fa-list-check' },
      { path: '/dashboard/budget', label: 'Budget', icon: 'fa-indian-rupee-sign' },
    ],
  },
  {
    title: 'Vendors & Details',
    items: [
      { path: '/dashboard/vendors', label: 'Vendors', icon: 'fa-store' },
      { path: '/dashboard/bhoj', label: 'Bhoj & Catering', icon: 'fa-utensils' },
      { path: '/dashboard/clothing', label: 'Clothing', icon: 'fa-shirt' },
      { path: '/dashboard/gifting', label: 'Gifting', icon: 'fa-gift' },
    ],
  },
  {
    title: 'Marketplace',
    items: [
      { path: '/dashboard/marketplace', label: 'Find Vendors', icon: 'fa-handshake' },
    ],
  },
  {
    title: 'Account',
    items: [
      { path: '/dashboard/settings', label: 'Settings', icon: 'fa-gear' },
    ],
  },
]

export const PAGE_META: Record<string, { title: string; breadcrumb: string }> = {
  '/dashboard': { title: 'Dashboard', breadcrumb: 'Overview / Home' },
  '/dashboard/events': { title: 'My Events', breadcrumb: 'Events / All' },
  '/dashboard/rituals': { title: 'Rituals', breadcrumb: 'Planning / Rituals' },
  '/dashboard/rsvp': { title: 'RSVP & Guests', breadcrumb: 'Planning / Guests' },
  '/dashboard/checkpoints': { title: 'Checkpoints', breadcrumb: 'Planning / Checkpoints' },
  '/dashboard/budget': { title: 'Budget', breadcrumb: 'Planning / Budget' },
  '/dashboard/vendors': { title: 'Vendors', breadcrumb: 'Vendors & Details' },
  '/dashboard/bhoj': { title: 'Bhoj & Catering', breadcrumb: 'Vendors & Details / Bhoj' },
  '/dashboard/clothing': { title: 'Clothing', breadcrumb: 'Vendors & Details / Clothing' },
  '/dashboard/gifting': { title: 'Gifting', breadcrumb: 'Vendors & Details / Gifting' },
  '/dashboard/marketplace': { title: 'Marketplace', breadcrumb: 'Marketplace / Browse' },
  '/dashboard/settings': { title: 'Settings', breadcrumb: 'Account / Settings' },
}
