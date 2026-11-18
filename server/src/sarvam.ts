// Thin Sarvam client. The API key lives here (server-side only). In DEMO mode
// (no key) it logs what it would do instead of calling Sarvam.
//
// NOTE: adjust the endpoint/path and body to match Sarvam's current Campaigns
// API for your account — this is the single place to change it.

import { CONFIG, DEMO_MODE } from './config.js'
import type { CampaignLead } from './types.js'

export async function addLeadToCampaign(
  campaignId: string,
  lead: CampaignLead,
): Promise<{ ok: boolean; mode: 'demo' | 'live'; detail?: string }> {
  if (DEMO_MODE) {
    console.info('[sarvam:demo] would add lead to campaign', campaignId, {
      name: lead.name,
      phone: lead.phone,
      language: lead.language,
      kind: lead.kind,
    })
    return { ok: true, mode: 'demo' }
  }

  try {
    const res = await fetch(
      `${CONFIG.sarvam.baseUrl}/v1/campaigns/${campaignId}/leads`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${CONFIG.sarvam.apiKey}`,
        },
        body: JSON.stringify({
          phone: lead.phone,
          language: lead.language,
          variables: {
            name: lead.name,
            kind: lead.kind,
            ...lead.variables,
          },
        }),
      },
    )
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      return { ok: false, mode: 'live', detail: `${res.status} ${detail}`.trim() }
    }
    return { ok: true, mode: 'live' }
  } catch (err) {
    return { ok: false, mode: 'live', detail: String(err) }
  }
}
