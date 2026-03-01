# Sterling Intelligence Briefing Strategy

## Overview

This configuration defines the strategy for generating automated GBP/JPY (Sterling/Yen) intelligence briefings on the H4 (4-hour) timeframe.

## Data Sources

### Primary Sources
1. **Price Data**: GBP/JPY exchange rates (real-time via Brave Search)
2. **News**: Forex market news and analysis (FXStreet, WalletInvestor, etc.)
3. **Technical Indicators**: RSI, Moving Averages, Support/Resistance levels

### Search Queries
- "GBP/JPY exchange rate today"
- "GBP JPY forex news analysis"
- "GBP JPY technical analysis [current month/year]"
- "Sterling Yen forex forecast"
- "UK Sterling GBP economic news [current month/year]"

## Analysis Framework

### 1. Current Market Position
- Current rate
- 24-hour change
- Trend direction (bullish/bearish/neutral)
- Intraday high/low

### 2. Technical Analysis (H4 Timeframe)
- **Trend Status**: Identify primary trend direction
- **Key Moving Averages**: 
  - 50-day SMA
  - 100-day SMA
  - 200-day SMA
- **Momentum Indicators**:
  - RSI (Relative Strength Index)
  - Direction and strength
- **Support Levels**: Identify 3-5 key support zones
- **Resistance Levels**: Identify 3-5 key resistance zones
- **Chart Patterns**: Any notable patterns (triangles, channels, etc.)

### 3. Fundamental Drivers
Analyze key factors affecting both currencies:

#### GBP (Sterling) Factors:
- Bank of England (BoE) monetary policy
- UK economic data (GDP, inflation, employment)
- Political developments
- Brexit-related news

#### JPY (Yen) Factors:
- Bank of Japan (BoJ) monetary policy
- Japanese economic indicators
- Risk sentiment (safe-haven flows)
- Government/PM statements on monetary policy

### 4. Sentiment Analysis
- Market sentiment (risk-on vs risk-off)
- G10 currency performance comparison
- Cross-pair correlation (USD/JPY, EUR/GBP influence)

## H4 Outlook Generation

### Scenario Planning
Generate 2-3 scenarios with probability estimates:

1. **Primary Scenario (50-70% probability)**
   - Most likely direction
   - Key levels to watch
   - Catalysts that would confirm

2. **Alternative Scenario (20-40% probability)**
   - Consolidation or counter-trend
   - Conditions for this outcome

3. **Low Probability Scenario (5-15% probability)**
   - Unexpected reversal
   - What would trigger this

### Trading Recommendations
- **Bias**: Long/Short/Neutral
- **Entry Points**: Specific price levels
- **Targets**: 2-3 profit targets
- **Stop Loss**: Risk management level
- **Risk/Reward Ratio**: Minimum 1:2
- **Confidence Level**: 1-10 scale

## Risk Factors

Always include:
- Upcoming economic data releases
- Central bank meetings
- Political events
- Technical invalidation levels
- Black swan scenarios

## Output Format

### Telegram Format
- Use HTML formatting for readability
- Include emojis for visual clarity: 📊 📈 📰 💡 🎯 ⚠️ 🟢 🔴
- Keep total length under 4000 characters
- Structure with clear sections using dividers (━━━)
- Bold key information
- Use bullet points for lists

### Sections Order
1. Header (pair, timeframe, timestamp)
2. Current Market Position
3. Technical Analysis
4. Fundamental Drivers
5. H4 Outlook & Strategy
6. Risk Factors
7. Trading Recommendation
8. Disclaimer

## Disclaimer

Always include:
*"This briefing is for informational purposes only. Always manage risk appropriately and conduct your own analysis before trading."*

## Automation

### Scheduled Generation
- **Frequency**: Every 4 hours (aligned with H4 timeframe)
- **Timing**: 00:00, 04:00, 08:00, 12:00, 16:00, 20:00 UTC
- **Delivery**: Automatic posting to configured Telegram chat

### Trigger Events
Also generate briefing on:
- Major GBP or JPY news events
- BoE or BoJ announcements
- Significant technical breakouts (>1% move)
- Manual request via Telegram chat

## Configuration Variables

```json
{
  "pair": "GBP/JPY",
  "timeframe": "H4",
  "schedule": "0 */4 * * *",
  "data_sources": ["brave_search"],
  "technical_indicators": ["RSI", "SMA50", "SMA100", "SMA200"],
  "min_confidence": 5,
  "max_scenarios": 3
}
```

## Version History

- **v1.0** (2026-03-01): Initial strategy document created
