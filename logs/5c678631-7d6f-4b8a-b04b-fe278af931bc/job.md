Ingest two YouTube videos into the knowledge vault. Process them one at a time.

## Video 1: Financial Psychology

URL: https://youtu.be/BVk2VBggxe4

```bash
/job/.pi/skills/youtube-transcript/transcript.js https://youtu.be/BVk2VBggxe4
```

Save the transcript + a structured summary to `vault/knowledge/2026-03-08-financial-psychology-mindset.md` with:
- YAML frontmatter: url, title, date: 2026-03-08, tags: [psychology, finance, mindset], source_type: youtube
- ## Summary section: 3-5 key insights from the video
- ## Key Concepts section: bullet list of the main ideas
- ## Action Steps section: concrete things Keith can apply to change his financial psychology
- ## Full Transcript section: the raw transcript

## Video 2: BlackRock in Crisis Mode

URL: https://youtu.be/Cda0fo9IHFg

```bash
/job/.pi/skills/youtube-transcript/transcript.js https://youtu.be/Cda0fo9IHFg
```

Save to `vault/knowledge/2026-03-08-blackrock-crisis-mode.md` with:
- YAML frontmatter: url, title, date: 2026-03-08, tags: [blackrock, markets, macro], source_type: youtube
- ## Summary section: what the video claims about BlackRock's situation
- ## Key Claims section: specific claims made in the video
- ## What This Means for Keith section: practical implications for a Forex trader — how macro instability at a firm like BlackRock signals broader market stress, what currency pairs might be affected, what to watch for
- ## Full Transcript section: the raw transcript

## After both videos are saved

Run the vector index update:
```bash
OBSIDIAN_VAULT_PATH=/job/vault node /job/.pi/skills/obsidian/embed.js
```

## Send Telegram confirmation

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

Then send a summary covering both videos. Keep it under 2500 chars, plain Markdown with *bold*, no emojis:

```bash
node /job/tmp/send-tg.js "YOUR SUMMARY"
```
