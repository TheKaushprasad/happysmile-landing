/**
 * Supabase — durable store for bookings & callbacks, written DIRECTLY from the
 * website so submissions are saved even when the local backend is offline.
 *
 * The anon key is public by design; the tables are protected by Row-Level
 * Security that allows INSERT only (see supabase/schema.sql). If the env vars
 * aren't set, these calls no-op so the app still runs (backend + Sheets handle
 * storage in that case).
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { CampaignLead } from '../types'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null

/** Insert a submission into the right table. Never throws. */
export async function saveSubmission(lead: CampaignLead): Promise<boolean> {
  if (!supabase) return false

  try {
    if (lead.kind === 'booking_confirmation') {
      const { error } = await supabase.from('bookings').insert({
        reference: lead.variables.reference,
        name: lead.name,
        phone: lead.phone,
        treatment: lead.variables.treatment,
        clinic: lead.variables.clinic,
        appointment_date: lead.variables.date,
        slot: lead.variables.slot,
        language: lead.language,
        consent: lead.consent,
        source: lead.source,
      })
      if (error) throw error
    } else {
      const { error } = await supabase.from('callbacks').insert({
        name: lead.name,
        phone: lead.phone,
        language: lead.language,
        consent: lead.consent,
        source: lead.source,
      })
      if (error) throw error
    }
    return true
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[supabase] save failed', err)
    return false
  }
}
