Generate the Sterling Intelligence Briefing for today.

## Step 1: Get live forex rates via Alpha Vantage

Fetch current rates for the major pairs. Run one at a time:

```bash
curl -s "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=GBP&to_currency=JPY&apikey=${ALPHA_VANTAGE_API_KEY}" | node -e "const d=require('fs').readFileSync('/dev/stdin','utf8'); const j=JSON.parse(d); const r=j['Realtime Currency Exchange Rate']; console.log('GBP/JPY:', r['5. Exchange Rate'], 'refreshed:', r['6. Last Refreshed']);"
```

```bash
curl -s "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=EUR&to_currency=USD&apikey=${ALPHA_VANTAGE_API_KEY}" | node -e "const d=require('fs').readFileSync('/dev/stdin','utf8'); const j=JSON.parse(d); const r=j['Realtime Currency Exchange Rate']; console.log('EUR/USD:', r['5. Exchange Rate']);"
```

```bash
curl -s "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=JPY&apikey=${ALPHA_VANTAGE_API_KEY}" | node -e "const d=require('fs').readFileSync('/dev/stdin','utf8'); const j=JSON.parse(d); const r=j['Realtime Currency Exchange Rate']; console.log('USD/JPY:', r['5. Exchange Rate']);"
```

```bash
curl -s "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=GBP&to_currency=USD&apikey=${ALPHA_VANTAGE_API_KEY}" | node -e "const d=require('fs').readFileSync('/dev/stdin','utf8'); const j=JSON.parse(d); const r=j['Realtime Currency Exchange Rate']; console.log('GBP/USD:', r['5. Exchange Rate']);"
```

```bash
curl -s "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=EUR&to_currency=GBP&apikey=${ALPHA_VANTAGE_API_KEY}" | node -e "const d=require('fs').readFileSync('/dev/stdin','utf8'); const j=JSON.parse(d); const r=j['Realtime Currency Exchange Rate']; console.log('EUR/GBP:', r['5. Exchange Rate']);"
```

## Step 2: Search for current market analysis

```bash
node /job/.pi/skills/brave-search/search.js "GBP JPY forex analysis forecast today 2026" -n 5
```

```bash
node /job/.pi/skills/brave-search/search.js "currency strength meter major pairs today" -n 4
```

```bash
node /job/.pi/skills/brave-search/search.js "forex high impact economic calendar events this week" -n 4
```

## Step 3: Write the Sterling Intelligence Briefing to vault

Based on all data gathered above, create a structured briefing at vault/knowledge/TODAYS_DATE-sterling-briefing.md (use today's actual date in the filename).

Include these sections:
- YAML frontmatter with title, date, tags: [forex, briefing, sterling-strategy]
- Live Rates table (all pairs fetched above)
- Currency Strength Assessment: rank major currencies strongest to weakest based on pair movements and news
- Top Setups (1-3 pairs with potential 4+ point divergence — specify pair, direction, reason, key levels)
- GBP/JPY Specific Analysis: rate, trend, key S/R levels, setup status
- Economic Calendar highlights this week affecting GBP, JPY, USD
- Sterling Verdict: clear 2-3 sentence actionable conclusion

## Step 4: Send Telegram notification

Write the Telegram send script to /job/tmp/send-tg.js:

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

Then run it with a concise briefing summary (keep under 2500 chars). Format as Markdown with bold pairs and rates. Include:
- Top pair to watch today with direction and key level
- GBP/JPY current rate and status (bullish/bearish/ranging)
- 1-2 key economic events this week
- Sterling verdict in one sentence

```bash
node /job/tmp/send-tg.js "YOUR BRIEFING SUMMARY"
```
