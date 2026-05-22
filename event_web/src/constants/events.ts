export type EventStatus = 'planning' | 'active' | 'complete'

export interface EventRow {
  name: string
  type: string
  date: string
  guests: number
  location?: string
  status: EventStatus
}

export const SAMPLE_EVENTS: EventRow[] = [
  {
    name: 'Sharma–Patel Vivah',
    type: 'Wedding',
    date: '14 Dec 2026',
    guests: 180,
    location: 'Jaipur',
    status: 'planning',
  },
  {
    name: 'Arjun Mundan',
    type: 'Mundan',
    date: '22 Aug 2026',
    guests: 45,
    location: 'Delhi',
    status: 'active',
  },
  {
    name: 'Diwali Bhoj',
    type: 'Festival',
    date: '1 Nov 2026',
    guests: 23,
    location: 'Mumbai',
    status: 'complete',
  },
]

export function statusBadgeClass(status: EventStatus): string {
  const map: Record<EventStatus, string> = {
    planning: 'badge-planning',
    active: 'badge-active',
    complete: 'badge-complete',
  }
  return map[status]
}

export function statusLabel(status: EventStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}
