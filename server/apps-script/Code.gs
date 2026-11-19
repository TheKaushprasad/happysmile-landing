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

    var tab;
    if (d.outcome || d.status) tab = 'voice ai';
    else if (d.type === 'Booking') tab = 'booking';
    else tab = 'callback request';

    var sheet = ss.getSheetByName(tab) || ss.insertSheet(tab);

    // Value for every header name we might see (lowercased keys).
    var phone = d.mobile || d.phone || '';
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
