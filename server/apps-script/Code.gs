/**
 * HappySmile — Google Sheets intake (spreadsheet: "Happy smile").
 *
 * One web app for everything. Deploy once and use the SAME URL for:
 *   - the website backend  (server/.env -> SHEETS_WEBHOOK_URL)
 *   - the Sarvam call-completion webhook
 *
 * Routing by payload:
 *   - a call outcome (has "outcome" or "status")  -> "voice ai" tab
 *   - a booking submission (type = "Booking")      -> "booking" tab
 *   - a callback request                           -> "callback request" tab
 *
 * Deploy: Extensions -> Apps Script -> paste -> Deploy -> New deployment ->
 * Web app (Execute as: Me, Who has access: Anyone) -> copy the URL.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var d = JSON.parse(e.postData.contents);

    // 1) Voice-agent call outcome -> "voice ai" tab
    if (d.outcome || d.status) {
      appendTo(ss, 'voice ai', [
        new Date(),
        d.name || '',
        d.phone || d.mobile || '',
        d.clinic || '',
        d.treatment || '',
        d.date || '',
        d.slot || '',
        d.outcome || d.status || '',
        d.notes || ''
      ]);
      return ok('voice ai');
    }

    // 2) Website form submission -> "booking" or "callback request" tab
    var tab = d.type === 'Booking' ? 'booking' : 'callback request';
    appendTo(ss, tab, [
      d.timestamp || new Date().toISOString(),
      d.type || '',
      d.reference || '',
      d.name || '',
      d.mobile || d.phone || '',
      d.treatment || '',
      d.clinic || '',
      d.date || '',
      d.slot || '',
      d.language || '',
      d.consent || '',
      d.source || ''
    ]);
    return ok(tab);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function appendTo(ss, name, row) {
  var sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  sheet.appendRow(row);
}

function ok(tab) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, tab: tab }))
    .setMimeType(ContentService.MimeType.JSON);
}
