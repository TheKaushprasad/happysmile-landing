/**
 * Write each submission to the Google Sheet DIRECTLY from the website, by POSTing
 * to the Apps Script web app. Because Apps Script is always-on (Google-hosted),
 * this works from any live website with no backend running.
 *
 * Uses `mode: 'no-cors'` — Apps Script doesn't send CORS headers, so we can't
 * read the response, but the row is still appended. Never throws.
 */
import type { CampaignLead } from '../types'

export function writeToSheet(lead: CampaignLead): void {
  const url = import.meta.env.VITE_SHEETS_WEBHOOK_URL as string | undefined
  if (!url) return

  const row = {
    type: lead.kind === 'booking_confirmation' ? 'Booking' : 'Callback',
    timestamp: lead.createdAt,
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

  // text/plain keeps it a "simple request" (no CORS preflight); Apps Script
  // reads e.postData.contents regardless of content type.
  fetch(url, { method: 'POST', mode: 'no-cors', body: JSON.stringify(row) }).catch(() => {
    /* best-effort; backend/Supabase still capture it */
  })
}
