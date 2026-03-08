Test Telegram sendMessage using Node.js (proper env var handling).

Step 1: Show env vars:
```bash
echo "TOKEN_LEN=${#TELEGRAM_BOT_TOKEN}"
echo "CHAT_ID=${TELEGRAM_CHAT_ID}"
```

Step 2: Send via Node.js (exact AGENT.md pattern):
```bash
node -e "
const https = require('https');
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
console.log('token_len:', token ? token.length : 'MISSING');
console.log('chat_id:', chatId || 'MISSING');
const text = 'Test from Pi agent - Node.js direct';
const body = JSON.stringify({ chat_id: chatId, text: text, parse_mode: 'Markdown' });
const req = https.request({ hostname: 'api.telegram.org', path: '/bot' + token + '/sendMessage', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, res => { let d=''; res.on('data', c => d+=c); res.on('end', () => { console.log('RESPONSE:', d); }); });
req.on('error', e => console.error('ERROR:', e.message));
req.write(body);
req.end();
"
```

Step 3: Also try curl with proper double-quote escaping:
```bash
curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -H "Content-Type: application/json" \
  -d "{\"chat_id\": \"${TELEGRAM_CHAT_ID}\", \"text\": \"Test curl with double quotes\"}"
```

Report ALL outputs verbatim.
