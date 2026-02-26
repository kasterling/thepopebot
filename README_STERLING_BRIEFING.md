# Sterling Intelligence Briefing System

## Overview

This repository now includes an automated system for generating Sterling Intelligence Briefings for the GBP/JPY currency pair. The system analyzes current market data, news, sentiment, and technical levels to produce comprehensive H4 (4-hour timeframe) trading outlooks.

## Components

### 1. Strategy Framework
**Location**: `config/STERLING_STRATEGY.md`

Defines the analysis methodology and briefing format for GBP/JPY trading intelligence, including:
- Market data requirements
- Sentiment analysis framework
- H4 timeframe outlook structure
- Technical analysis components
- Risk considerations

### 2. Briefing Generation
The system generates comprehensive briefings that include:
- Current GBP/JPY exchange rate and recent price action
- Fundamental news summary (UK data, Japan data, BoJ policy)
- Overall sentiment assessment (bullish/bearish/neutral)
- H4 technical outlook with key levels
- Support/resistance zones and price targets
- Risk factors and considerations

### 3. Output Formats
Each briefing is generated in multiple formats:
- **Markdown** (`.md`) - Full formatted document
- **Telegram HTML** (`.txt`) - Ready-to-send message with HTML formatting
- **Archive** - Saved with timestamp in job logs

## Usage

### Manual Generation
Request a briefing via Telegram chat or create a job:
```
Generate the 'Sterling Intelligence Briefing'. 1. Check GBP/JPY rates and news. 2. Analyze sentiment. 3. Summarize H4 outlook based on config/STERLING_STRATEGY.md. 4. Post summary to Telegram.
```

### Automated Generation (Cron)
Add to `operating_system/CRONS.json` for scheduled briefings:

```json
{
  "name": "sterling-briefing-morning",
  "schedule": "0 8 * * 1-5",
  "type": "agent",
  "job": "Generate the 'Sterling Intelligence Briefing'. 1. Check GBP/JPY rates and news. 2. Analyze sentiment. 3. Summarize H4 outlook based on config/STERLING_STRATEGY.md. 4. Post summary to Telegram.",
  "enabled": true
}
```

**Suggested Schedules**:
- `0 8 * * 1-5` - Daily at 8:00 AM UTC (weekdays only)
- `0 8,16 * * 1-5` - Twice daily at 8:00 AM and 4:00 PM UTC
- `0 */4 * * 1-5` - Every 4 hours during weekdays

### Telegram Integration

#### Requirements
- `TELEGRAM_BOT_TOKEN` - Bot token from @BotFather
- `TELEGRAM_CHAT_ID` - Target chat/channel ID

#### Sending Briefings

**Option 1: Automated Script**
```bash
cd /path/to/repo
TELEGRAM_BOT_TOKEN="your_token" \
TELEGRAM_CHAT_ID="your_chat_id" \
node logs/<JOB_ID>/send-telegram.js
```

**Option 2: Manual via API**
```bash
TOKEN="your_token"
CHAT_ID="your_chat_id"
MESSAGE=$(cat logs/<JOB_ID>/sterling_briefing_telegram.txt)

curl -X POST "https://api.telegram.org/bot${TOKEN}/sendMessage" \
  -H "Content-Type: application/json" \
  -d "{
    \"chat_id\": \"${CHAT_ID}\",
    \"text\": $(echo "$MESSAGE" | jq -Rs .),
    \"parse_mode\": \"HTML\",
    \"disable_web_page_preview\": true
  }"
```

**Option 3: Event Handler Integration**
The event handler can be configured to automatically post completed briefings. Add notification logic to `event_handler/tools/` to send the briefing when the job completes.

## Customization

### Modifying the Strategy
Edit `config/STERLING_STRATEGY.md` to adjust:
- Analysis criteria
- Key levels to monitor
- Risk thresholds
- Briefing format

### Adding Other Currency Pairs
1. Create a new strategy file (e.g., `config/EURUSD_STRATEGY.md`)
2. Create a corresponding cron job with the new strategy path
3. Adjust the search queries in the job description

### Extending the Briefing
The briefing can be enhanced to include:
- Economic calendar events
- Correlation analysis with other pairs
- Options market data (volatility, risk reversals)
- Positioning data (COT reports, sentiment surveys)
- Chart screenshots or technical analysis images

## Data Sources

The system uses the Brave Search API to gather:
- Real-time exchange rates from forex converter sites
- Recent news about GBP, JPY, and Bank of England/Bank of Japan
- Technical analysis from FXStreet, ActionForex, and other sources
- Market commentary and forecasts

## Files and Locations

```
config/
├── STERLING_STRATEGY.md          # Strategy framework

logs/<JOB_ID>/
├── sterling_briefing_*.md         # Timestamped briefing (markdown)
├── sterling_briefing_telegram.txt # Telegram-ready HTML
└── job.md                         # Original job description

tmp/
├── send-telegram.js              # Automated Telegram sender
├── TELEGRAM_INSTRUCTIONS.md      # Manual posting guide
└── sterling-cron-example.json    # Sample cron configuration
```

## Example Output

```
🇬🇧💷 Sterling Intelligence Briefing
GBP/JPY Analysis | 26 February 2026

📊 Current Rate & Action
GBP/JPY: 211.86

The pair has surged past 209.00...

📰 Fundamental Summary
• Strong UK Economic Data: ...
• Soft Japanese CPI: ...

🎯 Sentiment Assessment
BULLISH (with cautious undertones)

🕐 H4 Outlook
BIAS: BULLISH
Key Support: 207.60-208.00
Key Resistance: 212.00, 214.44-214.98

🎓 Bottom Line
Sterling remains bid on Yen weakness; H4 structure supports 
further upside toward 212-214...
```

## Maintenance

### Updating Market Data Sources
If search sources become unreliable:
1. Test alternative forex data sites
2. Update search queries in the job description
3. Adjust parsing logic if needed

### Monitoring Accuracy
Periodically review briefings for:
- Data accuracy (correct rates and news)
- Sentiment alignment with actual market conditions
- Level accuracy (support/resistance zones)
- Forecast reliability over time

### Performance Tuning
- Adjust search result count if data is insufficient
- Add `--content` flag to Brave searches for deeper analysis
- Use date ranges (`--freshness pw`) to focus on recent news

## Future Enhancements

Potential improvements:
- [ ] Multi-timeframe analysis (H1, D1, W1)
- [ ] Automated chart generation
- [ ] Backtesting of level predictions
- [ ] Machine learning sentiment scoring
- [ ] Integration with trading platforms
- [ ] Alert system for key level breaks
- [ ] Performance tracking dashboard

---

**Status**: ✅ Operational  
**Last Updated**: 26 February 2026  
**Version**: 1.0
