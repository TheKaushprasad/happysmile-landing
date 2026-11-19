/**
 * HappySmile — Google Sheets intake (sheet: "Happy smile").
 *
 * Paste this into that spreadsheet:
 *   Extensions → Apps Script → paste → Deploy → New deployment →
 *   Web app → Execute as: Me, Who has access: Anyone → Deploy → copy the URL.
 *
 * Put that URL in server/.env as SHEETS_WEBHOOK_URL. The backend POSTs one JSON
 * object per submission; bookings go to the "booking" tab and callback requests
 * to the "callback request" tab.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000); // avoid races when two submissions arrive together
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var d = JSON.parse(e.postData.contents);
    var tabName = d.type === 'Booking' ? 'booking' : 'callback request';
    var sheet = ss.getSheetByName(tabName) || ss.insertSheet(tabName);
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
      .createTextOutput(JSON.stringify({ ok: true, tab: tabName }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
