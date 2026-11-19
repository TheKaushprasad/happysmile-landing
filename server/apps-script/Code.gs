/**
 * HappySmile Bookings — Google Sheets intake.
 *
 * Paste this into the "HappySmile Bookings" sheet:
 *   Extensions → Apps Script → paste → Deploy → New deployment →
 *   Web app → Execute as: Me, Who has access: Anyone → Deploy → copy the URL.
 *
 * Put that URL in server/.env as SHEETS_WEBHOOK_URL. The backend POSTs one JSON
 * object per booking/callback; this appends it as a row under the headers.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000); // avoid races when two submissions arrive together
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
    var d = JSON.parse(e.postData.contents);
    sheet.appendRow([
      d.timestamp || new Date().toISOString(),
      d.type || '',
      d.reference || '',
      d.name || '',
      d.mobile || '',
      d.treatment || '',
      d.clinic || '',
      d.date || '',
      d.slot || '',
      d.language || '',
      d.consent || '',
      d.source || ''
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
