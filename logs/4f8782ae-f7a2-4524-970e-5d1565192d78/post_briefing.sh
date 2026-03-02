#!/bin/bash
#
# Post Sterling Intelligence Briefing to Telegram
# 
# This script should be run from the event handler context where
# TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are available.
#
# Usage:
#   ./post_briefing.sh
#
# Or from event handler cron/trigger:
#   { "type": "command", "command": "bash /job/tmp/post_briefing.sh" }
#

set -e

BRIEFING_FILE="/job/tmp/sterling_briefing.md"

if [ ! -f "$BRIEFING_FILE" ]; then
    echo "❌ Briefing file not found: $BRIEFING_FILE"
    exit 1
fi

if [ -z "$TELEGRAM_BOT_TOKEN" ]; then
    echo "❌ TELEGRAM_BOT_TOKEN not set"
    echo "Run this script from event handler context with SECRETS loaded."
    exit 1
fi

if [ -z "$TELEGRAM_CHAT_ID" ]; then
    echo "❌ TELEGRAM_CHAT_ID not set"
    echo "Please set TELEGRAM_CHAT_ID environment variable."
    exit 1
fi

echo "📤 Posting Sterling Intelligence Briefing..."

# Use Node.js to post via Telegram API
cd /job && node tmp/post_telegram.js

echo "✅ Done!"
