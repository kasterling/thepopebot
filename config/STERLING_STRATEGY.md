# Sterling Intelligence Briefing Strategy

## Overview
This document defines the strategy and methodology for generating the daily Sterling Intelligence Briefing for GBP/JPY.

## Data Sources
- **Brave Search API** - Real-time forex rates, news, and analysis
- **Multiple forex platforms** - FXStreet, WalletInvestor, Forex.com, MinkabuFX
- **Technical indicators** - RSI, Moving Averages, ATR, chart patterns

## Analysis Framework

### 1. Rate Collection
- Current GBP/JPY exchange rate
- 24-hour price change and percentage
- Intraday high/low levels
- Recent price action (1-7 day trends)

### 2. Technical Analysis (H4 Timeframe Focus)
**Key Components:**
- **Trend Identification:** Analyze higher timeframe structure (daily/4H)
- **Support/Resistance Levels:** Identify key technical levels
- **Momentum Indicators:**
  - RSI (Relative Strength Index) - Bullish above 50, bearish below
  - Moving Averages (50, 100, 200-day) - Trend direction and support/resistance
  - ATR (Average True Range) - Volatility measurement
- **Chart Patterns:** Triangles, channels, breakouts, consolidations
- **Volume Analysis:** Confirm price moves with volume data

**H4 (4-Hour) Specific Guidelines:**
- Focus on intraday to short-term swing opportunities (1-5 day holds)
- Identify clear support/resistance clusters
- Look for momentum confirmation before directional bias
- Note key pivot levels for entry/exit planning

### 3. Fundamental Analysis

**Sterling (GBP) Drivers:**
- Bank of England (BoE) monetary policy stance
- UK inflation data (CPI, Core CPI)
- UK GDP and employment figures
- BoE MPC member speeches and voting patterns
- UK political developments (Brexit-related, fiscal policy)

**Japanese Yen (JPY) Drivers:**
- Bank of Japan (BoJ) policy stance and normalization timeline
- Japan inflation data (CPI, Tokyo CPI)
- Japan GDP and trade balance
- BoJ Governor Ueda communications
- Risk sentiment (Yen as safe haven)

**Key Interest Rate Differential:**
- Monitor spread between UK and Japan rates
- Rate cut/hike expectations from both central banks
- Impact on carry trade dynamics

### 4. Sentiment Analysis

**Sentiment Scoring Model:**
- **Bullish Factors:** Technical breakouts, risk-on environment, favorable fundamentals for GBP
- **Bearish Factors:** Technical breakdowns, risk-off environment, GBP weakness drivers
- **Aggregate Score:** Express as percentage (e.g., "65% Bullish / 35% Bearish")

**Sentiment Indicators:**
- Central bank policy divergence
- Market positioning (COT reports when available)
- News flow tone and headline analysis
- Cross-currency correlations (EUR/GBP, GBP/USD impact)

### 5. Outlook Generation

**Structure:**
1. **Primary Scenario** (Highest probability 50-70%)
   - Trigger conditions
   - Price targets
   - Stop loss levels
   - Risk/reward ratio

2. **Secondary Scenario** (20-35%)
   - Alternative price action path
   - Conditions required

3. **Low Probability Scenario** (<20%)
   - Tail risk considerations
   - Black swan type events

### 6. Risk Factors
- Upcoming economic data releases
- Central bank speeches/meetings
- Geopolitical events
- Technical levels that could invalidate thesis

## Briefing Format

### Full Analysis (Markdown)
Saved to: `/job/logs/sterling-intelligence-briefing-YYYY-MM-DD.md`

**Sections:**
1. Current Market Status
2. Technical Analysis - H4 Outlook
3. Fundamental Drivers
4. Market Sentiment Analysis
5. H4 Trading Outlook (scenarios)
6. Key Events to Watch
7. Trading Recommendation
8. Risk Disclaimer

### Telegram Format (HTML)
Saved to: `/tmp/sterling-briefing-telegram.txt`

**Condensed version including:**
- Current rate and change
- H4 outlook (1-2 words: BULLISH/BEARISH/NEUTRAL)
- Key resistance/support levels
- Key fundamental drivers (bullet points)
- Sentiment percentage
- Trade idea (entry/target/stop)
- Main risk factor
- Link to full analysis

## Frequency
- **Generation:** Daily at 00:00 UTC
- **Updates:** On major central bank announcements or significant market moves

## Quality Standards
- All data must be from last 24-48 hours
- Cross-reference multiple sources for rates
- Clearly distinguish technical vs fundamental analysis
- Always include risk disclaimer
- Use emojis for visual clarity in Telegram format
- Maintain professional, objective tone

## Continuous Improvement
- Track forecast accuracy over time
- Adjust weighting of bullish/bearish factors based on outcomes
- Refine support/resistance level identification
- Update fundamental factor priorities as market regime changes
