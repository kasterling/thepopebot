# Posting Sterling Briefing to Telegram

The Sterling Intelligence Briefing has been generated and is ready to post to Telegram.

## Quick Post (Manual)

If you have access to the event handler environment with Telegram credentials:

```bash
cd /path/to/thepopebot
export TELEGRAM_BOT_TOKEN="your-bot-token"
export TELEGRAM_CHAT_ID="your-chat-id"
node tmp/post-briefing-from-event-handler.js 8456bb1d-f227-4844-ba60-6f7e42288735
```

## Automatic Posting (Recommended)

To automatically post Sterling briefings to Telegram when they complete, you have three options:

### Option 1: Modify Event Handler Notification

Edit `event_handler/server.js` in the `/github/webhook` endpoint to check for Sterling briefing jobs:

```javascript
// After receiving webhook in /github/webhook endpoint
const jobId = extractJobId(branchName);

// Check if this is a Sterling briefing job
const summaryPath = path.join(__dirname, '..', 'logs', jobId, 'telegram-summary.txt');
if (fs.existsSync(summaryPath)) {
  // This is a Sterling briefing - send the custom summary instead of generic job summary
  const customMessage = fs.readFileSync(summaryPath, 'utf8');
  await sendMessage(telegramBotToken, TELEGRAM_CHAT_ID, customMessage, { disablePreview: true });
} else {
  // Regular job - use the standard summarizeJob flow
  const message = await summarizeJob(results);
  await sendMessage(telegramBotToken, TELEGRAM_CHAT_ID, message);
}
```

### Option 2: Add a Webhook Trigger

Add this to `operating_system/TRIGGERS.json`:

```json
{
  "name": "sterling-briefing-notification",
  "watch_path": "/github/webhook",
  "actions": [
    {
      "type": "command",
      "command": "SUMMARY_FILE=/job/logs/${JOB_ID}/telegram-summary.txt; if [ -f \"$SUMMARY_FILE\" ]; then echo \"Found Sterling briefing, posting to Telegram...\"; node /job/tmp/post-briefing-from-event-handler.js ${JOB_ID}; fi"
    }
  ],
  "enabled": true
}
```

Note: You'll need to extract the job ID from the webhook payload and pass it to the command.

### Option 3: Scheduled Review

Add a cron job to check for new briefings and post them:

```json
{
  "name": "post-pending-briefings",
  "schedule": "*/15 * * * *",
  "type": "command",
  "command": "cd /job && for dir in logs/*/; do if [ -f \"${dir}telegram-summary.txt\" ] && [ ! -f \"${dir}.posted\" ]; then node tmp/post-briefing-from-event-handler.js $(basename $dir) && touch \"${dir}.posted\"; fi; done",
  "enabled": true
}
```

## Message Content

The message being posted is:

```
📊 STERLING INTELLIGENCE BRIEFING
🗓 March 2, 2026 | 12:00 UTC

💱 GBP/JPY: 210.35-210.40
📈 Session: 209.00 - 210.40
📉 Change: Flat (filled bearish gap, +140 pips from low)

⚡️ KEY DRIVERS:
• 🇯🇵 JPY Weakness: Tokyo CPI below BoJ 2% target → Near-term dovish
• 🇯🇵 BoJ's Himino: "Gradually move to neutral with moderate rate hikes"
• 🇬🇧 BoE Bailey: "Scope for rate cuts" → Inflation to 2% target
• 🇬🇧 BoE rates held at 3.75% (last meeting)
• ⚠️ Middle East tensions elevate safe-haven JPY demand
• 🏛 Japan PM Takaichi cautious on rate hikes

📊 H4 OUTLOOK: Neutral-to-Bullish Consolidation

Technical: Range 209.00-210.50, risk on upside as long as 207.20 holds
Fundamental: JPY weakness vs BoE dovishness = balanced forces

🎯 SCENARIOS:
• 🦘 Range (45%): Consolidate 209.00-210.50 → Fade extremes
• 🐂 Bull (35%): Break 210.50 → Target 212.10, then 214.98
• 🐻 Bear (20%): Break 209.00 → Target 207.20, then 206.00

[... rest of message ...]
```

See `/job/logs/8456bb1d-f227-4844-ba60-6f7e42288735/telegram-summary.txt` for the complete message.

## Troubleshooting

**"Telegram credentials not available"**
- Ensure `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are set in your environment
- These should be available in the event handler's environment (from .env or process env)

**"Summary file not found"**
- Verify the job ID is correct
- Check that the file exists at `/job/logs/<job-id>/telegram-summary.txt`

**"Telegram API error"**
- Check your bot token is valid
- Verify the chat ID is correct
- Ensure the bot has been started by the user (send `/start` to the bot)

## Verification

After posting, you should see output like:

```
✅ Successfully posted to Telegram!
   Message ID: 12345
   Chat: 1234567890
   Date: 2026-03-02T12:04:30.000Z
```

---

**Job ID:** 8456bb1d-f227-4844-ba60-6f7e42288735  
**Generated:** 2026-03-02 12:00 UTC  
**Summary Size:** 1,787 bytes  
**Format:** Telegram HTML with emojis
