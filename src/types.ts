import type { LucideIcon } from 'lucide-react'

export interface Treatment {
  id: string
  name: string
  short: string
  description: string
  icon: LucideIcon
  image: string
  priceNote: string
}

export interface Clinic {
  id: string
  name: string
  city: string
  address: string
  phone: string
  hours: string
  mapsQuery: string
}

export type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening'

export interface TimeSlot {
  label: string
  period: TimeOfDay
}

export interface ContactDetails {
  fullName: string
  mobile: string
  email: string
  /** Preferred language for the voice callback (ISO-ish code, e.g. 'hi'). */
  language: string
  /** Explicit consent to be contacted by phone/WhatsApp (required). */
  consent: boolean
}

/** The booking draft persisted across every step of the flow. */
export interface BookingDraft {
  treatmentId: string | null
  city: string | null
  clinicId: string | null
  date: string | null // ISO yyyy-mm-dd
  slot: string | null // slot label
  contact: ContactDetails
}

export interface ConfirmedBooking extends BookingDraft {
  reference: string
}

/* ---------------------------------------------------------------------------
 * Sarvam voice-agent integration contract
 * -------------------------------------------------------------------------*/

export type LeadKind = 'booking_confirmation' | 'drop_off_callback'

/**
 * The payload your backend sends to the Sarvam outbound campaign (one lead =
 * one call the agent will place). `variables` are surfaced to the agent during
 * the call (so it can greet by name, read back the slot, etc.).
 */
export interface CampaignLead {
  name: string
  phone: string
  language: string
  kind: LeadKind
  source: string
  consent: boolean
  createdAt: string
  variables: {
    treatment: string | null
    clinic: string | null
    date: string | null
    slot: string | null
    reference: string | null
  }
}

export type CallStatus =
  | 'booked'
  | 'confirmed'
  | 'no_answer'
  | 'declined'
  | 'callback_later'
  | 'failed'

/**
 * The shape Sarvam POSTs to your webhook when each campaign call finishes.
 * Mirrors Sarvam's call-completion event (outcome, transcript, duration and
 * the variables the agent collected on the call).
 */
export interface CallOutcomeWebhook {
  status: CallStatus
  phone: string
  durationSeconds?: number
  transcript?: string
  reference?: string | null
  variables?: Record<string, unknown>
}
