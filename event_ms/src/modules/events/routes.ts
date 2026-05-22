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
eventRoutes.delete('/:id', eventController.deleteEvent);
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

// Planning workspace
eventRoutes.get('/:id/checkpoints', eventController.listCheckpoints);
eventRoutes.post('/:id/checkpoints', eventController.createCheckpoint);
eventRoutes.patch('/:id/checkpoints/:checkpointId', eventController.updateCheckpoint);

eventRoutes.get('/:id/budget', eventController.getBudgetSummary);
eventRoutes.patch('/:id/budget', eventController.updateBudgetTotal);
eventRoutes.patch('/:id/expenses/:expenseId', eventController.updateExpense);

eventRoutes.get('/:id/vendors', eventController.listVendors);
eventRoutes.patch('/:id/vendors/:vendorId', eventController.updateVendor);

eventRoutes.get('/:id/clothing', eventController.getClothingPlan);
eventRoutes.patch('/:id/clothing/items/:itemName', eventController.updateClothingItem);

eventRoutes.get('/:id/bhoj', eventController.getBhojPlan);
eventRoutes.patch('/:id/bhoj/ingredients/:category', eventController.updateBhojIngredient);

eventRoutes.get('/:id/contributions', eventController.listContributions);
eventRoutes.post('/:id/contributions', eventController.createContribution);

eventRoutes.get('/:id/rsvp-analytics', eventController.getRsvpAnalytics);

eventRoutes.get('/:id/rituals', eventController.listRituals);
eventRoutes.patch('/:id/rituals/:ritualId', eventController.updateRitual);
