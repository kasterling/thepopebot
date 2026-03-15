#!/usr/bin/env node
// Send a text message to Telegram via sendMessage API
// Usage: node send-message.js "message text"
// Requires: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID env vars

const https = require('https');

const text = process.argv[2];

if (!text) {
  console.error('Usage: send-message.js "message text"');
  process.exit(1);
}

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

if (!token || !chatId) {
  console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
  process.exit(1);
}

const body = JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' });

const options = {
  hostname: 'api.telegram.org',
  path: `/bot${token}/sendMessage`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
  },
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const parsed = JSON.parse(data);
    if (parsed.ok) {
      console.log('Message sent, id:', parsed.result.message_id);
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
