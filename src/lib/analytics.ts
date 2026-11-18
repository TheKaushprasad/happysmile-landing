/**
 * Lightweight analytics layer.
 *
 * Every tracked interaction is pushed to `window.dataLayer` (GTM-compatible)
 * and mirrored to the console so the funnel is observable during the demo.
 * Swapping this file for a real GA4 / Segment / Amplitude call is all that is
 * needed to wire conversion tracking to production.
 */

export type AnalyticsEvent =
  | 'landing_page_viewed'
  | 'treatment_selected'
  | 'clinic_selected'
  | 'appointment_date_selected'
  | 'appointment_slot_selected'
  | 'booking_form_started'
  | 'booking_form_submitted'
  | 'booking_completed'
  | 'booking_failed'
  | 'callback_requested'
  | 'lead_submitted'

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

export function track(event: AnalyticsEvent, payload: Record<string, unknown> = {}): void {
  const entry = { event, ...payload, ts: new Date().toISOString() }
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer ?? []
    window.dataLayer.push(entry)
  }
  // eslint-disable-next-line no-console
  console.info(`[analytics] ${event}`, payload)
}
