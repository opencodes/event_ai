import { api } from '../../../core/api';

export interface Phase1Event {
  _id?: string;
  id: string;
  organizer_user_id: string;
  title: string;
  description?: string;
  ceremony_type: string;
  status: 'draft' | 'published' | 'in_progress' | 'completed' | 'cancelled' | 'archived';
  visibility: 'private' | 'invite_only' | 'unlisted_public';
  primary_locale: string;
  timezone: string;
  start_at?: string;
  end_at?: string;
  sub_events?: Phase1SubEvent[];
  rituals?: Phase1EventRitual[];
}

export interface Phase1SubEvent {
  _id?: string;
  id: string;
  event_id: string;
  name: string;
  sort_order: number;
  phase?: string;
  starts_at?: string;
  ends_at?: string;
  status?: string;
}

export interface Phase1EventRitual {
  _id?: string;
  id: string;
  event_id: string;
  sub_event_id?: string | null;
  ritual_key: string;
  name: string;
  sort_order: number;
  skipped: boolean;
  status?: string;
  scheduled_at?: string;
  checklists?: Phase1ChecklistItem[];
  samagri?: Phase1SamagriItem[];
}

export interface Phase1ChecklistItem {
  _id?: string;
  id: string;
  event_ritual_id: string;
  title: string;
  is_done: boolean;
  sort_order: number;
}

export interface Phase1SamagriItem {
  _id?: string;
  id: string;
  event_ritual_id: string;
  name: string;
  quantity?: string;
  unit?: string;
  procured: boolean;
}

export type GuestRsvpStatus = 'pending' | 'yes' | 'no' | 'maybe';
export type GuestMealPreference = 'veg' | 'non_veg' | 'jain' | 'unknown';
export type GuestGender = 'female' | 'male' | 'other' | 'undisclosed';

export interface PlusMember {
  id?: string;
  name: string;
  gender?: GuestGender | null;
  age?: number | null;
}

export interface EventGuest {
  _id?: string;
  id: string;
  event_id: string;
  contact_id?: string | null;
  name: string;
  phone?: string | null;
  email?: string | null;
  relationship?: string | null;
  rsvp_status: GuestRsvpStatus;
  meal_preference: GuestMealPreference;
  accommodation: boolean;
  plus_ones: number;
  plus_members?: PlusMember[];
  age?: number | null;
  gender?: GuestGender | null;
  dependent_group_id?: string | null;
  return_gift?: {
    gift_type?: string | null;
    quantity: number;
    notes?: string | null;
  };
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface GuestEstimate {
  total_invitees: number;
  plus_ones: number;
  projected_attendance: number;
  rsvp: Record<GuestRsvpStatus, number>;
}

export type CheckpointStatus = 'not-started' | 'in-progress' | 'completed';
export type CheckpointPriority = 'low' | 'medium' | 'high';
export type ExpenseStatus = 'pending' | 'in-progress' | 'confirmed';
export type VendorStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface EventCheckpoint {
  _id?: string;
  id: string;
  event_id: string;
  title: string;
  status: CheckpointStatus;
  priority: CheckpointPriority;
  sort_order: number;
}

export interface EventExpense {
  _id?: string;
  id: string;
  event_id: string;
  category: string;
  amount_paise: number;
  status: ExpenseStatus;
  percentage?: number;
  sort_order: number;
}

export interface BudgetSummary {
  total_paise: number;
  spent_paise: number;
  remaining_paise: number;
  expenses: EventExpense[];
}

export interface EventVendor {
  _id?: string;
  id: string;
  event_id: string;
  name: string;
  category: string;
  total_amount_paise: number;
  advance_paise: number;
  service_date: string;
  status: VendorStatus;
  sort_order: number;
}

export interface VendorSummary {
  vendors: EventVendor[];
  stats: { total: number; confirmed: number; pending: number; paid: number };
}

export interface ClothingItemLine {
  item: string;
  required: number;
  purchased: number;
}

export interface ClothingDistributionLine {
  family: string;
  saris: number;
  kurtas: number;
  dhotis: number;
  sherwanis: number;
}

export interface ClothingPlan {
  items: ClothingItemLine[];
  distributions: ClothingDistributionLine[];
  totals: { required: number; purchased: number };
}

export interface BhojPersonSummary {
  category: string;
  count: number;
}

export interface BhojPlan {
  person_summary: BhojPersonSummary[];
  total_headcount: number;
  meals: Array<{ day: string; type: string; items: string[] }>;
  ingredients: Array<{ category: string; quantity: number; unit: string }>;
}

export interface EventContribution {
  _id?: string;
  id: string;
  event_id: string;
  contributor_name: string;
  amount_paise: number;
  type: 'cash' | 'physical';
  status: 'pending' | 'received';
}

export interface GiftingSummary {
  contributions: EventContribution[];
  summary: {
    total_cash_paise: number;
    total_physical: number;
    total_contributors: number;
  };
}

export interface RsvpAnalytics {
  total_invited: number;
  rsvp_received: number;
  pending: number;
  dietary_preferences: Array<{ label: string; count: number }>;
  gender_distribution: Array<{ label: string; count: number }>;
  age_groups: Array<{ label: string; count: number }>;
}

export interface RitualTimelineItem {
  _id?: string;
  id: string;
  event_id: string;
  name: string;
  status: string;
  ui_status: 'upcoming' | 'in-progress' | 'completed';
  time: string;
  sort_order: number;
}

export interface ContactImportRow {
  name: string;
  phone?: string | null;
  email?: string | null;
  relationship?: string | null;
  relation?: string | null;
  source?: 'manual' | 'csv' | 'mobile';
  invite?: boolean;
  meal_preference?: GuestMealPreference;
  plus_ones?: number;
}

const withId = <T extends { id?: string; _id?: string }>(item: T): T & { id: string } => ({
  ...item,
  id: item.id ?? item._id ?? '',
});

const normalizeEvent = (event: Phase1Event): Phase1Event => ({
  ...withId(event),
  sub_events: (event.sub_events ?? []).map(withId),
  rituals: (event.rituals ?? []).map((ritual) => ({
    ...withId(ritual),
    checklists: (ritual.checklists ?? []).map(withId),
    samagri: (ritual.samagri ?? []).map(withId),
  })),
});

const normalizeGuest = (guest: EventGuest): EventGuest => {
  const plusMembers = guest.plus_members ?? [];
  return {
    ...withId(guest),
    rsvp_status: guest.rsvp_status ?? 'pending',
    meal_preference: guest.meal_preference ?? 'unknown',
    accommodation: Boolean(guest.accommodation),
    plus_members: plusMembers,
    plus_ones: plusMembers.length || Number(guest.plus_ones ?? 0),
    return_gift: guest.return_gift ?? { quantity: 0 },
  };
};

export const eventModuleApi = {
  createEvent: async (payload: Partial<Phase1Event>) => {
    const { data } = await api.post('/events', payload);
    return normalizeEvent(data.data as Phase1Event);
  },
  listEvents: async () => {
    const { data } = await api.get('/events');
    return (data.data ?? []).map(normalizeEvent) as Phase1Event[];
  },
  getEvent: async (id: string) => {
    const { data } = await api.get(`/events/${id}`);
    return normalizeEvent(data.data as Phase1Event);
  },
  updateEvent: async (id: string, payload: Partial<Phase1Event>) => {
    const { data } = await api.patch(`/events/${id}`, payload);
    return normalizeEvent(data.data as Phase1Event);
  },
  deleteEvent: async (id: string) => {
    const { data } = await api.delete(`/events/${id}`);
    return (data.data ?? { id }) as { id: string };
  },
  publishEvent: async (id: string) => {
    const { data } = await api.post(`/events/${id}/publish`);
    return normalizeEvent(data.data as Phase1Event);
  },
  addSubEvent: async (eventId: string, payload: Partial<Phase1SubEvent>) => {
    const { data } = await api.post(`/events/${eventId}/sub-events`, payload);
    return withId(data.data) as Phase1SubEvent;
  },
  addRitual: async (eventId: string, payload: Partial<Phase1EventRitual>) => {
    const { data } = await api.post(`/events/${eventId}/rituals`, payload);
    return withId(data.data) as Phase1EventRitual;
  },
  addChecklistItem: async (ritualId: string, payload: Partial<Phase1ChecklistItem>) => {
    const { data } = await api.post(`/events/rituals/${ritualId}/checklist`, payload);
    return withId(data.data) as Phase1ChecklistItem;
  },
  addSamagriItem: async (ritualId: string, payload: Partial<Phase1SamagriItem>) => {
    const { data } = await api.post(`/events/rituals/${ritualId}/samagri`, payload);
    return withId(data.data) as Phase1SamagriItem;
  },
  importContacts: async (eventId: string, contacts: ContactImportRow[]) => {
    const { data } = await api.post(`/events/${eventId}/contacts/import`, { contacts });
    return {
      contacts: data.data?.contacts ?? [],
      guests: ((data.data?.guests ?? []) as EventGuest[]).map(normalizeGuest),
      imported: Number(data.data?.imported ?? 0),
      invited: Number(data.data?.invited ?? 0),
    };
  },
  listGuests: async (eventId: string) => {
    const { data } = await api.get(`/events/${eventId}/guests`);
    return ((data.data ?? []) as EventGuest[]).map(normalizeGuest);
  },
  createGuest: async (eventId: string, payload: Partial<EventGuest>) => {
    const { data } = await api.post(`/events/${eventId}/guests`, payload);
    return normalizeGuest(data.data as EventGuest);
  },
  updateGuest: async (eventId: string, guestId: string, payload: Partial<EventGuest>) => {
    const { data } = await api.patch(`/events/${eventId}/guests/${guestId}`, payload);
    return normalizeGuest(data.data as EventGuest);
  },
  deleteGuest: async (eventId: string, guestId: string) => {
    const { data } = await api.delete(`/events/${eventId}/guests/${guestId}`);
    return (data.data ?? { id: guestId }) as { id: string };
  },
  addDependent: async (eventId: string, guestId: string, payload: Partial<EventGuest>) => {
    const { data } = await api.post(`/events/${eventId}/guests/${guestId}/dependents`, payload);
    return normalizeGuest(data.data as EventGuest);
  },
  getGuestEstimate: async (eventId: string) => {
    const { data } = await api.get(`/events/${eventId}/guest-estimate`);
    return (data.data ?? {
      total_invitees: 0,
      plus_ones: 0,
      projected_attendance: 0,
      rsvp: { pending: 0, yes: 0, no: 0, maybe: 0 },
    }) as GuestEstimate;
  },
  listCheckpoints: async (eventId: string) => {
    const { data } = await api.get(`/events/${eventId}/checkpoints`);
    return ((data.data ?? []) as EventCheckpoint[]).map(withId);
  },
  createCheckpoint: async (eventId: string, payload: Partial<EventCheckpoint>) => {
    const { data } = await api.post(`/events/${eventId}/checkpoints`, payload);
    return withId(data.data) as EventCheckpoint;
  },
  updateCheckpoint: async (eventId: string, checkpointId: string, payload: Partial<EventCheckpoint>) => {
    const { data } = await api.patch(`/events/${eventId}/checkpoints/${checkpointId}`, payload);
    return withId(data.data) as EventCheckpoint;
  },
  getBudgetSummary: async (eventId: string) => {
    const { data } = await api.get(`/events/${eventId}/budget`);
    const summary = data.data as BudgetSummary;
    return {
      ...summary,
      expenses: (summary.expenses ?? []).map(withId),
    } as BudgetSummary;
  },
  updateBudgetTotal: async (eventId: string, budgetTotalPaise: number) => {
    const { data } = await api.patch(`/events/${eventId}/budget`, { budget_total_paise: budgetTotalPaise });
    const summary = data.data as BudgetSummary;
    return {
      ...summary,
      expenses: (summary.expenses ?? []).map(withId),
    } as BudgetSummary;
  },
  updateExpense: async (eventId: string, expenseId: string, payload: Partial<EventExpense>) => {
    const { data } = await api.patch(`/events/${eventId}/expenses/${expenseId}`, payload);
    return withId(data.data) as EventExpense;
  },
  listVendors: async (eventId: string) => {
    const { data } = await api.get(`/events/${eventId}/vendors`);
    const result = data.data as VendorSummary;
    return {
      vendors: (result.vendors ?? []).map(withId),
      stats: result.stats ?? { total: 0, confirmed: 0, pending: 0, paid: 0 },
    } as VendorSummary;
  },
  updateVendor: async (eventId: string, vendorId: string, payload: Partial<EventVendor>) => {
    const { data } = await api.patch(`/events/${eventId}/vendors/${vendorId}`, payload);
    return withId(data.data) as EventVendor;
  },
  getClothingPlan: async (eventId: string) => {
    const { data } = await api.get(`/events/${eventId}/clothing`);
    return {
      items: data.data?.items ?? [],
      distributions: data.data?.distributions ?? [],
      totals: data.data?.totals ?? { required: 0, purchased: 0 },
    } as ClothingPlan;
  },
  updateClothingItem: async (eventId: string, itemName: string, payload: Partial<ClothingItemLine>) => {
    const { data } = await api.patch(`/events/${eventId}/clothing/items/${encodeURIComponent(itemName)}`, payload);
    return {
      items: data.data?.items ?? [],
      distributions: data.data?.distributions ?? [],
      totals: data.data?.totals ?? { required: 0, purchased: 0 },
    } as ClothingPlan;
  },
  getBhojPlan: async (eventId: string) => {
    const { data } = await api.get(`/events/${eventId}/bhoj`);
    return data.data as BhojPlan;
  },
  updateBhojIngredient: async (eventId: string, category: string, payload: { quantity?: number; unit?: string }) => {
    const { data } = await api.patch(`/events/${eventId}/bhoj/ingredients/${encodeURIComponent(category)}`, payload);
    return data.data as BhojPlan;
  },
  listContributions: async (eventId: string) => {
    const { data } = await api.get(`/events/${eventId}/contributions`);
    const result = data.data as GiftingSummary;
    return {
      contributions: (result.contributions ?? []).map(withId),
      summary: result.summary ?? { total_cash_paise: 0, total_physical: 0, total_contributors: 0 },
    } as GiftingSummary;
  },
  createContribution: async (eventId: string, payload: Partial<EventContribution>) => {
    const { data } = await api.post(`/events/${eventId}/contributions`, payload);
    return withId(data.data) as EventContribution;
  },
  getRsvpAnalytics: async (eventId: string) => {
    const { data } = await api.get(`/events/${eventId}/rsvp-analytics`);
    return data.data as RsvpAnalytics;
  },
  listRituals: async (eventId: string) => {
    const { data } = await api.get(`/events/${eventId}/rituals`);
    return ((data.data ?? []) as RitualTimelineItem[]).map(withId);
  },
  updateRitual: async (eventId: string, ritualId: string, payload: {
    status?: string;
    scheduled_at?: string;
    name?: string;
    sub_event_id?: string | null;
  }) => {
    const { data } = await api.patch(`/events/${eventId}/rituals/${ritualId}`, payload);
    return withId(data.data) as RitualTimelineItem;
  },
};
