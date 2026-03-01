#!/bin/bash
# Test script to verify Telegram posting capability
# This script can be executed by the event handler or manually with credentials

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MESSAGE_FILE="$SCRIPT_DIR/sterling_briefing_telegram.html"

echo "🧪 Testing Telegram Post Capability"
echo "=================================="

# Check if credentials are available
if [ -z "$TELEGRAM_BOT_TOKEN" ]; then
    echo "❌ TELEGRAM_BOT_TOKEN not set"
    echo ""
    echo "To post manually, run:"
    echo "  export TELEGRAM_BOT_TOKEN='your-token'"
    echo "  export TELEGRAM_CHAT_ID='your-chat-id'"
    echo "  $0"
    exit 1
fi

if [ -z "$TELEGRAM_CHAT_ID" ]; then
    echo "❌ TELEGRAM_CHAT_ID not set"
    exit 1
fi

echo "✓ Credentials found"
echo "✓ Message file exists: $MESSAGE_FILE"

# Read the message
MESSAGE=$(cat "$MESSAGE_FILE")

# URL encode the message for curl
MESSAGE_ENCODED=$(node -e "console.log(encodeURIComponent(process.argv[1]))" "$MESSAGE")

echo ""
echo "📤 Sending to Telegram..."

# Send via curl
RESPONSE=$(curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -d "chat_id=${TELEGRAM_CHAT_ID}" \
  -d "text=${MESSAGE_ENCODED}" \
  -d "parse_mode=HTML" \
  -d "disable_web_page_preview=true")

# Check response
if echo "$RESPONSE" | grep -q '"ok":true'; then
    echo "✅ Successfully posted to Telegram!"
    MESSAGE_ID=$(echo "$RESPONSE" | grep -o '"message_id":[0-9]*' | cut -d: -f2)
    echo "   Message ID: $MESSAGE_ID"
    
    # Save confirmation
    echo "{\"success\": true, \"message_id\": $MESSAGE_ID, \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" > "$SCRIPT_DIR/telegram_post_confirmation.json"
    
else
    echo "❌ Failed to post to Telegram"
    echo "$RESPONSE" | jq . 2>/dev/null || echo "$RESPONSE"
    exit 1
fi

echo ""
echo "✅ Test complete!"
