# HappySmile Server

The backend that connects the HappySmile website to the **Sarvam voice-agent campaign**. Node + Express + TypeScript, with an in-memory scheduling store and mock clinics so it runs locally end-to-end. See `../INTEGRATION.md` for the contract and `../SARVAM_AGENT.md` for the agent.

## Run

```bash
cd server
npm install
npm run dev
```

Starts on **http://localhost:3001** in **DEMO mode** (no Sarvam key → it logs what it would do instead of placing real calls). For live mode, copy `.env.example` to `.env` and fill in your Sarvam key, campaign id and webhook secret.

## Routes

| Route | Who calls it | Purpose |
| --- | --- | --- |
| `POST /api/leads` | The website (`submitLead`) | Validate consent + DND, store the lead, add it to the Sarvam campaign |
| `POST /api/tools/check-availability` | The Sarvam agent | `{ clinic, date }` → `{ open_slots, alternatives }` |
| `POST /api/tools/create-booking` | The Sarvam agent | `{ name, phone, treatment, clinic, date, slot, language }` → `{ status, confirmation_id }` |
| `POST /api/webhooks/sarvam` | Sarvam | Call-outcome event → update lead/booking, honour opt-outs |
| `GET /health` | You | Liveness + mode |
| `GET /api/_debug/snapshot` | You (dev) | Peek at the in-memory bookings/leads/DND |

## Try it

```bash
# 1) A booking-confirmation lead from the website
curl -s localhost:3001/api/leads -H "Content-Type: application/json" -d '{"campaignId":"demo-campaign","lead":{"name":"Priya Sharma","phone":"9876543210","language":"hi","kind":"booking_confirmation","source":"landing_page_booking","consent":true,"createdAt":"2026-11-18T09:00:00Z","variables":{"treatment":"Braces & Aligners","clinic":"HappySmile Koramangala, Bengaluru","date":"2026-11-21","slot":"2:00 PM","reference":"HS-593633"}}}'

# 2) Agent checks availability
curl -s localhost:3001/api/tools/check-availability -H "Content-Type: application/json" -d '{"clinic":"HappySmile Koramangala, Bengaluru","date":"2026-11-21"}'

# 3) Agent books the slot
curl -s localhost:3001/api/tools/create-booking -H "Content-Type: application/json" -d '{"name":"Priya Sharma","phone":"9876543210","treatment":"Braces & Aligners","clinic":"HappySmile Koramangala, Bengaluru","date":"2026-11-21","slot":"2:00 PM","language":"hi"}'

# 4) Sarvam reports the call outcome
curl -s localhost:3001/api/webhooks/sarvam -H "Content-Type: application/json" -d '{"status":"confirmed","phone":"+919876543210","durationSeconds":92,"reference":"HS-593633","variables":{"slot":"2:00 PM"}}'
```

Booking the same slot twice returns `slot_taken` — proving availability is real (within this process).

## Going to production

- Replace `src/store.ts` + `src/mockData.ts` with your real scheduling system / DB.
- Set the env vars; confirm the Sarvam endpoint/paths in `src/sarvam.ts` match your account's Campaigns API.
- Verify the webhook with Sarvam's real signing scheme (the current `x-webhook-secret` check is a placeholder).
- Put it behind HTTPS and point `VITE_LEAD_ENDPOINT` (website) + the agent tool URLs + the campaign webhook URL at it.
