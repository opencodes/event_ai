Excellent — this transforms **Utsav Connect** from a simple marketplace into a deeply cultural, operational “Wedding OS” for Indian traditional ceremonies.

Your features now resemble a hybrid of:

* WeddingWire + Notion + ERP + WhatsApp + Indian Ritual Planner
* Hyperlocal vendor marketplace
* Ritual intelligence system
* Family coordination platform
* Cultural event operating system

Here’s an upgraded MASTER AI PRODUCT PROMPT incorporating:

* MongoDB architecture
* Full module ecosystem
* Dashboard logic
* Indian traditional workflows
* Marketplace ecosystem
* SaaS-grade UX

---

Build a full-stack modern web application called “Utsav Connect” — an AI-powered Indian traditional wedding & ceremony operating system with an integrated vendor marketplace, family coordination system, ritual scheduling engine, budgeting tools, gifting ledger, RSVP tracking, and Bhoj procurement calculator.

The platform should feel like:

* A premium Indian cultural super-app
* A wedding ERP/dashboard
* A collaborative family planning workspace
* A modern marketplace for vendors and artists
* A ritual-aware ceremonial operating system

---

## PRIMARY PRODUCT VISION

Utsav Connect is designed for:

* Weddings (Vivah)
* Mundan
* Upanayan
* Tilak
* Engagement
* Housewarming
* Shradh Bhoj
* Religious ceremonies
* Regional Indian cultural celebrations

The application must blend:

* Traditional Indian cultural aesthetics
* Modern SaaS dashboards
* Mobile-first marketplace UX
* Real-time collaboration
* Spreadsheet-like planning tools
* Emotional storytelling

---

## DESIGN LANGUAGE

Use the uploaded brandbook theme.

Primary Colors:

* Garnet Red: #9B1B30
* Gold/Brown: #C5A059
* Dark Slate: #1F4E5F
* Warm Ivory Background: #FFF9F0

Typography:

* Heading Font: Great Vibes
* UI Font: Poppins

Visual Tone:

* Regal
* Warm
* Elegant
* Modern-traditional
* Minimal yet festive

Design inspiration:

* Airbnb
* Notion
* WeddingWire
* Pinterest
* Indian royal wedding aesthetics

Include:

* Soft shadows
* Glassmorphism where needed
* Animated dashboards
* Rich card layouts
* Floating festive gradients
* Decorative Indian motifs subtly in corners

---

## TECH STACK

Frontend:

* Next.js App Router
* TypeScript
* TailwindCSS
* Shadcn UI
* Framer Motion
* React Query

Backend:

* Node.js + Express OR Next.js Server Actions

Database:

* MongoDB Atlas

Authentication:

* Clerk/Auth.js/Firebase Auth
* Role-based authentication

Storage:

* Cloudinary/S3

Realtime:

* Socket.IO or Firebase realtime

Deployment:

* Vercel + MongoDB Atlas

---

## MONGODB DATABASE DESIGN

Create scalable MongoDB schemas/models for:

1. Users

* name
* email
* phone
* role (Host, Vendor, Guest)
* avatar
* familyGroup
* savedEvents

2. Events

* title
* slug
* eventType
* startDate
* endDate
* venue
* hostIds
* guestCount
* rituals[]
* tasks[]
* vendors[]
* budget
* expenses[]
* giftingLedger[]
* bhojPlanning[]
* clothingAssignments[]

3. Vendors

* businessName
* category
* ownerName
* services
* pricing
* location
* portfolio
* reviews
* verified
* packages
* availability
* certifications

4. RSVP Responses

* guestName
* familySize
* foodPreference
* transportNeed
* accommodationNeed
* genderBreakdown
* ageGroupBreakdown

5. Ritual Timeline

* ritualName
* muhuratStart
* muhuratEnd
* priority
* status
* assignedMembers

6. Budget Collections

* category
* allocated
* spent
* pending
* transactions

7. Lifafa Ledger

* contributorName
* giftType
* amount
* village
* reciprocalObligation
* notes

8. Bhoj Procurement

* headcount
* menuItems
* ingredients
* quantity
* wholesaleVendor

9. Clothing Allocation

* familyMember
* relationship
* clothingType
* size
* status
* assignedEvent

---

## APPLICATION MODULES

# 1. HOST EVENT COMMAND CENTER DASHBOARD

Create a premium operational dashboard with:

* Readiness percentage ring
* RSVP counters
* Vendor settlement trackers
* Ritual timeline
* Budget utilization chart
* Chuman/Lifafa live totals
* Pending tasks
* Event switcher
* Role switcher

Include:

* Interactive analytics cards
* Event progress radar chart
* Daily activity feed
* Upcoming ritual countdowns

Dashboard sections:

1. Ritual Timeline
2. Pending Tasks
3. RSVP Status
4. Purchase Checklist
5. Vendor Status
6. Budget Overview

---

# 2. CRITICAL PLANNING CHECKPOINTS MODULE

Interactive milestone checklist system.

Statuses:

* Not Started
* In Progress
* Completed

Features:

* Drag/drop priorities
* Reminder notifications
* Deadline warnings
* Smart suggestions

Default checkpoints:

* Venue Booking
* Vendor Confirmation
* Ritual Scheduling
* Catering Finalization
* Guest Accommodation
* Invitation Dispatch

---

# 3. VEDIC RITUAL TIMELINE ENGINE

Create a ceremonial scheduling interface.

Features:

* Muhurat-based scheduling
* Ritual timeline visualizer
* Color-coded statuses
* Priest assignment
* Ritual dependencies

Timeline examples:

* Haldi
* Mehendi
* Sangeet
* Tilak
* Vivah
* Bidai

---

# 4. WHATSAPP STYLE RSVP PORTAL

Create:

* WhatsApp-inspired invitation UI
* RSVP dashboard
* Family attendee calculator
* Food preference tracking
* Transport requirement tracker

Include:

* Bulk invite system
* QR invitation links
* Shareable invite cards
* Reminder messages

Analytics:

* Gender distribution
* Age group charts
* Dietary dashboards

---

# 5. CLOTHING ALLOCATION MATRIX

Spreadsheet-like UI for:

* Sarees
* Kurtas
* Dhotis
* Sherwanis

Features:

* Size tracking
* Purchase tracking
* Distribution lists
* Family assignments
* Vendor linkage

Include:

* Inventory availability progress bars
* Auto procurement suggestions

---

# 6. BHOJ PROCUREMENT CALCULATOR

Build a formula-driven catering calculator.

Features:

* Headcount-based calculations
* Ingredient conversion engine
* Wholesale estimation
* Per-day meal planning
* Regional cuisine presets

Cuisine examples:

* Maithila Bhoj
* Bengali Bhoj
* South Indian Feast
* Gujarati Thali

Visualize:

* Grains
* Dairy
* Vegetables
* Spices

with charts and procurement summaries.

---

# 7. VENDOR MARKETPLACE

Create a marketplace with:

* Vendor discovery
* Advanced filters
* Ratings/reviews
* Portfolio galleries
* Live bargaining system
* Instant inquiry

Vendor categories:

* Catering
* Photography
* Priests
* Tent houses
* Decorators
* Makeup artists
* Folk artists
* Musicians

Features:

* Real-time booking
* Vendor comparison
* Availability calendar
* Verified badges
* Dynamic pricing

---

# 8. BUDGET & EXPENSE TRACKER

Features:

* Budget allocation
* Expense categories
* Live expense charts
* Payment reminders
* Advance/balance tracking

Visuals:

* Pie charts
* Progress bars
* Burn-rate indicators

---

# 9. LIFAFA GIFTING LEDGER

Create a traditional gifting management system.

Features:

* Cash gift tracking
* Physical gift inventory
* Village/family filters
* Social exchange return reminders

Support:

* Excel-style tables
* Export to PDF
* Search/filter system

---

# UX REQUIREMENTS

---

* Mobile-first
* Responsive
* Fast-loading
* Rich microinteractions
* Elegant animations
* Sticky action buttons
* Offline-friendly PWA

---

## ADVANCED FEATURES

Add:

* AI wedding planner assistant
* Smart vendor recommendations
* AI Bhoj estimator
* Muhurat recommendation engine
* Family collaboration workspace
* Shared planning boards
* Ceremony countdown widgets
* Voice notes
* WhatsApp integration
* Digital invitation builder

---

## ADMIN PANEL

Create admin controls for:

* Vendor verification
* Marketplace moderation
* Payment settlements
* Ritual templates
* Regional presets
* Analytics

---

## OUTPUT REQUIREMENT

Generate:

1. Full application architecture
2. Folder structure
3. MongoDB schema design
4. API routes
5. Responsive UI screens
6. Dashboard wireframes
7. Reusable components
8. Marketplace flows
9. Authentication flows
10. State management approach

The final product should feel like:
“A modern Indian wedding operating system powered by culture, rituals, community, and intelligent planning.”
