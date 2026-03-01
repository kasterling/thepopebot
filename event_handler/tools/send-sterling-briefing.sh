#!/bin/bash
# Send the latest Sterling Intelligence Briefing to Telegram
#
# Usage: ./send-sterling-briefing.sh
#
# Requires:
#   - TELEGRAM_BOT_TOKEN environment variable
#   - TELEGRAM_CHAT_ID environment variable

# Find the most recent Sterling briefing
BRIEFING_FILE=$(find /job/logs -name "STERLING_INTELLIGENCE_BRIEFING.md" -type f -printf '%T@ %p\n' | sort -nr | head -1 | cut -d' ' -f2-)

if [ -z "$BRIEFING_FILE" ]; then
  echo "Error: No Sterling Intelligence Briefing found in logs/"
  exit 1
fi

echo "Found briefing: $BRIEFING_FILE"
echo "Sending to Telegram..."

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Send the briefing
node "$SCRIPT_DIR/send-telegram.js" --file "$BRIEFING_FILE"

if [ $? -eq 0 ]; then
  echo "✅ Sterling Intelligence Briefing sent successfully!"
else
  echo "❌ Failed to send briefing"
  exit 1
fi
