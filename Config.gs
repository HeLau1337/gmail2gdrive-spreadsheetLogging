/**
 * Configuration for Gmail2GDrive
 * See https://github.com/ahochsteger/gmail2gdrive/blob/master/README.md for a config reference
 */
function getGmail2GDriveConfig() {
  return {
    // Global filter
    "globalFilter": "-in:trash -in:drafts -in:spam",
    // Gmail label for processed threads (will be created, if not existing):
    "processedLabel": "to-gdrive/processed",
    // Sleep time in milli seconds between processed messages:
    "sleepTime": 100,
    // Maximum script runtime in seconds (google scripts will be killed after 5 minutes):
    "maxRuntime": 280,
    // Only process message newer than (leave empty for no restriction; use d, m and y for day, month and year):
    "newerThan": "1m",
    // Timezone for date/time operations:
    "timezone": "GMT",
    // Processing rules:
    "rules": [
      { // Store all attachments from example1@example.com to the folder "My-mail-attachments/example1/invoices" 
        // while renaming all attachments to the pattern defined in 'filenameTo' 
        // (which is dependent on the keywords within "filenameBasedOnKeywords")
        // and archive the thread.
        "filter": "has:attachment from:example1@example.com to:my.name+2drive@gmail.com",
        "folder": "'My-mail-attachments/example1/invoices'",
        "filenameTo": "'invoice_%s'", // insert 'yyyy-MM-dd' (including single quotation marks!) to add today's date to the filename.
        "archive": true,
        
        // Hier kann man bestimmen, womit '%s' oben bei "filenameTo" ersetzt werden soll.
        // Auswahlmöglichkeiten: 
        //     Alle Standard-Spalten, die in der SpreadsheetConfig unter "columns" stehen. Bsp.: "id", "mailInboxDate", ..., "subject".
        //     + alle keywords, die in der SpreadsheetConfig unter columns.splitSubject.keywords stehen. Bsp.: "Company:", "Invoice-No.:", ...
        "filenameBasedOnKeywords": [
          // Reihenfolge hier = Reihenfolge im Dateinamen
          "Date:",
          "Invoice-No.:",
        ],
      },
      
      // For more examples of customized rules, see https://github.com/ahochsteger/gmail2gdrive/blob/master/README.md
    ]
  };
}


/**
 * Konfiguration für das Logging der Attachments in einem Google Spreadsheet
 */
function getSpreadsheetLoggingConfig() {
  return {
    // Zum An-/Ausschalten des Spreadsheet-Loggings (an = true, aus = false)
    "activateSpreadsheetLogging": true, 

    // Die ID des Google Spreadsheets (kann man aus der URL entnehmen, wenn man das Spreadsheet geöffnet hat).
    "spreadsheetId": "8ZW8JZnI2cHicfMYNSkA8ZHcKAuAskn4XInIOONFQqBA",

    // Der Name des Tabellenblatts, auf dem die Zeilen eingefügt werden sollen.
    "sheetName": "Mail Attachments",

    // Der Spaltenindex für die Spalte, wo die jeweilige Information eingetragen wird. Spalte A wäre hier 1, B=2, C=3, ...
    // Die neuen Einträge werden immer in die nächste freie Zeile in der angegebenen Spalte eingetragen.
    "columns": {
      "messageId": 1,
      "mailInboxDate": 2, // Datum, an dem die Mail empfangen wurde
      "originalFileName": 3,
      "fileNameInDrive": 4,
      "mailLink": 5, // direkter Link zur Mail in Gmail
      "subject": 6, // Wird ignoriert, wenn unten splitSubject.activated == true ist

      "splitSubject": {
        "activated": true,
        "separator": ";",
        "keywords": [
          {
            "keyword": "Company:",
            "column": 6,
          },
          {
            "keyword": "Date:", // invoice date (mentioned in subject, marked with keyword "Date:")
            "column": 7,
          },
          {
            "keyword": "Category:",
            "column": 8,
          },
          {
            "keyword": "Invoice-No.:",
            "column": 9,
          },
        ],
      },
    },
  };
}
