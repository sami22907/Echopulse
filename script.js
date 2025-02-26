/**
 * Handles form submissions (POST) for ticket registration.
 * Writes the registration data to a Google Sheet, generates a serial number,
 * and sends a confirmation email.
 */
function doPost(e) {
  try {
    // For a bound script, use getActiveSpreadsheet(); otherwise, use openById('YOUR_SPREADSHEET_ID')
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = e.parameter;
    
    // Generate a unique 8-character serial number
    var serial = Utilities.getUuid().slice(0, 8).toUpperCase();
    
    var newRow = [
      new Date(),
      data.name,
      data.email,
      data.phone,
      serial
    ];
    
    sheet.appendRow(newRow);
    
    // Construct the confirmation email body
    var emailBody = `
      <h1>ROCK ON CHITTAGONG 2025</h1>
      <p>Your registration is confirmed!</p>
      <p>Serial Number: <strong>${serial}</strong></p>
      <p>Please show this serial number at the entrance.</p>
    `;
    
    // Send confirmation email. If needed, uncomment and replace the "from" field.
    GmailApp.sendEmail(
      data.email,
      "Ticket Confirmation - Rock On Chittagong 2025",
      "Your registration is confirmed! Please view this email in HTML mode.",
      {
        htmlBody: emailBody
        //,from: 'YOUR_EMAIL@example.com'
      }
    );
    
    return ContentService
      .createTextOutput(JSON.stringify({status: 'success', serial: serial}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({status: 'error', message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handles ticket verification (GET) requests.
 * Checks the Google Sheet for the provided serial number and returns ticket details.
 */
function doGet(e) {
  var serial = e.parameter.serial;
  if (!serial) {
    return ContentService
      .createTextOutput(JSON.stringify({status: 'error', message: 'Serial number is required.'}))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // For a bound script, use getActiveSpreadsheet(); otherwise, use openById('YOUR_SPREADSHEET_ID')
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  
  // Assuming the first row is headers; start from row 2
  for (var i = 1; i < data.length; i++) {
    if (data[i][4] === serial) {
      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'valid',
          name: data[i][1],
          email: data[i][2]
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({status: 'invalid'}))
    .setMimeType(ContentService.MimeType.JSON);
}
