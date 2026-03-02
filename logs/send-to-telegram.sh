#!/bin/bash
# Script to send Sterling Intelligence Briefing to Telegram
# Usage: TELEGRAM_BOT_TOKEN=xxx TELEGRAM_CHAT_ID=xxx ./send-to-telegram.sh

set -e

if [ -z "$TELEGRAM_BOT_TOKEN" ] || [ -z "$TELEGRAM_CHAT_ID" ]; then
    echo "Error: Missing required environment variables"
    echo "Please set:"
    echo "  TELEGRAM_BOT_TOKEN (from @BotFather)"
    echo "  TELEGRAM_CHAT_ID (your chat ID)"
    exit 1
fi

MESSAGE_FILE="/tmp/sterling-briefing-telegram.txt"

if [ ! -f "$MESSAGE_FILE" ]; then
    echo "Error: Message file not found at $MESSAGE_FILE"
    exit 1
fi

MESSAGE=$(cat "$MESSAGE_FILE")

# Send via Telegram Bot API
curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    -H "Content-Type: application/json" \
    -d "{
        \"chat_id\": \"${TELEGRAM_CHAT_ID}\",
        \"text\": $(echo "$MESSAGE" | jq -Rs .),
        \"parse_mode\": \"HTML\",
        \"disable_web_page_preview\": false
    }" | jq .

echo "✅ Sterling Intelligence Briefing sent to Telegram"
