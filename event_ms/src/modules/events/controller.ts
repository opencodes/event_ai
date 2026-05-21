import { Request, Response } from 'express';
import { eventService } from './service.js';

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
