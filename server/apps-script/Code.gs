/**
 * HappySmile — Google Sheets intake (spreadsheet: "Happy smile").
 *
 * One web app for everything. Deploy once and use the SAME URL for:
 *   - the website backend  (server/.env -> SHEETS_WEBHOOK_URL)
 *   - the Sarvam call-completion webhook
 *
 * Routing by payload:
 *   - a call outcome (has "outcome"/"status")  -> "voice ai" tab
 *   - a booking submission (type = "Booking")   -> "booking" tab
 *   - a callback request                        -> "callback request" tab
 *
 * HEADER-DRIVEN: each row is built from the destination tab's OWN header row,
 * matching header names (case-insensitive) to incoming fields. So you can add,
 * remove or reorder columns on any tab by editing its headers — no redeploy
 * needed. A header with no matching field is left blank.
 *
 * Deploy: Extensions -> Apps Script -> paste -> Deploy -> New deployment ->
 * Web app (Execute as: Me, Who has access: Anyone) -> copy the URL. To update
 * later: Deploy -> Manage deployments -> edit -> Version: New version -> Deploy
 * (the URL stays the same).
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var d = JSON.parse(e.postData.contents);

    // Flatten nested variable bags — a call-outcome webhook may nest the fields
    // the agent collected under variables / agent_variables / metadata.
    ['variables', 'agent_variables', 'metadata'].forEach(function (k) {
      if (d[k] && typeof d[k] === 'object') {
        for (var f in d[k]) if (!(f in d)) d[f] = d[k][f];
      }
    });

    var tab;
    if (d.outcome || d.status) tab = 'voice ai';
    else if (d.type === 'Booking') tab = 'booking';
    else tab = 'callback request';

    var sheet = ss.getSheetByName(tab) || ss.insertSheet(tab);

    // Value for every header name we might see (lowercased keys).
    var phone = d.mobile || d.phone || d.phone_number || '';
    var values = {
      'timestamp': d.timestamp || new Date().toISOString(),
      'date & time': d.timestamp || new Date().toISOString(),
      'type': d.type || '',
      'reference': d.reference || '',
      'ref': d.reference || '',
      'name': d.name || '',
      'phone': phone,
      'mobile': phone,
      'phone number': phone,
      'treatment': d.treatment || '',
      'clinic': d.clinic || '',
      'date': d.date || '',
      'preferred date': d.date || '',
      'slot': d.slot || '',
      'time': d.slot || '',
      'language': d.language || '',
      'preferred language': d.language || '',
      'consent': d.consent || '',
      'source': d.source || '',
      'outcome': d.outcome || d.status || '',
      'status': d.outcome || d.status || '',
      'notes': d.notes || ''
    };

    var lastCol = Math.max(1, sheet.getLastColumn());
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    var row = headers.map(function (h) {
      var key = String(h).trim().toLowerCase();
      return Object.prototype.hasOwnProperty.call(values, key) ? values[key] : '';
    });
    sheet.appendRow(row);

    // A new callback request → have the AI voice agent call this person now.
    if (tab === 'callback request') placeSarvamCall(d);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, tab: tab }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Place an outbound call via Sarvam's instant-outbound API so the AI voice agent
 * rings the person who just requested a callback. Credentials come from Script
 * Properties (Project Settings → Script properties). If they're not set this is
 * a no-op, so the sheet keeps working while you finish the Sarvam setup.
 *
 * Required Script properties:
 *   SARVAM_API_KEY        your workspace API key (X-API-Key)
 *   SARVAM_ORG_ID         org id
 *   SARVAM_WORKSPACE_ID   workspace id
 *   SARVAM_APP_ID         the agent id (e.g. Conversatio-eee27e9e-d31f)
 *   SARVAM_CONNECTION_ID  telephony connection id
 *   SARVAM_AGENT_NUMBER   your Sarvam virtual number (caller id)
 * Optional:
 *   SARVAM_APP_VERSION    default 1
 *   SELF_WEBHOOK_URL      this web app's /exec URL (where Sarvam posts the call
 *                         outcome, which this same script routes to "voice ai")
 */
var SARVAM_LANG = {
  en: 'English', hi: 'Hindi', kn: 'Kannada', te: 'Telugu', ta: 'Tamil',
  mr: 'Marathi', bn: 'Bengali', gu: 'Gujarati', ml: 'Malayalam', pa: 'Punjabi'
};

function placeSarvamCall(d) {
  var p = PropertiesService.getScriptProperties();
  var apiKey = p.getProperty('SARVAM_API_KEY');
  var orgId = p.getProperty('SARVAM_ORG_ID');
  var wsId = p.getProperty('SARVAM_WORKSPACE_ID');
  var appId = p.getProperty('SARVAM_APP_ID');
  var connectionId = p.getProperty('SARVAM_CONNECTION_ID');
  var agentNumber = p.getProperty('SARVAM_AGENT_NUMBER');
  if (!apiKey || !orgId || !wsId || !appId || !connectionId || !agentNumber) return;

  var phone = d.mobile || d.phone || '';
  if (!phone) return;
  var appVersion = Number(p.getProperty('SARVAM_APP_VERSION') || '5');
  var webhookUrl = p.getProperty('SELF_WEBHOOK_URL') || ScriptApp.getService().getUrl();

  var body = {
    app_config: {
      app_id: appId,
      app_version: appVersion,
      connection_config: { connection_id: connectionId, agent_phone_number: agentNumber },
      agent_variables: {
        name: d.name || '',
        user_name: d.name || '',
        phone_number: phone,
        kind: 'callback'
      },
      app_overrides: { initial_language_name: SARVAM_LANG[d.language] || 'English' }
    },
    user_config: { user_phone_number: phone }
  };
  if (webhookUrl) body.webhook_config = { url: webhookUrl };

  try {
    var resp = UrlFetchApp.fetch(
      'https://apps.sarvam.ai/api/outbounds/v1/orgs/' + orgId + '/workspaces/' + wsId + '/outbounds',
      {
        method: 'post',
        contentType: 'application/json',
        headers: { 'X-API-Key': apiKey },
        payload: JSON.stringify(body),
        muteHttpExceptions: true
      }
    );
    // Visible in Apps Script → Executions. 200/201 = call placed.
    // 401/403 = API key/permission issue. 404 = instant-outbound not enabled on
    // your plan (use the campaign path, or ask Sarvam to enable the REST API).
    console.log('Sarvam outbound: ' + resp.getResponseCode() + ' ' + resp.getContentText());
  } catch (err) {
    console.log('Sarvam outbound error: ' + err);
  }
}
