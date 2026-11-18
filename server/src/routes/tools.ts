import { Router } from 'express'
import { createBooking, getAlternatives, getOpenSlots, isSlotOpen, normalisePhone } from '../store.js'
import type {
  CheckAvailabilityResponse,
  CreateBookingResponse,
} from '../types.js'

export const toolsRouter = Router()

/**
 * POST /api/tools/check-availability   (agent tool)
 * Body: { clinic, date }  ->  { open_slots, alternatives }
 */
toolsRouter.post('/check-availability', (req, res) => {
  const clinic = String(req.body?.clinic ?? '').trim()
  const date = String(req.body?.date ?? '').trim()
  if (!clinic || !date) {
    return res.status(400).json({ error: 'clinic and date are required' })
  }

  const open_slots = getOpenSlots(clinic, date)
  const payload: CheckAvailabilityResponse = {
    clinic,
    date,
    open_slots,
    alternatives: open_slots.length ? [] : getAlternatives(clinic, date),
  }
  return res.json(payload)
})

/**
 * POST /api/tools/create-booking   (agent tool)
 * Body: { name, phone, treatment, clinic, date, slot, language }
 * Only books if the slot is still open; returns a confirmation id on success.
 */
toolsRouter.post('/create-booking', (req, res) => {
  const b = req.body ?? {}
  const clinic = String(b.clinic ?? '').trim()
  const date = String(b.date ?? '').trim()
  const slot = String(b.slot ?? '').trim()
  const name = String(b.name ?? '').trim()
  const phone = String(b.phone ?? '').trim()

  if (!name || !phone || !clinic || !date || !slot) {
    const fail: CreateBookingResponse = { status: 'failed', message: 'missing required fields' }
    return res.status(400).json(fail)
  }

  if (!isSlotOpen(clinic, date, slot)) {
    const taken: CreateBookingResponse = {
      status: 'slot_taken',
      message: 'That slot is no longer available. Offer an alternative from check-availability.',
    }
    return res.status(409).json(taken)
  }

  const booking = createBooking({
    name,
    phone: normalisePhone(phone),
    treatment: b.treatment ?? null,
    clinic,
    date,
    slot,
    language: String(b.language ?? 'en'),
    reference: b.reference ?? null,
    source: 'voice_agent',
  })

  if (!booking) {
    const taken: CreateBookingResponse = { status: 'slot_taken', message: 'slot just taken' }
    return res.status(409).json(taken)
  }

  const ok: CreateBookingResponse = { status: 'confirmed', confirmation_id: booking.id }
  return res.json(ok)
})
