Full pipeline test: brave-search → vault → Telegram.

1. Check Brave API key is available:
```bash
echo "BRAVE_API_KEY length: ${#BRAVE_API_KEY}"
```

2. Search for something simple:
```bash
node /job/.pi/skills/brave-search/search.js "GBP/JPY forex outlook today" -n 3
```

3. Write a small test note to vault:
```bash
mkdir -p /job/vault/knowledge
cat > /job/vault/knowledge/2026-03-09-brave-search-test.md << 'EOF'
---
title: Brave Search Pipeline Test
date: 2026-03-09
tags: [test, brave-search]
source_type: web
---
# Pipeline Test

Brave Search is working from inside the Pi agent container.
EOF
echo "Vault file written."
```

4. Send Telegram notification using Node.js:
```bash
node -e "
const https = require('https');
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
const text = '✅ *Full pipeline test complete!*\n\nBrave Search + vault + Telegram all working from Pi agent.\n\nFile saved: vault/knowledge/2026-03-09-brave-search-test.md';
const body = JSON.stringify({ chat_id: chatId, text: text, parse_mode: 'Markdown' });
const req = https.request({ hostname: 'api.telegram.org', path: '/bot' + token + '/sendMessage', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, res => { let d=''; res.on('data', c => d+=c); res.on('end', () => console.log(d)); });
req.on('error', e => console.error(e));
req.write(body);
req.end();
"
```

Report all outputs.
