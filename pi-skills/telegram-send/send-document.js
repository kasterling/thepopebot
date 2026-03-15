#!/usr/bin/env node
// Send a file as a Telegram document via sendDocument API
// Usage: node send-document.js <filepath> [caption]
// Requires: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID env vars

const https = require('https');
const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];
const caption = process.argv[3] || '';

if (!filePath) {
  console.error('Usage: send-document.js <filepath> [caption]');
  process.exit(1);
}

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

if (!token || !chatId) {
  console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  console.error('File not found:', filePath);
  process.exit(1);
}

const fileContent = fs.readFileSync(filePath);
const fileName = path.basename(filePath);
const boundary = '----FormBoundary' + Math.random().toString(36).slice(2);

const parts = [];

// chat_id field
parts.push(
  `--${boundary}\r\n` +
  `Content-Disposition: form-data; name="chat_id"\r\n\r\n` +
  `${chatId}`
);

// caption field (if provided)
if (caption) {
  parts.push(
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="caption"\r\n\r\n` +
    `${caption}`
  );
}

// document field
const fileHeader =
  `--${boundary}\r\n` +
  `Content-Disposition: form-data; name="document"; filename="${fileName}"\r\n` +
  `Content-Type: application/octet-stream\r\n\r\n`;

const closing = `\r\n--${boundary}--\r\n`;

const headerBuf = Buffer.from(parts.join('\r\n') + '\r\n' + fileHeader);
const closingBuf = Buffer.from(closing);
const body = Buffer.concat([headerBuf, fileContent, closingBuf]);

const options = {
  hostname: 'api.telegram.org',
  path: `/bot${token}/sendDocument`,
  method: 'POST',
  headers: {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': body.length,
  },
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const parsed = JSON.parse(data);
    if (parsed.ok) {
      console.log('Sent:', fileName);
    } else {
      console.error('Telegram error:', parsed.description);
      process.exit(1);
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
  process.exit(1);
});

req.write(body);
req.end();
