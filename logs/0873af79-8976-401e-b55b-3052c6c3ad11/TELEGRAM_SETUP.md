# Telegram Setup for Sterling Intelligence Briefing

## Overview

The Sterling Intelligence Briefing has been successfully generated and saved. To enable automatic posting to Telegram, you need to configure credentials.

## Quick Setup (5 minutes)

### Step 1: Create a Telegram Bot

1. Open Telegram and search for **@BotFather**
2. Send `/newbot` and follow the prompts
3. Choose a name (e.g., "Sterling Intelligence Bot")
4. Choose a username (e.g., "sterling_intelligence_bot")
5. Copy the bot token (format: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

### Step 2: Get Your Chat ID

**Option A - Personal Chat:**
1. Message your new bot on Telegram (send any message)
2. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
3. Look for `"chat":{"id":123456789}` in the JSON response
4. Copy the chat ID number

**Option B - Using a Bot:**
1. Search for **@userinfobot** on Telegram
2. Start a chat and it will reply with your user ID
3. Use this ID as your CHAT_ID

**Option C - For Groups/Channels:**
1. Add your bot to the group/channel
2. Send a message in the group
3. Check the getUpdates URL (same as Option A)
4. Group IDs are negative numbers (e.g., `-1001234567890`)

### Step 3: Add Credentials to GitHub

1. Go to your GitHub repository
2. Navigate to **Settings → Secrets and variables → Actions**
3. Click **Variables** tab
4. Find or create the `LLM_SECRETS` secret

**Create the JSON:**
```json
{
  "BRAVE_API_KEY": "your-existing-brave-key",
  "TELEGRAM_BOT_TOKEN": "1234567890:ABCdefGHIjklMNOpqrsTUVwxyz",
  "TELEGRAM_CHAT_ID": "123456789"
}
```

**Encode as Base64:**
```bash
echo -n '{"BRAVE_API_KEY":"...","TELEGRAM_BOT_TOKEN":"...","TELEGRAM_CHAT_ID":"..."}' | base64
```

**Add to GitHub:**
- If `LLM_SECRETS` doesn't exist, create it as a **Repository secret**
- Paste the base64-encoded string as the value
- Save

### Step 4: Test the Setup

**Manual Test:**
```bash
# On your local machine or server where thepopebot is running
export TELEGRAM_BOT_TOKEN="your-token"
export TELEGRAM_CHAT_ID="your-chat-id"
node /path/to/telegram_post_simple.js /path/to/sterling_briefing.md
```

**Agent Test:**
Create a test job that runs:
```
Read the Sterling briefing at logs/0873af79-8976-401e-b55b-3052c6c3ad11/sterling_briefing.md and post it to Telegram using the script at tmp/telegram_post_simple.js
```

## Automated Daily Briefings

Once credentials are configured, add this to `operating_system/CRONS.json`:

```json
{
  "name": "sterling-briefing-daily",
  "schedule": "0 4 * * *",
  "type": "agent",
  "job": "Read the file at operating_system/STERLING_STRATEGY.md and complete the tasks described there.",
  "enabled": true
}
```

**Schedule Options:**
- `0 4 * * *` - Daily at 4:00 AM UTC (before London open)
- `0 7 * * 1-5` - Weekdays at 7:00 AM UTC
- `0 */4 * * *` - Every 4 hours
- `0 4,12,20 * * *` - Three times daily (4 AM, 12 PM, 8 PM UTC)

## Files Created

| File | Purpose |
|------|---------|
| `logs/0873af79-8976-401e-b55b-3052c6c3ad11/sterling_briefing.md` | Full briefing (committed to repo) |
| `config/STERLING_STRATEGY.md` | Strategy configuration and instructions |
| `tmp/telegram_post_simple.js` | Standalone posting script (no dependencies) |
| `tmp/sterling_briefing.md` | Working copy of briefing |

## Manual Posting

If you prefer to post manually, you can:

1. **Copy-paste** the briefing from `logs/.../sterling_briefing.md` to Telegram
2. **Use the script** with credentials as environment variables
3. **Create a webhook** that triggers the posting script
4. **Use the event handler** `/webhook` endpoint with Telegram tool

## Troubleshooting

### "Bot was blocked by the user"
- Unblock the bot in Telegram settings
- Start a new chat with the bot
- Send `/start` to reactivate

### "Chat not found"
- Verify the chat ID is correct
- For groups, make sure the ID includes the minus sign
- Ensure the bot is a member of the group

### "Invalid bot token"
- Check for typos in the token
- Ensure no extra spaces or quotes
- Generate a new token if needed (BotFather → /mybots → select bot → API Token)

### Message too long
- The script automatically splits messages > 4096 characters
- Each part is sent separately with a 500ms delay

### HTML parsing errors
- The conversion should handle most markdown
- If errors occur, check for unescaped `<`, `>`, or `&` characters
- The script removes code blocks which can cause issues

## Security Notes

- **Never commit** bot tokens or chat IDs to the repository
- Use GitHub Secrets for all credentials
- Rotate tokens periodically
- Restrict bot permissions to only what's needed
- For production, consider using Telegram's secret tokens for webhook validation

## Next Steps

1. ✅ Complete Telegram setup (Steps 1-3 above)
2. ✅ Test manual posting
3. ✅ Enable automated cron job
4. ✅ Monitor first few runs
5. ✅ Customize briefing format as needed

## Support

- Telegram Bot API: https://core.telegram.org/bots/api
- BotFather commands: `/help` in @BotFather chat
- thepopebot docs: See `CLAUDE.md` and `docs/` folder
