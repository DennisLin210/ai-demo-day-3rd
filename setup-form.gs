/**
 * 第三屆天來集團 AI Demo Day - 自動建立報名表單 & 簡報上傳資料夾
 *
 * 使用方式：
 * 1. 前往 https://script.google.com
 * 2. 建立新專案，貼上此程式碼
 * 3. 執行 main() 函式
 * 4. 首次執行需授權 Google Form + Drive 權限
 * 5. 執行完畢後，查看 Logger 取得表單編輯連結、回覆連結、Drive 資料夾連結
 */

function main() {
  var folder = createUploadFolder();
  var form = createRegistrationForm(folder);

  Logger.log('=== 建立完成 ===');
  Logger.log('表單編輯連結: ' + form.getEditUrl());
  Logger.log('表單填寫連結: ' + form.getPublishedUrl());
  Logger.log('簡報上傳資料夾: ' + folder.getUrl());
  Logger.log('');
  Logger.log('請將以下連結更新至 index.html:');
  Logger.log('  報名表單: ' + form.getPublishedUrl());
  Logger.log('  簡報上傳: ' + folder.getUrl());
}

/**
 * 建立簡報上傳用 Google Drive 資料夾
 */
function createUploadFolder() {
  var parentFolder = DriveApp.getRootFolder();
  var folder = parentFolder.createFolder('第三屆 AI Demo Day - 參賽者簡報上傳區');

  // 設定為「知道連結的人可以上傳」
  folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.EDIT);

  Logger.log('Drive 資料夾已建立: ' + folder.getUrl());
  return folder;
}

/**
 * 建立報名表單
 */
function createRegistrationForm(uploadFolder) {
  var form = FormApp.create('第三屆天來集團 AI Demo Day 報名表單');

  // 表單設定
  form.setDescription(
    '第三屆天來集團 AI Demo Day 報名表單\n\n' +
    '活動日期：115 年 3 月 24 日（一）09:30 - 12:30\n' +
    '活動地點：新竹市香山區 茄苳景觀大道 F park R101\n' +
    '報名截止：115 年 2 月 25 日（二）18:00\n\n' +
    '簡報上傳區：' + uploadFolder.getUrl() + '\n' +
    '檔名格式：公司_部門_主題名稱\n' +
    '上傳截止：115 年 3 月 17 日（一）18:00'
  );
  form.setConfirmationMessage(
    '報名成功！感謝您的參與。\n\n' +
    '請記得於 115 年 3 月 17 日 18:00 前上傳簡報至指定 Google Drive 資料夾。\n' +
    '簡報上傳區：' + uploadFolder.getUrl()
  );
  form.setLimitOneResponsePerUser(false);
  form.setAllowResponseEdits(true);

  // === Section 1: 聯絡人資訊 ===
  form.addSectionHeaderItem()
    .setTitle('聯絡人資訊')
    .setHelpText('請填寫主要聯絡人（隊長）資料');

  form.addTextItem()
    .setTitle('公司名稱')
    .setRequired(true);

  form.addTextItem()
    .setTitle('部門名稱')
    .setRequired(true);

  form.addTextItem()
    .setTitle('聯絡人姓名（隊長）')
    .setRequired(true);

  form.addTextItem()
    .setTitle('聯絡人 Email')
    .setRequired(true)
    .setValidation(FormApp.createTextValidation()
      .requireTextIsEmail()
      .build());

  form.addTextItem()
    .setTitle('聯絡人電話')
    .setRequired(true);

  // === Section 2: 參賽主題 ===
  form.addPageBreakItem()
    .setTitle('參賽主題資訊');

  form.addTextItem()
    .setTitle('主題名稱')
    .setHelpText('您的 AI 應用方案名稱')
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('主題簡介')
    .setHelpText('請簡述您的 AI 應用方案（100-300 字）')
    .setRequired(true);

  // === Section 3: 團隊資訊 ===
  form.addPageBreakItem()
    .setTitle('團隊資訊');

  form.addListItem()
    .setTitle('團隊人數（含隊長）')
    .setChoiceValues(['1 人', '2 人', '3 人', '4 人', '5 人', '6 人以上'])
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('團隊成員名單')
    .setHelpText('請列出所有成員姓名與部門（每行一位，格式：姓名 / 部門）\n不含隊長，若僅一人參賽可略過')
    .setRequired(false);

  // === Section 4: 備註 ===
  form.addPageBreakItem()
    .setTitle('其他');

  form.addParagraphTextItem()
    .setTitle('備註事項')
    .setHelpText('其他想讓主辦方知道的事項（選填）')
    .setRequired(false);

  Logger.log('報名表單已建立: ' + form.getPublishedUrl());
  return form;
}
