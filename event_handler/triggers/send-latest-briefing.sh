#!/bin/bash
# Send the most recent Sterling briefing to Telegram
# Run from event_handler directory

cd "$(dirname "$0")/.."
node send-sterling-briefing.js
