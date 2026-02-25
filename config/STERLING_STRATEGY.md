# Sterling Intelligence Briefing Strategy

This document defines the strategy and methodology for generating the Sterling Intelligence Briefing for GBP/JPY.

## Overview

The Sterling Intelligence Briefing is a comprehensive H4 (4-hour) technical analysis report for the GBP/JPY currency pair, combining real-time market data, technical analysis, fundamental drivers, and actionable trading insights.

## Objectives

1. **Monitor** GBP/JPY exchange rates and market developments
2. **Analyze** technical structure across multiple timeframes (focus on H4)
3. **Identify** key support/resistance levels and trading scenarios
4. **Assess** fundamental drivers affecting the pair
5. **Synthesize** sentiment and provide actionable outlook
6. **Deliver** clear, concise briefing via Telegram

## Data Sources

### Primary Sources
- **Brave Search API** - Real-time web search for exchange rates and news
- **Technical Analysis Sites**: FXDailyReport, MarketPulse, FXStreet, DailyForex
- **Financial News**: Bloomberg, Reuters, ForexLive, TradingView
- **Central Bank Communications**: Bank of England, Bank of Japan

### Key Search Queries
- "GBP/JPY exchange rate today"
- "GBP/JPY forex analysis news [current month/year]"
- "British Pound Japanese Yen technical analysis"
- "Bank of England interest rate"
- "Japan yen policy"

## Analysis Framework

### 1. Current Market State
- Current price/range
- Recent price action (highs/lows)
- Overall bias (bullish/bearish/neutral)
- Volatility assessment

### 2. Technical Structure

#### Support Levels (3-4 key levels)
- Immediate support (short-term)
- Key support (tested recently)
- Major support (monthly/yearly significance)
- Pivotal support (game-changing break level)

#### Resistance Levels (3-4 key levels)
- Immediate resistance
- Major resistance
- Moving averages (20-EMA, 50-MA, 200-MA)
- Recent highs/peaks

#### Technical Signals
- Trend structure (higher highs/lows or lower highs/lows)
- Moving average positions and crossovers
- Trendline analysis
- Chart patterns (tops, bottoms, triangles)
- Momentum indicators (EMA breaks, momentum shifts)

### 3. Fundamental Drivers

#### GBP Factors
- UK economic data (unemployment, GDP, inflation)
- Bank of England policy stance and rate expectations
- Political developments
- Risk sentiment correlation (equity markets)

#### JPY Factors
- Bank of Japan policy
- Japanese economic indicators
- Yield curve dynamics
- Safe-haven flows

#### Cross-Pair Dynamics
- Interest rate differentials
- Risk-on vs risk-off environment
- Geopolitical developments
- Commodity correlations

### 4. H4 Trading Outlook

#### Scenario Planning
For each scenario, define:
- **Trigger**: What price action/event confirms this scenario
- **Targets**: Sequential price objectives with rationale
- **Invalidation**: What price action negates this scenario
- **Probability**: Relative likelihood based on confluence

#### Base Case Scenario
- Most likely direction based on current setup
- Technical and fundamental support
- Key levels and progression

#### Alternative Scenario
- Contrarian view
- Required triggers
- Less probable but viable path

### 5. Risk Management Notes
- Volatility considerations
- Stop placement guidance
- Timing risks (weekend gaps, news events)
- Position sizing considerations

## Output Format

### Telegram Message Structure
```
📊 [TITLE] Sterling Intelligence Briefing
[SUBTITLE] GBP/JPY H4 Technical Outlook | [DATE]

🔴 Current State
[Price, bias, context]

📉 Technical Structure
[Key patterns and signals]

🎯 Key Levels

Support:
[Level 1] - [Description]
[Level 2] - [Description]
[Level 3] - [Description]

Resistance:
[Level 1] - [Description]
[Level 2] - [Description]

📰 Fundamentals
[GBP drivers]
[JPY drivers]
[Rate differential context]

⚡ H4 Outlook

Base Case ([Bias]):
Trigger: [Specific price action]
→ [Target 1]
→ [Target 2]
→ [Target 3]
Invalidation: [Price level]

Alt Case ([Opposite bias]):
Trigger: [Specific price action]
→ [Targets]

💬 Summary
[Synthesis and key takeaway]

Generated: [Timestamp]
```

### Formatting Guidelines (Telegram HTML)
- Use `<b>bold</b>` for key terms, levels, and section headers
- Use `<i>italic</i>` for timestamps and subtle emphasis
- Use `•` or `→` for plain text bullets
- Keep under 4096 characters (Telegram limit)
- No HTML comments, Markdown, or unsupported tags
- Emojis for visual hierarchy (📊🔴📉🎯📰⚡💬)

## Frequency & Triggers

### Scheduled Briefings
- **Daily**: 08:00 UTC (before London open)
- **Additional**: 12:00 UTC (mid-session check)
- **Weekly**: Sunday 20:00 UTC (week-ahead outlook)

### Event-Driven Briefings
- Major technical break (key level violation)
- Central bank announcements
- Significant fundamental releases (UK/Japan)
- High volatility events (>200 pip moves)

## Quality Checklist

Before finalizing briefing:
- [ ] Current price data within last 24 hours
- [ ] At least 3 support and 3 resistance levels identified
- [ ] Both bullish and bearish scenarios addressed
- [ ] Fundamental context included
- [ ] Risk management notes present
- [ ] Clear trigger conditions for scenarios
- [ ] Message under 4096 characters
- [ ] HTML formatting validated (no unsupported tags)
- [ ] Emojis render correctly
- [ ] Timestamp included

## Evolution & Improvement

### Performance Tracking
- Track key level accuracy (support/resistance holds/breaks)
- Monitor scenario accuracy (which case played out)
- Document major misses and lessons learned

### Strategy Refinement
- Update data sources as quality varies
- Refine technical indicator weights based on accuracy
- Adjust timeframe focus based on user needs
- Incorporate user feedback

## Tools & Dependencies

- **Brave Search API**: Web search and content extraction
- **llm-secrets**: Access to API keys and credentials
- **Telegram Bot API**: Message delivery
- **Node.js**: Scripting environment

## Notes

- Focus on **actionable** insights, not just description
- **Objectivity**: Present both sides, let trader decide
- **Clarity**: Simple language, avoid jargon unless necessary
- **Timeliness**: Fresh data critical for relevance
- **Consistency**: Same structure each time builds trust
- **Risk-awareness**: Always mention volatility and invalidation levels

---

*Last Updated: February 25, 2026*
