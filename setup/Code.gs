/**
 * PP projekt s.r.o. — Google Apps Script Backend
 * Nasadit jako: Nasadit > Nové nasazení > Webová aplikace
 *   Spustit jako: Já
 *   Přístup: Kdokoli
 *
 * Každý "sheet" je pojmenovaný list ve spreadsheetu.
 * Data se ukládají serializovaná jako JSON do buňky A1.
 * Listy: config | projects | workers | finance | tasks_<projectId>
 */

const ALLOWED_SHEETS = /^(config|projects|workers|finance|tasks_.+)$/;

/* ─────────────────────────────────────────────
   CORS HEADERS
───────────────────────────────────────────── */
function setCorsHeaders(output) {
  return output
    .setMimeType(ContentService.MimeType.JSON)
    .addHeader('Access-Control-Allow-Origin', '*')
    .addHeader('Access-Control-Allow-Methods', 'GET,POST')
    .addHeader('Access-Control-Allow-Headers', 'Content-Type');
}

/* ─────────────────────────────────────────────
   doGet — čtení dat
   URL: ?action=read&sheet=projects
───────────────────────────────────────────── */
function doGet(e) {
  try {
    const action = (e.parameter.action || '').toLowerCase();
    const sheet  = (e.parameter.sheet  || '').toLowerCase();

    if (action === 'read') {
      if (!ALLOWED_SHEETS.test(sheet)) throw new Error('Nepovolený list: ' + sheet);
      const data = readSheet(sheet);
      return setCorsHeaders(
        ContentService.createTextOutput(JSON.stringify({ ok: true, data }))
      );
    }

    // Ping / health check
    if (!action || action === 'ping') {
      return setCorsHeaders(
        ContentService.createTextOutput(JSON.stringify({ ok: true, msg: 'PP projekt API běží' }))
      );
    }

    throw new Error('Neznámá akce: ' + action);

  } catch (err) {
    return setCorsHeaders(
      ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.message }))
    );
  }
}

/* ─────────────────────────────────────────────
   doPost — zápis dat
   Body: { action: "write", sheet: "projects", data: [...] }
───────────────────────────────────────────── */
function doPost(e) {
  try {
    const body   = JSON.parse(e.postData.contents);
    const action = (body.action || '').toLowerCase();
    const sheet  = (body.sheet  || '').toLowerCase();

    if (action === 'write') {
      if (!ALLOWED_SHEETS.test(sheet)) throw new Error('Nepovolený list: ' + sheet);
      writeSheet(sheet, body.data);
      return setCorsHeaders(
        ContentService.createTextOutput(JSON.stringify({ ok: true }))
      );
    }

    throw new Error('Neznámá akce: ' + action);

  } catch (err) {
    return setCorsHeaders(
      ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.message }))
    );
  }
}

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */

/**
 * Přečte JSON z buňky A1 pojmenovaného listu.
 * Pokud list neexistuje, vrátí null.
 */
function readSheet(sheetName) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return null;
  const val = sheet.getRange('A1').getValue();
  if (!val) return null;
  try { return JSON.parse(val); }
  catch (_) { return null; }
}

/**
 * Zapíše JSON do buňky A1 pojmenovaného listu.
 * List vytvoří, pokud neexistuje.
 */
function writeSheet(sheetName, data) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let   sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  sheet.getRange('A1').setValue(JSON.stringify(data));
}
