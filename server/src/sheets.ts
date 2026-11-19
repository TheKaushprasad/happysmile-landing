// Append each booking / callback to the "HappySmile Bookings" Google Sheet.
//
// The browser never writes to the sheet. The backend POSTs the row to a Google
// Apps Script web app bound to the sheet (see server/apps-script/Code.gs and the
// README). Set SHEETS_WEBHOOK_URL to that web-app URL to leave demo mode.

import { CONFIG } from './config.js'
import type { CampaignLead } from './types.js'

export async function appendBookingRow(
  lead: CampaignLead,
): Promise<{ ok: boolean; mode: 'demo' | 'live'; detail?: string }> {
  const row = {
    timestamp: lead.createdAt || new Date().toISOString(),
    type: lead.kind === 'booking_confirmation' ? 'Booking' : 'Callback',
    reference: lead.variables.reference ?? '',
    name: lead.name,
    mobile: lead.phone,
    treatment: lead.variables.treatment ?? '',
    clinic: lead.variables.clinic ?? '',
    date: lead.variables.date ?? '',
    slot: lead.variables.slot ?? '',
    language: lead.language,
    consent: lead.consent ? 'Yes' : 'No',
    source: lead.source,
  }

  if (!CONFIG.sheets.webhookUrl) {
    console.info('[sheets:demo] would append row', {
      type: row.type,
      name: row.name,
      reference: row.reference,
    })
    return { ok: true, mode: 'demo' }
  }

  try {
    const res = await fetch(CONFIG.sheets.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row),
    })
    return res.ok
      ? { ok: true, mode: 'live' }
      : { ok: false, mode: 'live', detail: `${res.status}` }
  } catch (err) {
    return { ok: false, mode: 'live', detail: String(err) }
  }
}
