# High-Level Design (HLD)
## Traditional Indian Ceremony & Event Management Platform

**Version:** 1.0  
**Status:** Draft  
**Last updated:** May 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Overview](#2-system-overview)
3. [Architecture](#3-architecture)
4. [Data Design](#4-data-design)
5. [Cultural & Regional Customization](#5-cultural--regional-customization)
6. [Integration Points](#6-integration-points)
7. [Key Workflows](#7-key-workflows)
8. [Scalability & Performance](#8-scalability--performance)
9. [Security & Privacy](#9-security--privacy)
10. [Mobile-First Design](#10-mobile-first-design)
11. [Vendor Ecosystem](#11-vendor-ecosystem)
12. [Non-Functional Requirements](#12-non-functional-requirements)
13. [Technology Stack](#13-technology-stack)
14. [Monetization](#14-monetization)
15. [Assumptions & Constraints](#15-assumptions--constraints)
16. [Cultural Context Challenges](#16-cultural-context-challenges)
17. [Appendix: Decision Log](#17-appendix-decision-log)

---

## 1. Executive Summary

This document defines the high-level architecture for a **multi-tenant platform** that helps organizers plan, coordinate, and celebrate traditional Indian ceremonies—Vivah (wedding), Mundan, Upnayan, Naamkaran, Griha Pravesh, and related events.

The platform connects **organizers**, **priests/pandits**, **vendors**, and **guests** through a mobile-first experience with WhatsApp as the primary outreach channel, regional language support, Panchang-based muhurat guidance, and India-specific payment rails (UPI, Razorpay).

**Architectural stance:** Microservices behind an API gateway, polyglot persistence (PostgreSQL + MongoDB + object storage), async messaging for bulk notifications and media processing, and regional deployment for latency and data residency.

---

## 2. System Overview

### 2.1 Purpose

Enable end-to-end ceremony lifecycle management: from auspicious date selection and ritual planning through vendor/priest booking, guest invitations, gift registry, and post-event media sharing.

### 2.2 Target Users

| Persona | Primary goals |
|---------|----------------|
| **Event organizer** | Create events, manage rituals, invite guests, book vendors & priests |
| **Host / Planner** | Estimate invitees, plan sub-events, manage Bhoj/items, track gifts and dependent guest groups |
| **Priest / Pandit** | Showcase expertise, manage availability, share samagri lists |
| **Vendor** (caterer, decorator, photographer, venue) | List services, accept bookings, receive settlements |
| **Admin** | Manage users, roles and permissions, oversee platform governance |
| **Guest / Attendee** | RSVP, view invitations, contribute gifts, access photo galleries |

### 2.3 Core Capabilities

- Event creation with **ceremony-type templates** and customizable ritual checklists
- Host planning workflows for sub-events, guest estimation, dependent guest groups, Bhoj menu, and material tracking
- Contact import via CSV/mobile, plus invite delivery via call, email, SMS, and WhatsApp
- **Vendor marketplace** with search, availability, booking, and reviews
- **Priest/pandit booking** with dakshina and samagri management
- **Guest management**: guest relationship mapping, RSVP, meal preferences (veg / non-veg / Jain)
- **Digital & printable invitations** (WhatsApp-ready)
- **Muhurat & Panchang** integration for auspicious timing
- **Gift registry** and cash/UPI contributions
- **Media gallery** with privacy controls and CDN delivery
- **Admin user management**: roles, permissions, platform settings, and audit trails

### 2.4 High-Level Context Diagram

```
                    ┌─────────────────────────────────────────────────────────┐
                    │              External Integrations                       │
                    │  Panchang API │ Razorpay/UPI │ WhatsApp │ Maps │ Zoom   │
                    └────────────┬────────────────────────────────────────────┘
                                 │
    ┌──────────────┐    ┌────────▼────────┐    ┌──────────────┐
    │  Web App     │    │   API Gateway    │    │ Mobile Apps  │
    │  (Next.js)   │───►│  (Auth, i18n,   │◄───│ (RN/Flutter) │
    └──────────────┘    │   rate limit)    │    └──────────────┘
                          └────────┬────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
    ┌────▼────┐  ┌─────────┐  ┌────▼────┐  ┌──────────┐  ┌▼────────┐
    │  User & │  │ Event & │  │ Vendor  │  │  Guest   │  │ Muhurat │
    │ User   │  │Ceremony │  │Market-  │  │   RSVP   │  │Panchang │
    │ Profile │  │ Service │  │ place   │  │ Service  │  │ Service │
    └────┬────┘  └────┬────┘  └────┬────┘  └────┬─────┘  └────┬────┘
         │            │            │            │             │
         └────────────┴────────────┴────────────┴─────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
         ┌────▼────┐         ┌─────▼─────┐       ┌─────▼─────┐
         │PostgreSQL│         │  MongoDB  │       │ S3 + CDN  │
         │(txn data)│         │(templates)│       │  (media)  │
         └─────────┘         └───────────┘       └───────────┘
```

---

## 3. Architecture

### 3.1 Style: Microservices (Modular Monolith for MVP)

**Decision rationale:**

| Approach | When | Rationale |
|----------|------|-----------|
| **Modular monolith** (Phase 0) | MVP, &lt;50k MAU | Faster delivery; shared DB transactions for bookings/payments |
| **Extracted microservices** (Phase 1+) | Wedding-season scale, vendor ecosystem | Independent scaling for notification bursts and vendor search |

Start with **bounded contexts** in one deployable unit; extract **Notification**, **Media Processing**, and **Vendor Search** first when load or team size demands it.

### 3.2 Service Catalog

| Service | Responsibility | Primary store |
|---------|----------------|---------------|
| **User Profile** | Auth identities, relationships, roles | PostgreSQL |
| **Event & Ceremony** | Events, venues, ritual instances, timelines | PostgreSQL + MongoDB (templates) |
| **Vendor Marketplace** | Catalog, packages, availability, inquiries, bookings | PostgreSQL + Elasticsearch |
| **Priest/Pandit Booking** | Profiles, expertise, dakshina, samagri lists | PostgreSQL |
| **Guest Management & RSVP** | Guest lists, RSVP, preferences, check-in | PostgreSQL |
| **Invitation** | Template render, personalization, delivery orchestration | PostgreSQL + S3 |
| **Gift Registry & Contributions** | Registry items, UPI/card payments, thank-you tracking | PostgreSQL |
| **Media Gallery** | Upload, transcoding, albums, signed URLs | S3 + metadata in PostgreSQL |
| **Muhurat & Panchang** | Date suggestions, tithi/nakshatra cache, regional calendars | MongoDB cache + external API |
| **Notification** (async) | WhatsApp, SMS, email, push fan-out | Kafka/RabbitMQ |
| **Payment** (async) | Webhooks, settlement, reconciliation | PostgreSQL + queue |

### 3.3 Logical Architecture (ASCII)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           Client Layer                                    │
│   Next.js (SSR invitations)  │  React Native / Flutter  │  Vendor Portal │
└───────────────────────────────┬──────────────────────────────────────────┘
                                │ HTTPS
┌───────────────────────────────▼──────────────────────────────────────────┐
│                         API Gateway (Kong / AWS API GW)                   │
│  • JWT validation (OTP + OAuth)   • Accept-Language / locale routing       │
│  • Rate limiting (per IP, per user, per event for bulk send)              │
│  • Request tracing (correlation ID)                                        │
└───────────────────────────────┬──────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
┌───────▼───────┐     ┌─────────▼─────────┐   ┌────────▼────────┐
│  Sync APIs    │     │  Message Bus       │   │  Search Tier    │
│  (REST/GraphQL)│     │  Kafka / RabbitMQ  │   │  Elasticsearch  │
└───────┬───────┘     └─────────┬─────────┘   └────────┬────────┘
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                │
┌───────────────────────────────▼──────────────────────────────────────────┐
│  Data: PostgreSQL (primary) │ MongoDB (templates) │ Redis (cache/sessions) │
│  Object: S3 / GCS + CloudFront / Cloudflare CDN                           │
└──────────────────────────────────────────────────────────────────────────┘
```

### 3.4 Authentication

| Method | Use case |
|--------|----------|
| **Phone OTP** (primary) | India-first onboarding; Twilio/MSG91 |
| **Google / Facebook OAuth** | Optional social login; link to phone |
| **Guest magic links** | RSVP without full account |
| **Vendor/Priest JWT** | Separate scopes; dashboard APIs |

**Flow:** OTP verified → issue short-lived access token + refresh token → Redis session blacklist on logout.

### 3.5 API Gateway: Multi-Language

- `Accept-Language` header + user profile `preferred_locale`
- i18n resource bundles per service (shared lib); invitation content stored **per locale** in MongoDB/PostgreSQL JSON columns
- RTL not required for initial Indian languages; Unicode (Devanagari, Tamil, etc.) end-to-end in DB and PDF render pipeline

---

## 4. Data Design

### 4.1 Storage Strategy

| Data type | Store | Rationale |
|-----------|-------|-----------|
| Bookings, payments, guests, users | **PostgreSQL** | ACID, relational integrity, reporting |
| Ritual/ceremony templates, invitation layouts | **MongoDB** | Schema flexibility per region/ceremony |
| Sessions, vendor catalog cache, rate limits | **Redis** | Low-latency reads |
| Photos, videos, PDF invitations | **S3** + CDN | Cost, scale, signed URLs |

### 4.2 Entity Relationship (Conceptual)

```
Organizer / User ──< Event ──< RitualInstance (from template)
         │
         ├──< Guest ── RSVP, meal_pref, relationship
         ├──< VendorBooking ── Payment
         ├──< PriestBooking ── SamagriList
         ├──< Invitation ── template_id, locale, delivery_status
         ├──< GiftRegistryItem ── Contribution
         └──< MediaAlbum ── MediaAsset

Vendor ──< Package, AvailabilitySlot, Review
Priest ──< ExpertiseTag, AvailabilitySlot, SamagriTemplate
```

### 4.3 Core Entities (PostgreSQL)

**users**
```sql
id UUID PK, phone VARCHAR UNIQUE, email VARCHAR,
role ENUM(organizer, guest, vendor, priest, admin),
preferred_locale VARCHAR(10), created_at
```

**events**
```sql
id UUID PK,
ceremony_type ENUM(vivah, mundan, upnayan, naamkaran, griha_pravesh, other),
status ENUM(draft, published, completed, cancelled),
start_at TIMESTAMPTZ, end_at TIMESTAMPTZ,
venue JSONB, -- {name, address, lat, lng, maps_place_id}
muhurat JSONB, -- {tithi, nakshatra, source_api, suggested_windows[]}
visibility ENUM(public, private, invite_only),
region_code VARCHAR(10) -- e.g. IN-MH, IN-TN
```

**guests**
```sql
id UUID PK, event_id UUID FK,
name VARCHAR, phone VARCHAR, email VARCHAR,
rsvp_status ENUM(pending, yes, no, maybe),
meal_preference ENUM(veg, non_veg, jain, vegan),
accommodation_needed BOOLEAN,
relationship VARCHAR,
plus_ones INT DEFAULT 0
```

**vendor_bookings**
```sql
id UUID PK, event_id UUID FK, vendor_id UUID FK,
package_id UUID, status ENUM(inquiry, confirmed, completed, cancelled),
amount_paise BIGINT, advance_paise BIGINT,
settlement_at TIMESTAMPTZ -- T+7 per business rule
```

**contributions**
```sql
id UUID PK, registry_item_id UUID FK,
guest_id UUID FK NULL, amount_paise BIGINT,
payment_provider VARCHAR, provider_ref VARCHAR,
status ENUM(pending, captured, failed, refunded)
```

### 4.4 Flexible Documents (MongoDB)

**ceremony_templates**
```json
{
  "_id": "vivah_north_indian_v1",
  "ceremony_type": "vivah",
  "region": ["IN-UP", "IN-DL", "IN-HR"],
  "locales": {
    "hi": { "title": "विवाह", "rituals": [...] },
    "en": { "title": "Wedding", "rituals": [...] }
  },
  "rituals": [
    {
      "key": "haldi",
      "order": 1,
      "default_duration_hours": 3,
      "samagri_hints": ["turmeric", "mango leaves"],
      "checklist": ["Apply haldi to bride/groom", "..."]
    }
  ]
}
```

**invitation_templates**
```json
{
  "_id": "template_rajasthani_peacock",
  "design_assets": { "background_s3": "...", "fonts": [...] },
  "supported_locales": ["hi", "en", "mr"],
  "whatsapp_preview_aspect": "9:16"
}
```

### 4.5 Caching

| Key pattern | TTL | Content |
|-------------|-----|---------|
| `vendor:search:{region}:{category}:{page}` | 5–15 min | Elasticsearch result page |
| `template:ceremony:{type}:{region}` | 1 h | MongoDB template |
| `event:{id}:guest_summary` | 30 s | RSVP counts (invalidate on RSVP) |
| `muhurat:{lat}:{date}:{tradition}` | 24 h | Panchang API response |

---

## 5. Cultural & Regional Customization

### 5.1 Ceremony Types & Ritual Templates

| Ceremony | Example ritual phases (template-driven) |
|----------|-------------------------------------------|
| **Vivah** | Roka, Haldi, Mehendi, Sangeet, Baraat, Pheras, Vidaai |
| **Mundan** | Puja, tonsuring, feast |
| **Upnayan** | Yagnopavit, Gayatri mantra, feast |
| **Naamkaran** | Naming ritual, annaprashan optional |
| **Griha Pravesh** | Ganesh puja, kalash, entry muhurat |

Templates are **versioned**; events snapshot template version at creation so mid-season template edits do not mutate live events.

### 5.2 Regional Variation Model

```
ceremony_type + region_code + tradition (optional) → template_id
```

Organizers can **fork** a template (add/remove rituals, reorder). Diff stored as overlay JSON merged at read time.

### 5.3 Multi-Language

- Supported at launch: **Hindi, English**; phased: Marathi, Gujarati, Tamil, Telugu, Bengali, Kannada, Punjabi
- Invitations: per-guest locale from contact or explicit override
- Notifications: WhatsApp templates pre-approved per language (Meta Business policy)

### 5.4 Muhurat & Panchang

- Integrate third-party Panchang API (e.g. Prokerala, AstroSage-style partners) with **fallback provider**
- Cache by `(geolocation, date, sampradaya)` to reduce API cost
- Present **windows** (e.g. 10:30–12:15) not single timestamps; allow organizer override with audit log

### 5.5 Vendor Regionalization

- Geo-index vendors in Elasticsearch (`geo_point` + `region_code`)
- Boost vendors with completed bookings in same `region_code` and ceremony type

---

## 6. Integration Points

| Domain | Integration | Pattern |
|--------|-------------|---------|
| **Payments** | Razorpay (primary), Paytm/PhonePe via Razorpay routes | Webhook → Payment service → idempotent ledger |
| **UPI** | Razorpay UPI intent / collect | Guest contributions & advances |
| **WhatsApp** | Meta WhatsApp Business API | Template messages for invite/RSVP/reminder |
| **SMS** | Twilio / MSG91 | OTP, fallback RSVP |
| **Email** | SendGrid / SES | Formal PDF invitations |
| **Calendar** | Google Calendar, Microsoft Graph | OAuth2 per organizer; ICS fallback |
| **Panchang** | Partner REST API | Adapter interface; circuit breaker |
| **Maps** | Google Maps Platform | Venue geocode, directions deep link |
| **Social** | Meta Graph (optional) | Share album link to Instagram/Facebook |
| **Video** | Zoom / Google Meet API | Create meeting for remote rituals |

**Webhook reliability:** All payment and WhatsApp delivery callbacks stored in `inbound_webhooks` table; process at-least-once with idempotency keys.

---

## 7. Key Workflows

### 7.1 Event Creation Flow

```
Organizer → Select ceremony_type
         → [Optional] Request muhurat suggestions (Panchang Service)
         → Pick date/time (manual or suggested window)
         → Add venue (Maps geocode)
         → Load ritual template → customize checklist
         → Build guest list / import contacts / guest relationships
         → Select invitation design → preview per locale
         → Publish event (status: published)
```

**Data flow:**
```
Client → API Gateway → Event Service → MongoDB (template merge)
                              → PostgreSQL (event, rituals)
                              → Muhurat Service → External Panchang API
```

### 7.2 Vendor Booking Flow

```
Browse/search (Elasticsearch) → Filter by date availability
→ View portfolio (CDN) → Inquiry OR instant book
→ Advance payment (Razorpay) → Booking confirmed
→ Contract PDF (optional) → Post-event review
→ Settlement T+7 (Payment service batch)
```

**Sequence (simplified):**
```
Organizer    Gateway    Vendor Svc    Payment Svc    Razorpay
    |           |            |              |            |
    |-- book -->|            |              |            |
    |           |-- reserve->|              |            |
    |           |            |-- create --->|            |
    |           |            |              |--- charge->|
    |           |            |              |<-- webhook-|
    |           |            |<-- confirm --|            |
    |<-- OK ----|            |              |            |
```

### 7.3 Priest/Pandit Booking Flow

Similar to vendor flow with additions:
- Filter by `ceremony_type`, `scripture_tradition`, languages spoken
- Dakshina displayed in INR; samagri list attached post-confirmation (PDF + checklist in app)
- Priest can update samagri; organizer gets push + WhatsApp digest

### 7.4 Guest Invitation & RSVP Flow

```
Import contacts (device / CSV) → Map relationships
→ Segment guests (e.g. "Delhi group", "office colleagues")
→ Personalize message per segment
→ Enqueue bulk send (Notification Service)
   ├── WhatsApp template + RSVP deep link
   ├── SMS fallback (no WhatsApp)
   └── Email with ICS attachment
→ Guest opens link (magic token) → RSVP + meal prefs
→ Organizer dashboard updates (WebSocket or poll)
→ Scheduled reminders (H-7, H-1, day-of)
```

**Bulk send architecture:**
```
Invitation Svc → Kafka topic: invitations.outbound
              → Workers (rate-limited per WABA tier)
              → Delivery status → PostgreSQL guest_invitation_delivery
```

### 7.5 Host Planning & Event Management Flow

```
Host → Create event (new or from template)
     → Add sub-events / ceremony schedule
     → Import contact list / mobile contacts
     → Estimate guests: invitees, villagers
     → Add dependents & linked guest members
     → Allocate Bhoj items & kitchen supplies
     → Plan vendor assignments for food, bartan, milk, curd, kirasan, and other items
     → Estimate kapra requirements
     → Track vidh vyabhar tasks, purchases, and completion
     → Capture chuman/gift amounts and return gift details
     → Publish event and monitor preparation status
```

**Host planning details:**
- Sub-events: pre-ceremony, main ceremony, post-ceremony gatherings
- Bhoj planning: menu items, serving counts, vendor vs in-house assignment
- Material tracker: bartan, kirasan, milk, curd, khoa, chena pani, kapra, and sundry items
- Dependent guest groups: parent/guardian call status, group attendance, age/gender for return-gift planning

### 7.6 Admin Role & Permission Flow

```
Admin → Create/manage users → Assign roles/permissions
      → Grant organizer, vendor, priest, host, or admin access
      → Monitor activity logs and audit changes
      → Configure platform defaults, invite policies, and template access
```

**Admin capabilities:**
- Role-based access control for organizer, host, vendor, priest, and admin personas
- Permission scopes for event creation, vendor booking, guest list editing, and reporting
- Audit logging for user and event changes
- Governance of vendor/service categories and regional templates

### 7.7 Gift Registry & Contribution Flow

```
Create registry (items + cash fund) → Share link (short URL)
→ Guest pays via UPI/card → Webhook confirms
→ Mark item fulfilled / increment cash total
→ Auto thank-you (WhatsApp/email) optional
→ Export contribution report (CSV/PDF) for event records
```

### 7.8 Media Sharing Flow

```
Photographer role upload → S3 multipart → Queue: transcode/thumbnail
→ Album privacy (invite-only | link | public)
→ Guest uploads (moderation queue optional)
→ CDN signed URLs (short TTL for hi-res download)
→ Optional: montage job (FFmpeg worker, low priority queue)
```

---

## 8. Scalability & Performance

### 8.1 Load Profile

| Scenario | Estimate | Mitigation |
|----------|----------|------------|
| Concurrent active events (peak season) | 10,000+ | Horizontal pod autoscaling on stateless APIs |
| WhatsApp invitations / hour | 1,000s | Queue + shard by event; respect Meta rate tiers |
| Post-wedding media upload | Spike 48h after event | S3 transfer acceleration; async processing |
| Large wedding guest list | 100,000 guests | Partition `guests` by `event_id`; cursor pagination; materialized RSVP counts |

### 8.2 Scaling Tactics

- **API tier:** Kubernetes HPA on CPU/latency; separate deployment for read-heavy RSVP public endpoints
- **CDN:** Invitation images, thumbnails, public album previews
- **DB:** Read replicas for vendor search and guest lists; **shard vendors by region** when &gt;10M rows
- **Queues:** Kafka for invitation and media; RabbitMQ acceptable for MVP notification volume

### 8.3 Wedding Season (Nov–Feb)

- Pre-warm CDN and replica pools by October
- Feature flags to degrade non-critical features (montage, social share)
- Dedicated WhatsApp sender pool and template pre-approval before season
- SLO bump: 99.9% uptime target vs 99.5% off-season

---

## 9. Security & Privacy

| Control | Implementation |
|---------|----------------|
| **Identity** | Phone OTP; optional OAuth; MFA for vendor/priest payouts |
| **Encryption** | TLS 1.3 in transit; AES-256 at rest (RDS, S3); field-level encryption for phone/address |
| **Payments** | PCI DSS via Razorpay tokenization; no raw card storage |
| **Authorization** | RBAC + event-scoped ACLs; guests see only their RSVP; organizers see full guest PII |
| **Visibility** | Event-level: public / private / invite-only |
| **Media** | Signed URLs; album ACL; EXIF strip on upload |
| **Vendor trust** | Manual verification flag Phase 0; document upload to secure bucket |
| **Privacy rights** | GDPR-style export/delete APIs; anonymize guest records on event deletion |
| **Audit** | Admin actions, payment state changes, invitation sends logged with correlation ID |

---

## 10. Mobile-First Design

| Capability | Approach |
|------------|----------|
| **Clients** | Responsive Next.js + React Native or Flutter |
| **WhatsApp** | Deep links to RSVP; Business API for outbound |
| **Offline** | Ritual checklists cached in SQLite (mobile); sync on reconnect |
| **Push** | FCM/APNs for RSVP, reminders, vendor messages |
| **Check-in** | QR per guest (signed JWT); scan at venue (offline-capable scanner app) |
| **Voice input** | Platform speech-to-text for regional languages in guest notes |

---

## 11. Vendor Ecosystem

### 11.1 Vendor Dashboard

- Vendor profile and service listings with estimated plan details
- Booking calendar (block dates, tentative holds)
- Portfolio CRUD → S3
- Inquiry inbox → convert to booking
- Earnings & settlement status (T+7)
- Analytics: impressions, conversion, revenue trends

### 11.2 Monetization Hooks (see §14)

- Commission on confirmed bookings
- Subscription tiers (featured placement, more photos)
- Promoted listings in search results (clearly labeled)

---

## 12. Non-Functional Requirements

| Metric | Target |
|--------|--------|
| Availability | 99.5% (99.9% wedding season) |
| Invitation page load | &lt; 2 s (LCP on 4G) |
| Vendor search API | p95 &lt; 500 ms |
| Max guests per event | 100,000 (paginated APIs) |
| Deployment | Multi-region India (Mumbai, Hyderabad, Delhi NCR) |
| DR | RPO 24h, RTO 4h; daily backups; cross-region replica for PostgreSQL |
| Observability | Prometheus + Grafana; Sentry; structured JSON logs |
| Analytics | GA4 + Mixpanel (funnel: create event → send invite → RSVP) |

---

## 13. Technology Stack

| Layer | Recommendation |
|-------|----------------|
| **Web** | Next.js 14+ (SSR for public invitations, SEO) |
| **Mobile** | React Native (shared TS with web) or Flutter |
| **API** | NestJS (Node) or FastAPI (Python)—team skill dependent |
| **Gateway** | Kong or AWS API Gateway |
| **OLTP** | PostgreSQL 15+ |
| **Documents** | MongoDB 6+ |
| **Cache** | Redis 7 |
| **Search** | Elasticsearch 8 |
| **Queue** | Kafka (scale) or RabbitMQ (MVP) |
| **Media** | S3 + CloudFront / Cloudflare |
| **K8s** | EKS / GKE; Helm; GitHub Actions CI/CD |
| **IaC** | Terraform |

---

## 14. Monetization

1. **Marketplace commission:** 10–15% on vendor/priest bookings (excluding GST; clarify in ToS)
2. **Premium tier:** Advanced invitation designs, unlimited guests, priority support
3. **Vendor subscriptions:** Basic / Pro / Featured tiers
4. **Promoted listings:** Auction or fixed fee per category-region
5. **Adjacent ads:** Jewelry, travel, insurance (strict separation from editorial search)

---

## 15. Assumptions & Constraints

| # | Assumption |
|---|------------|
| 1 | 60%+ traffic mobile; WhatsApp primary for invites |
| 2 | Regional languages required for adoption outside metros |
| 3 | Rituals vary by region; templates + fork model required |
| 4 | Vendor verification manual initially |
| 5 | Vendor settlement **T+7** after event completion |
| 6 | Meta WhatsApp template approval lead time 2–4 weeks |
| 7 | Panchang APIs may disagree; show source and allow override |

---

## 16. Cultural Context Challenges

| Challenge | Impact | Mitigation |
|-----------|--------|------------|
| **Multi-language content** | Invitation quality, legal copy | Professional translation for templates; user-editable fields; locale fallbacks |
| **Regional ritual differences** | Wrong checklist offends/troubles | Region-tagged templates; community contributors; priest-reviewed packs (Phase 2) |
| **Muhurat disagreement** | Trust erosion | Multiple sources; display uncertainty; priest override |
| **Relationship taxonomy** | Complex addressing ("Mama ji") | Flexible relationship strings + optional guest relationship UI |
| **Dietary rules** | Jain/veg/separate kitchen | Explicit meal enums; per-day meal plans for multi-day weddings |
| **WhatsApp dependency** | Meta policy, per-user blocks | SMS/email fallback; in-app notification center |
| **Cash + digital gifts** | Reconciliation | Record manual cash gifts; UPI for digital; export for event ledger |
| **Large guest lists** | Performance, cost | Pagination; batch messaging; tiered pricing for &gt;5k guests |
| **Photographer copyright** | Legal | Upload terms; organizer controls download rights |

---

## 17. Appendix: Decision Log

| ID | Decision | Alternatives considered | Why chosen |
|----|----------|-------------------------|------------|
| D1 | Microservices (phased) | Pure monolith | Vendor/notification scale independently in season |
| D2 | PostgreSQL + MongoDB | Single DB | Transactions vs flexible ritual/invite templates |
| D3 | Kafka for invitations | Sync HTTP to WhatsApp | Rate limits, retries, burst handling |
| D4 | Elasticsearch for vendors | PostgreSQL full-text | Geo + faceted search &lt;500ms p95 |
| D5 | Razorpay primary | Multiple direct integrations | Single PCI scope; UPI + cards + settlements |
| D6 | Phone OTP primary auth | Email-first | Matches Indian user behavior |
| D7 | API Gateway i18n | Per-service only | Consistent locale resolution |
| D8 | Template versioning | Live pointer to latest | Prevents changing rituals mid-planning |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | May 2026 | — | Initial HLD from requirements prompt |

---

*End of HLD*
