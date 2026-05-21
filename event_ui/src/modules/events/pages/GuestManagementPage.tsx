import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Gift,
  Plus,
  RefreshCw,
  Search,
  Check,
  Trash2,
  Upload,
  UserPlus,
  UsersRound,
  X
} from 'lucide-react';
import { Sidebar, Header } from '@/layout';
import {
  ContactImportRow,
  EventGuest,
  GuestGender,
  GuestEstimate,
  GuestMealPreference,
  GuestRsvpStatus,
  PlusMember,
  eventModuleApi
} from '../api/eventApi';
import { useEventWorkspace } from '../context';

type GuestTab = 'all' | 'groups' | 'rsvp' | 'dependents';
type GuestModal = 'guest' | 'import' | 'plus' | null;

const blankGuest = {
  name: '',
  phone: '',
  email: '',
  relationship: '',
  rsvp_status: 'pending' as GuestRsvpStatus,
  meal_preference: 'unknown' as GuestMealPreference,
  gender: 'undisclosed' as GuestGender,
  age: null as number | null,
  plus_ones: 0,
  accommodation: false,
};

const createBlankPlusMember = (): PlusMember => ({
  name: '',
  gender: 'undisclosed',
  age: null,
});

const emptyEstimate: GuestEstimate = {
  total_invitees: 0,
  plus_ones: 0,
  projected_attendance: 0,
  rsvp: { pending: 0, yes: 0, no: 0, maybe: 0 },
};

const statusLabels: Record<GuestRsvpStatus, string> = {
  pending: 'Pending',
  yes: 'Yes',
  no: 'No',
  maybe: 'Maybe',
};

const mealLabels: Record<GuestMealPreference, string> = {
  unknown: 'Unknown',
  veg: 'Veg',
  non_veg: 'Non-veg',
  jain: 'Jain',
};

const genderLabels: Record<GuestGender, string> = {
  undisclosed: 'Gender',
  female: 'Female',
  male: 'Male',
  other: 'Other',
};

const genderDisplayLabels: Record<GuestGender, string> = {
  undisclosed: 'Unspecified',
  female: 'Female',
  male: 'Male',
  other: 'Other',
};

const memberMeta = (member: PlusMember) => {
  const parts = [];
  if (member.gender && member.gender !== 'undisclosed') {
    parts.push(genderDisplayLabels[member.gender]);
  }
  if (member.age) {
    parts.push(`${member.age} yrs`);
  }
  return parts.join(' · ') || 'Details pending';
};

const guestMeta = (guest: EventGuest) => {
  const parts = [];
  if (guest.gender && guest.gender !== 'undisclosed') {
    parts.push(genderDisplayLabels[guest.gender]);
  }
  if (guest.age) {
    parts.push(`${guest.age} yrs`);
  }
  return parts.join(' · ') || 'Age/gender not set';
};

const parseCsv = (value: string): ContactImportRow[] => {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name = '', phone = '', email = '', relationship = '', meal = 'unknown', plusOnes = '0'] = line
        .split(',')
        .map((cell) => cell.trim());
      return {
        name,
        phone: phone || null,
        email: email || null,
        relationship: relationship || null,
        meal_preference: (meal || 'unknown') as GuestMealPreference,
        plus_ones: Number(plusOnes || 0),
        source: 'csv' as const,
        invite: true,
      };
    })
    .filter((row) => row.name);
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error && typeof error === 'object') {
    const maybeError = error as { response?: { data?: { message?: string } }; message?: string };
    return maybeError.response?.data?.message || maybeError.message || fallback;
  }
  return fallback;
};

export const GuestManagementPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { selectedEventId, selectedEvent } = useEventWorkspace();
  const [guests, setGuests] = useState<EventGuest[]>([]);
  const [estimate, setEstimate] = useState<GuestEstimate>(emptyEstimate);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<GuestTab>('all');
  const [activeModal, setActiveModal] = useState<GuestModal>(null);
  const [newGuest, setNewGuest] = useState(blankGuest);
  const [plusMemberBatch, setPlusMemberBatch] = useState<PlusMember[]>([createBlankPlusMember()]);
  const [addingPlusFor, setAddingPlusFor] = useState<string | null>(null);
  const [dependentFor, setDependentFor] = useState<string | null>(null);
  const [csvText, setCsvText] = useState('Ananya Rao,+91 9988776655,ananya@example.com,Cousin,veg,1');

  const handleMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const closeModal = () => {
    setActiveModal(null);
    setDependentFor(null);
    setAddingPlusFor(null);
    setPlusMemberBatch([createBlankPlusMember()]);
  };

  const loadGuests = useCallback(async () => {
    if (!selectedEventId) return;
    setIsLoading(true);
    setError(null);
    try {
      const [guestList, guestEstimate] = await Promise.all([
        eventModuleApi.listGuests(selectedEventId),
        eventModuleApi.getGuestEstimate(selectedEventId),
      ]);
      setGuests(guestList);
      setEstimate(guestEstimate);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to load guests'));
    } finally {
      setIsLoading(false);
    }
  }, [selectedEventId]);

  useEffect(() => {
    loadGuests();
  }, [loadGuests]);

  const filteredGuests = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return guests.filter((guest) => {
      const matchesQuery = !normalizedQuery || [guest.name, guest.phone, guest.email, guest.relationship]
        .some((value) => (value ?? '').toLowerCase().includes(normalizedQuery));
      if (!matchesQuery) return false;
      if (tab === 'rsvp') return guest.rsvp_status !== 'pending';
      if (tab === 'dependents') return Boolean(guest.dependent_group_id);
      return true;
    });
  }, [guests, query, tab]);

  const groups = useMemo(() => {
    const map = new Map<string, EventGuest[]>();
    guests.forEach((guest) => {
      const key = guest.dependent_group_id || guest.relationship || 'Ungrouped';
      map.set(key, [...(map.get(key) ?? []), guest]);
    });
    return Array.from(map.entries());
  }, [guests]);

  const plusParentGuest = addingPlusFor ? guests.find((guest) => guest.id === addingPlusFor) ?? null : null;

  const createGuest = async () => {
    if (!selectedEventId || !newGuest.name.trim()) return;
    setIsSaving(true);
    setError(null);
    try {
      await eventModuleApi.createGuest(selectedEventId, newGuest);
      setNewGuest(blankGuest);
      closeModal();
      await loadGuests();
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to add guest'));
    } finally {
      setIsSaving(false);
    }
  };

  const updateGuest = async (guestId: string, payload: Partial<EventGuest>) => {
    if (!selectedEventId) return;
    const previous = guests;
    setGuests((items) => items.map((guest) => guest.id === guestId ? { ...guest, ...payload } : guest));
    try {
      const updated = await eventModuleApi.updateGuest(selectedEventId, guestId, payload);
      setGuests((items) => items.map((guest) => guest.id === guestId ? updated : guest));
      setEstimate(await eventModuleApi.getGuestEstimate(selectedEventId));
    } catch (err: unknown) {
      setGuests(previous);
      setError(getErrorMessage(err, 'Failed to update guest'));
    }
  };

  const updatePlusMemberDraft = (index: number, payload: Partial<PlusMember>) => {
    setPlusMemberBatch((drafts) => drafts.map((draft, draftIndex) => (
      draftIndex === index ? { ...draft, ...payload } : draft
    )));
  };

  const addPlusMemberDraft = () => {
    setPlusMemberBatch((drafts) => [...drafts, createBlankPlusMember()]);
  };

  const removePlusMemberDraft = (index: number) => {
    setPlusMemberBatch((drafts) => {
      const nextDrafts = drafts.filter((_, draftIndex) => draftIndex !== index);
      return nextDrafts.length > 0 ? nextDrafts : [createBlankPlusMember()];
    });
  };

  const addPlusMembers = async (guest: EventGuest) => {
    const newMembers = plusMemberBatch
      .map((draft) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: draft.name.trim(),
        gender: draft.gender ?? 'undisclosed',
        age: draft.age ?? null,
      }))
      .filter((draft) => draft.name);
    if (newMembers.length === 0) return;
    const nextMembers = [
      ...(guest.plus_members ?? []),
      ...newMembers,
    ];
    await updateGuest(guest.id, { plus_members: nextMembers, plus_ones: nextMembers.length });
    closeModal();
  };

  const removePlusMember = async (guest: EventGuest, memberIndex: number) => {
    const nextMembers = (guest.plus_members ?? []).filter((_, index) => index !== memberIndex);
    await updateGuest(guest.id, { plus_members: nextMembers, plus_ones: nextMembers.length });
  };

  const removeGuest = async (guestId: string) => {
    if (!selectedEventId) return;
    setError(null);
    try {
      await eventModuleApi.deleteGuest(selectedEventId, guestId);
      await loadGuests();
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to delete guest'));
    }
  };

  const importContacts = async () => {
    if (!selectedEventId) return;
    const rows = parseCsv(csvText);
    if (rows.length === 0) {
      setError('Paste at least one contact row before importing.');
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await eventModuleApi.importContacts(selectedEventId, rows);
      closeModal();
      await loadGuests();
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to import contacts'));
    } finally {
      setIsSaving(false);
    }
  };

  const addDependent = async () => {
    if (!selectedEventId || !dependentFor || !newGuest.name.trim()) return;
    setIsSaving(true);
    setError(null);
    try {
      await eventModuleApi.addDependent(selectedEventId, dependentFor, newGuest);
      setNewGuest(blankGuest);
      closeModal();
      await loadGuests();
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to add dependent'));
    } finally {
      setIsSaving(false);
    }
  };

  const previewRows = parseCsv(csvText).slice(0, 4);

  return (
    <div className="flex h-screen overflow-hidden app-shell">
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        isCollapsed={sidebarCollapsed}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMobileMenuToggle={handleMenuToggle} />

        <main className="flex-1 px-4 md:px-8 py-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-[var(--app-fg)]">Guests</h1>
                <p className="text-sm text-[var(--app-fg-muted)] mt-1">
                  {selectedEvent ? `Managing invitations for ${selectedEvent.title}.` : 'Select an event workspace to manage invitations.'}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setDependentFor(null);
                    setNewGuest(blankGuest);
                    setActiveModal('guest');
                  }}
                  disabled={!selectedEventId}
                  className="btn-primary"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add Guest</span>
                </button>
                <button
                  onClick={() => setActiveModal('import')}
                  disabled={!selectedEventId}
                  className="btn-secondary"
                >
                  <Upload className="w-4 h-4" />
                  <span>Import Contacts</span>
                </button>
                <button onClick={loadGuests} disabled={!selectedEventId || isLoading} className="btn-secondary">
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {!selectedEventId ? (
              <section className="glass-black-surface border border-[var(--panel-border)] rounded-xl p-8 text-center">
                <UsersRound className="w-12 h-12 mx-auto text-[var(--app-fg-muted)] mb-4" />
                <h2 className="text-lg font-semibold text-[var(--app-fg)]">No active event selected</h2>
                <p className="text-sm text-[var(--app-fg-muted)] mt-1">Choose an event before importing contacts or tracking RSVPs.</p>
                <button onClick={() => navigate('/events')} className="btn-primary mt-5">Open Events</button>
              </section>
            ) : (
              <>
                {error && (
                  <div className="alert-error flex items-center justify-between gap-3">
                    <p className="text-sm">{error}</p>
                    <button onClick={() => setError(null)} className="text-sm font-semibold">Dismiss</button>
                  </div>
                )}

                <section className="grid grid-cols-2 xl:grid-cols-5 gap-3">
                  {[
                    ['Invitees', estimate.total_invitees],
                    ['Plus-ones', estimate.plus_ones],
                    ['Projected', estimate.projected_attendance],
                    ['Accepted', estimate.rsvp.yes],
                    ['Pending', estimate.rsvp.pending],
                  ].map(([label, value]) => (
                    <article key={label} className="rounded-xl p-4 glass-black-surface border border-[var(--panel-border)]">
                      <p className="text-xs text-[var(--app-fg-muted)]">{label}</p>
                      <p className="mt-2 text-2xl font-bold text-[var(--app-fg)]">{value}</p>
                    </article>
                  ))}
                </section>

                <section>
                  <div className="glass-black-surface border border-[var(--panel-border)] rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-[var(--panel-border)] space-y-3">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                        <div className="flex flex-wrap gap-2">
                          {(['all', 'groups', 'rsvp', 'dependents'] as GuestTab[]).map((item) => (
                            <button
                              key={item}
                              onClick={() => setTab(item)}
                              className={`px-3 py-2 rounded-lg text-sm font-semibold capitalize ${tab === item ? 'bg-[var(--primary-light)] text-[var(--primary-text)]' : 'text-[var(--app-fg-muted)] hover:bg-[var(--surface-muted)]'}`}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                        <div className="relative w-full lg:w-72">
                          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--app-fg-muted)]" />
                          <input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search guests"
                            className="input-theme pl-9"
                          />
                        </div>
                      </div>
                    </div>

                    {isLoading ? (
                      <div className="p-8 text-sm text-[var(--app-fg-muted)]">Loading guests...</div>
                    ) : tab === 'groups' ? (
                      <div className="divide-y divide-[var(--panel-border)]">
                        {groups.map(([groupId, groupGuests]) => (
                          <article key={groupId} className="p-4">
                            <div className="flex items-center justify-between gap-3">
                              <h2 className="text-base font-semibold text-[var(--app-fg)]">{groupId}</h2>
                              <span className="text-sm text-[var(--app-fg-muted)]">{groupGuests.length} guests</span>
                            </div>
                            <p className="text-sm text-[var(--app-fg-muted)] mt-2">
                              {groupGuests.map((guest) => guest.name).join(', ')}
                            </p>
                          </article>
                        ))}
                      </div>
                    ) : filteredGuests.length === 0 ? (
                      <div className="p-10 text-center">
                        <UsersRound className="w-12 h-12 mx-auto text-[var(--app-fg-muted)] mb-4" />
                        <h2 className="text-lg font-semibold text-[var(--app-fg)]">No guests found</h2>
                        <p className="text-sm text-[var(--app-fg-muted)] mt-1">Add a guest or import contacts to build the list.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[1080px] text-sm">
                          <thead className="bg-[var(--table-head-bg)] text-[var(--app-fg-muted)]">
                            <tr>
                              <th className="text-left font-semibold px-4 py-3">Guest</th>
                              <th className="text-left font-semibold px-4 py-3">RSVP</th>
                              <th className="text-left font-semibold px-4 py-3">Meal</th>
                              <th className="text-left font-semibold px-4 py-3">Plus Members</th>
                              <th className="text-left font-semibold px-4 py-3">Gift</th>
                              <th className="text-right font-semibold px-4 py-3">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--table-row-border)]">
                            {filteredGuests.map((guest) => (
                              <Fragment key={guest.id}>
                              <tr className="hover:bg-[var(--table-row-hover)]">
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <p className="font-semibold text-[var(--app-fg)]">{guest.name}</p>
                                    <span className="rounded-full bg-[var(--primary-light)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--primary-text)]">
                                      Main
                                    </span>
                                  </div>
                                  <p className="text-xs text-[var(--app-fg-muted)]">{guest.relationship || 'No relation'} · {guestMeta(guest)}</p>
                                  <p className="text-xs text-[var(--app-fg-muted)]">{guest.phone || guest.email || 'No contact'}</p>
                                </td>
                                <td className="px-4 py-3">
                                  <select
                                    value={guest.rsvp_status}
                                    onChange={(event) => updateGuest(guest.id, { rsvp_status: event.target.value as GuestRsvpStatus })}
                                    className="input-theme min-w-[118px]"
                                  >
                                    {Object.entries(statusLabels).map(([value, label]) => (
                                      <option key={value} value={value}>{label}</option>
                                    ))}
                                  </select>
                                </td>
                                <td className="px-4 py-3">
                                  <select
                                    value={guest.meal_preference}
                                    onChange={(event) => updateGuest(guest.id, { meal_preference: event.target.value as GuestMealPreference })}
                                    className="input-theme min-w-[120px]"
                                  >
                                    {Object.entries(mealLabels).map(([value, label]) => (
                                      <option key={value} value={value}>{label}</option>
                                    ))}
                                  </select>
                                </td>
                                <td className="px-4 py-3 align-top">
                                  <div className="min-w-[380px] max-w-[500px] space-y-2">
                                    <div className="flex items-center justify-between gap-3">
                                      <span className="text-xs font-semibold text-[var(--app-fg-muted)]">
                                        {(guest.plus_members ?? []).length === 0
                                          ? 'No linked plus rows'
                                          : `${guest.plus_members?.length} linked plus ${(guest.plus_members?.length ?? 0) === 1 ? 'row' : 'rows'}`}
                                      </span>
                                      <button
                                        onClick={() => {
                                          setAddingPlusFor(guest.id);
                                          setPlusMemberBatch([createBlankPlusMember()]);
                                          setActiveModal('plus');
                                        }}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--panel-border)] px-2.5 py-1.5 text-xs font-semibold text-[var(--app-fg)] hover:bg-[var(--surface-muted)]"
                                      >
                                        <UserPlus className="w-3.5 h-3.5" />
                                        <span>Add plus rows</span>
                                      </button>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <button
                                    onClick={() => updateGuest(guest.id, { return_gift: { quantity: guest.return_gift?.quantity ? 0 : 1 } })}
                                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold ${guest.return_gift?.quantity ? 'border-[var(--primary)] text-[var(--primary-text)] bg-[var(--primary-light)]' : 'border-[var(--panel-border)] text-[var(--app-fg-muted)]'}`}
                                  >
                                    <Gift className="w-3.5 h-3.5" />
                                    <span>{guest.return_gift?.quantity ? 'Ready' : 'None'}</span>
                                  </button>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => {
                                        setDependentFor(guest.id);
                                        setNewGuest({
                                          ...blankGuest,
                                          relationship: guest.relationship ?? '',
                                          meal_preference: guest.meal_preference,
                                        });
                                        setActiveModal('guest');
                                      }}
                                      className="btn-secondary min-h-9 px-3"
                                    >
                                      <UserPlus className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => removeGuest(guest.id)} className="btn-secondary min-h-9 px-3">
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                              {(guest.plus_members ?? []).map((member, index) => (
                                <tr key={member.id ?? `${guest.id}-${index}`} className="bg-[var(--surface-subtle)]/60 hover:bg-[var(--table-row-hover)]">
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-3 pl-5">
                                      <div className="h-9 w-9 shrink-0 rounded-full border border-[var(--panel-border)] bg-[var(--surface-muted)] flex items-center justify-center text-xs font-bold text-[var(--app-fg-muted)]">
                                        {member.name.trim().slice(0, 1).toUpperCase() || 'P'}
                                      </div>
                                      <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                          <p className="font-semibold text-[var(--app-fg)]">{member.name}</p>
                                          <span className="rounded-full border border-[var(--panel-border)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--app-fg-muted)]">
                                            Plus member
                                          </span>
                                        </div>
                                        <p className="text-xs text-[var(--app-fg-muted)]">{memberMeta(member)}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className="inline-flex items-center rounded-full bg-[var(--surface-muted)] px-2.5 py-1 text-xs font-semibold text-[var(--app-fg-muted)]">
                                      With {statusLabels[guest.rsvp_status]}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className="inline-flex items-center rounded-full bg-[var(--surface-muted)] px-2.5 py-1 text-xs font-semibold text-[var(--app-fg-muted)]">
                                      {mealLabels[guest.meal_preference]}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className="inline-flex items-center rounded-full border border-[var(--panel-border)] px-2.5 py-1 text-xs font-semibold text-[var(--app-fg)]">
                                      Main: {guest.name}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className="text-xs text-[var(--app-fg-muted)]">Linked to main</span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center justify-end">
                                      <button
                                        onClick={() => removePlusMember(guest, index)}
                                        className="btn-secondary min-h-9 px-3"
                                        aria-label={`Remove ${member.name}`}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                              </Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </section>
              </>
            )}
          </div>
        </main>
      </div>
      {activeModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/45 backdrop-blur-sm px-4 py-6">
          <section className="w-full max-w-xl rounded-xl border border-[var(--panel-border)] glass-black-surface shadow-[var(--panel-shadow-lg)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between gap-3 border-b border-[var(--panel-border)] px-5 py-4">
              <div className="flex items-center gap-2">
                {activeModal === 'guest' ? (
                  <Plus className="w-4 h-4 text-[var(--primary)]" />
                ) : activeModal === 'plus' ? (
                  <UserPlus className="w-4 h-4 text-[var(--primary)]" />
                ) : (
                  <Upload className="w-4 h-4 text-[var(--primary)]" />
                )}
                <h2 className="text-base font-semibold text-[var(--app-fg)]">
                  {activeModal === 'guest'
                    ? (dependentFor ? 'Add Dependent' : 'Add Guest')
                    : activeModal === 'plus'
                      ? 'Add Plus Members'
                      : 'Import Contacts'}
                </h2>
              </div>
              <button onClick={closeModal} className="btn-secondary min-h-9 px-3" aria-label="Close modal">
                <X className="w-4 h-4" />
              </button>
            </div>

            {activeModal === 'guest' ? (
              <div className="p-5 space-y-3">
                <input value={newGuest.name} onChange={(event) => setNewGuest({ ...newGuest, name: event.target.value })} placeholder="Name" className="input-theme" />
                <input value={newGuest.phone} onChange={(event) => setNewGuest({ ...newGuest, phone: event.target.value })} placeholder="Phone" className="input-theme" />
                <input value={newGuest.email} onChange={(event) => setNewGuest({ ...newGuest, email: event.target.value })} placeholder="Email" className="input-theme" />
                <input value={newGuest.relationship} onChange={(event) => setNewGuest({ ...newGuest, relationship: event.target.value })} placeholder="Relationship" className="input-theme" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select value={newGuest.gender} onChange={(event) => setNewGuest({ ...newGuest, gender: event.target.value as GuestGender })} className="input-theme">
                    {Object.entries(genderLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                  <input type="number" min={0} value={newGuest.age ?? ''} onChange={(event) => setNewGuest({ ...newGuest, age: event.target.value ? Number(event.target.value) : null })} className="input-theme" placeholder="Age" />
                  <select value={newGuest.meal_preference} onChange={(event) => setNewGuest({ ...newGuest, meal_preference: event.target.value as GuestMealPreference })} className="input-theme">
                    {Object.entries(mealLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                  <input type="number" min={0} value={newGuest.plus_ones} onChange={(event) => setNewGuest({ ...newGuest, plus_ones: Number(event.target.value) })} className="input-theme" placeholder="Plus count" />
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-2">
                  <button onClick={closeModal} className="btn-secondary">Cancel</button>
                  <button onClick={dependentFor ? addDependent : createGuest} disabled={isSaving || !newGuest.name.trim()} className="btn-primary">
                    <UserPlus className="w-4 h-4" />
                    <span>{dependentFor ? 'Add Dependent' : 'Add Guest'}</span>
                  </button>
                </div>
              </div>
            ) : activeModal === 'plus' && plusParentGuest ? (
              <div className="p-5 space-y-4">
                <div className="rounded-lg border border-[var(--panel-border)] bg-[var(--surface-muted)] px-3 py-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-fg-muted)]">Main invitee</p>
                  <p className="mt-1 text-sm font-semibold text-[var(--app-fg)]">{plusParentGuest.name}</p>
                  <p className="text-xs text-[var(--app-fg-muted)]">{plusParentGuest.relationship || 'No relation'} · {guestMeta(plusParentGuest)}</p>
                </div>
                <div className="space-y-3">
                  {plusMemberBatch.map((draft, index) => (
                    <div key={index} className="rounded-lg border border-[var(--panel-border)] bg-[var(--surface-subtle)] p-3">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-fg-muted)]">Plus member {index + 1}</p>
                        <button
                          onClick={() => removePlusMemberDraft(index)}
                          className="text-xs font-semibold text-[var(--app-fg-muted)] hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                      <input
                        value={draft.name}
                        onChange={(event) => updatePlusMemberDraft(index, { name: event.target.value })}
                        placeholder="Plus member name"
                        className="input-theme"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                        <select
                          value={draft.gender ?? 'undisclosed'}
                          onChange={(event) => updatePlusMemberDraft(index, { gender: event.target.value as GuestGender })}
                          className="input-theme"
                        >
                          {Object.entries(genderLabels).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min={0}
                          value={draft.age ?? ''}
                          onChange={(event) => updatePlusMemberDraft(index, { age: event.target.value ? Number(event.target.value) : null })}
                          placeholder="Age"
                          className="input-theme"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={addPlusMemberDraft} className="btn-secondary w-full">
                  <UserPlus className="w-4 h-4" />
                  <span>Add Another Member</span>
                </button>
                <div className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-2">
                  <button onClick={closeModal} className="btn-secondary">Cancel</button>
                  <button
                    onClick={() => addPlusMembers(plusParentGuest)}
                    disabled={isSaving || !plusMemberBatch.some((draft) => draft.name.trim())}
                    className="btn-primary"
                  >
                    <Check className="w-4 h-4" />
                    <span>Add Plus Members</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5">
                <textarea
                  value={csvText}
                  onChange={(event) => setCsvText(event.target.value)}
                  className="input-theme min-h-[160px]"
                  placeholder="Name, phone, email, relationship, meal, plus ones"
                />
                <div className="mt-3 space-y-2">
                  {previewRows.map((row) => (
                    <div key={`${row.name}-${row.phone}`} className="rounded-lg border border-[var(--panel-border)] p-2 text-xs text-[var(--app-fg-muted)]">
                      <span className="font-semibold text-[var(--app-fg)]">{row.name}</span>
                      <span> · {row.relationship || 'No relation'} · {mealLabels[row.meal_preference ?? 'unknown']}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-4">
                  <button onClick={closeModal} className="btn-secondary">Cancel</button>
                  <button onClick={importContacts} disabled={isSaving} className="btn-primary">
                    <Upload className="w-4 h-4" />
                    <span>Import CSV Rows</span>
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};
