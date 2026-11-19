import { Router } from 'express'
import { CONFIG } from '../config.js'
import { addLead, isDnd } from '../store.js'
import { placeOutboundCall } from '../sarvam.js'
import { appendBookingRow } from '../sheets.js'
import type { CampaignLead } from '../types.js'

export const leadsRouter = Router()

/**
 * POST /api/leads
 * Body: { campaignId?, lead: CampaignLead }  (what the website's submitLead() sends)
 * Validates consent, screens the DND list, stores the lead and forwards it to Sarvam.
 */
leadsRouter.post('/', async (req, res) => {
  const lead = req.body?.lead as CampaignLead | undefined
  const campaignId = (req.body?.campaignId as string) || CONFIG.sarvam.campaignId || 'demo-campaign'

  if (!lead || !lead.phone || !lead.name) {
    return res.status(400).json({ ok: false, error: 'lead with name and phone is required' })
  }
  // Compliance gate: never dial without explicit consent.
  if (lead.consent !== true) {
    return res.status(422).json({ ok: false, error: 'consent is required before calling' })
  }
  // Do Not Disturb: accept the lead but do not queue a call.
  if (isDnd(lead.phone)) {
    const stored = addLead({ ...lead, campaignId })
    stored.status = 'declined'
    return res.json({ ok: true, leadId: stored.id, queued: false, reason: 'dnd' })
  }

  const stored = addLead({ ...lead, campaignId })

  // Record the submission in the Google Sheet (booking or callback).
  const sheet = await appendBookingRow(lead)

  // Fire the callback immediately: the agent rings the end user from the
  // virtual number. (Set the Sarvam ids in .env to leave demo mode.)
  const webhookUrl = CONFIG.publicWebhookUrl || undefined
  const result = await placeOutboundCall(lead, webhookUrl)

  return res.status(result.ok ? 200 : 502).json({
    ok: result.ok,
    leadId: stored.id,
    logged: sheet.ok,
    called: result.ok,
    mode: result.mode,
    ...(result.attemptId ? { attemptId: result.attemptId } : {}),
    ...(result.detail ? { detail: result.detail } : {}),
  })
})
