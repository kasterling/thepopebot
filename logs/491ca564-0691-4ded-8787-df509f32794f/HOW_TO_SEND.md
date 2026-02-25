# How to Send Sterling Briefing to Telegram

The briefing has been generated but cannot be sent directly from the Docker agent environment because Telegram credentials are only available on the Event Handler server.

## Files Generated

1. **sterling_briefing_2026-02-25.md** - Full detailed briefing (markdown)
2. **TELEGRAM_MESSAGE.txt** - Telegram-formatted message (HTML)

## Option 1: Manual Send (Quick)

From the Event Handler server:

```bash
export TELEGRAM_BOT_TOKEN="your_bot_token"
export TELEGRAM_CHAT_ID="your_chat_id"

# Copy the message content from TELEGRAM_MESSAGE.txt and send via curl:
curl -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -H "Content-Type: application/json" \
  -d '{
    "chat_id": "'"${TELEGRAM_CHAT_ID}"'",
    "text": "PASTE_TELEGRAM_MESSAGE_HERE",
    "parse_mode": "HTML"
  }'
```

## Option 2: Automated via Event Handler

Create a simple script on the Event Handler server:

```javascript
// send_briefing.js
const { sendMessage } = require('./event_handler/tools/telegram.js');
const fs = require('fs');

const message = fs.readFileSync('logs/491ca564-0691-4ded-8787-df509f32794f/TELEGRAM_MESSAGE.txt', 'utf8');

sendMessage(
  process.env.TELEGRAM_BOT_TOKEN,
  process.env.TELEGRAM_CHAT_ID,
  message
).then(() => console.log('✅ Sent!')).catch(console.error);
```

## Option 3: Add to TRIGGERS.json

For future automated briefings, add this trigger to `operating_system/TRIGGERS.json`:

```json
{
  "name": "post-sterling-briefing",
  "watch_path": "/github/webhook",
  "actions": [
    {
      "type": "command",
      "command": "cd event_handler && node -e \"const {sendMessage}=require('./tools/telegram');const fs=require('fs');const msg=fs.readFileSync('../logs/{{body.job_id}}/TELEGRAM_MESSAGE.txt','utf8');sendMessage(process.env.TELEGRAM_BOT_TOKEN,process.env.TELEGRAM_CHAT_ID,msg).then(()=>console.log('Sent')).catch(console.error);\""
    }
  ],
  "enabled": false
}
```

## Option 4: Update JOB_SUMMARY.md

The Event Handler's `update-event-handler.yml` workflow already sends job completion notifications. The message content from TELEGRAM_MESSAGE.txt will be included in the PR and can be extracted by the notification system.

---

## Next Steps

1. ✅ Briefing generated with current market data
2. ✅ Strategy document created at `config/STERLING_STRATEGY.md`
3. ⏳ Send to Telegram (requires Event Handler access)
4. 🔄 Automate for future briefings (add to CRONS.json)

## Automation Recommendation

Add this to `operating_system/CRONS.json` for daily briefings:

```json
{
  "name": "sterling-daily-briefing",
  "schedule": "0 8 * * *",
  "type": "agent",
  "job": "Read the file at config/STERLING_STRATEGY.md and generate the Sterling Intelligence Briefing for today. Save the Telegram message to logs/[JOB_ID]/TELEGRAM_MESSAGE.txt",
  "enabled": true
}
```
