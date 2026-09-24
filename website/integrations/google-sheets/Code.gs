/**
 * School Connect — order inbox for Google Sheets.
 *
 * Receives each sign-up/order from the website, appends it as a row in the
 * spreadsheet this script is attached to, and emails you a notification.
 * Setup steps: see README.md in this folder.
 */

// Who gets an email for every new order. Leave empty to use the account that
// deployed the script.
var NOTIFY_EMAIL = '';

var SHEET_NAME = 'Orders';

var HEADERS = [
  'Received at',
  'Reference',
  'Status',
  'Plan',
  'Billing',
  'Amount',
  'Currency',
  'Payment method',
  'School',
  'Contact',
  'Role',
  'Email',
  'Phone',
  'City',
  'Country',
  'Students',
  'Message',
];

var PLANS = ['free', 'basic', 'enterprise'];
var MAX_FIELD_LENGTH = 2000;

function doPost(e) {
  try {
    var order = parseOrder(e);
    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      appendOrder(order);
    } finally {
      lock.releaseLock();
    }
    notify(order);
    return json({ ok: true, reference: order.reference });
  } catch (err) {
    return json({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

/** Lets you open the web app URL in a browser to check it's deployed. */
function doGet() {
  return json({ ok: true, service: 'School Connect order inbox' });
}

function parseOrder(e) {
  if (!e || !e.postData || !e.postData.contents) throw new Error('Empty request');
  var data = JSON.parse(e.postData.contents);
  var school = data.school || {};

  if (PLANS.indexOf(data.planId) === -1) throw new Error('Unknown plan');
  if (!/^SC-\d{6}-[A-Z0-9]{4}$/.test(String(data.reference))) throw new Error('Bad reference');
  if (!school.schoolName || !school.contactName || !school.email) throw new Error('Missing school details');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(school.email))) throw new Error('Bad email');

  return {
    reference: clean(data.reference),
    planId: clean(data.planId),
    billing: clean(data.billing),
    amount: Number(data.amount) || 0,
    currency: clean(data.currency),
    paymentMethod: clean(data.paymentMethod),
    school: {
      schoolName: clean(school.schoolName),
      contactName: clean(school.contactName),
      role: clean(school.role),
      email: clean(school.email),
      phone: clean(school.phone),
      city: clean(school.city),
      country: clean(school.country),
      students: clean(school.students),
      message: clean(school.message),
    },
  };
}

function appendOrder(order) {
  var sheet = getSheet();
  var status = order.planId === 'enterprise' ? 'New lead' : order.amount > 0 ? 'Awaiting payment' : 'New sign-up';
  var s = order.school;
  sheet.appendRow([
    new Date(),
    order.reference,
    status,
    order.planId,
    order.amount > 0 ? order.billing : '',
    order.amount,
    order.currency,
    order.amount > 0 ? order.paymentMethod : '',
    s.schoolName,
    s.contactName,
    s.role,
    s.email,
    s.phone,
    s.city,
    s.country,
    s.students,
    s.message,
  ]);
}

function getSheet() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function notify(order) {
  var to = NOTIFY_EMAIL || Session.getEffectiveUser().getEmail();
  if (!to) return;
  var s = order.school;
  var kind = order.planId === 'enterprise' ? 'Enterprise enquiry' : order.amount > 0 ? 'New order' : 'Free sign-up';
  var lines = [
    kind + ' from ' + s.schoolName,
    '',
    'Reference: ' + order.reference,
    'Plan: ' + order.planId + (order.amount > 0 ? ' (' + order.billing + ')' : ''),
    order.amount > 0 ? 'Amount due: ' + order.amount + ' ' + order.currency : '',
    '',
    'Contact: ' + s.contactName + (s.role ? ' (' + s.role + ')' : ''),
    'Email: ' + s.email,
    'Phone: ' + s.phone,
    'Location: ' + [s.city, s.country].filter(String).join(', '),
    'Students: ' + s.students,
    s.message ? '\n' + s.message : '',
    '',
    'Spreadsheet: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl(),
  ];
  MailApp.sendEmail({
    to: to,
    replyTo: s.email,
    subject: '[School Connect] ' + kind + ' – ' + s.schoolName + ' – ' + order.reference,
    body: lines.join('\n'),
  });
}

function clean(value) {
  var text = value === undefined || value === null ? '' : String(value);
  text = text.slice(0, MAX_FIELD_LENGTH);
  // Stop spreadsheet formula injection (values starting with =, +, - or @).
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function json(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
