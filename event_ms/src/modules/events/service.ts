import { v4 as uuidv4 } from 'uuid';
import { EventModel, IEventDoc } from './schemas/Event.js';
import { SubEventModel, ISubEventDoc } from './schemas/SubEvent.js';
import { EventRitualModel, IEventRitualDoc } from './schemas/EventRitual.js';
import { ChecklistItemModel, IChecklistItemDoc } from './schemas/ChecklistItem.js';
import { SamagriItemModel, ISamagriItemDoc } from './schemas/SamagriItem.js';
import { ContactModel, IContactDoc } from './schemas/Contact.js';
import { GuestModel, IGuestDoc } from './schemas/Guest.js';

type ContactImportItem = Partial<IContactDoc> & {
  invite?: boolean;
  relationship?: string;
  meal_preference?: IGuestDoc['meal_preference'];
  plus_ones?: number;
  plus_members?: IGuestDoc['plus_members'];
};

const normalizePlusMembers = (members: IGuestDoc['plus_members'] = []) => {
  return members
    .map((member) => ({
      id: member.id ?? uuidv4(),
      name: typeof member.name === 'string' ? member.name.trim() : '',
      gender: member.gender ?? null,
      age: member.age === undefined || member.age === null ? null : Number(member.age)
    }))
    .filter((member) => member.name);
};

export class EventService {
  /**
   * Create a new draft event
   */
  async createEvent(userId: string, data: Partial<IEventDoc>) {
    const event = await EventModel.create({
      _id: uuidv4(),
      organizer_user_id: userId,
      status: 'draft',
      creation_source: 'scratch',
      ...data,
    });
    return event;
  }

  /**
   * Get an event with nested data (sub-events, rituals, etc.)
   */
  async getEventFull(eventId: string, userId: string) {
    const event = await EventModel.findOne({ _id: eventId, organizer_user_id: userId }).lean({ virtuals: true });
    if (!event) return null;

    const subEvents = await SubEventModel.find({ event_id: eventId }).sort({ sort_order: 1 }).lean({ virtuals: true });
    const eventRituals = await EventRitualModel.find({ event_id: eventId }).sort({ sort_order: 1 }).lean({ virtuals: true });
    
    // Fetch checklists and samagri for all rituals
    const ritualIds = eventRituals.map((r: any) => r._id);
    const checklists = await ChecklistItemModel.find({ event_ritual_id: { $in: ritualIds } }).sort({ sort_order: 1 }).lean({ virtuals: true });
    const samagris = await SamagriItemModel.find({ event_ritual_id: { $in: ritualIds } }).sort({ sort_order: 1 }).lean({ virtuals: true });

    return {
      ...event,
      sub_events: subEvents,
      rituals: eventRituals.map((r: any) => ({
        ...r,
        checklists: checklists.filter((c: any) => c.event_ritual_id === r._id),
        samagri: samagris.filter((s: any) => s.event_ritual_id === r._id),
      })),
    };
  }

  /**
   * Update basic event metadata
   */
  async updateEvent(eventId: string, userId: string, data: Partial<IEventDoc>) {
    const updated = await EventModel.findOneAndUpdate(
      { _id: eventId, organizer_user_id: userId },
      { $set: data },
      { new: true }
    );
    return updated;
  }

  /**
   * Add a sub-event
   */
  async addSubEvent(eventId: string, userId: string, data: Partial<ISubEventDoc>) {
    // Ensure event exists and belongs to user
    const event = await EventModel.findOne({ _id: eventId, organizer_user_id: userId });
    if (!event) throw new Error('Event not found or unauthorized');

    const name = typeof data.name === 'string' ? data.name.trim() : '';
    if (!name) throw new Error('Sub-event name is required');

    const startsAt = data.starts_at ? new Date(data.starts_at) : undefined;
    const endsAt = data.ends_at ? new Date(data.ends_at) : undefined;
    if (startsAt && Number.isNaN(startsAt.getTime())) throw new Error('Sub-event start date is invalid');
    if (endsAt && Number.isNaN(endsAt.getTime())) throw new Error('Sub-event end date is invalid');
    if (startsAt && endsAt && endsAt < startsAt) throw new Error('Sub-event end date must be after start date');

    const subEvent = await SubEventModel.create({
      _id: uuidv4(),
      event_id: eventId,
      name,
      sort_order: data.sort_order ?? 0,
      phase: data.phase,
      starts_at: startsAt,
      ends_at: endsAt,
      venue: data.venue,
      notes: data.notes,
      status: data.status ?? 'planned',
    });
    return subEvent;
  }

  /**
   * Add a ritual
   */
  async addRitual(eventId: string, userId: string, data: Partial<IEventRitualDoc>) {
    const event = await EventModel.findOne({ _id: eventId, organizer_user_id: userId });
    if (!event) throw new Error('Event not found or unauthorized');

    const ritual = await EventRitualModel.create({
      _id: uuidv4(),
      event_id: eventId,
      ...data,
    });
    return ritual;
  }

  /**
   * Add checklist item to a ritual
   */
  async addChecklistItem(ritualId: string, data: Partial<IChecklistItemDoc>) {
    const checklistItem = await ChecklistItemModel.create({
      _id: uuidv4(),
      event_ritual_id: ritualId,
      ...data,
    });
    return checklistItem;
  }

  /**
   * Add samagri item to a ritual
   */
  async addSamagriItem(ritualId: string, data: Partial<ISamagriItemDoc>) {
    const samagriItem = await SamagriItemModel.create({
      _id: uuidv4(),
      event_ritual_id: ritualId,
      ...data,
    });
    return samagriItem;
  }

  /**
   * Publish an event (Phase 1 validation)
   */
  async publishEvent(eventId: string, userId: string) {
    const event = await EventModel.findOne({ _id: eventId, organizer_user_id: userId });
    if (!event) throw new Error('Event not found or unauthorized');

    if (!event.title) throw new Error('Event title is required to publish.');
    if (!event.start_at) throw new Error('Event start date is required to publish.');

    const rituals = await EventRitualModel.find({ event_id: eventId, skipped: false });
    if (rituals.length === 0) throw new Error('At least one unskipped ritual is required to publish.');

    event.status = 'published';
    event.published_at = new Date();
    await event.save();
    return event;
  }

  /**
   * List user's events
   */
  async listUserEvents(userId: string) {
    return await EventModel.find({ organizer_user_id: userId })
      .sort({ created_at: -1 })
      .lean({ virtuals: true });
  }

  async importContacts(eventId: string, userId: string, contacts: ContactImportItem[]) {
    await this.ensureEventOwner(eventId, userId);

    const createdContacts = [];
    const createdGuests = [];
    for (const entry of contacts) {
      const name = typeof entry.name === 'string' ? entry.name.trim() : '';
      if (!name) continue;

      const contact = await ContactModel.create({
        _id: uuidv4(),
        user_id: userId,
        name,
        phone: entry.phone ?? null,
        email: entry.email ?? null,
        relation: entry.relation ?? entry.relationship ?? null,
        source: entry.source ?? 'csv',
        metadata: entry.metadata ?? {}
      });
      createdContacts.push(contact);

      if (entry.invite !== false) {
        const guest = await this.createGuestFromContact(eventId, contact, {
          relationship: entry.relationship ?? entry.relation ?? null,
          meal_preference: entry.meal_preference ?? 'unknown',
          plus_members: normalizePlusMembers(entry.plus_members),
          plus_ones: Number(entry.plus_ones ?? entry.plus_members?.length ?? 0)
        });
        createdGuests.push(guest);
      }
    }

    return {
      contacts: createdContacts,
      guests: createdGuests,
      imported: createdContacts.length,
      invited: createdGuests.length
    };
  }

  async listGuests(eventId: string, userId: string) {
    await this.ensureEventOwner(eventId, userId);
    return GuestModel.find({ event_id: eventId }).sort({ created_at: -1 }).lean({ virtuals: true });
  }

  async createGuest(eventId: string, userId: string, data: Partial<IGuestDoc>) {
    await this.ensureEventOwner(eventId, userId);
    const name = typeof data.name === 'string' ? data.name.trim() : '';
    if (!name) throw new Error('Guest name is required');

    const contact = await ContactModel.create({
      _id: uuidv4(),
      user_id: userId,
      name,
      phone: data.phone ?? null,
      email: data.email ?? null,
      relation: data.relationship ?? null,
      source: 'manual',
      metadata: {}
    });

    return this.createGuestFromContact(eventId, contact, data);
  }

  async updateGuest(eventId: string, userId: string, guestId: string, data: Partial<IGuestDoc>) {
    await this.ensureEventOwner(eventId, userId);
    const updated = await GuestModel.findOneAndUpdate(
      { _id: guestId, event_id: eventId },
      { $set: this.cleanGuestPayload(data) },
      { new: true }
    ).lean({ virtuals: true });
    if (!updated) throw new Error('Guest not found');

    if (updated.contact_id) {
      await ContactModel.findOneAndUpdate(
        { _id: updated.contact_id, user_id: userId },
        {
          $set: {
            name: updated.name,
            phone: updated.phone ?? null,
            email: updated.email ?? null,
            relation: updated.relationship ?? null
          }
        }
      );
    }

    return updated;
  }

  async deleteGuest(eventId: string, userId: string, guestId: string) {
    await this.ensureEventOwner(eventId, userId);
    const deleted = await GuestModel.findOneAndDelete({ _id: guestId, event_id: eventId });
    if (!deleted) throw new Error('Guest not found');
    return { id: guestId };
  }

  async addDependent(eventId: string, userId: string, guestId: string, data: Partial<IGuestDoc>) {
    await this.ensureEventOwner(eventId, userId);
    const parent = await GuestModel.findOne({ _id: guestId, event_id: eventId });
    if (!parent) throw new Error('Guest not found');
    const name = typeof data.name === 'string' ? data.name.trim() : '';
    if (!name) throw new Error('Dependent guest name is required');

    const groupId = parent.dependent_group_id ?? uuidv4();
    if (!parent.dependent_group_id) {
      parent.dependent_group_id = groupId;
      await parent.save();
    }

    return GuestModel.create({
      _id: uuidv4(),
      event_id: eventId,
      contact_id: null,
      name,
      phone: data.phone ?? null,
      email: data.email ?? null,
      relationship: data.relationship ?? parent.relationship ?? null,
      rsvp_status: data.rsvp_status ?? parent.rsvp_status,
      meal_preference: data.meal_preference ?? parent.meal_preference,
      accommodation: data.accommodation ?? parent.accommodation,
      plus_ones: 0,
      plus_members: [],
      age: data.age ?? null,
      gender: data.gender ?? null,
      dependent_group_id: groupId,
      return_gift: data.return_gift ?? { quantity: 0 },
      notes: data.notes ?? null
    });
  }

  async getGuestEstimate(eventId: string, userId: string) {
    const guests = await this.listGuests(eventId, userId);
    const totalInvitees = guests.length;
    const plusOnes = guests.reduce((total, guest) => total + this.plusMemberCount(guest), 0);
    const attendingGuests = guests
      .filter((guest) => guest.rsvp_status === 'yes')
      .reduce((total, guest) => total + 1 + this.plusMemberCount(guest), 0);
    const maybeGuests = guests
      .filter((guest) => guest.rsvp_status === 'maybe' || guest.rsvp_status === 'pending')
      .reduce((total, guest) => total + 1 + this.plusMemberCount(guest), 0);

    return {
      total_invitees: totalInvitees,
      plus_ones: plusOnes,
      projected_attendance: attendingGuests + Math.ceil(maybeGuests * 0.5),
      rsvp: {
        pending: guests.filter((guest) => guest.rsvp_status === 'pending').length,
        yes: guests.filter((guest) => guest.rsvp_status === 'yes').length,
        no: guests.filter((guest) => guest.rsvp_status === 'no').length,
        maybe: guests.filter((guest) => guest.rsvp_status === 'maybe').length
      }
    };
  }

  private async ensureEventOwner(eventId: string, userId: string) {
    const event = await EventModel.findOne({ _id: eventId, organizer_user_id: userId });
    if (!event) throw new Error('Event not found or unauthorized');
    return event;
  }

  private async createGuestFromContact(eventId: string, contact: IContactDoc, data: Partial<IGuestDoc>) {
    return GuestModel.create({
      _id: uuidv4(),
      event_id: eventId,
      contact_id: contact._id,
      name: contact.name,
      phone: contact.phone ?? null,
      email: contact.email ?? null,
      relationship: data.relationship ?? contact.relation ?? null,
      rsvp_status: data.rsvp_status ?? 'pending',
      meal_preference: data.meal_preference ?? 'unknown',
      accommodation: data.accommodation ?? false,
      plus_members: normalizePlusMembers(data.plus_members),
      plus_ones: Number(data.plus_ones ?? data.plus_members?.length ?? 0),
      age: data.age ?? null,
      gender: data.gender ?? null,
      dependent_group_id: data.dependent_group_id ?? null,
      return_gift: data.return_gift ?? { quantity: 0 },
      notes: data.notes ?? null
    });
  }

  private cleanGuestPayload(data: Partial<IGuestDoc>) {
    const plusMembers = data.plus_members === undefined ? undefined : normalizePlusMembers(data.plus_members);
    return {
      ...data,
      name: typeof data.name === 'string' ? data.name.trim() : data.name,
      plus_members: plusMembers,
      plus_ones: plusMembers === undefined
        ? data.plus_ones === undefined ? undefined : Math.max(0, Number(data.plus_ones))
        : plusMembers.length,
      age: data.age === undefined || data.age === null ? data.age : Number(data.age)
    };
  }

  private plusMemberCount(guest: Pick<IGuestDoc, 'plus_members' | 'plus_ones'>) {
    return guest.plus_members?.length ?? Number(guest.plus_ones ?? 0);
  }
}

export const eventService = new EventService();
