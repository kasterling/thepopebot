#!/bin/bash
# Post Sterling Briefing to Telegram
# This script attempts to use credentials from the environment

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "📤 Posting Sterling Intelligence Briefing to Telegram..."

# Check if running in event handler context (has access to credentials)
if [ -f "/job/event_handler/tools/telegram.js" ]; then
    echo "   Using event handler Telegram tools..."
    
    # Create a simple Node script that uses the event handler's tools
    cat > "$SCRIPT_DIR/post_via_handler.js" << 'EOFSCRIPT'
const { sendMessage } = require('/job/event_handler/tools/telegram');
const fs = require('fs');
const path = require('path');

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

if (!botToken || !chatId) {
  console.error('❌ Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
  process.exit(1);
}

const briefingPath = path.join(__dirname, 'sterling_briefing_telegram.html');
const message = fs.readFileSync(briefingPath, 'utf8');

sendMessage(botToken, chatId, message, { disablePreview: true })
  .then(() => {
    console.log('✅ Sterling Briefing posted successfully!');
  })
  .catch((err) => {
    console.error('❌ Failed to post:', err.message);
    process.exit(1);
  });
EOFSCRIPT

    node "$SCRIPT_DIR/post_via_handler.js"
    rm "$SCRIPT_DIR/post_via_handler.js"
else
    # Fallback to direct API call
    echo "   Using direct Telegram API..."
    node "$SCRIPT_DIR/post_to_telegram.js"
fi

echo "✅ Done!"
