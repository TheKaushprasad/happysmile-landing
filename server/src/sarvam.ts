// Thin Sarvam client. The API key lives here (server-side only). In DEMO mode
// (no key) it logs what it would do instead of calling Sarvam.
//
// NOTE: adjust the endpoint/path and body to match Sarvam's current Campaigns
// API for your account — this is the single place to change it.

import { CONFIG, DEMO_MODE } from './config.js'
import type { CampaignLead } from './types.js'

// Our language codes -> Sarvam's initial_language_name enum.
const LANGUAGE_ENUM: Record<string, string> = {
  en: 'English',
  hi: 'Hindi',
  kn: 'Kannada',
  te: 'Telugu',
  ta: 'Tamil',
  mr: 'Marathi',
  bn: 'Bengali',
  gu: 'Gujarati',
  ml: 'Malayalam',
  pa: 'Punjabi',
}

/**
 * Place a single immediate outbound call: the agent rings the end user from
 * YOUR virtual number. This is what fires when someone requests a callback.
 *
 * POST {outboundsBaseUrl}/v1/orgs/{org}/workspaces/{ws}/outbounds
 */
export async function placeOutboundCall(
  lead: CampaignLead,
  webhookUrl?: string,
): Promise<{ ok: boolean; mode: 'demo' | 'live'; attemptId?: string; detail?: string }> {
  if (DEMO_MODE) {
    console.info('[sarvam:demo] would call end user now', {
      to: lead.phone,
      from: CONFIG.sarvam.agentNumber || '(virtual number not set)',
      language: lead.language,
      kind: lead.kind,
    })
    return { ok: true, mode: 'demo' }
  }

  const s = CONFIG.sarvam
  const url = `${s.outboundsBaseUrl}/v1/orgs/${s.orgId}/workspaces/${s.workspaceId}/outbounds`
  const body = {
    app_config: {
      app_id: s.appId,
      app_version: s.appVersion,
      connection_config: {
        connection_id: s.connectionId,
        agent_phone_number: s.agentNumber, // your virtual number = caller id
      },
      agent_variables: {
        name: lead.name,
        kind: lead.kind,
        ...lead.variables,
      },
      app_overrides: {
        initial_language_name: LANGUAGE_ENUM[lead.language] ?? 'English',
      },
    },
    user_config: { user_phone_number: lead.phone }, // the person to call
    ...(webhookUrl ? { webhook_config: { url: webhookUrl } } : {}),
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'X-API-Key': s.apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      return { ok: false, mode: 'live', detail: `${res.status} ${detail}`.trim() }
    }
    const data = (await res.json().catch(() => ({}))) as { attempt_id?: string }
    return { ok: true, mode: 'live', attemptId: data.attempt_id }
  } catch (err) {
    return { ok: false, mode: 'live', detail: String(err) }
  }
}

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
