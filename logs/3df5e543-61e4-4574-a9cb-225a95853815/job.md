Generate the Sterling Intelligence Briefing for today's morning session.

## Step 1: Fetch live forex rates via Alpha Vantage (sleep 2s between calls to respect free tier limit)

Run each curl separately with a sleep in between:

```bash
curl -s "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=GBP&to_currency=JPY&apikey=${ALPHA_VANTAGE_API_KEY}" | node -e "const d=require('fs').readFileSync('/dev/stdin','utf8'); const j=JSON.parse(d); const r=j['Realtime Currency Exchange Rate']; if(r) console.log('GBP/JPY:', r['5. Exchange Rate']); else console.log('RATE_LIMITED:', JSON.stringify(j));"
sleep 2
curl -s "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=EUR&to_currency=USD&apikey=${ALPHA_VANTAGE_API_KEY}" | node -e "const d=require('fs').readFileSync('/dev/stdin','utf8'); const j=JSON.parse(d); const r=j['Realtime Currency Exchange Rate']; if(r) console.log('EUR/USD:', r['5. Exchange Rate']); else console.log('RATE_LIMITED:', JSON.stringify(j));"
sleep 2
curl -s "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=JPY&apikey=${ALPHA_VANTAGE_API_KEY}" | node -e "const d=require('fs').readFileSync('/dev/stdin','utf8'); const j=JSON.parse(d); const r=j['Realtime Currency Exchange Rate']; if(r) console.log('USD/JPY:', r['5. Exchange Rate']); else console.log('RATE_LIMITED:', JSON.stringify(j));"
sleep 2
curl -s "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=GBP&to_currency=USD&apikey=${ALPHA_VANTAGE_API_KEY}" | node -e "const d=require('fs').readFileSync('/dev/stdin','utf8'); const j=JSON.parse(d); const r=j['Realtime Currency Exchange Rate']; if(r) console.log('GBP/USD:', r['5. Exchange Rate']); else console.log('RATE_LIMITED:', JSON.stringify(j));"
sleep 2
curl -s "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=EUR&to_currency=GBP&apikey=${ALPHA_VANTAGE_API_KEY}" | node -e "const d=require('fs').readFileSync('/dev/stdin','utf8'); const j=JSON.parse(d); const r=j['Realtime Currency Exchange Rate']; if(r) console.log('EUR/GBP:', r['5. Exchange Rate']); else console.log('RATE_LIMITED:', JSON.stringify(j));"
```

## Step 2: Search for current market intelligence

```bash
node /job/.pi/skills/brave-search/search.js "GBP JPY forex analysis forecast today" -n 5
```

```bash
node /job/.pi/skills/brave-search/search.js "currency strength meter USD GBP JPY today" -n 3
```

```bash
node /job/.pi/skills/brave-search/search.js "forex high impact economic calendar events this week" -n 3
```

## Step 3: Write briefing to vault

Create `vault/knowledge/TODAYS_DATE-sterling-briefing.md` (use actual date in filename, e.g. 2026-03-10-sterling-briefing.md). Include:
- YAML frontmatter: title, date, tags: [forex, briefing, sterling-strategy]
- Live Rates table (all pairs fetched)
- Currency Strength Assessment: rank major currencies strongest to weakest
- Top Setups (1-3 pairs with potential 4+ point divergence — pair, direction, reason, key levels)
- GBP/JPY Specific Analysis: rate, trend, key S/R, setup status
- Economic Calendar highlights this week (GBP, JPY, USD events)
- Sterling Verdict: 2-3 sentence actionable conclusion

## Step 4: Send Telegram notification

Write /job/tmp/send-tg.js:

```javascript
// /job/tmp/send-tg.js
const https = require('https');
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
const text = process.argv[2];
const body = JSON.stringify({ chat_id: chatId, text: text, parse_mode: 'Markdown' });
const req = https.request({
  hostname: 'api.telegram.org',
  path: '/bot' + token + '/sendMessage',
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
}, res => { let d = ''; res.on('data', c => d += c); res.on('end', () => console.log(d)); });
req.on('error', e => console.error(e.message));
req.write(body);
req.end();
```

Then send a concise briefing summary (under 2500 chars). Include: GBP/JPY rate + status, top 1-2 setups with key levels, key economic events this week, Sterling Verdict. Use Markdown bold (*text*). Avoid emojis and special characters that break Telegram Markdown parsing.

```bash
node /job/tmp/send-tg.js "YOUR BRIEFING SUMMARY"
```
