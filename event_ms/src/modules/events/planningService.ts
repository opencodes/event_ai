import { v4 as uuidv4 } from 'uuid';
import { EventModel } from './schemas/Event.js';
import { EventRitualModel, IEventRitualDoc } from './schemas/EventRitual.js';
import { SubEventModel } from './schemas/SubEvent.js';
import { GuestModel, IGuestDoc } from './schemas/Guest.js';
import { EventCheckpointModel, IEventCheckpointDoc } from './schemas/EventCheckpoint.js';
import { EventExpenseModel, IEventExpenseDoc } from './schemas/EventExpense.js';
import { EventVendorModel, IEventVendorDoc } from './schemas/EventVendor.js';
import { EventClothingModel } from './schemas/EventClothing.js';
import { EventBhojModel } from './schemas/EventBhoj.js';
import { EventContributionModel, IEventContributionDoc } from './schemas/EventContribution.js';

const DEFAULT_CHECKPOINTS = [
  { title: 'Venue Booking', status: 'not-started' as const, priority: 'high' as const },
  { title: 'Vendor Confirmation', status: 'in-progress' as const, priority: 'high' as const },
  { title: 'Ritual Scheduling', status: 'not-started' as const, priority: 'medium' as const },
  { title: 'Initial Budget Allocation', status: 'completed' as const, priority: 'high' as const },
];

const DEFAULT_EXPENSES = [
  { category: 'Venue', amount_paise: 10000000, status: 'confirmed' as const },
  { category: 'Catering', amount_paise: 5000000, status: 'confirmed' as const },
  { category: 'Decor', amount_paise: 3000000, status: 'in-progress' as const },
  { category: 'Clothing', amount_paise: 2000000, status: 'pending' as const },
  { category: 'Miscellaneous', amount_paise: 5000000, status: 'pending' as const },
];

const DEFAULT_VENDORS = [
  { name: 'Maithila Bhoj Caterers', category: 'Food Catering', total_amount_paise: 5000000, advance_paise: 2500000, service_date: 'Day 1', status: 'confirmed' as const },
  { name: 'Sangeet Shehnai Group', category: 'Music', total_amount_paise: 3000000, advance_paise: 0, service_date: 'Day 2', status: 'pending' as const },
  { name: 'EcoTent Solutions', category: 'Tent Builders', total_amount_paise: 10000000, advance_paise: 5000000, service_date: 'Day 1-3', status: 'confirmed' as const },
  { name: 'Shubh Vedic Purohits', category: 'Vedic Priests', total_amount_paise: 2500000, advance_paise: 0, service_date: 'Day 1', status: 'pending' as const },
  { name: 'Eternal Moments Photography', category: 'Photography', total_amount_paise: 4500000, advance_paise: 2000000, service_date: 'Day 1-3', status: 'confirmed' as const },
];

const DEFAULT_CLOTHING = {
  items: [
    { item: 'Silk Saris', required: 20, purchased: 10 },
    { item: 'Kurtas', required: 15, purchased: 5 },
    { item: 'Dhotis', required: 10, purchased: 5 },
    { item: 'Sherwanis', required: 5, purchased: 2 },
  ],
  distributions: [
    { family: "Bride's Family", saris: 10, kurtas: 5, dhotis: 3, sherwanis: 2 },
    { family: "Groom's Family", saris: 10, kurtas: 10, dhotis: 7, sherwanis: 3 },
    { family: 'Close Relatives', saris: 5, kurtas: 5, dhotis: 5, sherwanis: 2 },
  ],
};

const DEFAULT_BHOJ = {
  meals: [
    {
      day: 'Day 1',
      type: 'Maithila Bhoj (Pure Vegetarian)',
      items: ['Sabji 1 Aloo Baingan', 'Sabji 2 Kaddu', 'Sabji 3 Bhindi', 'Rice Basmati', 'Daal Tadka', 'Rasgulla', 'Dahi', 'Chini'],
    },
  ],
  ingredients: [
    { category: 'Grains', quantity: 200, unit: 'kg' },
    { category: 'Spices', quantity: 50, unit: 'kg' },
    { category: 'Dairy', quantity: 100, unit: 'liters' },
    { category: 'Vegetables', quantity: 150, unit: 'kg' },
  ],
};

const DEFAULT_CONTRIBUTIONS = [
  { contributor_name: 'Rakesh Kumar', amount_paise: 1000000, type: 'cash' as const },
  { contributor_name: 'Sita Devi', amount_paise: 500000, type: 'cash' as const },
  { contributor_name: 'Ram Kumar', amount_paise: 1500000, type: 'cash' as const },
  { contributor_name: 'Radha Devi', amount_paise: 2000000, type: 'cash' as const },
  { contributor_name: 'Krishna Kumar', amount_paise: 2500000, type: 'cash' as const },
  { contributor_name: 'Laxmi Devi', amount_paise: 2500000, type: 'cash' as const },
];

const RELATIONSHIP_BUCKETS: Record<string, string> = {
  family: 'Within Family',
  'close family': 'Within Family',
  cousin: 'Extended Family',
  uncle: 'Extended Family',
  aunt: 'Extended Family',
  friend: 'Friends',
  colleague: 'Colleagues',
  village: 'Village Community',
  community: 'Village Community',
};

const bucketForRelationship = (relationship?: string | null) => {
  if (!relationship) return 'Other';
  const key = relationship.trim().toLowerCase();
  for (const [needle, bucket] of Object.entries(RELATIONSHIP_BUCKETS)) {
    if (key.includes(needle)) return bucket;
  }
  return 'Other';
};

const ageGroupLabel = (age: number | null | undefined, gender?: string | null) => {
  const g = gender === 'female' ? 'Female' : gender === 'male' ? 'Male' : '';
  if (age === null || age === undefined) return g ? `Adults ${g} (13-60)` : 'Adults (13-60)';
  if (age <= 12) return g ? `Children ${g} (0-12)` : 'Children (0-12)';
  if (age >= 60) return g ? `Seniors ${g} (60+)` : 'Seniors (60+)';
  return g ? `Adults ${g} (13-60)` : 'Adults (13-60)';
};

const mealLabel = (meal: IGuestDoc['meal_preference']) => {
  const map: Record<string, string> = {
    veg: 'Pure Vegetarian',
    jain: 'Jain',
    non_veg: 'Non-Vegetarian',
    unknown: 'No Preference',
  };
  return map[meal] ?? 'No Preference';
};

const ritualUiStatus = (status: string) => {
  if (status === 'completed') return 'completed';
  if (status === 'in_progress') return 'in-progress';
  return 'upcoming';
};

export class EventPlanningService {
  private async ensureEventOwner(eventId: string, userId: string) {
    const event = await EventModel.findOne({ _id: eventId, organizer_user_id: userId });
    if (!event) throw new Error('Event not found or unauthorized');
    return event;
  }

  async listCheckpoints(eventId: string, userId: string) {
    await this.ensureEventOwner(eventId, userId);
    let items = await EventCheckpointModel.find({ event_id: eventId }).sort({ sort_order: 1 }).lean({ virtuals: true });
    if (items.length === 0) {
      await EventCheckpointModel.insertMany(
        DEFAULT_CHECKPOINTS.map((item, index) => ({
          _id: uuidv4(),
          event_id: eventId,
          ...item,
          sort_order: index,
        }))
      );
      items = await EventCheckpointModel.find({ event_id: eventId }).sort({ sort_order: 1 }).lean({ virtuals: true });
    }
    return items;
  }

  async createCheckpoint(eventId: string, userId: string, data: Partial<IEventCheckpointDoc>) {
    await this.ensureEventOwner(eventId, userId);
    const title = typeof data.title === 'string' ? data.title.trim() : '';
    if (!title) throw new Error('Checkpoint title is required');
    const count = await EventCheckpointModel.countDocuments({ event_id: eventId });
    return EventCheckpointModel.create({
      _id: uuidv4(),
      event_id: eventId,
      title,
      status: data.status ?? 'not-started',
      priority: data.priority ?? 'medium',
      sort_order: data.sort_order ?? count,
    });
  }

  async updateCheckpoint(eventId: string, userId: string, checkpointId: string, data: Partial<IEventCheckpointDoc>) {
    await this.ensureEventOwner(eventId, userId);
    const updated = await EventCheckpointModel.findOneAndUpdate(
      { _id: checkpointId, event_id: eventId },
      { $set: data },
      { new: true }
    ).lean({ virtuals: true });
    if (!updated) throw new Error('Checkpoint not found');
    return updated;
  }

  async getBudgetSummary(eventId: string, userId: string) {
    const event = await this.ensureEventOwner(eventId, userId);
    let expenses = await EventExpenseModel.find({ event_id: eventId }).sort({ sort_order: 1 }).lean({ virtuals: true });
    if (expenses.length === 0) {
      await EventExpenseModel.insertMany(
        DEFAULT_EXPENSES.map((item, index) => ({
          _id: uuidv4(),
          event_id: eventId,
          ...item,
          sort_order: index,
        }))
      );
      expenses = await EventExpenseModel.find({ event_id: eventId }).sort({ sort_order: 1 }).lean({ virtuals: true });
    }
    const total = event.budget_total_paise ?? 50000000;
    const spent = expenses.reduce((sum, row) => sum + row.amount_paise, 0);
    return {
      total_paise: total,
      spent_paise: spent,
      remaining_paise: Math.max(0, total - spent),
      expenses: expenses.map((row) => ({
        ...row,
        percentage: total > 0 ? Math.round((row.amount_paise / total) * 1000) / 10 : 0,
      })),
    };
  }

  async updateBudgetTotal(eventId: string, userId: string, budgetTotalPaise: number) {
    await this.ensureEventOwner(eventId, userId);
    const total = Math.max(0, Number(budgetTotalPaise));
    const updated = await EventModel.findOneAndUpdate(
      { _id: eventId, organizer_user_id: userId },
      { $set: { budget_total_paise: total } },
      { new: true }
    ).lean({ virtuals: true });
    if (!updated) throw new Error('Event not found or unauthorized');
    return this.getBudgetSummary(eventId, userId);
  }

  async updateExpense(eventId: string, userId: string, expenseId: string, data: Partial<IEventExpenseDoc>) {
    await this.ensureEventOwner(eventId, userId);
    const updated = await EventExpenseModel.findOneAndUpdate(
      { _id: expenseId, event_id: eventId },
      { $set: data },
      { new: true }
    ).lean({ virtuals: true });
    if (!updated) throw new Error('Expense not found');
    return updated;
  }

  async listVendors(eventId: string, userId: string) {
    await this.ensureEventOwner(eventId, userId);
    let vendors = await EventVendorModel.find({ event_id: eventId }).sort({ sort_order: 1 }).lean({ virtuals: true });
    if (vendors.length === 0) {
      await EventVendorModel.insertMany(
        DEFAULT_VENDORS.map((item, index) => ({
          _id: uuidv4(),
          event_id: eventId,
          ...item,
          sort_order: index,
        }))
      );
      vendors = await EventVendorModel.find({ event_id: eventId }).sort({ sort_order: 1 }).lean({ virtuals: true });
    }
    const confirmed = vendors.filter((v) => v.status === 'confirmed').length;
    const pending = vendors.filter((v) => v.status === 'pending').length;
    const paid = vendors.filter((v) => v.advance_paise > 0).length;
    return { vendors, stats: { total: vendors.length, confirmed, pending, paid } };
  }

  async updateVendor(eventId: string, userId: string, vendorId: string, data: Partial<IEventVendorDoc>) {
    await this.ensureEventOwner(eventId, userId);
    const updated = await EventVendorModel.findOneAndUpdate(
      { _id: vendorId, event_id: eventId },
      { $set: data },
      { new: true }
    ).lean({ virtuals: true });
    if (!updated) throw new Error('Vendor not found');
    return updated;
  }

  async getClothingPlan(eventId: string, userId: string) {
    await this.ensureEventOwner(eventId, userId);
    let plan = await EventClothingModel.findOne({ event_id: eventId }).lean({ virtuals: true });
    if (!plan) {
      const created = await EventClothingModel.create({
        _id: uuidv4(),
        event_id: eventId,
        ...DEFAULT_CLOTHING,
      });
      plan = created.toObject({ virtuals: true });
    }
    const items = plan?.items ?? [];
    const totalRequired = items.reduce((sum, row) => sum + row.required, 0);
    const totalPurchased = items.reduce((sum, row) => sum + row.purchased, 0);
    return {
      items,
      distributions: plan?.distributions ?? [],
      totals: { required: totalRequired, purchased: totalPurchased },
    };
  }

  async updateClothingItem(
    eventId: string,
    userId: string,
    itemName: string,
    data: { required?: number; purchased?: number }
  ) {
    await this.ensureEventOwner(eventId, userId);
    const plan = await EventClothingModel.findOne({ event_id: eventId });
    if (!plan) throw new Error('Clothing plan not found');
    const items = plan.items.map((row) =>
      row.item === itemName
        ? {
            ...row,
            required: data.required === undefined ? row.required : Math.max(0, Number(data.required)),
            purchased: data.purchased === undefined ? row.purchased : Math.max(0, Number(data.purchased)),
          }
        : row
    );
    plan.items = items;
    await plan.save();
    return this.getClothingPlan(eventId, userId);
  }

  async getBhojPlan(eventId: string, userId: string) {
    await this.ensureEventOwner(eventId, userId);
    let plan = await EventBhojModel.findOne({ event_id: eventId }).lean({ virtuals: true });
    if (!plan) {
      const created = await EventBhojModel.create({
        _id: uuidv4(),
        event_id: eventId,
        ...DEFAULT_BHOJ,
      });
      plan = created.toObject({ virtuals: true });
    }

    const guests = await GuestModel.find({ event_id: eventId }).lean({ virtuals: true });
    const bucketCounts = new Map<string, number>();
    const countHeads = (guest: IGuestDoc) => {
      if (guest.rsvp_status === 'no') return 0;
      return 1 + (guest.plus_members?.length ?? guest.plus_ones ?? 0);
    };
    guests.forEach((guest) => {
      const bucket = bucketForRelationship(guest.relationship);
      bucketCounts.set(bucket, (bucketCounts.get(bucket) ?? 0) + countHeads(guest));
    });

    const personSummary = bucketCounts.size > 0
      ? Array.from(bucketCounts.entries()).map(([category, count]) => ({ category, count }))
      : [
          { category: 'Within Family', count: 30 },
          { category: 'Extended Family', count: 20 },
          { category: 'Friends', count: 15 },
          { category: 'Colleagues', count: 10 },
          { category: 'Village Community', count: 25 },
        ];

    const totalHeadcount = personSummary.reduce((sum, row) => sum + row.count, 0);

    return {
      person_summary: personSummary,
      total_headcount: totalHeadcount,
      meals: plan.meals ?? [],
      ingredients: plan.ingredients ?? [],
    };
  }

  async updateBhojIngredient(
    eventId: string,
    userId: string,
    category: string,
    data: { quantity?: number; unit?: string }
  ) {
    await this.ensureEventOwner(eventId, userId);
    const plan = await EventBhojModel.findOne({ event_id: eventId });
    if (!plan) throw new Error('Bhoj plan not found');
    plan.ingredients = plan.ingredients.map((row) =>
      row.category === category
        ? {
            ...row,
            quantity: data.quantity === undefined ? row.quantity : Math.max(0, Number(data.quantity)),
            unit: data.unit ?? row.unit,
          }
        : row
    );
    await plan.save();
    return this.getBhojPlan(eventId, userId);
  }

  async listContributions(eventId: string, userId: string) {
    await this.ensureEventOwner(eventId, userId);
    let contributions = await EventContributionModel.find({ event_id: eventId }).sort({ sort_order: 1 }).lean({ virtuals: true });
    if (contributions.length === 0) {
      await EventContributionModel.insertMany(
        DEFAULT_CONTRIBUTIONS.map((item, index) => ({
          _id: uuidv4(),
          event_id: eventId,
          ...item,
          status: 'received',
          sort_order: index,
        }))
      );
      contributions = await EventContributionModel.find({ event_id: eventId }).sort({ sort_order: 1 }).lean({ virtuals: true });
    }
    const totalCash = contributions
      .filter((row) => row.type === 'cash')
      .reduce((sum, row) => sum + row.amount_paise, 0);
    const totalPhysical = contributions.filter((row) => row.type === 'physical').length;
    return {
      contributions,
      summary: {
        total_cash_paise: totalCash,
        total_physical: totalPhysical,
        total_contributors: contributions.length,
      },
    };
  }

  async createContribution(eventId: string, userId: string, data: Partial<IEventContributionDoc>) {
    await this.ensureEventOwner(eventId, userId);
    const name = typeof data.contributor_name === 'string' ? data.contributor_name.trim() : '';
    if (!name) throw new Error('Contributor name is required');
    const count = await EventContributionModel.countDocuments({ event_id: eventId });
    return EventContributionModel.create({
      _id: uuidv4(),
      event_id: eventId,
      contributor_name: name,
      amount_paise: Math.max(0, Number(data.amount_paise ?? 0)),
      type: data.type ?? 'cash',
      status: data.status ?? 'received',
      guest_id: data.guest_id ?? null,
      notes: data.notes ?? null,
      sort_order: count,
    });
  }

  async getRsvpAnalytics(eventId: string, userId: string) {
    await this.ensureEventOwner(eventId, userId);
    const guests = await GuestModel.find({ event_id: eventId }).lean({ virtuals: true });

    const headcount = (guest: IGuestDoc) => 1 + (guest.plus_members?.length ?? guest.plus_ones ?? 0);
    const totalInvited = guests.reduce((sum, guest) => sum + headcount(guest), 0);
    const rsvpReceived = guests
      .filter((guest) => guest.rsvp_status === 'yes' || guest.rsvp_status === 'maybe')
      .reduce((sum, guest) => sum + headcount(guest), 0);
    const pending = guests
      .filter((guest) => guest.rsvp_status === 'pending')
      .reduce((sum, guest) => sum + headcount(guest), 0);

    const mealCounts = new Map<string, number>();
    const genderCounts = new Map<string, number>();
    const ageCounts = new Map<string, number>();

    const tallyPerson = (meal: IGuestDoc['meal_preference'], gender?: string | null, age?: number | null) => {
      const mealKey = mealLabel(meal);
      mealCounts.set(mealKey, (mealCounts.get(mealKey) ?? 0) + 1);
      if (gender === 'male' || gender === 'female') {
        const genderKey = gender === 'male' ? 'Male' : 'Female';
        genderCounts.set(genderKey, (genderCounts.get(genderKey) ?? 0) + 1);
      }
      const ageKey = ageGroupLabel(age, gender);
      ageCounts.set(ageKey, (ageCounts.get(ageKey) ?? 0) + 1);
    };

    guests.forEach((guest) => {
      if (guest.rsvp_status === 'no') return;
      tallyPerson(guest.meal_preference, guest.gender, guest.age);
      (guest.plus_members ?? []).forEach((member) => {
        tallyPerson(guest.meal_preference, member.gender ?? guest.gender, member.age ?? null);
      });
    });

    const toRows = (map: Map<string, number>) =>
      Array.from(map.entries()).map(([label, count]) => ({ label, count }));

    return {
      total_invited: totalInvited || 100,
      rsvp_received: rsvpReceived || 75,
      pending: pending || 25,
      dietary_preferences: toRows(mealCounts).length > 0 ? toRows(mealCounts) : [
        { label: 'Pure Vegetarian', count: 60 },
        { label: 'Jain', count: 10 },
        { label: 'Non-Vegetarian', count: 5 },
        { label: 'No Preference', count: 5 },
      ],
      gender_distribution: toRows(genderCounts).length > 0 ? toRows(genderCounts) : [
        { label: 'Male', count: 40 },
        { label: 'Female', count: 35 },
      ],
      age_groups: toRows(ageCounts).length > 0 ? toRows(ageCounts) : [
        { label: 'Children (0-12)', count: 15 },
        { label: 'Adults (13-60)', count: 50 },
        { label: 'Seniors (60+)', count: 10 },
      ],
    };
  }

  async listRituals(eventId: string, userId: string) {
    await this.ensureEventOwner(eventId, userId);
    const rituals = await EventRitualModel.find({ event_id: eventId, skipped: false })
      .sort({ sort_order: 1 })
      .lean({ virtuals: true });
    return rituals.map((ritual) => ({
      ...ritual,
      ui_status: ritualUiStatus(ritual.status),
      time: ritual.scheduled_at
        ? new Date(ritual.scheduled_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        : 'TBD',
    }));
  }

  async updateRitual(eventId: string, userId: string, ritualId: string, data: Partial<IEventRitualDoc>) {
    await this.ensureEventOwner(eventId, userId);

    const payload: Partial<IEventRitualDoc> = { ...data };
    if (payload.name !== undefined) {
      const name = typeof payload.name === 'string' ? payload.name.trim() : '';
      if (!name) throw new Error('Ritual name is required');
      payload.name = name;
    }
    if (payload.scheduled_at !== undefined) {
      if (!payload.scheduled_at) throw new Error('Ritual date and time is required');
      const scheduledAt = new Date(payload.scheduled_at);
      if (Number.isNaN(scheduledAt.getTime())) throw new Error('Ritual date and time is invalid');
      payload.scheduled_at = scheduledAt;
    }
    if (payload.sub_event_id) {
      const subEvent = await SubEventModel.findOne({ _id: payload.sub_event_id, event_id: eventId });
      if (!subEvent) throw new Error('Sub-event not found for this event');
    }

    const updated = await EventRitualModel.findOneAndUpdate(
      { _id: ritualId, event_id: eventId },
      { $set: payload },
      { new: true }
    ).lean({ virtuals: true });
    if (!updated) throw new Error('Ritual not found');
    return {
      ...updated,
      ui_status: ritualUiStatus(updated.status),
      time: updated.scheduled_at
        ? new Date(updated.scheduled_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        : 'TBD',
    };
  }
}

export const eventPlanningService = new EventPlanningService();
