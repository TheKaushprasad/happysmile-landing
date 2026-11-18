# HappySmile — Conversion-Focused Dental Landing Page

A high-converting, self-service appointment-booking landing page for **HappySmile**, a chain of 12 dental clinics across India. The page is built to reduce dependency on manual callbacks by letting prospective patients explore treatments and **book an appointment immediately** instead of submitting an enquiry and waiting.

Built with **React + TypeScript + Vite + Tailwind CSS + lucide-react**.

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default http://localhost:5173).

Other scripts:

```bash
npm run build      # type-check + production build
npm run preview    # preview the production build
npm run typecheck  # type-check only
```

## What it does

- **Sticky navigation** with contact number + prominent *Book Appointment* CTA; compact mobile menu.
- **Hero** with headline, benefits, dual CTAs and an overlaid booking card.
- **Quick 5-step booking flow** (the core experience):
  1. Select treatment → 2. Select clinic (city + clinic) → 3. Choose date & time → 4. Contact details → 5. Confirmation with a generated booking reference.
- **Treatment, clinic and “book at this clinic” cards** all deep-link into the booking flow with the choice **preselected**.
- **State persists across steps** — going back never loses entered data (single source of truth in `BookingContext`).
- **Interactive calendar** (past dates disabled) and grouped Morning / Afternoon / Evening demo slots.
- **Form validation** with inline errors (name, Indian mobile format, optional email).
- **Confirmation screen** with Add to Calendar (`.ics`), Contact Clinic and Book Another — clearly framed as a *request pending clinic confirmation*, never a confirmed appointment.
- **Why Us, How It Works, Testimonials carousel, FAQ accordion, final CTA, footer.**
- **WhatsApp float button** (configurable number) + **mobile sticky Book bar.**

## Honesty & demo-data labelling

Per the brief, nothing is overstated:

- Clinic data, time slots and testimonials are **clearly labelled as demonstration / sample data**.
- A submission produces a **booking request**, explicitly “pending clinic confirmation” — not a confirmed appointment, because live availability is not yet validated.

## Analytics readiness

All funnel events are emitted via `src/lib/analytics.ts` to `window.dataLayer` (GTM-compatible) and the console:

`landing_page_viewed`, `treatment_selected`, `clinic_selected`, `appointment_date_selected`, `appointment_slot_selected`, `booking_form_started`, `booking_form_submitted`, `booking_completed`, `booking_failed`.

Swap that one file for a real GA4 / Segment / Amplitude call to go live.

## Ready for integration

Clean seams for backend wiring:

- `src/data/*` — mock clinics (12), treatments, slots, testimonials, FAQs → replace with CMS / API.
- `BookingContext.confirmBooking()` → replace the local reference generator with a real **booking API** call that validates availability.
- `src/lib/config.ts` — WhatsApp Business number, phone, email, brand config.
- Slot source (`DEMO_SLOTS`) → clinic **scheduling system**. CRM and WhatsApp Business API hooks drop in at the same layer.

## Project structure

```
src/
  App.tsx                     # layout + providers
  main.tsx
  index.css                   # Tailwind layers + design tokens
  context/BookingContext.tsx  # cross-step booking state + preselection
  lib/analytics.ts            # event tracking layer
  lib/config.ts               # business config (phone, WhatsApp, email)
  data/                       # clinics, treatments, slots, testimonials, faqs
  components/
    booking/                  # BookingSection, Calendar, StepIndicator
    ui/                       # SectionHeading, Logo
    Navbar, Hero, Treatments, WhyUs, Clinics,
    HowItWorks, Testimonials, FAQ, FinalCTA, Footer, FloatingActions
```

## Design

Colours and type follow the brief — primary `#147D83`, secondary `#DDF3F1`, background `#F8FAFC`, text `#1E293B` / `#64748B`; Inter + Plus Jakarta Sans; rounded cards, subtle shadows, mobile-first.
