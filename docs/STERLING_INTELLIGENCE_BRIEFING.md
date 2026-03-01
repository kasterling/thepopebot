# Sterling Intelligence Briefing System

## Overview

The Sterling Intelligence Briefing is an automated forex analysis system that monitors GBP/JPY (British Pound / Japanese Yen) exchange rates, analyzes central bank policies, and provides H4 (4-hour) timeframe outlook summaries.

## Components

### 1. Strategy Configuration
**File**: `config/STERLING_STRATEGY.md`

Defines the analysis framework for GBP/JPY including:
- Key data points to monitor
- Bullish/bearish factors
- Technical analysis approach
- Report structure

### 2. Briefing Generator
**Trigger**: Manual job or cron schedule

The briefing generation job:
1. Searches for current GBP/JPY exchange rates using Brave Search
2. Gathers news about Bank of England and Bank of Japan policies
3. Analyzes market sentiment
4. Generates a formatted briefing based on the strategy framework
5. Saves the briefing to `logs/{JOB_ID}/STERLING_INTELLIGENCE_BRIEFING.md`

### 3. Telegram Delivery

**Tool**: `event_handler/tools/send-telegram.js`

A CLI tool for sending messages to Telegram.

**Usage**:
```bash
# Send a text message
node event_handler/tools/send-telegram.js "Your message"

# Send a file
node event_handler/tools/send-telegram.js --file path/to/file.md

# Specify chat ID
node event_handler/tools/send-telegram.js --file path/to/file.md --chat-id 123456
```

**Tool**: `event_handler/tools/send-sterling-briefing.sh`

A convenience script that finds and sends the most recent Sterling briefing.

**Usage**:
```bash
./event_handler/tools/send-sterling-briefing.sh
```

## Setup

### Prerequisites

1. **Brave Search API Key** - Required for gathering market data
   - Sign up at https://api-dashboard.search.brave.com/register
   - Add to LLM_SECRETS: `BRAVE_API_KEY`

2. **Telegram Bot Token** - Required for sending briefings
   - Create a bot via BotFather on Telegram
   - Add to SECRETS: `TELEGRAM_BOT_TOKEN`

3. **Telegram Chat ID** - Required for delivery
   - Get your chat ID by messaging your bot and checking updates
   - Add to environment: `TELEGRAM_CHAT_ID`

### Manual Execution

To generate and send a Sterling briefing manually:

```bash
# 1. Create a job to generate the briefing
curl -X POST https://your-event-handler.com/webhook \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"job": "Generate the Sterling Intelligence Briefing. 1. Check GBP/JPY rates and news. 2. Analyze sentiment. 3. Summarize H4 outlook based on config/STERLING_STRATEGY.md. 4. Post summary to Telegram."}'

# 2. After the job completes, send the briefing (from event handler server)
./event_handler/tools/send-sterling-briefing.sh
```

### Automated Execution

Add a cron job to `operating_system/CRONS.json`:

```json
{
  "name": "sterling-briefing",
  "schedule": "0 9,15 * * 1-5",
  "type": "agent",
  "job": "Generate the Sterling Intelligence Briefing. 1. Check GBP/JPY rates and news. 2. Analyze sentiment. 3. Summarize H4 outlook based on config/STERLING_STRATEGY.md. 4. Post summary to Telegram.",
  "enabled": true
}
```

This runs at 9 AM and 3 PM UTC on weekdays (London and Tokyo overlap).

### Automated Telegram Posting

To automatically send the briefing after generation, add a trigger to `operating_system/TRIGGERS.json`:

```json
{
  "name": "send-sterling-on-complete",
  "watch_path": "/github/webhook",
  "actions": [
    {
      "type": "command",
      "command": "if [ -f /path/to/job/logs/{{body.job_id}}/STERLING_INTELLIGENCE_BRIEFING.md ]; then ./event_handler/tools/send-sterling-briefing.sh; fi"
    }
  ],
  "enabled": true
}
```

## Briefing Format

The briefing includes:

1. **Current Rate** - GBP/JPY spot rate
2. **Weekly Performance** - Recent price action
3. **Central Bank Analysis**
   - Bank of England policy stance and rate expectations
   - Bank of Japan monetary policy and political influences
4. **Sentiment Analysis** - Market mood for Sterling and Yen
5. **H4 Outlook** - 4-hour timeframe bias (bullish/bearish/neutral)
6. **Key Levels** - Support and resistance zones
7. **Recommendation** - Trading scenarios and risk events

All formatting uses Telegram HTML syntax:
- `<b>bold</b>` for emphasis
- `<i>italic</i>` for disclaimers
- Plain text bullets (• or -)
- No unsupported HTML tags

## Customization

### Change Analysis Timeframe

Edit `config/STERLING_STRATEGY.md` to focus on different timeframes (H1, D1, etc.)

### Monitor Different Pairs

Create new strategy files for other currency pairs:
- `config/CABLE_STRATEGY.md` (GBP/USD)
- `config/DOLLAR_YEN_STRATEGY.md` (USD/JPY)
- etc.

Update the job description to reference the new strategy file.

### Adjust Schedule

Modify the cron schedule in `operating_system/CRONS.json` to match your preferred timing. Common forex analysis times:
- London open: `0 7 * * 1-5` (7 AM UTC)
- New York open: `0 13 * * 1-5` (1 PM UTC)
- Tokyo open: `0 0 * * 1-5` (midnight UTC)

## Troubleshooting

### Briefing not generating
- Check Brave Search API key is valid
- Verify search results are returning data
- Check job logs for errors

### Telegram not sending
- Verify `TELEGRAM_BOT_TOKEN` is set correctly
- Verify `TELEGRAM_CHAT_ID` is correct
- Test with manual command: `node event_handler/tools/send-telegram.js "test"`
- Check bot has permission to send messages to the chat

### Outdated data
- Brave Search uses `--freshness pd` flag for past day results
- If data seems stale, check Brave Search API status
- Consider increasing search result count (`-n` flag)

## Future Enhancements

Potential improvements:
- Direct API integration with forex data providers (OANDA, Alpha Vantage)
- Technical indicator calculations (RSI, MACD, Bollinger Bands)
- Chart generation and image attachments
- Multiple timeframe analysis (H1 + H4 + D1)
- Economic calendar integration
- Position sizing recommendations based on volatility
