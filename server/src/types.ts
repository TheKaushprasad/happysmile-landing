// Shared contract — mirrors src/types.ts on the website.

export type LeadKind = 'booking_confirmation' | 'drop_off_callback'

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

export interface CallOutcomeWebhook {
  status: CallStatus
  phone: string
  durationSeconds?: number
  transcript?: string
  reference?: string | null
  variables?: Record<string, unknown>
}

/* --- Agent tool payloads --- */

export interface CheckAvailabilityRequest {
  clinic: string
  date: string // yyyy-mm-dd
}
export interface CheckAvailabilityResponse {
  clinic: string
  date: string
  open_slots: string[]
  alternatives: { date: string; slots: string[] }[]
}

export interface CreateBookingRequest {
  name: string
  phone: string
  treatment?: string | null
  clinic: string
  date: string
  slot: string
  language?: string
}
export interface CreateBookingResponse {
  status: 'confirmed' | 'slot_taken' | 'failed'
  confirmation_id?: string
  message?: string
}

/* --- Stored records --- */

export interface Booking {
  id: string
  name: string
  phone: string
  treatment: string | null
  clinic: string
  date: string
  slot: string
  language: string
  reference: string | null
  createdAt: string
  source: 'voice_agent' | 'web'
}

export interface StoredLead extends CampaignLead {
  id: string
  campaignId: string
  status: 'queued' | CallStatus
}
