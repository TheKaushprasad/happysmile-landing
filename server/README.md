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
| `POST /api/leads` | The website (`submitLead`) | Validate consent + DND, store the lead, and **place an instant outbound call** (the agent rings the user from your virtual number) |
| `POST /api/tools/check-availability` | The Sarvam agent | `{ clinic, date }` → `{ open_slots, alternatives }` |
| `POST /api/tools/create-booking` | The Sarvam agent | `{ name, phone, treatment, clinic, date, slot, language }` → `{ status, confirmation_id }` |
| `POST /api/webhooks/sarvam` | Sarvam | Call-outcome event → update lead/booking, honour opt-outs |
| `GET /health` | You | Liveness + mode |
| `GET /api/_debug/snapshot` | You (dev) | Peek at the in-memory bookings/leads/DND |

## Logging to Google Sheets

Every submission is appended to the **Happy smile** spreadsheet — bookings to the **booking** tab, callback requests to the **callback request** tab. Setup (no Google Cloud / service account needed):

1. Open the spreadsheet → **Extensions → Apps Script**.
2. Paste `server/apps-script/Code.gs`, then **Deploy → New deployment → Web app** (Execute as: *Me*, Who has access: *Anyone*). Copy the web-app URL.
3. Put it in `server/.env` as `SHEETS_WEBHOOK_URL` and restart.

`/api/leads` then POSTs each submission to that URL, which appends a row (Timestamp, Type, Reference, Name, Mobile, Treatment, Clinic, Date, Slot, Language, Consent, Source) to the right tab. Until the URL is set, the server logs the row instead (`[sheets:demo] would append row`).

The **same web-app URL** also accepts Sarvam **call outcomes** (payloads with `outcome`/`status`) and appends them to the **voice ai** tab — so point your Sarvam call-completion webhook at this one URL too.

## How the callback works

When someone submits the callback form, `/api/leads` calls Sarvam's **Instant Outbound** endpoint:

```
POST {SARVAM_OUTBOUNDS_URL}/v1/orgs/{SARVAM_ORG_ID}/workspaces/{SARVAM_WORKSPACE_ID}/outbounds
X-API-Key: {SARVAM_API_KEY}
{
  "app_config": {
    "app_id": "{SARVAM_APP_ID}",
    "app_version": {SARVAM_APP_VERSION},
    "connection_config": { "connection_id": "{SARVAM_CONNECTION_ID}", "agent_phone_number": "{SARVAM_AGENT_NUMBER}" },
    "agent_variables": { "name": "...", "kind": "...", "treatment": "...", "clinic": "..." },
    "app_overrides": { "initial_language_name": "Tamil" }
  },
  "user_config": { "user_phone_number": "+91..." },
  "webhook_config": { "url": "{PUBLIC_WEBHOOK_URL}" }
}
```

Sarvam returns an `attempt_id`, the agent calls the user **from your virtual number** (`agent_phone_number`), and posts the outcome to your webhook when the call ends. Set the seven `SARVAM_*` values in `.env` to leave demo mode.

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
