export const CONFIG = {
  port: Number(process.env.PORT ?? 3001),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  sarvam: {
    apiKey: process.env.SARVAM_API_KEY ?? '', // workspace API key (X-API-Key)
    baseUrl: process.env.SARVAM_BASE_URL ?? 'https://api.sarvam.ai',
    outboundsBaseUrl: process.env.SARVAM_OUTBOUNDS_URL ?? 'https://apps.sarvam.ai/api/outbounds',
    campaignId: process.env.SARVAM_CAMPAIGN_ID ?? '',
    // Instant-outbound identifiers (from the Sarvam console):
    orgId: process.env.SARVAM_ORG_ID ?? '',
    workspaceId: process.env.SARVAM_WORKSPACE_ID ?? '',
    appId: process.env.SARVAM_APP_ID ?? '', // the agent (app) id
    appVersion: Number(process.env.SARVAM_APP_VERSION ?? 1),
    connectionId: process.env.SARVAM_CONNECTION_ID ?? '', // telephony connection
    agentNumber: process.env.SARVAM_AGENT_NUMBER ?? '', // YOUR virtual number (caller id)
  },
  // Public URL Sarvam should POST call outcomes to, e.g.
  // https://api.happysmile.example/api/webhooks/sarvam
  publicWebhookUrl: process.env.PUBLIC_WEBHOOK_URL ?? '',
  sheets: {
    // Google Apps Script web-app URL that appends a row to the Bookings sheet.
    webhookUrl: process.env.SHEETS_WEBHOOK_URL ?? '',
    // The "Happy smile" spreadsheet (booking + callback request tabs).
    spreadsheetId: process.env.SHEETS_SPREADSHEET_ID ?? '1MM8PKNBrGa2fv4RS-Fu23-PQyIPBrFY5-foH3zI3CBU',
  },
  webhookSecret: process.env.WEBHOOK_SECRET ?? '',
  callingHours: { startHour: 9, endHour: 19 },
}

/** True only when every value needed to place a real call is set. */
export const CAN_PLACE_CALLS = Boolean(
  CONFIG.sarvam.apiKey &&
    CONFIG.sarvam.orgId &&
    CONFIG.sarvam.workspaceId &&
    CONFIG.sarvam.appId &&
    CONFIG.sarvam.connectionId &&
    CONFIG.sarvam.agentNumber,
)

/** DEMO mode = not fully configured, so we log calls instead of placing them. */
export const DEMO_MODE = !CAN_PLACE_CALLS
