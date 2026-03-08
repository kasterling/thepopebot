Test Telegram using Node.js (no bash curl).

1. First, test via simple bash GET URL (to check if TELEGRAM_BOT_TOKEN is in bash env):
```bash
curl -sk "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe" | head -c 100
```

2. Then send via Node.js one-liner:
```bash
node -e "
const https = require('https');
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
const text = 'Agent test: Node.js Telegram works!';
const body = JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' });
const req = https.request({ hostname: 'api.telegram.org', path: '/bot' + token + '/sendMessage', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, res => { let d=''; res.on('data', c => d+=c); res.on('end', () => console.log(d)); });
req.on('error', e => console.error(e.message));
req.write(body);
req.end();
"
```

3. Report the exact output from both steps.
