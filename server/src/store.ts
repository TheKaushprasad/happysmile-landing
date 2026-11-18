// In-memory scheduling store. Everything resets on restart. Swap these functions
// for your real scheduling system / DB in production.

import { DEFAULT_SLOTS, resolveClinicKey } from './mockData.js'
import type { Booking, StoredLead } from './types.js'

const bookings: Booking[] = []
const leads: StoredLead[] = []
const dnd = new Set<string>() // normalised phone numbers to never call

let seq = 1000
const nextId = (prefix: string) => `${prefix}-${++seq}`

function slotKey(clinicKey: string, date: string, slot: string): string {
  return `${clinicKey}|${date}|${slot}`
}

/** Open slots for a clinic+date = standard slots minus already-booked ones. */
export function getOpenSlots(clinic: string, date: string): string[] {
  const clinicKey = resolveClinicKey(clinic)
  const taken = new Set(
    bookings
      .filter((b) => resolveClinicKey(b.clinic) === clinicKey && b.date === date)
      .map((b) => b.slot),
  )
  return DEFAULT_SLOTS.filter((s) => !taken.has(s))
}

/** The next few days that still have open slots, for "alternatives". */
export function getAlternatives(clinic: string, fromDate: string, days = 3) {
  const out: { date: string; slots: string[] }[] = []
  const base = new Date(`${fromDate}T00:00:00`)
  for (let i = 1; i <= days; i++) {
    const d = new Date(base)
    d.setDate(d.getDate() + i)
    const iso = d.toISOString().slice(0, 10)
    const slots = getOpenSlots(clinic, iso)
    if (slots.length) out.push({ date: iso, slots })
  }
  return out
}

export function isSlotOpen(clinic: string, date: string, slot: string): boolean {
  return getOpenSlots(clinic, date).includes(slot)
}

export function createBooking(
  input: Omit<Booking, 'id' | 'createdAt'>,
): Booking | null {
  const clinicKey = resolveClinicKey(input.clinic)
  // Guard against double-booking the same slot.
  const exists = bookings.some(
    (b) =>
      slotKey(resolveClinicKey(b.clinic), b.date, b.slot) ===
      slotKey(clinicKey, input.date, input.slot),
  )
  if (exists) return null
  const booking: Booking = { ...input, id: nextId('HS-CNF'), createdAt: new Date().toISOString() }
  bookings.push(booking)
  return booking
}

export function addLead(lead: Omit<StoredLead, 'id' | 'status'>): StoredLead {
  const stored: StoredLead = { ...lead, id: nextId('LEAD'), status: 'queued' }
  leads.push(stored)
  return stored
}

export function updateLeadStatusByPhone(phone: string, status: StoredLead['status']): StoredLead | undefined {
  const norm = normalisePhone(phone)
  // Most recent lead for this number.
  const lead = [...leads].reverse().find((l) => normalisePhone(l.phone) === norm)
  if (lead) lead.status = status
  return lead
}

export function isDnd(phone: string): boolean {
  return dnd.has(normalisePhone(phone))
}
export function addDnd(phone: string): void {
  dnd.add(normalisePhone(phone))
}

export function snapshot() {
  return { bookings, leads, dnd: [...dnd] }
}

export function normalisePhone(raw: string): string {
  const digits = raw.replace(/[\s-]/g, '')
  if (digits.startsWith('+')) return digits
  if (digits.startsWith('91') && digits.length === 12) return `+${digits}`
  if (digits.length === 10) return `+91${digits}`
  return digits
}
