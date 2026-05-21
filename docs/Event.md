# Event Module Specification
## Event Creation, Templates & Ritual Planning

**Version:** 1.2  
**Status:** Draft  
**Scope:** Event bounded context — creation, templates, rituals library, host planning, admin governance  
**Related:** [HLD.md](./HLD.md) · [LLD.md](./LLD.md)

> **Product principle:** Build event creation first, then let organizers save a successful event as a reusable template, then make new event creation faster through saved templates.

---

## Table of Contents

0. [Implementation Phases](#0-implementation-phases)
1. [Overview](#1-overview)
2. [Functional Requirements](#2-functional-requirements)
3. [Data Design](#3-data-design)
4. [User Flows](#4-user-flows)
5. [Template Library](#5-template-library)
6. [Rituals Library](#6-rituals-library)
7. [Template Creation](#7-template-creation)
8. [Admin](#8-admin)
9. [API Surface (Summary)](#9-api-surface-summary)
10. [Validation & Business Rules](#10-validation--business-rules)
11. [Non-Functional (Event Module)](#11-non-functional-event-module)

---

## 1. Overview

### 1.1 Purpose

The **Event module** is the core of the platform. It lets organizers and hosts:

- Create ceremonies from scratch first, then from **saved ceremony templates**
- Plan **sub-events**, **rituals**, schedules, and venues
- Attach **muhurat**, **samagri**, and preparation checklists
- Run **host planning** (Bhoj, materials, dependents, vidhi vyavhar)
- Progress an event through **draft → published → in_progress → completed → archived**

Templates and rituals live in a **library layer** (PostgreSQL JSONB for early family templates → MongoDB when the shared catalog grows). Events created from templates **snapshot** template/ritual versions so platform, family, or community edits never change live events.

### 1.2 Event Workspace Principle

Event is the primary workspace object. After a user selects an event, the rest of the application should behave in the context of that selected event.

| Rule | Detail |
|------|--------|
| Workspace selector | Show an event switcher in a persistent area such as a sidebar-bottom Events accordion or the top bar |
| Selected event | Persist `activeEventId` in app settings for the user session |
| Module scoping | Guests, rituals, finance, tasks, host planning, media, and reports read/write against the selected event |
| Navigation | Selecting an event activates the workspace without changing page; event list/detail/create may also update the active workspace when opened directly |
| Empty state | If no event is selected, modules show an event selection prompt instead of global data |
| API calls | Module APIs include `event_id` in route or query once the workspace is selected |

### 1.3 Actors

| Actor | Event capabilities |
|-------|-------------------|
| **Organizer** | Full CRUD on owned events; publish; invite co-organizers |
| **Host / Planner** | Sub-events, Bhoj, materials, guest estimates, preparation tracker |
| **Co-organizer** | Scoped edit per `event_members.permission` |
| **Priest** (linked) | View ritual schedule; attach/update samagri on booked rituals |
| **Admin** | Template/ritual library; approve community templates; override/support |
| **Guest** | Read published event summary via invite link only (no event CRUD) |

### 1.4 Event Lifecycle States

```
┌────────┐    publish     ┌───────────┐   start date    ┌─────────────┐
│ DRAFT  │───────────────►│ PUBLISHED │────────────────►│ IN_PROGRESS │
└────────┘                └───────────┘                 └──────┬──────┘
     ▲                           │                              │
     │         unpublish         │ cancel                       │ end + close
     └───────────────────────────┼──────────────────────────────┤
                                 ▼                              ▼
                          ┌───────────┐                  ┌───────────┐
                          │ CANCELLED │                  │ COMPLETED │
                          └───────────┘                  └─────┬─────┘
                                                                 │ archive (90d)
                                                                 ▼
                                                          ┌───────────┐
                                                          │ ARCHIVED  │
                                                          └───────────┘
```

| State | Description |
|-------|-------------|
| `draft` | Editable; not visible to guests; invitations disabled |
| `published` | Visible per visibility rule; invites/RSVP enabled |
| `in_progress` | Auto or manual when first sub-event starts |
| `completed` | Ceremony finished; read-heavy; media upload peak |
| `cancelled` | Soft cancel; notify guests; retain data |
| `archived` | Read-only; exports allowed; PII retention per policy |

---

## 0. Implementation Phases

To ensure a solid architectural foundation and prioritize user-driven utility, the Event Module is implemented in four structured phases. Each phase builds logically upon the previous, starting with basic event creation, proceeding to template extraction, and culminating in full template utilization and community expansion.

| Phase | Title | Primary Goal | Event Module Focus |
|---|---|---|---|
| **Phase 1** | **Create Event (From Scratch)** | Organizer can create and manage a complete, customized ceremony manually without any pre-existing templates. | Draft event creation, ceremony type selection, core metadata (title, locale, timezone), multi-day schedule/sub-events, manual rituals, per-ritual checklist tasks, samagri lists, and the draft-to-publish validation gate. |
| **Phase 2** | **Save as Template** | Organizer can extract and save a successfully planned real-world event as a reusable family/private template. | Reusable template extraction engine, template metadata configuration (tradition, region, locale), automated exclusion of instance data (guests, RSVPs, invite links, notes), and local template catalog persistence. |
| **Phase 3** | **Create Event With Template** | Organizer can spin up a new event instantly by applying a saved family template or a pre-seeded platform template. | Template browser interface, detail previewing, snapshot copy-on-write initialization (frozen instance configurations), and override diff management (organizer custom tweaks relative to template snapshot). |
| **Phase 4** | **Extensions & Community Library** | Scale content and tools beyond individual families to the public community. | Community template sharing, content moderation queues, user reviews/ratings, elastic ritual searches, priest-Pandit integration, and advanced host logistics (Bhoj menu, materials checklist, return-gift ledger). |

---

### 0.1 Phase 1 — Create Event (From Scratch)

In this initial phase, the platform must support complete event customization without relying on pre-existing template records in the database. This ensures organizers have ultimate flexibility and prevents database lock-in.

```mermaid
graph TD
    Start([Start: 'New Event']) --> PickCeremony[Pick Ceremony Type]
    PickCeremony --> Basics[Enter Title, Locale, Timezone]
    Basics --> DraftEvent[Save Draft Event]
    DraftEvent --> AddSubEvents[Add Sub-Events & Schedule]
    AddSubEvents --> AddRituals[Add Manual Rituals]
    AddRituals --> ChecklistSamagri[Define Checklists & Samagri Items]
    ChecklistSamagri --> PublishGate{Validation Gate: Title, Date, & >=1 Ritual?}
    PublishGate -- No --> EditDraft[Edit Draft]
    EditDraft --> DraftEvent
    PublishGate -- Yes --> Publish[Publish Event & Activate Invites]
```

> [!IMPORTANT]
> **Phase 1 Rule:** Event creation must be completely self-contained and run on a relational model (PostgreSQL). It does NOT require or query template databases. The organizer represents the source of truth for all rituals, check-lists, and sub-events.
>
> **Excluded from Phase 1:** Save as template, create from template, Panchang/Muhurat API integration, community contributions, host Bhoj/material details, vendor marketplaces, and guest invite channels.

---

### 0.2 Phase 2 — Save Event as Template

Once an organizer completes or successfully plans a custom event, they must be able to convert that plan into a private template for their family. This grounds the template system in actual real-world usage patterns rather than abstract admin builders.

```mermaid
graph LR
    Event[Select Real Event] --> SaveTpl[Trigger 'Save as Template']
    SaveTpl --> FilterData[System Filters Out Instance Data: Guests, RSVPs, Private Notes]
    FilterData --> MetaForm[Organizer Fills Metadata: Template Name, Region, Tradition, Language]
    MetaForm --> ConfirmSave[Review Extracted Sub-events, Rituals, & Checklists]
    ConfirmSave --> SaveDb[(Save Private/Family Template)]
```

> [!TIP]
> **Phase 2 Rule:** Templates are *extracted* from actual instances. The system maps `events` -> `family_templates`, copying the nested hierarchy of `sub_events` and `event_rituals` (along with their associated checklists and samagri list structures) while strictly excluding personal data.
>
> **Excluded from Phase 2:** Platform templates, public community submission, template version upgrade migrations, and auto-applying templates.

---

### 0.3 Phase 3 — Create Event With Template

With family and platform templates populated, organizers can dramatically accelerate event setup. Applying a template bootstraps the entire workflow while maintaining full editing autonomy.

```mermaid
graph TD
    StartTpl([Start: 'New Event with Template']) --> BrowseTpls[Browse Family & Platform Templates]
    BrowseTpls --> PreviewTpl[Preview Blueprint: Rituals, Schedules, Checklists]
    PreviewTpl --> ApplyTpl[Apply Template to New Event]
    ApplyTpl --> SnapshotTpl[Clone Snapshot to Event Schema]
    SnapshotTpl --> CustomFields[Organizer Enters Event-Specific Dates, Venue, Title]
    CustomFields --> EditInstance[Customize Instance: Skip, Add, or Reorder Rituals]
    EditInstance --> Publish[Publish Event]
```

> [!IMPORTANT]
> **Phase 3 Rule:** Applying a template creates a **frozen copy (snapshot)** at the moment of initialization. Subsequent edits to the template document MUST NOT affect already generated event instances. Any customized changes made by the organizer are recorded as local overrides on the event itself.
>
> **Excluded from Phase 3:** Community submissions, review moderation queue, rating/feedback loops, and curator overrides.

---

### 0.4 Phase 4 — Extensions & Community Library

Once the core creation and templating workflows are verified and stable, the platform expands to allow community contribution, professional curate controls, and detailed host logistical dashboards.


---

## 2. Functional Requirements

### 2.1 Event CRUD

| ID | Requirement | Phase |
|----|-------------|-------|
| E-001 | Create event with `ceremony_type`, title, primary locale | Phase 1 |
| E-002 | Save as `draft` without required date/venue | Phase 1 |
| E-003 | Update event metadata (title, description, cover image, tags) | Phase 1 |
| E-004 | Delete draft event (hard delete); cancel published event (soft) | Phase 1 |
| E-005 | Duplicate event from existing (copy rituals, not guests) | Phase 3 |
| E-006 | List events for user (filter: status, ceremony_type, date range) | Phase 1 |
| E-007 | Event visibility: `private`, `invite_only` (Phase 1); `unlisted_public` (Phase 4) | Phase 1/4 |
| E-008 | Assign `region_code` and `tradition` for template matching | Phase 1 |
| E-009 | Link event to `user_id` (organizer) and optional `host_user_id` | Phase 1 |
| E-010 | Add co-organizers with granular permissions | Phase 4 |

### 2.2 Ceremony & Schedule

| ID | Requirement | Phase |
|----|-------------|-------|
| E-020 | Ceremony types: Vivah, Mundan, Griha Pravesh (Phase 1); +Upnayan, Naamkaran, Other (Phase 4) | Phase 1/4 |
| E-021 | Apply **ceremony template** → populate rituals & default sub-events | Phase 3 |
| E-022 | Add/edit/remove **sub-events** (e.g. Haldi Day 1, Pheras) with start/end | Phase 1 |
| E-023 | Multi-day events: timeline view across days | Phase 1 |
| E-024 | Venue per sub-event or shared master venue | Phase 1 |
| E-025 | Integrate **muhurat**: fetch suggestions, pick window, manual override | Phase 4 (Phase 1: manual date only) |
| E-026 | Store muhurat source, tithi, nakshatra, priest override flag | Phase 4 |
| E-027 | Attach Google/Outlook calendar export (ICS) per sub-event | Phase 4 |

### 2.3 Rituals & Checklists (Event Instance)

| ID | Requirement | Phase |
|----|-------------|-------|
| E-030 | Add rituals manually to event | Phase 1 |
| E-031 | Reorder, skip, or add custom rituals on event | Phase 1 |
| E-032 | Per-ritual checklist items (done/todo; assignee/due Phase 4) | Phase 1 |
| E-033 | Samagri list per ritual | Phase 1 |
| E-034 | Mark ritual status: `planned`, `ready`, `in_progress`, `done` | Phase 1 |
| E-035 | Instantiate rituals from template snapshot | Phase 3 |
| E-036 | Priest can suggest samagri edits on linked booking | Phase 4 |
| E-037 | After event completed, prompt to submit ritual diff to community | Phase 4 |

### 2.4 Host Planning (Extended)

| ID | Requirement | Phase |
|----|-------------|-------|
| E-040 | Guest estimate: invitees, villagers, buffer % | Phase 4 |
| E-041 | Dependent guest groups (parent/guardian, linked members) | Phase 4 |
| E-042 | **Bhoj** plan: menu items, veg/Jain splits, serving counts | Phase 4 |
| E-043 | Material tracker: bartan, kirana, milk, curd, kapra, sundry | Phase 4 |
| E-044 | Vendor assignment per material line (marketplace link) | Phase 4 |
| E-045 | Vidhi vyavhar task list (purchases, errands, completion %) | Phase 4 |
| E-046 | Chuman/gift ledger and return-gift planning | Phase 4 |
| E-047 | Preparation dashboard (rituals + checklist only in Phase 1) | Phase 1 (rituals only) / Phase 4 (full) |

### 2.5 Template & Library Usage

| ID | Requirement | Phase |
|----|-------------|-------|
| E-050 | Save event as **family template** (private) | Phase 2 |
| E-051 | Extract template from event sub-events, rituals, checklist, and samagri | Phase 2 |
| E-052 | Browse templates: family/platform (Phase 3); + community (Phase 4) | Phase 3/4 |
| E-053 | Preview template rituals before apply | Phase 3 |
| E-054 | Show template version + source (platform/community/family) | Phase 3 |
| E-055 | Search rituals library; add ritual atom to event | Phase 4 (Phase 1: inline custom ritual only) |
| E-056 | Rate/report community template or ritual | Phase 4 |

### 2.6 Publishing & Governance

| ID | Requirement | Phase |
|----|-------------|-------|
| E-060 | Publish validates: title, date, ≥1 ritual | Phase 1 |
| E-061 | Unpublish returns to draft if no invites sent; else block | Phase 1 |
| E-062 | Audit log: who changed what on event | Phase 4 |
| E-063 | Export event plan PDF (schedule + rituals + samagri) | Phase 4 |
| E-064 | Contributor submit template/ritual → moderation queue | Phase 4 |
| E-065 | Regional curator approve submissions (optional role) | Phase 4 |

---

## 3. Data Design

### 3.1 Storage Split

| Entity group | Store | Notes |
|--------------|-------|-------|
| `events`, `sub_events`, `event_rituals`, `event_members`, host planning tables | **PostgreSQL** | Transactional, relational (Core for Phase 1) |
| `ceremony_templates`, `ritual_definitions`, `template_versions` | **MongoDB** | Introduced in Phase 3 / Phase 4 for reusable library scale |
| `family_templates` (saved event templates) | **MongoDB** or PostgreSQL JSONB | Phase 2 can start with PostgreSQL JSONB; move to MongoDB when library grows |
| Cover images, exported PDFs | **S3** | CDN URLs in PostgreSQL |
| Template browse cache | **Redis** | Key: `tpl:list:{ceremony}:{region}` |

### 3.2 Entity Relationship

```
ceremony_templates (Mongo) ──snapshot──► events
ritual_definitions (Mongo) ──snapshot──► event_rituals

users ──< event_members >── events ──< sub_events
                              │
                              ├──< event_rituals ──< ritual_checklist_items
                              │                      └──< samagri_items
                              ├──< event_venues
                              ├──< host_guest_estimates
                              ├──< host_bhoj_plans
                              ├──< host_material_lines
                              ├──< host_tasks
                              └──< event_audit_log

family_templates (Mongo) ── optional source ──► events
```

### 3.3 PostgreSQL Schemas

#### `events`

```sql
CREATE TABLE events (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_user_id UUID NOT NULL REFERENCES users(id),
  host_user_id      UUID REFERENCES users(id),
  title             VARCHAR(255) NOT NULL,
  description       TEXT,
  ceremony_type     VARCHAR(32) NOT NULL,  -- vivah, mundan, ...
  status            VARCHAR(20) NOT NULL DEFAULT 'draft',
  visibility        VARCHAR(20) NOT NULL DEFAULT 'invite_only',
  region_code       VARCHAR(10),           -- IN-RJ, IN-MH
  tradition         VARCHAR(64),           -- e.g. north_indian, iyengar
  primary_locale    VARCHAR(10) NOT NULL DEFAULT 'hi',
  timezone          VARCHAR(64) NOT NULL DEFAULT 'Asia/Kolkata',
  start_at          TIMESTAMPTZ,
  end_at            TIMESTAMPTZ,
  cover_image_url   TEXT,
  venue_master      JSONB,                 -- default venue snapshot
  muhurat           JSONB,                 -- see §3.5
  creation_source   VARCHAR(32) NOT NULL DEFAULT 'scratch', -- scratch, template, duplicate
  template_snapshot JSONB,                 -- frozen copy from template at apply; null for scratch
  template_source   JSONB,                 -- {type, id, version}
  overlay_diff      JSONB,                 -- organizer fork vs template
  preparation_pct   SMALLINT DEFAULT 0,
  published_at      TIMESTAMPTZ,
  completed_at      TIMESTAMPTZ,
  cancelled_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_events_organizer ON events(organizer_user_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_ceremony ON events(ceremony_type);
```

#### `sub_events`

```sql
CREATE TABLE sub_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name        VARCHAR(255) NOT NULL,
  name_i18n   JSONB,                       -- {"hi":"हल्दी","en":"Haldi"}
  sort_order  INT NOT NULL DEFAULT 0,
  phase       VARCHAR(32),                 -- pre_ceremony, main, post
  starts_at   TIMESTAMPTZ,
  ends_at     TIMESTAMPTZ,
  venue       JSONB,
  notes       TEXT,
  status      VARCHAR(20) DEFAULT 'planned',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sub_events_event ON sub_events(event_id, sort_order);
```

#### `event_rituals`

```sql
CREATE TABLE event_rituals (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id            UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  sub_event_id        UUID REFERENCES sub_events(id) ON DELETE SET NULL,
  ritual_def_id       VARCHAR(128),        -- Mongo ritual_definitions._id
  ritual_def_version  VARCHAR(32),
  ritual_key          VARCHAR(64) NOT NULL,
  name                VARCHAR(255) NOT NULL,
  name_i18n           JSONB,
  sort_order          INT NOT NULL DEFAULT 0,
  scheduled_at        TIMESTAMPTZ,
  duration_minutes    INT,
  status              VARCHAR(20) DEFAULT 'planned',
  snapshot            JSONB NOT NULL,        -- full ritual def at bind time
  priest_booking_id   UUID,
  skipped             BOOLEAN DEFAULT false,
  skip_reason         TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### `ritual_checklist_items`

```sql
CREATE TABLE ritual_checklist_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_ritual_id UUID NOT NULL REFERENCES event_rituals(id) ON DELETE CASCADE,
  title           VARCHAR(512) NOT NULL,
  title_i18n      JSONB,
  sort_order      INT NOT NULL DEFAULT 0,
  is_done         BOOLEAN DEFAULT false,
  assigned_to     UUID REFERENCES users(id),
  due_at          TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  completed_by    UUID REFERENCES users(id)
);
```

#### `samagri_items`

```sql
CREATE TABLE samagri_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_ritual_id UUID NOT NULL REFERENCES event_rituals(id) ON DELETE CASCADE,
  name            VARCHAR(255) NOT NULL,
  quantity        VARCHAR(64),
  unit            VARCHAR(32),
  category        VARCHAR(64),   -- fruit, flower, ghee, textile
  procured        BOOLEAN DEFAULT false,
  vendor_note     TEXT,
  sort_order      INT DEFAULT 0
);
```

#### `event_members`

```sql
CREATE TABLE event_members (
  event_id    UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES users(id),
  role        VARCHAR(32) NOT NULL,  -- organizer, host, co_organizer, viewer
  permissions JSONB NOT NULL,        -- see §8.3
  invited_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (event_id, user_id)
);
```

#### Host planning tables

```sql
CREATE TABLE host_guest_estimates (
  event_id           UUID PRIMARY KEY REFERENCES events(id) ON DELETE CASCADE,
  invitees_count     INT DEFAULT 0,
  villagers_count    INT DEFAULT 0,
  buffer_percent     SMALLINT DEFAULT 10,
  dependents_count   INT DEFAULT 0,
  notes              TEXT
);

CREATE TABLE host_bhoj_plans (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id     UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  sub_event_id UUID REFERENCES sub_events(id),
  item_name    VARCHAR(255) NOT NULL,
  meal_type    VARCHAR(32),    -- lunch, dinner, snack
  diet_tag     VARCHAR(32),    -- veg, non_veg, jain
  servings     INT NOT NULL,
  source       VARCHAR(32)     -- in_house, vendor
);

CREATE TABLE host_material_lines (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id     UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  category     VARCHAR(64) NOT NULL,  -- bartan, kirana, milk, kapra
  item_name    VARCHAR(255) NOT NULL,
  quantity     VARCHAR(64),
  assigned_to  VARCHAR(32),           -- vendor, family, pending
  procured     BOOLEAN DEFAULT false
);

CREATE TABLE host_tasks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id     UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  title        VARCHAR(512) NOT NULL,
  category     VARCHAR(64),   -- vidhi_vyavhar, purchase, errand
  status       VARCHAR(20) DEFAULT 'todo',
  due_at       TIMESTAMPTZ,
  assigned_to  UUID REFERENCES users(id)
);
```

#### `event_audit_log`

```sql
CREATE TABLE event_audit_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  actor_id    UUID REFERENCES users(id),
  action      VARCHAR(64) NOT NULL,
  payload     JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 3.4 MongoDB: Ceremony Template Document

```json
{
  "_id": "vivah_north_indian_v2",
  "slug": "vivah-north-indian",
  "version": "2.0.0",
  "status": "published",
  "ceremony_type": "vivah",
  "regions": ["IN-UP", "IN-DL", "IN-HR", "IN-RJ"],
  "traditions": ["north_indian"],
  "supported_locales": ["hi", "en"],
  "metadata": {
    "title": { "hi": "उत्तर भारतीय विवाह", "en": "North Indian Wedding" },
    "description": { "hi": "...", "en": "..." },
    "estimated_days": 3,
    "cover_image": "s3://templates/vivah-north.jpg"
  },
  "sub_event_blueprints": [
    {
      "key": "haldi",
      "phase": "pre_ceremony",
      "default_name": { "hi": "हल्दी", "en": "Haldi" },
      "default_duration_hours": 4,
      "ritual_keys": ["haldi_ceremony", "haldi_feast"]
    }
  ],
  "ritual_refs": [
    { "ritual_key": "haldi_ceremony", "ritual_def_id": "rit_haldi_v1", "sort_order": 1 }
  ],
  "default_muhurat_hints": {
    "preferred_times": ["morning"],
    "avoid_rahukaal": true
  },
  "tags": ["popular", "wedding_season"],
  "created_by": "system",
  "published_at": "2026-01-15T00:00:00Z",
  "changelog": "Added Mehendi sub-event for NCR variant"
}
```

### 3.5 Muhurat JSON (on `events.muhurat`)

```json
{
  "mode": "suggested",
  "source": "prokerala",
  "location": { "lat": 28.61, "lng": 77.23, "city": "Delhi" },
  "sampradaya": "north_indian",
  "windows": [
    { "starts_at": "2026-11-20T10:30:00+05:30", "ends_at": "2026-11-20T12:15:00+05:30", "score": 0.92 }
  ],
  "selected_window_index": 0,
  "tithi": "Dwitiya",
  "nakshatra": "Rohini",
  "priest_override": false,
  "manual_note": null
}
```

### 3.6 Template Snapshot (frozen on `events.template_snapshot`)

When a template is applied, store the **resolved** tree:

```json
{
  "template_id": "vivah_north_indian_v2",
  "version": "2.0.0",
  "applied_at": "2026-05-19T10:00:00Z",
  "sub_events": [ "...resolved blueprints..." ],
  "rituals": [ "...resolved ritual defs..." ]
}
```

### 3.7 Overlay Diff (`events.overlay_diff`)

Organizer changes relative to snapshot:

```json
{
  "rituals_added": [{ "ritual_key": "custom_ganesh", "after": "haldi_ceremony" }],
  "rituals_removed": ["engagement_optional"],
  "rituals_reordered": ["haldi_ceremony", "mehendi", "sangeet"],
  "sub_events_added": [],
  "checklist_overrides": {}
}
```

### 3.8 Family Template Document

Created in **Phase 2** when an organizer saves an event as a template.

```json
{
  "_id": "family_tpl_vivah_jha_2026",
  "family_id": "fam_123",
  "source_event_id": "event_123",
  "type": "family",
  "status": "active",
  "version": "1.0.0",
  "ceremony_type": "vivah",
  "regions": ["IN-BR"],
  "traditions": ["maithil"],
  "supported_locales": ["hi", "en"],
  "metadata": {
    "title": { "hi": "झा परिवार विवाह", "en": "Jha Family Wedding" },
    "description": { "en": "Reusable family wedding plan" }
  },
  "template_snapshot": {
    "sub_events": [],
    "rituals": [],
    "checklists": [],
    "samagri": []
  },
  "excluded_from_source": ["guests", "rsvps", "invite_links", "audit_logs", "private_notes"],
  "created_by": "user_123",
  "created_at": "2026-05-21T10:00:00Z",
  "updated_at": "2026-05-21T10:00:00Z"
}
```

---

## 4. User Flows

### 4.1 Phase 1 — Create Event From Scratch

```
┌─────────────┐
│ Start       │
│ "New Event" │
└──────┬──────┘
       ▼
┌─────────────────────┐     No
│ Pick ceremony type  │────────► Custom "Other" → blank event
└──────┬──────────────┘
       ▼
┌─────────────────────┐
│ Event title, locale │
│ date, venue         │
│ Save DRAFT          │
└──────┬──────────────┘
       ▼
┌─────────────────────┐
│ Add sub-events      │
│ & schedule          │
└──────┬──────────────┘
       ▼
┌─────────────────────┐
│ Add rituals         │
│ checklist, samagri  │
└──────┬──────────────┘
       ▼
┌─────────────────────┐
│ Review → Publish    │  validation gate
└─────────────────────┘
```

### 4.2 Phase 2 — Save Event as Template

```
┌─────────────────────┐
│ Open existing event │
└──────┬──────────────┘
       ▼
┌─────────────────────┐
│ Save as template    │
└──────┬──────────────┘
       ▼
┌─────────────────────┐
│ Template metadata   │
│ name, region, tags  │
└──────┬──────────────┘
       ▼
┌─────────────────────┐
│ Review extracted    │
│ rituals & samagri   │
└──────┬──────────────┘
       ▼
┌─────────────────────┐
│ Save family template│
└─────────────────────┘
```

### 4.3 Phase 3 — Create Event With Template

```
┌─────────────┐
│ Start       │
│ "New Event" │
└──────┬──────┘
       ▼
┌─────────────────────┐
│ Pick ceremony type  │
│ region + tradition  │
└──────┬──────────────┘
       ▼
┌─────────────────────┐
│ Browse templates    │
│ Preview → Use       │
└──────┬──────────────┘
       ▼
┌─────────────────────┐
│ Create draft event  │
│ from snapshot       │
└──────┬──────────────┘
       ▼
┌─────────────────────┐
│ Edit event-specific │
│ date, venue, rituals│
└──────┬──────────────┘
       ▼
┌─────────────────────┐
│ Review → Publish    │  validation gate
└─────────────────────┘
```

### 4.4 Screen Map (Organizer)

| Step | Screen | Key actions |
|------|--------|-------------|
| 1 | Ceremony picker | Grid of ceremony types with icons |
| 2 | Event basics | Title, description, cover, visibility |
| 3 | Schedule | Multi-day timeline, sub-event cards |
| 4 | Rituals | List by day; drill into checklist/samagri |
| 5 | Template gallery | Phase 3: filters, preview drawer, "Use template" |
| 6 | Save template | Phase 2: metadata + extracted reusable content review |
| 7 | Muhurat | Phase 4: calendar + auspicious windows |
| 8 | Host plan | Phase 4: Guests est., Bhoj, Materials, Tasks |
| 9 | Review | Checklist of missing items; Publish CTA |

### 4.5 Apply Template Flow (Data)

```
User selects template_id
    → GET /templates/{id} (Mongo)
    → Server resolves ritual_refs → ritual_definitions
    → BEGIN TRANSACTION
        INSERT events (status=draft, creation_source=template, template_snapshot=resolved)
        INSERT sub_events FROM sub_event_blueprints
        INSERT event_rituals + checklist + samagri FROM snapshots
    → COMMIT
    → Return event_id + redirect to Schedule screen
```

### 4.6 Save Template Flow (Data)

```
User selects "Save as template" on event_id
    → GET event detail with sub_events, event_rituals, checklist, samagri
    → Server builds reusable template document
    → Organizer confirms metadata and removes event-specific notes
    → INSERT family_templates
    → Return template_id
```

Template extraction excludes guests, RSVP data, invite links, audit logs, published status, and private notes by default.

### 4.7 Edit Published Event

| Change | Allowed? | Behavior |
|--------|----------|----------|
| Add ritual | Yes | Append; notify co-organizers |
| Remove future ritual | Yes | If not started |
| Change date (major) | Yes | Warn if invites sent; optional guest notify |
| Change template | No | Must duplicate event |
| Visibility tighten | Yes | Immediate |
| Visibility loosen | Yes | Audit log |

### 4.8 Host Planning Flow

```
Host opens event → Host Planning tab
  → Set guest estimates (invitees + villagers + buffer)
  → Define dependent groups (optional)
  → Bhoj: add menu lines per sub-event / day
  → Materials: add lines by category; mark procured
  → Tasks: vidhi vyavhar list with assignees
  → Dashboard shows preparation_pct (weighted)
```

**Preparation % formula (default weights):**

| Component | Weight |
|-----------|--------|
| Rituals with status `ready` or `done` | 40% |
| Checklist items done | 25% |
| Samagri procured | 20% |
| Host materials procured | 10% |
| Host tasks done | 5% |

### 4.9 Co-Organizer Invite Flow

```
Organizer → Invite by phone/email
         → Select role: co_organizer | host | viewer
         → Customize permissions JSON
         → Notification sent
         → Accept → event_members row active
```

---

## 5. Template Library

### 5.1 Purpose

Curated **ceremony templates** bundle sub-events, ritual references, default timings, and muhurat hints. Organizers discover templates by ceremony type, region, and language.

### 5.2 Template Types

| Type | Owner | Visibility | Phase |
|------|-------|------------|-------|
| **Platform** | Admin (seed after scratch flow is stable) | All users | Phase 3 |
| **Family** | Organizer | Private to user/family | Phase 2 |
| **Community** | Contributor + moderation | Public after approve | Phase 4 |

### 5.3 Library Browse (Organizer UI)

Available from **Phase 3** for family/platform templates and **Phase 4** for community templates.

**Filters:**

- `ceremony_type` (required for browse)
- `region_code` (multi-select)
- `tradition`
- `locale` (templates with content in language)
- `tags` (popular, multi-day, budget)
- `estimated_days` range

**Sort:** popularity (usage count), newest, recommended (region match score)

**Card shows:** title, cover, ritual count, sub-event count, days, regions, "Used by N families"

### 5.4 Template Resolution Algorithm

```
resolve_template(template_id, locale, region_code):
  load ceremony_templates[template_id]
  for each ritual_ref in template.ritual_refs:
    load ritual_definitions[ritual_def_id@version]
    merge locale strings (fallback chain: locale → hi → en)
  expand sub_event_blueprints with resolved ritual names
  return resolved_document
```

**Fallback chain:** `user.locale` → `event.primary_locale` → `hi` → `en`

### 5.5 Versioning Rules

| Rule | Detail |
|------|--------|
| Immutable versions | `vivah_north_indian_v2` never overwritten; new publish → `v3` |
| Event binding | Events store `template_source.version` at apply time |
| Deprecation | Old versions `status: deprecated`; browse hides unless already used |
| Migration | No auto-migrate live events; offer "Apply new template to copy" |

### 5.6 Save Event as Family Template

```
Existing event → Organizer selects "Save as template"
  → System extracts reusable sub-events, rituals, checklist, samagri
  → Organizer edits metadata and removes event-specific details
  → Mongo family_templates collection
  → { family_id, source_event_id, metadata, template_snapshot }
```

Re-use: create event from `family_template_id` → snapshot the family template into a new draft event.

If the family template was originally created from a platform/community template, retain `parent_template_id` and `overlay_diff` for lineage, but the Phase 2 implementation can store the resolved family snapshot directly.

---

## 6. Rituals Library

### 6.1 Purpose

**Ritual definitions** are reusable atoms (Haldi, Pheras, Ganesh Puja). Ceremony templates reference them by `ritual_key`. Organizers can add rituals à la carte when building custom events.

### 6.2 Ritual Definition Document (MongoDB)

```json
{
  "_id": "rit_haldi_v1",
  "ritual_key": "haldi_ceremony",
  "version": "1.2.0",
  "status": "published",
  "ceremony_types": ["vivah", "other"],
  "regions": ["*"],
  "name": { "hi": "हल्दी संस्कार", "en": "Haldi Ceremony" },
  "description": { "hi": "...", "en": "..." },
  "default_duration_minutes": 120,
  "phase": "pre_ceremony",
  "checklist": [
    { "key": "apply_haldi", "title": { "hi": "वर-वधू को हल्दी लगाएं", "en": "Apply haldi" } },
    { "key": "songs", "title": { "hi": "मंगल गीत", "en": "Mangal songs" } }
  ],
  "samagri": [
    { "name": { "hi": "हल्दी", "en": "Turmeric" }, "quantity": "250", "unit": "g", "category": "spice" },
    { "name": { "hi": "नीम पत्ते", "en": "Neem leaves" }, "quantity": "1", "unit": "bundle", "category": "leaf" }
  ],
  "optional_notes": { "hi": "पीले वस्त्र पहनाएं", "en": "Wear yellow attire" },
  "priest_required": false,
  "media": { "icon": "s3://rituals/haldi.svg" },
  "tags": ["vivah", "color_yellow"]
}
```

### 6.3 Ritual Categories (Taxonomy)

| Category | Examples |
|----------|----------|
| `pre_ceremony` | Haldi, Mehendi, Sangeet, Tilak |
| `main_ritual` | Pheras, Kanyadaan, Mundan shaving, Yagnopavit |
| `puja` | Ganesh Puja, Griha Pravesh kalash |
| `feast` | Bhoj, Prasad distribution |
| `post_ceremony` | Vidaai, Ashirwad |

### 6.4 Library Browse (Organizer)

- Search by name (all locales, Elasticsearch index on Mongo sync)
- Filter: `ceremony_type`, `phase`, `priest_required`, `region`
- Preview checklist + samagri before "Add to event"
- On add: create `event_ritual` with snapshot; link to `sub_event` if selected

### 6.5 Ritual Relationships

| Relation | Description |
|----------|-------------|
| `requires` | Ritual B cannot start before A (validation warning) |
| `pairs_with` | Suggested adjacent rituals (UI hint) |
| `excludes` | Mutually exclusive (region-specific) |

Stored in `ritual_definitions.relations[]`.

---

## 7. Template Creation

### 7.1 Who Can Create

| Creator | Template type | Approval |
|---------|---------------|----------|
| **Admin** | Platform | Self-publish (or second admin review) |
| **Content editor** role | Platform | Admin publish |
| **Community contributor** | Community | Admin approve |
| **Organizer** | Family only | None |

### 7.2 Admin Template Builder Flow

```
Admin → Templates → Create new
     → Metadata: ceremony_type, regions, traditions, locales, tags
     → Sub-events: add blueprints (key, phase, duration, names i18n)
     → Rituals: pick from library OR create draft ritual inline
     → Order rituals within each sub-event
     → Default muhurat hints
     → Preview (locale switcher)
     → Save draft → Review → Publish version
```

### 7.3 Template Builder Screens

| Screen | Fields / actions |
|--------|------------------|
| **Metadata** | ceremony_type, slug, regions[], traditions[], supported_locales[], cover upload |
| **Sub-events** | CRUD blueprints; drag sort; link phase |
| **Ritual mapping** | Per sub-event: add `ritual_ref`; search library |
| **i18n editor** | Side-by-side hi / en / regional tabs |
| **Preview** | Simulated timeline; ritual expand |
| **Publish** | Version bump; changelog required |

### 7.4 Inline Ritual Creation (during template build)

If ritual missing in library:

1. Create `ritual_definitions` with `status: draft`
2. Attach to template `ritual_refs`
3. On template publish, optionally auto-publish linked rituals (admin checkbox)

### 7.5 Validation Before Publish (Template)

| Check | Error if fail |
|-------|---------------|
| ≥1 sub-event blueprint | Yes |
| ≥1 ritual_ref resolved | Yes |
| All ritual_refs exist and published | Yes |
| All required locales have `title` | Yes (per supported_locales) |
| No duplicate `ritual_key` in same sub-event | Yes |
| `slug` unique per ceremony_type | Yes |
| Cover image present | Warning |

### 7.6 Community Submission Flow (Phase 4)

```
Organizer completes event → optional "Contribute your plan"
           → System builds diff vs template_snapshot
           → Contributor edits metadata (region, tradition, title i18n)
           → Submit (status: pending_review)
           → Auto-checks (duplicate key, profanity, rate limit)
           → Admin / regional curator queue
           → Approve → published (community) + contributor badge
           → Reject → reason + allow resubmit
```

**Ritual-only submission:** Single ritual JSON from event customizations—lighter review than full templates.

### 7.7 Contributor Reputation (Phase 4)

| Field | Use |
|-------|-----|
| `trust_level` | user → contributor → trusted → curator |
| `approved_count` | Unlock trusted auto-publish for rituals |
| `avg_rating` | Sort contributor profile |

Trusted contributors: rituals auto-publish; templates still require human approve.

---

## 8. Admin

### 8.1 Admin Scope (Event Module)

| Area | Capabilities |
|------|--------------|
| **Template library** | CRUD, publish, deprecate, feature on homepage |
| **Rituals library** | CRUD, merge duplicates, tag taxonomy |
| **Events (support)** | Read any event; freeze; cancel abusive; export audit |
| **Categories** | Ceremony types, regions, tradition enum governance |
| **Feature flags** | Enable host planning, muhurat provider per region |

### 8.2 Admin Roles

| Role | Permissions |
|------|-------------|
| `super_admin` | All + user role assignment |
| `content_admin` | Templates, rituals, i18n |
| `support_admin` | Read events, audit logs, no template publish |
| `analytics_viewer` | Read-only dashboards |

### 8.3 Event Permission Matrix (`event_members.permissions`)

```json
{
  "event.edit_metadata": true,
  "event.edit_schedule": true,
  "event.edit_rituals": true,
  "event.edit_host_plan": true,
  "event.publish": false,
  "event.invite_coorganizer": true,
  "event.view_audit": false
}
```

**Default bundles:**

| Role | Bundle |
|------|--------|
| `organizer` | All `true` |
| `host` | host_plan + schedule view + rituals view |
| `co_organizer` | edit rituals, schedule; no publish |
| `viewer` | read-only |

### 8.4 Admin Event Support Actions

| Action | Preconditions | Effect |
|--------|---------------|--------|
| Force cancel | Abuse / legal | status=cancelled; notify organizer |
| Freeze event | Investigation | status unchanged; writes blocked |
| Reassign organizer | Verified ticket | update organizer_user_id; audit |
| Export audit | Support ticket | JSON/CSV download |

### 8.5 Admin Dashboards

- **Template usage:** top templates by region/month
- **Ritual coverage:** ceremonies missing templates per region
- **Draft events stale:** drafts &gt;30 days inactive
- **Publish funnel:** created → template applied → published

### 8.6 Audit Events (logged to `event_audit_log`)

| Action | Payload |
|--------|---------|
| `event.created` | ceremony_type, template_id |
| `event.template_applied` | template_id, version |
| `event.published` | visibility |
| `event.ritual.added` | ritual_key |
| `event.ritual.skipped` | reason |
| `event.schedule.changed` | diff |
| `admin.event.frozen` | ticket_id |

---

## 9. API Surface (Summary)

Base path: `/api/v1`

### 9.1 Events

| Method | Path | Description |
|--------|------|-------------|
| POST | `/events` | Create draft event |
| GET | `/events` | List current user's events |
| GET | `/events/{id}` | Event detail + rituals summary |
| PATCH | `/events/{id}` | Update metadata |
| POST | `/events/{id}/publish` | Publish |
| POST | `/events/{id}/cancel` | Cancel |
| DELETE | `/events/{id}` | Delete draft only |
| POST | `/events/{id}/duplicate` | Clone |

### 9.2 Templates

| Method | Path | Description |
|--------|------|-------------|
| POST | `/events/{id}/templates` | Phase 2: save event as family template |
| GET | `/templates` | Phase 3: browse library (filters) |
| GET | `/templates/{id}` | Phase 3: preview resolved template |
| POST | `/events/from-template` | Phase 3: create draft event from `{ template_id }` |
| POST | `/events/{id}/apply-template` | Phase 3 optional: apply template to an existing empty draft |

### 9.3 Sub-events & Rituals

| Method | Path | Description |
|--------|------|-------------|
| CRUD | `/events/{id}/sub-events` | Sub-event management |
| CRUD | `/events/{id}/rituals` | Event ritual instances |
| PATCH | `/events/{id}/rituals/{rid}/checklist/{cid}` | Toggle checklist item |
| CRUD | `/events/{id}/rituals/{rid}/samagri` | Samagri lines |

### 9.4 Rituals Library

| Method | Path | Description |
|--------|------|-------------|
| GET | `/rituals` | Search/browse |
| GET | `/rituals/{key}` | Definition by key + version |
| POST | `/events/{id}/rituals/from-library` | Add ritual atom |

### 9.5 Muhurat

| Method | Path | Description |
|--------|------|-------------|
| POST | `/events/{id}/muhurat/suggest` | Body: location, date range |
| PATCH | `/events/{id}/muhurat` | Select window or manual |

### 9.6 Host Planning

| Method | Path | Description |
|--------|------|-------------|
| GET/PATCH | `/events/{id}/host/estimates` | Guest estimates |
| CRUD | `/events/{id}/host/bhoj` | Bhoj lines |
| CRUD | `/events/{id}/host/materials` | Material tracker |
| CRUD | `/events/{id}/host/tasks` | Vidhi vyavhar tasks |
| GET | `/events/{id}/host/dashboard` | preparation_pct breakdown |

### 9.7 Admin

| Method | Path | Description |
|--------|------|-------------|
| CRUD | `/admin/templates` | Platform templates |
| CRUD | `/admin/rituals` | Ritual definitions |
| POST | `/admin/templates/{id}/publish` | Version publish |
| GET | `/admin/events` | Search all events |
| POST | `/admin/events/{id}/freeze` | Support action |

---

## 10. Validation & Business Rules

| Rule | Detail |
|------|--------|
| BR-01 | `title` min 3 chars, max 255 |
| BR-02 | Publish requires `start_at` OR ≥1 `sub_event.starts_at` |
| BR-03 | Publish requires ≥1 non-skipped ritual |
| BR-04 | `end_at` must be ≥ `start_at` if both set |
| BR-05 | Cannot delete published event with guests &gt;0 → use cancel |
| BR-06 | Template apply only on `draft` status and only before event has user-entered rituals/sub-events, unless user confirms overwrite |
| BR-07 | Family template visible only to same `family_id` members |
| BR-08 | Skipped ritual retains samagri but excluded from preparation % |
| BR-09 | Region filter: template shown if `region_code` intersects OR template.regions contains `*` |
| BR-10 | Co-organizer cannot publish unless `event.publish` permission |
| BR-11 | Save-as-template excludes guests, invite links, RSVP data, audit logs, private notes, and published/cancelled status |
| BR-12 | Event created from template must store `creation_source=template`, `template_source`, and frozen `template_snapshot` |

---

## 11. Non-Functional (Event Module)

| Concern | Target |
|---------|--------|
| Create event API | p95 &lt; 300 ms (no template) |
| Apply template | p95 &lt; 800 ms (≤20 rituals) |
| Template browse | p95 &lt; 400 ms (cached) |
| List rituals search | p95 &lt; 500 ms |
| Offline checklist | Last-write-wins per item; conflict toast |
| Concurrency | Optimistic lock on `events.updated_at` |
| Max rituals per event | 200 (soft warn at 50) |
| Max sub-events | 30 |

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | May 2026 | Initial event module spec |
| 1.1 | May 2026 | Phased MVP→community delivery; aligned with growth-strategy.md |
| 1.2 | May 2026 | Refocused implementation phases: create event, save as template, create event with template |

---

*End of Event Module Specification*
