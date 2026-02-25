# Sterling Intelligence Briefing

Automated GBP/JPY market analysis and Telegram delivery system.

## Overview

The Sterling Intelligence Briefing provides H4 (4-hour) timeframe analysis for GBP/JPY, combining:
- Real-time exchange rates
- Fundamental sentiment analysis (BoE & BOJ policy, economic data)
- Technical outlook (support/resistance, trend, momentum)
- Key catalysts and risk factors

## Components

### 1. Strategy Configuration
**File:** `config/STERLING_STRATEGY.md`

Defines the analysis framework:
- Asset focus (GBP/JPY)
- Timeframe (H4)
- Fundamental drivers (Sterling & Yen)
- Technical analysis elements
- Output format template

### 2. Generated Briefings
**Location:** `logs/sterling-briefing-YYYY-MM-DD.md`

Each briefing contains:
- Current GBP/JPY rate
- 24-hour price action
- Sentiment analysis summary
- H4 technical outlook
- Key support/resistance levels
- Trading bias (Bullish/Bearish/Neutral)
- Upcoming catalysts

### 3. Telegram Delivery Script
**File:** `scripts/send-sterling-briefing.js`

Node.js script for posting briefings to Telegram.

**Usage:**
```bash
# Send today's briefing
TELEGRAM_BOT_TOKEN=xxx TELEGRAM_CHAT_ID=yyy node scripts/send-sterling-briefing.js

# Send specific briefing file
TELEGRAM_BOT_TOKEN=xxx TELEGRAM_CHAT_ID=yyy node scripts/send-sterling-briefing.js logs/sterling-briefing-2026-02-25.md
```

**Required Environment Variables:**
- `TELEGRAM_BOT_TOKEN` - Bot token from @BotFather
- `TELEGRAM_CHAT_ID` - Target chat ID (use @userinfobot to find)

## Setup for Automated Delivery

### Option 1: Scheduled Cron Job

Add to `operating_system/CRONS.json`:

```json
{
  "name": "sterling-briefing",
  "schedule": "0 8,16 * * *",
  "type": "agent",
  "job": "Generate the Sterling Intelligence Briefing. 1. Check GBP/JPY rates and news. 2. Analyze sentiment. 3. Summarize H4 outlook based on config/STERLING_STRATEGY.md. 4. Post summary to Telegram.",
  "enabled": true
}
```

This generates briefings at 8:00 and 16:00 UTC daily (covering Asian and European sessions).

### Option 2: Manual Trigger

Create a command-type cron or trigger to send existing briefings:

```json
{
  "name": "send-latest-sterling-briefing",
  "schedule": "5 8,16 * * *",
  "type": "command",
  "command": "cd /job && TELEGRAM_BOT_TOKEN=$TELEGRAM_BOT_TOKEN TELEGRAM_CHAT_ID=$TELEGRAM_CHAT_ID node scripts/send-sterling-briefing.js",
  "enabled": true
}
```

### Option 3: On-Demand via Webhook

Add to `operating_system/TRIGGERS.json`:

```json
{
  "name": "sterling-briefing-webhook",
  "watch_path": "/webhook",
  "actions": [
    {
      "type": "agent",
      "job": "Generate the Sterling Intelligence Briefing. 1. Check GBP/JPY rates and news. 2. Analyze sentiment. 3. Summarize H4 outlook based on config/STERLING_STRATEGY.md. 4. Post summary to Telegram."
    }
  ],
  "enabled": true
}
```

Then trigger via HTTP:
```bash
curl -X POST https://your-event-handler.com/webhook \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"job": "sterling_briefing"}'
```

## Configuration

### Add Telegram Credentials

Add to event handler environment or GitHub Secrets:

```bash
# For event handler (docker-compose.yml or .env)
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789

# For GitHub Actions (add to SECRETS)
# Encode with existing secrets:
echo -n '{"GH_TOKEN":"...","ANTHROPIC_API_KEY":"...","TELEGRAM_BOT_TOKEN":"xxx","TELEGRAM_CHAT_ID":"yyy"}' | base64
```

### Customize Analysis

Edit `config/STERLING_STRATEGY.md` to:
- Add additional technical indicators
- Include more fundamental factors
- Adjust output format
- Change timeframe focus

## Data Sources

The briefing uses:
- **Brave Search API** - Real-time forex rates and financial news
- **FXDailyReport, ActionForex, Reuters** - Technical analysis
- **Bloomberg, FXStreet** - Central bank policy and economic data
- **MarketPulse, DailyForex** - Market sentiment

## Example Output

```
📊 STERLING INTELLIGENCE BRIEFING
Date: February 25, 2026 20:00 UTC

💱 GBP/JPY Rate: 211.98
📈 24h Range: 207.20 - 214.98 (Recent)

📰 Sentiment Analysis:
Sterling faces headwinds from rising Bank of England rate cut 
expectations, with markets pricing in a 25bp cut at the March 
meeting...

🎯 H4 Technical Outlook:
GBP/JPY staged a bullish bounce from support around 207.20-207.24 
(February lows) but the broader structure remains bearish...

⚠️ Key Levels:
Support: 207.20 (February lows - critical)
Resistance: 214.98 (recent high)

🔮 Bias: NEUTRAL (Range-bound with bearish undertone)

⚡ Key Catalysts:
- UK labour data ahead of March BoE meeting
- BOJ March policy decision
- Global risk sentiment
```

## Troubleshooting

### Briefing Not Generated
- Check cron job is enabled in `CRONS.json`
- Verify `ANTHROPIC_API_KEY` in secrets
- Check `BRAVE_API_KEY` in `LLM_SECRETS`

### Not Sent to Telegram
- Verify `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in environment
- Check bot has permission to send messages to chat
- Review event handler logs for errors

### Stale Data
- Brave Search caches results briefly
- Add `--freshness pd` flag for past 24 hours only
- Check if Brave API subscription is active

## Future Enhancements

- [ ] Add chart image generation (TradingView screenshots)
- [ ] Include economic calendar events
- [ ] Multi-pair support (EUR/GBP, GBP/USD)
- [ ] Historical briefing archive with performance tracking
- [ ] Custom alert thresholds (e.g., notify on >100 pip moves)
- [ ] Integration with trading platform APIs for automated execution
