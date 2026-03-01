# Sterling Intelligence Briefing Strategy

This configuration defines the strategy for generating GBP/JPY intelligence briefings.

## Briefing Components

### 1. Rate Data Collection
- **Primary Pair:** GBP/JPY
- **Data Sources:** 
  - Real-time exchange rates
  - Technical analysis platforms
  - Economic calendars
- **Frequency:** Daily or on-demand

### 2. News Analysis
- **Topics:**
  - Bank of England policy updates
  - Bank of Japan policy developments
  - UK economic data releases
  - Global risk sentiment shifts
  - Geopolitical events affecting GBP or JPY

### 3. Technical Analysis (H4 Timeframe)
- **Primary Indicators:**
  - Support and resistance levels
  - Moving averages (20-day, 50-day, 200-day EMA/SMA)
  - Trend lines and channels
  - Fibonacci retracements and projections
  - Volume profile analysis

- **Key Levels to Monitor:**
  - Recent highs and lows
  - Psychological levels (round numbers)
  - Major pivot points
  - Dynamic support/resistance (moving averages)

### 4. Sentiment Analysis
- **Factors:**
  - Central bank policy divergence
  - Interest rate differentials
  - Economic growth forecasts
  - Safe-haven demand (JPY-specific)
  - Risk appetite indicators
  - Market positioning data

### 5. Trading Strategy Framework

#### Entry Criteria
- **Bullish:**
  - Price above key support with confirmation
  - Break above resistance with volume
  - Bullish divergence on H4
  
- **Bearish:**
  - Price below key support with confirmation
  - Failed break attempts at resistance
  - Bearish divergence on H4

#### Risk Management
- **Position Sizing:** Conservative (1-2% risk per trade)
- **Stop Loss:** Below/above key technical levels
- **Take Profit:** Multiple targets (T1, T2, T3)
- **Risk-Reward Ratio:** Minimum 1:2

#### Key Watch Levels (Update Daily)
- Critical support
- Immediate resistance
- Major resistance
- Extended targets

### 6. Delivery Format

#### Briefing Structure
1. **Header:** Date, time, pair, timeframe
2. **Current Market Status:** Rate, range, trend
3. **Technical Analysis:** Levels, indicators, scenarios
4. **Sentiment Analysis:** Drivers, overall bias
5. **Trading Strategy:** Entry zones, risk management
6. **Calendar:** Upcoming events
7. **Disclaimer:** Risk warning

#### Distribution
- **Primary:** Telegram channel/chat
- **Backup:** Saved to logs directory
- **Format:** Markdown with HTML conversion for Telegram

## Automation Configuration

### Scheduling Options
1. **Daily Briefing:** Run at 04:00 UTC (before London open)
2. **Pre-Event:** Before major economic releases
3. **On-Demand:** Via command or webhook

### Cron Job Example
```json
{
  "name": "sterling-briefing-daily",
  "schedule": "0 4 * * *",
  "type": "agent",
  "job": "Read the file at operating_system/STERLING_STRATEGY.md and complete the tasks described there.",
  "enabled": true
}
```

## Required Credentials

### For Market Data (LLM_SECRETS)
- `BRAVE_API_KEY` - Web search for rates and news

### For Telegram Posting (LLM_SECRETS recommended)
- `TELEGRAM_BOT_TOKEN` - Bot token from @BotFather
- `TELEGRAM_CHAT_ID` - Target chat/channel ID

> **Note:** Add these to LLM_SECRETS so the agent can access them directly:
> ```bash
> echo -n '{"BRAVE_API_KEY":"...", "TELEGRAM_BOT_TOKEN":"...", "TELEGRAM_CHAT_ID":"..."}' | base64
> ```

## Data Sources

### Recommended Sites
- WalletInvestor (rate forecasts)
- ActionForex (technical analysis)
- FXEmpire (market commentary)
- TradingView (charts and indicators)
- ForexFactory (economic calendar)

### Search Strategies
- "GBP/JPY exchange rate today" --freshness pd
- "GBP JPY forecast technical analysis" --freshness pw
- "pound yen H4 analysis" --content
- "Bank of England rate decision"
- "Bank of Japan policy meeting"

## Quality Standards

### Accuracy
- Verify rates from multiple sources
- Cross-check technical levels
- Cite sources where appropriate

### Timeliness
- Use latest available data (past 24 hours)
- Update on significant market moves
- Flag stale data if sources unavailable

### Clarity
- Use clear, professional language
- Explain technical terms when needed
- Structure for easy scanning
- Use emojis sparingly for visual hierarchy

### Risk Management
- Always include disclaimer
- Present multiple scenarios
- Emphasize risk management
- Never guarantee outcomes

## Troubleshooting

### No Telegram Credentials
If TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID are not available:
1. Save briefing to logs directory ✓
2. Create standalone HTML file
3. Log instructions for manual posting
4. Document credential requirements

### Data Source Failures
- Fall back to cached data
- Use alternative sources
- Note data limitations in briefing
- Consider postponing briefing if critical data unavailable

### Technical Issues
- Log all errors with context
- Save partial results
- Retry with exponential backoff
- Alert on critical failures

## Version History

- **1.0** (2026-03-01) - Initial strategy configuration
