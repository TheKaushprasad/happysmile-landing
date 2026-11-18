import { Router } from 'express'
import { CONFIG } from '../config.js'
import { addDnd, updateLeadStatusByPhone } from '../store.js'
import type { CallOutcomeWebhook } from '../types.js'

export const webhookRouter = Router()

/**
 * POST /api/webhooks/sarvam
 * Sarvam POSTs a call-completion event here when each campaign call ends.
 * Header: x-webhook-secret (must match WEBHOOK_SECRET, if configured).
 *
 * NOTE: verify against Sarvam's actual signing scheme in production — this
 * shared-secret header check is a placeholder.
 */
webhookRouter.post('/sarvam', (req, res) => {
  if (CONFIG.webhookSecret) {
    const provided = req.header('x-webhook-secret')
    if (provided !== CONFIG.webhookSecret) {
      return res.status(401).json({ ok: false, error: 'bad signature' })
    }
  }

  const event = req.body as CallOutcomeWebhook
  if (!event?.status || !event?.phone) {
    return res.status(400).json({ ok: false, error: 'status and phone are required' })
  }

  // Keep the lead's status in sync with the call outcome.
  const lead = updateLeadStatusByPhone(event.phone, event.status)

  // Suppress future calls when the person opts out.
  if (event.status === 'declined') addDnd(event.phone)

  console.info('[webhook] call outcome', {
    phone: event.phone,
    status: event.status,
    reference: event.reference ?? null,
    durationSeconds: event.durationSeconds,
    matchedLead: lead?.id ?? null,
  })

  // Here you would also: write/finalize the appointment in your scheduling
  // system, update your CRM, and re-emit analytics (booking_completed, etc.).

  return res.json({ ok: true })
})
