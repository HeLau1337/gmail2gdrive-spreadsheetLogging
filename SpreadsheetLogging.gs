
function getValuesOfSubjectComponents(subject, splitSubjectConfig) {
  var keywordsAndCols = splitSubjectConfig.keywords;
  var subjectComponents = subject.split(splitSubjectConfig.separator);
  var results = new Object();

  for(let keywordAndCol of keywordsAndCols) {
    var keyword = keywordAndCol.keyword;
    var column = keywordAndCol.column;
    var value = "";
    
    for (let item of subjectComponents) {
      var splitItem = item.split(keyword);
      if (splitItem != item) {
        value = splitItem[1].trim();
      }
    }
    
    results[keyword] = {"value": value, "column": column};
  }

  Logger.log(results);
  return results;
}

function getAllMailAttachmentInfo(message, file, originalFileName) {
  var config = getSpreadsheetLoggingConfig();
  var cols = config.columns;

  const MAIL_LINK_BASE = "https://mail.google.com/mail/u/0/#inbox/";
  var mailLink = MAIL_LINK_BASE + message.getId();

  const FILE_PREVIEW_LINK_BASE = "https://drive.google.com/open?id=";
  var fileLink = FILE_PREVIEW_LINK_BASE + file.getId();

  var results = {
    "messageId": {
      "value": message.getId(),
      "column": cols.messageId,
    },
    "mailInboxDate": {
      "value": message.getDate(),
      "column": cols.mailInboxDate,
    },
    "subject": {
      "value": message.getSubject(),
      "column": cols.subject,
    },
    "originalFileName": {
      "value": originalFileName,
      "column": cols.originalFileName,
    },
    "fileNameInDrive": {
      "value": file.getName(),
      "column": cols.fileNameInDrive,
    },
    "fileLink": {
      "value": fileLink,
      "column": cols.fileLink,
    },
    "mailLink": {
      "value": mailLink,
      "column": cols.mailLink,
    },
  };

  var splitSubjectConfig = cols.splitSubject;
  if (splitSubjectConfig.activated == true) {
    var subjectComponents = getValuesOfSubjectComponents(message.getSubject(), splitSubjectConfig);
    
    for (let [keyword, obj] of Object.entries(subjectComponents)) {
      results[keyword] = {
        "value": obj.value,
        "column": obj.column,
      };
    }
  }

  return results;
}

/* Pflegt Informationen zur Mail und dem/den Attachment(s) in ein Google Spreadsheet.
Das kann in Config.gs bei getSpreadsheetLoggingConfig() konfiguriert werden. */
function addRowToSpreadsheet(message, file, originalFileName) {
  var config = getSpreadsheetLoggingConfig();

  if (config.activateSpreadsheetLogging == true) {

    var ss = SpreadsheetApp.openById(config.spreadsheetId);
    var sheet = ss.getSheetByName(config.sheetName);

    var nextRow = sheet.getLastRow() + 1;
    var cols = config.columns;

    var allInfo = getAllMailAttachmentInfo(message, file, originalFileName);

    for (let [keyword, obj] of Object.entries(allInfo)) {
      var cell = sheet.getRange(nextRow, obj.column);
      if (keyword == "subject") {
        if (cols.splitSubject.activated) {
          continue;
        } 
      } else if (keyword == "mailLink") {
        cell.setFormula('=HYPERLINK("'+ obj.value +'"; "Open in Gmail")');
        continue;

      } else if (keyword == "fileLink") {
        cell.setFormula('=HYPERLINK("'+ obj.value +'"; "Open in GDrive")');
        continue;
      }
      cell.setValue(obj.value);
    }
  }
}
