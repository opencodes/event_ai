import { Request, Response } from 'express';
import { eventService } from './service.js';
import { eventPlanningService } from './planningService.js';

export const createEvent = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth.userId;
    const event = await eventService.createEvent(userId, req.body);
    res.success(event, 'Event created successfully', 201);
  } catch (error: any) {
    res.fail(error.message, 400);
  }
};

export const listEvents = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth.userId;
    const events = await eventService.listUserEvents(userId);
    res.success(events, 'Events retrieved successfully');
  } catch (error: any) {
    res.fail(error.message, 400);
  }
};

export const getEvent = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth.userId;
    const eventId = req.params.id;
    const event = await eventService.getEventFull(eventId, userId);
    if (!event) {
      return res.fail('Event not found', 404);
    }
    res.success(event, 'Event retrieved successfully');
  } catch (error: any) {
    res.fail(error.message, 400);
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth.userId;
    const eventId = req.params.id;
    const updated = await eventService.updateEvent(eventId, userId, req.body);
    if (!updated) {
      return res.fail('Event not found or unauthorized', 404);
    }
    res.success(updated, 'Event updated successfully');
  } catch (error: any) {
    res.fail(error.message, 400);
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth.userId;
    const eventId = req.params.id;
    const result = await eventService.deleteEvent(eventId, userId);
    res.success(result, 'Event deleted successfully');
  } catch (error: any) {
    res.fail(error.message, 400);
  }
};


export const publishEvent = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth.userId;
    const eventId = req.params.id;
    const published = await eventService.publishEvent(eventId, userId);
    res.success(published, 'Event published successfully');
  } catch (error: any) {
    res.fail(error.message, 400);
  }
};

export const addSubEvent = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth.userId;
    const eventId = req.params.id;
    const subEvent = await eventService.addSubEvent(eventId, userId, req.body);
    res.success(subEvent, 'Sub-event added successfully', 201);
  } catch (error: any) {
    res.fail(error.message, 400);
  }
};

export const addRitual = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth.userId;
    const eventId = req.params.id;
    const ritual = await eventService.addRitual(eventId, userId, req.body);
    res.success(ritual, 'Ritual added successfully', 201);
  } catch (error: any) {
    res.fail(error.message, 400);
  }
};

export const addChecklistItem = async (req: Request, res: Response) => {
  try {
    const ritualId = req.params.ritualId;
    const item = await eventService.addChecklistItem(ritualId, req.body);
    res.success(item, 'Checklist item added successfully', 201);
  } catch (error: any) {
    res.fail(error.message, 400);
  }
};

export const addSamagriItem = async (req: Request, res: Response) => {
  try {
    const ritualId = req.params.ritualId;
    const item = await eventService.addSamagriItem(ritualId, req.body);
    res.success(item, 'Samagri item added successfully', 201);
  } catch (error: any) {
    res.fail(error.message, 400);
  }
};

export const importContacts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth.userId;
    const eventId = req.params.id;
    const contacts = Array.isArray(req.body.contacts) ? req.body.contacts : [];
    const result = await eventService.importContacts(eventId, userId, contacts);
    res.success(result, 'Contacts imported successfully', 201);
  } catch (error: any) {
    res.fail(error.message, 400);
  }
};

export const listGuests = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth.userId;
    const eventId = req.params.id;
    const guests = await eventService.listGuests(eventId, userId);
    res.success(guests, 'Guests retrieved successfully');
  } catch (error: any) {
    res.fail(error.message, 400);
  }
};

export const createGuest = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth.userId;
    const eventId = req.params.id;
    const guest = await eventService.createGuest(eventId, userId, req.body);
    res.success(guest, 'Guest created successfully', 201);
  } catch (error: any) {
    res.fail(error.message, 400);
  }
};

export const updateGuest = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth.userId;
    const eventId = req.params.id;
    const guest = await eventService.updateGuest(eventId, userId, req.params.guestId, req.body);
    res.success(guest, 'Guest updated successfully');
  } catch (error: any) {
    res.fail(error.message, 400);
  }
};

export const deleteGuest = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth.userId;
    const eventId = req.params.id;
    const result = await eventService.deleteGuest(eventId, userId, req.params.guestId);
    res.success(result, 'Guest deleted successfully');
  } catch (error: any) {
    res.fail(error.message, 400);
  }
};

export const addDependent = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth.userId;
    const eventId = req.params.id;
    const guest = await eventService.addDependent(eventId, userId, req.params.guestId, req.body);
    res.success(guest, 'Dependent guest added successfully', 201);
  } catch (error: any) {
    res.fail(error.message, 400);
  }
};

export const getGuestEstimate = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth.userId;
    const eventId = req.params.id;
    const estimate = await eventService.getGuestEstimate(eventId, userId);
    res.success(estimate, 'Guest estimate retrieved successfully');
  } catch (error: any) {
    res.fail(error.message, 400);
  }
};

export const listCheckpoints = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth.userId;
    const checkpoints = await eventPlanningService.listCheckpoints(req.params.id, userId);
    res.success(checkpoints, 'Checkpoints retrieved successfully');
  } catch (error: any) {
    res.fail(error.message, 400);
  }
};

export const createCheckpoint = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth.userId;
    const checkpoint = await eventPlanningService.createCheckpoint(req.params.id, userId, req.body);
    res.success(checkpoint, 'Checkpoint created successfully', 201);
  } catch (error: any) {
    res.fail(error.message, 400);
  }
};

export const updateCheckpoint = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth.userId;
    const checkpoint = await eventPlanningService.updateCheckpoint(
      req.params.id,
      userId,
      req.params.checkpointId,
      req.body
    );
    res.success(checkpoint, 'Checkpoint updated successfully');
  } catch (error: any) {
    res.fail(error.message, 400);
  }
};

export const getBudgetSummary = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth.userId;
    const summary = await eventPlanningService.getBudgetSummary(req.params.id, userId);
    res.success(summary, 'Budget summary retrieved successfully');
  } catch (error: any) {
    res.fail(error.message, 400);
  }
};

export const updateBudgetTotal = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth.userId;
    const summary = await eventPlanningService.updateBudgetTotal(
      req.params.id,
      userId,
      Number(req.body.budget_total_paise ?? req.body.total_paise ?? 0)
    );
    res.success(summary, 'Budget updated successfully');
  } catch (error: any) {
    res.fail(error.message, 400);
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth.userId;
    const expense = await eventPlanningService.updateExpense(
      req.params.id,
      userId,
      req.params.expenseId,
      req.body
    );
    res.success(expense, 'Expense updated successfully');
  } catch (error: any) {
    res.fail(error.message, 400);
  }
};

export const listVendors = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth.userId;
    const result = await eventPlanningService.listVendors(req.params.id, userId);
    res.success(result, 'Vendors retrieved successfully');
  } catch (error: any) {
    res.fail(error.message, 400);
  }
};

export const updateVendor = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth.userId;
    const vendor = await eventPlanningService.updateVendor(
      req.params.id,
      userId,
      req.params.vendorId,
      req.body
    );
    res.success(vendor, 'Vendor updated successfully');
  } catch (error: any) {
    res.fail(error.message, 400);
  }
};

export const getClothingPlan = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth.userId;
    const plan = await eventPlanningService.getClothingPlan(req.params.id, userId);
    res.success(plan, 'Clothing plan retrieved successfully');
  } catch (error: any) {
    res.fail(error.message, 400);
  }
};

export const updateClothingItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth.userId;
    const plan = await eventPlanningService.updateClothingItem(
      req.params.id,
      userId,
      req.params.itemName,
      req.body
    );
    res.success(plan, 'Clothing item updated successfully');
  } catch (error: any) {
    res.fail(error.message, 400);
  }
};

export const getBhojPlan = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth.userId;
    const plan = await eventPlanningService.getBhojPlan(req.params.id, userId);
    res.success(plan, 'Bhoj plan retrieved successfully');
  } catch (error: any) {
    res.fail(error.message, 400);
  }
};

export const updateBhojIngredient = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth.userId;
    const plan = await eventPlanningService.updateBhojIngredient(
      req.params.id,
      userId,
      req.params.category,
      req.body
    );
    res.success(plan, 'Bhoj ingredient updated successfully');
  } catch (error: any) {
    res.fail(error.message, 400);
  }
};

export const listContributions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth.userId;
    const result = await eventPlanningService.listContributions(req.params.id, userId);
    res.success(result, 'Contributions retrieved successfully');
  } catch (error: any) {
    res.fail(error.message, 400);
  }
};

export const createContribution = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth.userId;
    const contribution = await eventPlanningService.createContribution(req.params.id, userId, req.body);
    res.success(contribution, 'Contribution created successfully', 201);
  } catch (error: any) {
    res.fail(error.message, 400);
  }
};

export const getRsvpAnalytics = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth.userId;
    const analytics = await eventPlanningService.getRsvpAnalytics(req.params.id, userId);
    res.success(analytics, 'RSVP analytics retrieved successfully');
  } catch (error: any) {
    res.fail(error.message, 400);
  }
};

export const listRituals = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth.userId;
    const rituals = await eventPlanningService.listRituals(req.params.id, userId);
    res.success(rituals, 'Rituals retrieved successfully');
  } catch (error: any) {
    res.fail(error.message, 400);
  }
};

export const updateRitual = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth.userId;
    const ritual = await eventPlanningService.updateRitual(
      req.params.id,
      userId,
      req.params.ritualId,
      req.body
    );
    res.success(ritual, 'Ritual updated successfully');
  } catch (error: any) {
    res.fail(error.message, 400);
  }
};
