# Sarvam Voice-Callback Integration

How the HappySmile landing page connects to a **Sarvam outbound voice-agent campaign**, and the exact contract your backend implements. Verified against Sarvam's Voice Agents docs (Campaigns + call-completion webhooks).

## Why voice here

The page is **book-now first** — most patients self-serve a slot and never need a call. The voice agent is the **safety net + confirmation layer**, which is where it pays off:

| Role | Trigger on the page | Lead kind |
| --- | --- | --- |
| **Drop-off rescue** | "Request a Callback" section (`RequestCallback.tsx`) | `drop_off_callback` |
| **Booking confirmation** | A completed booking (`confirmBooking()`) | `booking_confirmation` |

The agent's edge over front-desk staff: it calls back in **minutes, not 4–6 hours**, and speaks the patient's **preferred Indian language**.

## Data flow

```
Browser (form)                 Your backend                     Sarvam
──────────────                 ────────────                     ──────
submitLead(lead)  ──POST──▶  /api/leads  ──create lead / add──▶  Outbound Campaign
                              (holds Sarvam API key)                 │
                                                                     │ agent dials
                                                                     ▼
Your server  ◀──POST (call-completion webhook)───────────────  call ends
  └─ update CRM, write appointment, fire analytics
```

**The browser never calls Sarvam directly.** It posts to *your* server (`CAMPAIGN.leadEndpoint`), which keeps the Sarvam API key and forwards the lead. In this demo build, `submitLead()` logs the payload (and only POSTs if `VITE_LEAD_ENDPOINT` is set).

## 1. Lead your backend receives (from the page)

`src/lib/leads.ts` → `CampaignLead` (see `src/types.ts`):

```jsonc
{
  "campaignId": "demo-campaign",
  "lead": {
    "name": "Priya Sharma",
    "phone": "+919876543210",      // normalised to E.164
    "language": "hi",               // Sarvam language tag
    "kind": "booking_confirmation", // or "drop_off_callback"
    "source": "landing_page_booking",
    "consent": true,                // never dial without this
    "createdAt": "2026-11-18T09:12:00.000Z",
    "variables": {                  // surfaced to the agent on the call
      "treatment": "braces-aligners",
      "clinic": "blr-koramangala",
      "date": "2026-11-21",
      "slot": "2:00 PM",
      "reference": "HS-593633"
    }
  }
}
```

Your `/api/leads` handler: validate `consent === true`, check the number against Sarvam's **DND list**, then add it to the campaign (dashboard import or the Campaigns API).

## 2. Webhook Sarvam POSTs back (call ended)

Set the **Webhook URL** in the campaign's Advanced step. Expected shape → `CallOutcomeWebhook` in `src/types.ts`:

```jsonc
{
  "status": "booked",            // booked | confirmed | no_answer | declined | callback_later | failed
  "phone": "+919876543210",
  "durationSeconds": 92,
  "reference": "HS-593633",
  "transcript": "…",
  "variables": { "slot": "2026-11-21 14:00", "clinic": "blr-koramangala" }
}
```

Map `status` → action **and** to the analytics funnel the page already emits:

| status | Do |
| --- | --- |
| `booked` / `confirmed` | Write the appointment in the scheduling system → `booking_completed` |
| `callback_later` | Re-queue the lead at the requested time |
| `no_answer` | Let the campaign retry policy handle it |
| `declined` | Close the lead, suppress further calls |
| `failed` | Log for `booking_failed`, alert if repeated |

## 3. Config (`src/lib/config.ts`)

| Setting | Env var | Notes |
| --- | --- | --- |
| `CAMPAIGN.leadEndpoint` | `VITE_LEAD_ENDPOINT` | Your backend route; empty = demo mode |
| `CAMPAIGN.campaignId` | `VITE_SARVAM_CAMPAIGN_ID` | Sarvam campaign id |
| `CAMPAIGN.callingHours` | — | 09:00–19:00; also enforce on the campaign |
| `LANGUAGES` | — | Offered in the form; map to Sarvam tags |

Create a `.env.local` for production:

```
VITE_LEAD_ENDPOINT=https://api.happysmile.example/api/leads
VITE_SARVAM_CAMPAIGN_ID=camp_xxx
```

## 4. Compliance (India) — not optional

- **Consent**: the form requires an explicit checkbox; your backend must reject leads without `consent: true`.
- **DND**: screen every number against Sarvam's org-wide Do-Not-Disturb list before dialing.
- **Hours**: keep to 09:00–19:00 local.
- **Disclosure**: the agent should identify itself as an automated assistant.
- **Honesty**: the agent creates/confirms a *request*; it should only say "confirmed" when it has validated live slot availability — same rule as the page.

## 5. Analytics events (already emitted)

`landing_page_viewed`, `treatment_selected`, `clinic_selected`, `appointment_date_selected`, `appointment_slot_selected`, `booking_form_started`, `booking_form_submitted`, `booking_completed`, `booking_failed`, **`callback_requested`**, **`lead_submitted`** — in `window.dataLayer`. Reconcile call outcomes from the webhook against these to see the full enquiry → call → booked funnel.

## Demo vs production

- **Demo**: leave `VITE_LEAD_ENDPOINT` empty — leads log to the console so you can see the payload. Load a few **consented, test** numbers (your own / teammates') into the campaign by hand; never real patients who haven't opted in.
- **Production**: implement `/api/leads` + the webhook receiver, set the env vars, and wire `booking_completed` to the scheduling system.
