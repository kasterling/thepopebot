# Quick Start: Sending the Sterling Briefing

## Option 1: Automated (Fastest)

```bash
export TELEGRAM_BOT_TOKEN="your_bot_token_from_botfather"
export TELEGRAM_CHAT_ID="your_chat_id"
node send-telegram.js
```

## Option 2: Manual Copy-Paste

1. Open `sterling_briefing_telegram.txt`
2. Copy all content
3. Paste into your Telegram bot/channel

## Option 3: curl Command

```bash
TOKEN="your_bot_token"
CHAT_ID="your_chat_id"

curl -X POST "https://api.telegram.org/bot${TOKEN}/sendMessage" \
  -H "Content-Type: application/json" \
  -d @- << 'JSON'
{
  "chat_id": "'"$CHAT_ID"'",
  "text": "'"$(cat sterling_briefing_telegram.txt)"'",
  "parse_mode": "HTML",
  "disable_web_page_preview": true
}
JSON
```

## Getting Your Chat ID

Don't know your chat ID? 

1. Send any message to your bot
2. Visit: `https://api.telegram.org/bot<TOKEN>/getUpdates`
3. Find the "chat" object, copy the "id" value

---

For full instructions, see: `TELEGRAM_INSTRUCTIONS.md`
