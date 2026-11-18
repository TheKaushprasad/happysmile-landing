/**
 * Lead layer for the Sarvam outbound voice-callback campaign.
 *
 * Flow:
 *   browser form  ──submitLead()──▶  YOUR backend (CAMPAIGN.leadEndpoint)
 *                                      └─▶ adds the lead to the Sarvam campaign
 *   Sarvam agent dials the lead, then POSTs a CallOutcomeWebhook back to your
 *   server when the call ends (see INTEGRATION.md).
 *
 * The browser NEVER talks to Sarvam directly — the Sarvam API key lives only on
 * your server. In this demo build `submitLead` logs the payload (and posts to
 * `CAMPAIGN.leadEndpoint` only if one is configured) so the funnel is visible.
 */
import { track } from './analytics'
import { CAMPAIGN } from './config'
import type { CampaignLead, ConfirmedBooking, ContactDetails } from '../types'

/** A booked slot → a short confirmation call from the agent. */
export function buildBookingLead(b: ConfirmedBooking): CampaignLead {
  return {
    name: b.contact.fullName.trim(),
    phone: normalisePhone(b.contact.mobile),
    language: b.contact.language,
    kind: 'booking_confirmation',
    source: 'landing_page_booking',
    consent: b.contact.consent,
    createdAt: new Date().toISOString(),
    variables: {
      treatment: b.treatmentId,
      clinic: b.clinicId,
      date: b.date,
      slot: b.slot,
      reference: b.reference,
    },
  }
}

/** A drop-off / "call me back" lead → the agent rings to help them book. */
export function buildCallbackLead(
  contact: Pick<ContactDetails, 'fullName' | 'mobile' | 'language' | 'consent'>,
  context: { treatmentId?: string | null; clinicId?: string | null } = {},
): CampaignLead {
  return {
    name: contact.fullName.trim(),
    phone: normalisePhone(contact.mobile),
    language: contact.language,
    kind: 'drop_off_callback',
    source: 'landing_page_callback',
    consent: contact.consent,
    createdAt: new Date().toISOString(),
    variables: {
      treatment: context.treatmentId ?? null,
      clinic: context.clinicId ?? null,
      date: null,
      slot: null,
      reference: null,
    },
  }
}

/**
 * Hand the lead to your backend, which forwards it to the Sarvam campaign.
 * Resolves `true` when accepted. Never throws — the UI should acknowledge the
 * request regardless, and failures are tracked for retry.
 */
export async function submitLead(lead: CampaignLead): Promise<boolean> {
  track('lead_submitted', { kind: lead.kind, language: lead.language })
  // eslint-disable-next-line no-console
  console.info('[sarvam] lead →', lead)

  if (!CAMPAIGN.leadEndpoint) {
    // Demo mode: no backend wired yet. Pretend-accept so the flow completes.
    return true
  }

  try {
    const res = await fetch(CAMPAIGN.leadEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaignId: CAMPAIGN.campaignId, lead }),
    })
    return res.ok
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[sarvam] lead submit failed', err)
    return false
  }
}

/** Keep +91 formatting consistent for the dialer; strip spaces/dashes. */
function normalisePhone(raw: string): string {
  const digits = raw.replace(/[\s-]/g, '')
  if (digits.startsWith('+')) return digits
  if (digits.startsWith('91') && digits.length === 12) return `+${digits}`
  if (digits.length === 10) return `+91${digits}`
  return digits
}
