export const CONFIG = {
  port: Number(process.env.PORT ?? 3001),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  sarvam: {
    apiKey: process.env.SARVAM_API_KEY ?? '',
    baseUrl: process.env.SARVAM_BASE_URL ?? 'https://api.sarvam.ai',
    campaignId: process.env.SARVAM_CAMPAIGN_ID ?? '',
  },
  webhookSecret: process.env.WEBHOOK_SECRET ?? '',
  callingHours: { startHour: 9, endHour: 19 },
}

/** DEMO mode = no Sarvam key, so we never place real calls; we just log. */
export const DEMO_MODE = !CONFIG.sarvam.apiKey
