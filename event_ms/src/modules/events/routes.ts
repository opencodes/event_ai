import { Router } from 'express';
import { authMiddleware } from '../../core/shared/middleware/auth.js';
import * as eventController from './controller.js';

export const eventRoutes = Router();

// All event routes require authentication
eventRoutes.use(authMiddleware);

// Event CRUD
eventRoutes.post('/', eventController.createEvent);
eventRoutes.get('/', eventController.listEvents);
eventRoutes.get('/:id', eventController.getEvent);
eventRoutes.patch('/:id', eventController.updateEvent);
eventRoutes.post('/:id/publish', eventController.publishEvent);

// Guests & contacts
eventRoutes.post('/:id/contacts/import', eventController.importContacts);
eventRoutes.get('/:id/guests', eventController.listGuests);
eventRoutes.post('/:id/guests', eventController.createGuest);
eventRoutes.patch('/:id/guests/:guestId', eventController.updateGuest);
eventRoutes.delete('/:id/guests/:guestId', eventController.deleteGuest);
eventRoutes.post('/:id/guests/:guestId/dependents', eventController.addDependent);
eventRoutes.get('/:id/guest-estimate', eventController.getGuestEstimate);

// SubEvents
eventRoutes.post('/:id/sub-events', eventController.addSubEvent);

// Rituals
eventRoutes.post('/:id/rituals', eventController.addRitual);

// Checklist & Samagri (Nested under rituals for ease, though we could use event ID)
eventRoutes.post('/rituals/:ritualId/checklist', eventController.addChecklistItem);
eventRoutes.post('/rituals/:ritualId/samagri', eventController.addSamagriItem);
