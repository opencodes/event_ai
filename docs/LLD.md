# Low-Level Design (LLD)

## 1. Purpose

This document defines the low-level design for the event management platform backend and user interface.
It maps the functional requirements for Host, Vendor, and Admin into backend services, data models, APIs, and UI screens.

---

## 2. Backend LLD

### 2.1 Overall Architecture

- Backend is a modular server application exposing REST/GraphQL APIs.
- Recommended stack: Node.js + NestJS or Python + FastAPI.
- Core modules:
  - Auth / Identity
  - User / Role Management
  - Event / Ceremony Management
  - Guest / Contact Management
  - Invitation / Notification
  - Vendor Marketplace
  - Planning & Logistics
  - Purchase / Task Tracker
  - Gift / Finance Tracker
  - Admin / Audit
- Services share a PostgreSQL database for transactional data and Redis for cache/sessions.
- Optional MongoDB for ritual templates and invitation template content.
- Async queue for bulk messaging, media processing, and vendor workflow notifications.

### 2.2 Service Boundaries

#### 2.2.1 Auth & Identity Service

Responsibilities:
- Phone and email OTP verification
- JWT token issuance and refresh
- Role-based authorization
- Vendor/admin access scopes

Key APIs:
- `POST /auth/request-otp`
- `POST /auth/verify-otp`
- `POST /auth/refresh-token`
- `GET /auth/me`

Entities:
- `User` {id, phone, email, name, role, preferred_locale, status, created_at}
- `RolePermission` {role, permission}

#### 2.2.2 User / Admin Service

Responsibilities:
- Manage user profiles
- Role and permission administration
- Admin audit logs

Key APIs:
- `GET /users`
- `GET /users/:id`
- `PATCH /users/:id`
- `POST /users/:id/roles`
- `DELETE /users/:id/roles`
- `GET /audit/logs`

Entities:
- `UserProfile`
- `AuditLog` {id, actor_id, target_type, target_id, action, data, timestamp}

#### 2.2.3 Event & Planning Service

Responsibilities:
- Create events from scratch or templates
- Manage sub-events and ceremony schedule
- Track Bhoj & menu planning
- Track item estimates and vendor assignments

Key APIs:
- `POST /events`
- `GET /events/:id`
- `PATCH /events/:id`
- `POST /events/:id/sub-events`
- `PATCH /events/:id/sub-events/:subEventId`
- `GET /events/:id/plan`
- `POST /events/:id/plan/items`
- `PATCH /events/:id/plan/items/:itemId`
- `POST /events/:id/vendors`
- `GET /events/:id/vendors`

Entities:
- `Event` {id, name, type, status, venue, start_at, end_at, region_code, visibility, muhurat}
- `SubEvent` {id, event_id, title, description, start_at, end_at, location, owner}
- `EventPlanItem` {id, event_id, category, name, quantity_estimate, assigned_vendor_id, status}
- `BhojPlan` {id, event_id, item, servings_estimate, vendor_id, notes}
- `KitItem` {id, event_id, category, item_name, quantity, source_type}
- `KapraEstimate` {id, event_id, category, count, notes}

#### 2.2.4 Guest & Contact Service

Responsibilities:
- Import contacts from CSV and mobile device sync
- Manage guest list, dependent guest groups, plus-ones
- Estimate guest counts and attendance
- Track return-gift details per guest

Key APIs:
- `POST /events/:id/contacts/import`
- `GET /events/:id/guests`
- `POST /events/:id/guests`
- `PATCH /events/:id/guests/:guestId`
- `POST /events/:id/guests/:guestId/dependents`
- `GET /events/:id/guest-estimate`

Entities:
- `Contact` {id, user_id, name, phone, email, relation, source, metadata}
- `Guest` {id, event_id, contact_id, name, phone, email, relationship, rsvp_status, meal_preference, accommodation, plus_ones, age, gender, dependent_group_id}
- `DependentGroup` {id, event_id, caller, status, notes}
- `ReturnGift` {id, guest_id, gift_type, quantity, notes}

#### 2.2.5 Invitation & Notification Service

Responsibilities:
- Build invitations and send by call, email, SMS, WhatsApp
- Track deliverability and RSVP responses
- Support segment-based messaging and fallback channels

Key APIs:
- `POST /events/:id/invitations/send`
- `GET /events/:id/invitations/status`
- `POST /invitations/:token/rsvp`
- `GET /invitations/:id/preview`
- `POST /events/:id/invitations/templates`

Entities:
- `Invitation` {id, event_id, guest_id, channel, status, template_id, locale, sent_at, delivered_at}
- `InvitationTemplate` {id, name, channel, locale, content, variables}
- `NotificationJob` {id, event_id, type, payload, status}

#### 2.2.6 Vendor Service

Responsibilities:
- Vendor profile creation and service catalog
- Availability and booking flow
- Estimated plan details for services

Key APIs:
- `GET /vendors`
- `POST /vendors`
- `GET /vendors/:id`
- `PATCH /vendors/:id`
- `POST /vendors/:id/packages`
- `GET /vendors/:id/availability`
- `POST /events/:id/vendor-bookings`
- `GET /events/:id/vendor-bookings`

Entities:
- `Vendor` {id, name, category, profile, location, rating, tags, status}
- `VendorPackage` {id, vendor_id, name, description, price, duration, estimates}
- `VendorAvailability` {id, vendor_id, date, status}
- `VendorBooking` {id, event_id, vendor_id, package_id, status, amount, advance_amount, dates}

#### 2.2.7 Purchase / Task Tracker Service

Responsibilities:
- Manage Vidhi Vyabhar todo items and purchase tracking
- Track completion of ritual tasks and material purchases

Key APIs:
- `GET /events/:id/tasks`
- `POST /events/:id/tasks`
- `PATCH /events/:id/tasks/:taskId`
- `GET /events/:id/purchases`
- `POST /events/:id/purchases`
- `PATCH /events/:id/purchases/:purchaseId`

Entities:
- `Task` {id, event_id, title, type, assignee_id, due_date, priority, status, notes}
- `Purchase` {id, event_id, item, quantity, vendor_name, amount, purchased_at, status, notes}

#### 2.2.8 Gift & Finance Tracker Service

Responsibilities:
- Track chuman / gift amounts received
- Record cash and digital contributions
- Generate event finance summaries

Key APIs:
- `GET /events/:id/contributions`
- `POST /events/:id/contributions`
- `PATCH /events/:id/contributions/:contributionId`
- `GET /events/:id/gift-summary`

Entities:
- `Contribution` {id, event_id, guest_id, type, amount, method, received_at, notes}
- `GiftSummary` {event_id, total_amount, total_items, pending_items}

### 2.3 Data Model Details

#### 2.3.1 Key Tables

`users`
- id UUID PK
- phone VARCHAR UNIQUE
- email VARCHAR UNIQUE NULLABLE
- name VARCHAR
- role ENUM(organizer, host, vendor, priest, admin, guest)
- preferred_locale VARCHAR(10)
- status ENUM(active, inactive)
- created_at TIMESTAMPTZ
- updated_at TIMESTAMPTZ

`events`
- id UUID PK
- name VARCHAR
- type ENUM(vivah, mundan, upnayan, naamkaran, griha_pravesh, other)
- template_id UUID NULLABLE
- status ENUM(draft, published, completed, cancelled)
- venue JSONB
- start_at TIMESTAMPTZ
- end_at TIMESTAMPTZ
- region_code VARCHAR(10)
- visibility ENUM(public, private, invite_only)
- muhurat JSONB
- created_by UUID FK
- created_at TIMESTAMPTZ
- updated_at TIMESTAMPTZ

`sub_events`
- id UUID PK
- event_id UUID FK
- title VARCHAR
- description TEXT
- start_at TIMESTAMPTZ
- end_at TIMESTAMPTZ
- location JSONB
- owner_id UUID FK
- status ENUM(planned, confirmed, completed)

`event_plan_items`
- id UUID PK
- event_id UUID FK
- category ENUM(bhoj, bartan, kirasan, milk, curd, khoa, chena_pani, kapra, other)
- name VARCHAR
- quantity_estimate INT
- actual_quantity INT NULLABLE
- assigned_vendor_id UUID NULLABLE
- status ENUM(pending, assigned, purchased, completed)
- notes TEXT

`guests`
- id UUID PK
- event_id UUID FK
- contact_id UUID NULLABLE
- name VARCHAR
- phone VARCHAR
- email VARCHAR
- relationship VARCHAR
- rsvp_status ENUM(pending, yes, no, maybe)
- meal_preference ENUM(veg, non_veg, jain, vegan, other)
- accommodation_needed BOOLEAN DEFAULT false
- plus_ones INT DEFAULT 0
- age INT NULLABLE
- gender ENUM(male, female, other, unspecified)
- dependent_group_id UUID NULLABLE
- return_gift_required BOOLEAN DEFAULT false
- return_gift_notes TEXT
- created_at TIMESTAMPTZ
- updated_at TIMESTAMPTZ

`contacts`
- id UUID PK
- user_id UUID FK
- name VARCHAR
- phone VARCHAR
- email VARCHAR
- relation VARCHAR
- source ENUM(csv, mobile, manual)
- metadata JSONB
- created_at TIMESTAMPTZ

`invitation_templates`
- id UUID PK
- name VARCHAR
- channel ENUM(whatsapp, sms, email, call)
- locale VARCHAR(10)
- content JSONB
- variables JSONB
- created_by UUID FK
- created_at TIMESTAMPTZ
- updated_at TIMESTAMPTZ

`invitations`
- id UUID PK
- event_id UUID FK
- guest_id UUID FK
- channel ENUM(whatsapp, sms, email, call)
- status ENUM(pending, sent, delivered, failed)
- template_id UUID FK
- locale VARCHAR(10)
- sent_at TIMESTAMPTZ NULLABLE
- delivered_at TIMESTAMPTZ NULLABLE
- metadata JSONB

`vendors`
- id UUID PK
- user_id UUID FK
- name VARCHAR
- category ENUM(catering, decoration, photography, venue, priest, other)
- profile JSONB
- location JSONB
- rating NUMERIC(2,1)
- status ENUM(active, inactive)
- created_at TIMESTAMPTZ

`vendor_packages`
- id UUID PK
- vendor_id UUID FK
- name VARCHAR
- description TEXT
- amount_paise BIGINT
- duration VARCHAR
- estimate_details JSONB
- created_at TIMESTAMPTZ

`vendor_bookings`
- id UUID PK
- event_id UUID FK
- vendor_id UUID FK
- package_id UUID FK
- status ENUM(inquiry, confirmed, completed, cancelled)
- amount_paise BIGINT
- advance_paise BIGINT
- booked_at TIMESTAMPTZ
- settled_at TIMESTAMPTZ NULLABLE

`tasks`
- id UUID PK
- event_id UUID FK
- title VARCHAR
- type ENUM(vidh_vyabhar, purchase, follow_up, other)
- assignee_id UUID NULLABLE
- due_date TIMESTAMPTZ NULLABLE
- priority ENUM(low, medium, high)
- status ENUM(todo, in_progress, done, blocked)
- notes TEXT
- created_at TIMESTAMPTZ
- updated_at TIMESTAMPTZ

`purchases`
- id UUID PK
- event_id UUID FK
- item VARCHAR
- quantity INT
- vendor_name VARCHAR
- amount_paise BIGINT
- purchased_at TIMESTAMPTZ NULLABLE
- status ENUM(pending, purchased, received)
- notes TEXT

`contributions`
- id UUID PK
- event_id UUID FK
- guest_id UUID NULLABLE
- type ENUM(cash, upi, card, cheque, other)
- amount_paise BIGINT
- method VARCHAR
- received_at TIMESTAMPTZ
- notes TEXT

`audit_logs`
- id UUID PK
- actor_id UUID FK
- target_type VARCHAR
- target_id UUID
- action VARCHAR
- data JSONB
- created_at TIMESTAMPTZ

### 2.4 API Design

#### 2.4.1 Authentication Endpoints

- `POST /auth/request-otp`
- `POST /auth/verify-otp`
- `POST /auth/refresh-token`
- `GET /auth/me`

#### 2.4.2 Event Management Endpoints

- `POST /events`
- `GET /events`
- `GET /events/:id`
- `PATCH /events/:id`
- `DELETE /events/:id`
- `POST /events/:id/copy`

#### 2.4.3 Sub-event & Planning Endpoints

- `POST /events/:id/sub-events`
- `GET /events/:id/sub-events`
- `PATCH /events/:id/sub-events/:subId`
- `DELETE /events/:id/sub-events/:subId`
- `POST /events/:id/plan/items`
- `PATCH /events/:id/plan/items/:itemId`
- `PATCH /events/:id/plan/kapra`
- `GET /events/:id/plan/summary`

#### 2.4.4 Guest & Contact Endpoints

- `POST /events/:id/contacts/import`
- `GET /events/:id/guests`
- `POST /events/:id/guests`
- `PATCH /events/:id/guests/:guestId`
- `DELETE /events/:id/guests/:guestId`
- `GET /events/:id/guest-estimate`
- `POST /events/:id/guests/:guestId/dependents`

#### 2.4.5 Invitation & Notification Endpoints

- `POST /events/:id/invitations/send`
- `GET /events/:id/invitations`
- `GET /events/:id/invitations/status`
- `POST /invitations/:token/rsvp`
- `POST /events/:id/invitations/templates`
- `GET /events/:id/invitations/templates`

#### 2.4.6 Vendor Endpoints

- `GET /vendors`
- `POST /vendors`
- `GET /vendors/:id`
- `PATCH /vendors/:id`
- `GET /vendors/:id/packages`
- `POST /vendors/:id/packages`
- `PATCH /vendors/:id/packages/:packageId`
- `GET /vendors/:id/availability`
- `POST /events/:id/vendor-bookings`
- `GET /events/:id/vendor-bookings`

#### 2.4.7 Task & Purchase Endpoints

- `GET /events/:id/tasks`
- `POST /events/:id/tasks`
- `PATCH /events/:id/tasks/:taskId`
- `GET /events/:id/purchases`
- `POST /events/:id/purchases`
- `PATCH /events/:i/purchases/:purchaseId`

#### 2.4.8 Contributions & Gift Endpoints

- `GET /events/:id/contributions`
- `POST /events/:id/contributions`
- `PATCH /events/:id/contributions/:contributionId`
- `GET /events/:id/gift-summary`

#### 2.4.9 Admin Endpoints

- `GET /users`
- `PATCH /users/:id`
- `POST /users/:id/roles`
- `DELETE /users/:id/roles`
- `GET /roles`
- `GET /audit/logs`

### 2.5 Backend Workflow Details

#### 2.5.1 Event creation

- User creates an event via `POST /events`
- If template selected, apply template data and create `sub_events`, `plan_items`, and default guests structure
- Persist primary event data in `events`
- Build initial `event_plan_items` for Bhoj and material categories

#### 2.5.2 Contact import

- `POST /events/:id/contacts/import` accepts CSV or mobile contact payload
- Normalize contact names, phone, email, relationship
- Insert into `contacts`
- Create associated `guests` records if marked for invite

#### 2.5.3 Dependent guest group mapping

- A dependent group is created when a caller confirms attendance for an invitee group
- Each guest is stored in `guests` with `dependent_group_id`
- Return gift and demographic attributes are captured per guest

#### 2.5.4 Invitation delivery

- Host selects channels and templates
- `POST /events/:id/invitations/send` enqueues jobs for WhatsApp, SMS, email, or phone call
- Worker uses `InvitationTemplate` and `Invitation` rows for delivery status
- RSVP link contains a secure token mapped to guest and event
- RSVP updates guest record and triggers dashboard updates

#### 2.5.5 Vendor booking

- Vendor lists services via `/vendors`
- Host chooses packages and sends a booking request
- `POST /events/:id/vendor-bookings` creates `VendorBooking` with status `inquiry`
- Payment service captures advance and updates booking status on webhook

#### 2.5.6 Task tracking

- Hosts add vidhi vyabhar tasks and purchases
- Each task item is assigned and status-tracked by event
- Completion triggers event readiness progress metrics

#### 2.5.7 Admin governance

- Admin manages users and roles
- Audit logs capture changes to events, vendor bookings, and user permissions

### 2.6 Integration Points

- WhatsApp Business API / SMS gateway / email provider
- Razorpay or payment gateway for advance payments and contributions
- Google Maps for venue location and address autocomplete
- Panchang API for muhurat suggestions
- Cloud storage for media and document attachments

---

## 3. UI LLD

### 3.1 UI Architecture

- Primary front-end application: Next.js 14+ for web
- Optional mobile app: React Native or Flutter for Host/Vendor/Admin access
- Shared UI library using component-driven design
- Pages / views divided by persona: Host, Vendor, Admin
- UI state managed with Redux / Zustand / React Query
- Layouts:
  - Public landing
  - Authenticated dashboard
  - Event workspace
  - Vendor portal
  - Admin console

### 3.2 Persona-specific UI Flows

#### 3.2.1 Host / Organizer UI

Key screens:
- Dashboard: upcoming events, readiness, RSVP summary, vendor status
- Create event screen: new event or template selection
- Event details workspace: sub-events, timeline, venue, muhurat
- Guest manager: import contacts, guest relationship mapping, dependent groups, guest estimate
- Bhoj & logistics planner: menu planner, item inventory, kapra estimate
- Vendor assignments: vendor search, service details, booking status
- Invitations: compose/send invites, channel selection, delivery status
- Task tracker: vidh vyabhar todos, purchase checklist
- Gift tracker: chuman amounts, gift summary, thank-you note tasks

UI components:
- Stepper form for event creation
- Contact import dropzone and CSV preview
- Guest card with RSVP status and return gift toggle
- Guest group panel with aggregate counts
- Material estimate cards for bartan, milk, curd, kapra, etc.
- Vendor cards with package estimates and availability badges
- Timeline calendar for sub-events
- Progress indicators for event readiness and task completion

#### 3.2.2 Vendor UI

Key screens:
- Vendor profile setup
- Service listing builder
- Booking requests inbox
- Availability calendar
- Package editor with estimated plan details
- Earnings dashboard and bookings

UI components:
- Service card with estimate details and sample images
- Calendar heatmap for blocked dates
- Booking request table with action buttons
- Review panel and vendor analytics cards

#### 3.2.3 Admin UI

Key screens:
- User management console
- Role & permission editor
- Audit log viewer
- Template / category management
- Platform health and usage metrics

UI components:
- Role assignment matrix
- Search and filter on users, events, vendors
- Audit log timeline with change details
- Feature flag toggles and template status cards

### 3.3 Screen & Component Layout

#### Event Workspace Layout

- Left rail: event navigation
  - Overview
  - Guest list
  - Invitations
  - Planning
  - Vendors
  - Tasks
  - Finance
- Main panel: selected section details
- Right rail: event summary + quick actions + progress

#### Guest Manager Layout

- Top toolbar: import, add guest, estimate summary
- Tabs: all guests / guest groups / RSVP / dependents
- Search/filter by name, relation, status
- Table or card list with contact info, RSVP, plus-one, age/gender
- Detail drawer for return gift and notes

#### Planning Layout

- Summary header: Bhoj estimate, kapra count, material status
- Tabbed plan view: menu, kitchen items, kapra, sub-event assignments
- Add item modal for new plan items
- Vendor assignments table with status labels

### 3.4 Component Patterns

- Reusable forms: event details, contact fields, vendor package editor
- Standard list/table components with bulk actions
- Drawer detail views for guest/vendor/task details
- Modal flows for confirmation, import, and assign operations
- Toast / inline alerts for save status and async updates
- Responsive grids for mobile and tablet screens

### 3.5 Data Fetching & State

- Use query hooks for event, guest, vendor, task data
- Prefetch event summary on dashboard landing
- Optimistic updates for RSVP and task status
- Server-driven permissions to hide/show UI elements
- Local computed state for guest estimate totals and event readiness

### 3.6 Mobile / Responsive Behavior

- Mobile-first card-based UI for event workspace
- Bottom navigation for core app sections on mobile
- Collapsible side menus and summarised event progress
- Condensed guest list with swipe actions for RSVP and notes
- Full-screen modals for import and add item workflows

### 3.7 Accessibility & Localization

- Support screen-reader labels, keyboard navigation, focus management
- Locale fallback and timeline formatting using i18n library
- RTL support not required initially but architecture is language-agnostic
- High contrast and adjustable font sizes for readability

### 3.8 UI Security

- Enforce role-based feature visibility
- Prevent unauthorized actions in UI using server-side permission checks
- Sanitize HTML injection in templates and guest notes
- Secure magic RSVP links and route guards for authenticated screens

---

## 4. Implementation Notes

- Backend should expose OpenAPI schema for APIs.
- UI should be built as a component-driven design system.
- Backend and UI share common domain models for events, guests, vendors, and roles.
- Use feature flags to phase in invite channels and vendor marketplace features.
- Ensure event creation and guest import flows are highly guided for Host personas.

---

## 5. Appendices

### 5.1 Recommended Module Structure

Backend modules:
- `auth`
- `users`
- `events`
- `contacts`
- `invitations`
- `vendors`
- `tasks`
- `finance`
- `admin`

UI modules:
- `pages`
- `components`
- `hooks`
- `services`
- `layouts`
- `contexts`

### 5.2 Event States

- `draft` → `published` → `completed` / `cancelled`
- `guest` RSVP: `pending`, `yes`, `no`, `maybe`
- `vendor_booking`: `inquiry`, `confirmed`, `completed`, `cancelled`
- `task`: `todo`, `in_progress`, `done`, `blocked`

### 5.3 Suggested Data Flow

1. Host creates event.
2. Host imports contacts.
3. Backend normalizes guests and builds dependent groups.
4. Host sends invitations through Notification Service.
5. Guests RSVP and host tracks attendance.
6. Host assigns vendors and purchases.
7. Admin monitors roles and platform operations.
