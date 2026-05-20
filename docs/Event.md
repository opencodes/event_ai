# Event Module Specification
## Create, Template, Ritual & Admin Design

**Version:** 1.1  
**Status:** Draft  
**Scope:** Event bounded context — creation, templates, rituals library, host planning, admin governance  
**Related:** [HLD.md](./HLD.md) · [growth-strategy.md](./growth-strategy.md)

> **Product principle:** Ship a **minimal event core** (Phase 0), then grow templates and rituals through **family reuse** (Phase 1) and **community contribution** (Phase 2). See [growth-strategy.md](./growth-strategy.md).

---

## Table of Contents

0. [Phased Delivery (MVP → Community)](#0-phased-delivery-mvp--community)
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

- Create ceremonies from **ceremony templates** or scratch
- Plan **sub-events**, **rituals**, schedules, and venues
- Attach **muhurat**, **samagri**, and preparation checklists
- Run **host planning** (Bhoj, materials, dependents, vidhi vyavhar)
- Progress an event through **draft → published → in_progress → completed → archived**

Templates and rituals live in a **library layer** (PostgreSQL JSONB in MVP → MongoDB when community catalog grows). Each created event **snapshots** template/ritual versions so platform or community edits never change live events.

### 1.2 Actors

| Actor | Event capabilities |
|-------|-------------------|
| **Organizer** | Full CRUD on owned events; publish; invite co-organizers |
| **Host / Planner** | Sub-events, Bhoj, materials, guest estimates, preparation tracker |
| **Co-organizer** | Scoped edit per `event_members.permission` |
| **Priest** (linked) | View ritual schedule; attach/update samagri on booked rituals |
| **Admin** | Template/ritual library; approve community templates; override/support |
| **Guest** | Read published event summary via invite link only (no event CRUD) |

### 1.3 Event Lifecycle States

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

## 0. Phased Delivery (MVP → Community)

Requirements use **Phase** tags: **P0** (MVP), **P1** (retention), **P2** (community), **P3** (ecosystem).

| Phase | Event module focus |
|-------|-------------------|
| **P0 MVP** | Draft event, 3 ceremony types, admin-seeded templates, checklist/samagri, manual guests, RSVP link, copy-to-WhatsApp invite |
| **P1** | Family templates, contact import, WhatsApp API, muhurat, co-organizers, +2 ceremony types |
| **P2** | Submit ritual/template, moderation, community browse, ratings, contributor reputation |
| **P3** | Host planning, vendor links, priest samagri merge, full library search at scale |

### 0.1 P0 — What We Build First

```
Create event → Pick ceremony (Vivah | Mundan | Griha Pravesh)
            → Apply 1 of few platform templates
            → Edit checklist / samagri / date / venue
            → Add guests (manual) → Publish
            → Share RSVP link (user pastes in WhatsApp)
```

**Not in P0:** community submit, Panchang API, host Bhoj/materials, bulk WhatsApp, rituals library search, MongoDB.

### 0.2 P2 — Social Contribution (Event Module)

| Action | Flow |
|--------|------|
| **Suggest ritual** | After `completed` event → "Share your ritual list" → diff vs template → submit `pending_review` |
| **Suggest template** | Contributor packages sub-events + ritual refs → moderation → `community` template |
| **Use community template** | Browse by region → same apply + snapshot as platform |
| **Rate after use** | Organizer rates once per event; feeds `usage_count` + `avg_rating` |
| **Report** | Flag incorrect/offensive content → hide pending review |

Contributor fields on templates/rituals: `contribution_source`, `contributor_user_id`, `status`, `usage_count`, `parent_template_id` (fork lineage).

---

## 2. Functional Requirements

### 2.1 Event CRUD

| ID | Requirement | Phase |
|----|-------------|-------|
| E-001 | Create event with `ceremony_type`, title, primary locale | P0 |
| E-002 | Save as `draft` without required date/venue | P0 |
| E-003 | Update event metadata (title, description, cover image, tags) | P0 |
| E-004 | Delete draft event (hard delete); cancel published event (soft) | P0 |
| E-005 | Duplicate event from existing (copy rituals, not guests) | P1 |
| E-006 | List events for user (filter: status, ceremony_type, date range) | P0 |
| E-007 | Event visibility: `private`, `invite_only` (P0); `unlisted_public` (P1) | P0/P1 |
| E-008 | Assign `region_code` and `tradition` for template matching | P0 |
| E-009 | Link event to `user_id` (organizer) and optional `host_user_id` | P0 |
| E-010 | Add co-organizers with granular permissions | P1 |

### 2.2 Ceremony & Schedule

| ID | Requirement | Phase |
|----|-------------|-------|
| E-020 | Ceremony types: Vivah, Mundan, Griha Pravesh (P0); +Upnayan, Naamkaran, Other (P1) | P0/P1 |
| E-021 | Apply **ceremony template** → populate rituals & default sub-events | P0 |
| E-022 | Add/edit/remove **sub-events** (e.g. Haldi Day 1, Pheras) with start/end | P1 (P0: single-day only) |
| E-023 | Multi-day events: timeline view across days | P1 |
| E-024 | Venue per sub-event or shared master venue | P0 (master venue only) / P1 |
| E-025 | Integrate **muhurat**: fetch suggestions, pick window, manual override | P1 (P0: manual date only) |
| E-026 | Store muhurat source, tithi, nakshatra, priest override flag | P1 |
| E-027 | Attach Google/Outlook calendar export (ICS) per sub-event | P2 |

### 2.3 Rituals & Checklists (Event Instance)

| ID | Requirement | Phase |
|----|-------------|-------|
| E-030 | Instantiate rituals from template snapshot | P0 |
| E-031 | Reorder, skip, or add custom rituals on event | P0 |
| E-032 | Per-ritual checklist items (done/todo; assignee/due P1) | P0 |
| E-033 | Samagri list per ritual (template + custom lines) | P0 |
| E-034 | Mark ritual status: `planned`, `ready`, `in_progress`, `done` | P0 |
| E-035 | Offline sync of ritual checklists (mobile) | P1 |
| E-036 | Priest can suggest samagri edits on linked booking | P3 |
| E-037 | After event completed, prompt to submit ritual diff to community | P2 |

### 2.4 Host Planning (Extended)

| ID | Requirement | Phase |
|----|-------------|-------|
| E-040 | Guest estimate: invitees, villagers, buffer % | P3 |
| E-041 | Dependent guest groups (parent/guardian, linked members) | P3 |
| E-042 | **Bhoj** plan: menu items, veg/Jain splits, serving counts | P3 |
| E-043 | Material tracker: bartan, kirana, milk, curd, kapra, sundry | P3 |
| E-044 | Vendor assignment per material line (marketplace link) | P3 |
| E-045 | Vidhi vyavhar task list (purchases, errands, completion %) | P3 |
| E-046 | Chuman/gift ledger and return-gift planning | P3 |
| E-047 | Preparation dashboard (rituals + checklist only in P1) | P1 (rituals only) / P3 (full) |

### 2.5 Template & Library Usage

| ID | Requirement | Phase |
|----|-------------|-------|
| E-050 | Browse templates: platform only (P0); + community (P2) | P0/P2 |
| E-051 | Preview template rituals before apply | P0 |
| E-052 | Fork → save as **family template** (private) | P1 |
| E-053 | Search rituals library; add ritual atom to event | P2 (P0: inline custom ritual only) |
| E-054 | Show template version + source (platform/community/family) | P0 |
| E-055 | Rate community template after event use | P2 |
| E-056 | Report community template or ritual | P2 |

### 2.6 Publishing & Governance

| ID | Requirement | Phase |
|----|-------------|-------|
| E-060 | Publish validates: title, date, ≥1 ritual | P0 |
| E-061 | Unpublish returns to draft if no invites sent; else block | P0 |
| E-062 | Audit log: who changed what on event | P1 |
| E-063 | Export event plan PDF (schedule + rituals + samagri) | P2 |
| E-064 | Contributor submit template/ritual → moderation queue | P2 |
| E-065 | Regional curator approve submissions (optional role) | P2+ |

---

## 3. Data Design

### 3.1 Storage Split

| Entity group | Store | Notes |
|--------------|-------|-------|
| `events`, `sub_events`, `event_rituals`, `event_members`, host planning tables | **PostgreSQL** | Transactional, relational |
| `ceremony_templates`, `ritual_definitions`, `template_versions` | **MongoDB** | Flexible schema, i18n blobs |
| `family_templates` (user forks) | **MongoDB** or PostgreSQL JSONB | MVP: MongoDB |
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
  template_snapshot JSONB NOT NULL,        -- frozen copy from Mongo at apply
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

---

## 4. User Flows

### 4.1 Create Event (Happy Path)

```
┌─────────────┐
│ Start       │
│ "New Event" │
└──────┬──────┘
       ▼
┌─────────────────────┐     No
│ Pick ceremony type  │────────► Custom "Other" → minimal template
└──────┬──────────────┘
       ▼
┌─────────────────────┐
│ Region + tradition  │  (auto-suggest templates)
└──────┬──────────────┘
       ▼
┌─────────────────────┐     Skip
│ Browse templates    │────────► Blank event (add rituals manually)
│ Preview → Apply     │
└──────┬──────────────┘
       ▼
┌─────────────────────┐
│ Event title, locale │
│ Save DRAFT          │
└──────┬──────────────┘
       ▼
┌─────────────────────┐     Optional branch
│ Muhurat wizard      │────► Panchang API → pick window → set start_at
└──────┬──────────────┘
       ▼
┌─────────────────────┐
│ Edit sub-events     │  timeline drag-drop
│ & venues            │
└──────┬──────────────┘
       ▼
┌─────────────────────┐
│ Customize rituals   │  add/remove/reorder, checklists, samagri
└──────┬──────────────┘
       ▼
┌─────────────────────┐     Optional
│ Host planning       │  Bhoj, materials, estimates
└──────┬──────────────┘
       ▼
┌─────────────────────┐
│ Review → Publish    │  validation gate
└─────────────────────┘
```

### 4.2 Screen Map (Organizer)

| Step | Screen | Key actions |
|------|--------|-------------|
| 1 | Ceremony picker | Grid of ceremony types with icons |
| 2 | Region selector | State/region + tradition dropdown |
| 3 | Template gallery | Filters, preview drawer, "Use template" |
| 4 | Event basics | Title, description, cover, visibility |
| 5 | Schedule | Multi-day timeline, sub-event cards |
| 6 | Muhurat | Calendar + auspicious windows |
| 7 | Rituals | List by day; drill into checklist/samagri |
| 8 | Host plan | Tabs: Guests est., Bhoj, Materials, Tasks |
| 9 | Review | Checklist of missing items; Publish CTA |

### 4.3 Apply Template Flow (Data)

```
User selects template_id
    → GET /templates/{id} (Mongo)
    → Server resolves ritual_refs → ritual_definitions
    → BEGIN TRANSACTION
        INSERT events (status=draft, template_snapshot=resolved)
        INSERT sub_events FROM sub_event_blueprints
        INSERT event_rituals + checklist + samagri FROM snapshots
    → COMMIT
    → Return event_id + redirect to Schedule screen
```

### 4.4 Edit Published Event

| Change | Allowed? | Behavior |
|--------|----------|----------|
| Add ritual | Yes | Append; notify co-organizers |
| Remove future ritual | Yes | If not started |
| Change date (major) | Yes | Warn if invites sent; optional guest notify |
| Change template | No | Must duplicate event |
| Visibility tighten | Yes | Immediate |
| Visibility loosen | Yes | Audit log |

### 4.5 Host Planning Flow

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

### 4.6 Co-Organizer Invite Flow

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
| **Platform** | Admin (seed ~5 for MVP) | All users | P0 |
| **Family** | Organizer | Private to user/family | P1 |
| **Community** | Contributor + moderation | Public after approve | P2 |

### 5.3 Library Browse (Organizer UI)

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

### 5.6 Family Template Fork

```
Platform template → Organizer edits in wizard → "Save as family template"
  → Mongo family_templates collection
  → { family_id, parent_template_id, overlay_diff, metadata }
```

Re-use: create event from `family_template_id` → apply overlay on top of parent snapshot.

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

### 7.6 Community Submission Flow (Phase 2)

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

### 7.7 Contributor Reputation (Phase 2)

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

### 9.2 Template Application

| Method | Path | Description |
|--------|------|-------------|
| GET | `/templates` | Browse library (filters) |
| GET | `/templates/{id}` | Preview resolved template |
| POST | `/events/{id}/apply-template` | Body: `{ template_id }` |
| POST | `/events/{id}/save-family-template` | Fork to family library |

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
| BR-06 | Template apply only on `draft` status |
| BR-07 | Family template visible only to same `family_id` members |
| BR-08 | Skipped ritual retains samagri but excluded from preparation % |
| BR-09 | Region filter: template shown if `region_code` intersects OR template.regions contains `*` |
| BR-10 | Co-organizer cannot publish unless `event.publish` permission |

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

---

*End of Event Module Specification*
