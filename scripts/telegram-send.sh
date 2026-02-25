#!/bin/bash
# Simple wrapper to send Sterling briefing to Telegram
# Can be called from event handler command-type actions

set -e

# Change to script directory
cd "$(dirname "$0")"

# Check for required environment variables
if [ -z "$TELEGRAM_BOT_TOKEN" ] || [ -z "$TELEGRAM_CHAT_ID" ]; then
  echo "❌ Error: TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID must be set"
  exit 1
fi

# Default to today's briefing if no file specified
BRIEFING_FILE="${1:-../logs/sterling-briefing-$(date +%Y-%m-%d).md}"

# Run the Node.js sender script
node send-sterling-briefing.js "$BRIEFING_FILE"
