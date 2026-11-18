/**
 * Business configuration. In production these come from env / CMS.
 * The WhatsApp and phone numbers are placeholders — swap them for the
 * real HappySmile business line before launch.
 */
export const BUSINESS = {
  brand: 'HappySmile',
  tagline: 'Dental Care, Reimagined',
  phoneDisplay: '+91 1800 123 4567',
  phoneDial: '+9118001234567',
  whatsappNumber: '911800123456', // configurable WhatsApp Business number
  email: 'hello@happysmile.example',
  clinicCount: 12,
}

export function whatsappLink(message: string): string {
  const base = `https://wa.me/${BUSINESS.whatsappNumber}`
  return `${base}?text=${encodeURIComponent(message)}`
}

/**
 * Languages the voice callback supports (Sarvam handles these natively).
 * Codes follow Sarvam's language tags.
 */
export const LANGUAGES: { code: string; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'kn', label: 'Kannada' },
  { code: 'te', label: 'Telugu' },
  { code: 'ta', label: 'Tamil' },
  { code: 'mr', label: 'Marathi' },
  { code: 'bn', label: 'Bengali' },
  { code: 'gu', label: 'Gujarati' },
  { code: 'ml', label: 'Malayalam' },
  { code: 'pa', label: 'Punjabi' },
]

/**
 * Sarvam outbound campaign settings. These are placeholders; your developer
 * sets the real campaign id and the backend endpoint the form posts leads to.
 * The browser never calls Sarvam directly — it posts to YOUR server, which
 * holds the Sarvam API key and forwards the lead to the campaign.
 */
export const CAMPAIGN = {
  // Your own backend route that ingests a lead and adds it to the Sarvam campaign.
  leadEndpoint: import.meta.env.VITE_LEAD_ENDPOINT ?? '',
  campaignId: import.meta.env.VITE_SARVAM_CAMPAIGN_ID ?? 'demo-campaign',
  // Sensible calling window (local clinic time). Enforced on the campaign too.
  callingHours: { startHour: 9, endHour: 19 },
}
