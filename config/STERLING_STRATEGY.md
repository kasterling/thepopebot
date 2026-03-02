# Sterling (GBP/JPY) Trading Strategy

This document defines the strategy and parameters for Sterling Intelligence Briefings.

## Overview

**Pair:** GBP/JPY (British Pound / Japanese Yen)  
**Timeframe:** H4 (4-hour chart focus)  
**Update Frequency:** Daily before London open (08:00 UTC recommended)  
**Analysis Type:** Comprehensive fundamental + technical

## Briefing Components

### 1. Market Snapshot
- Current rate and session range
- Daily change and key moves
- Pivot points (S1, P, R1)

### 2. Market Drivers Analysis
Analyze three categories:

#### Japanese Yen Factors
- Bank of Japan policy stance
- Tokyo/National CPI data
- Japanese government statements
- Intervention risk
- Safe-haven flows

#### British Pound Factors
- Bank of England policy signals
- UK inflation data
- Political developments
- Manufacturing/Services PMI
- Labor market data

#### Risk Sentiment
- Geopolitical tensions
- Global risk appetite
- Cross-market correlations
- USD dynamics

### 3. Technical Analysis (H4)
- Current structure and bias
- Key support and resistance levels
- Daily pivot points
- Pattern recognition
- Momentum indicators

### 4. Scenario Planning
Provide probability-weighted scenarios:
- **Range/Consolidation** (baseline)
- **Bullish Case** (breakout up)
- **Bearish Case** (breakdown)

Include triggers, targets, and probabilities for each.

### 5. Trading Framework
For each scenario:
- Entry zones
- Stop loss levels
- Profit targets
- Risk/reward ratios
- Position sizing recommendations

### 6. Risk Warnings
- High-risk events this week
- Intervention risks
- Volatility considerations
- Geopolitical factors

## Data Sources

### Primary Sources
1. **FXStreet** - Real-time forex analysis and news
2. **ActionForex** - Technical analysis and pivot points
3. **Reuters/Investing.com** - Central bank coverage
4. **Bank of England** - Official policy statements
5. **Bank of Japan** - Official policy statements

### Search Strategy
Use Brave Search API with these queries:
- "GBP/JPY exchange rate forecast" (freshness: past day)
- "Bank of England interest rates" (freshness: past week)
- "Bank of Japan policy" (freshness: past week)
- "UK economic data" (freshness: past day)
- "Tokyo CPI inflation" (freshness: past week)

## Output Formats

### Full Briefing (Markdown)
- **Target:** 2,000-3,000 words
- **Sections:** As outlined above
- **Location:** `logs/<job-id>/sterling-briefing-YYYY-MM-DD.md`
- **Audience:** Analysts and researchers

### Telegram Summary (Text)
- **Target:** 1,500-2,000 bytes
- **Format:** Emoji-enhanced, mobile-optimized
- **Location:** `logs/<job-id>/telegram-summary.txt`
- **Audience:** Traders on mobile devices

### Quick Reference (Markdown Table)
- **Target:** <2KB, scannable
- **Format:** Table-based with key levels
- **Location:** `logs/sterling-quick-reference.md`
- **Audience:** Trading desk

## Automation

### Daily Generation (Recommended Cron)
```json
{
  "name": "sterling-briefing-daily",
  "schedule": "0 8 * * 1-5",
  "type": "agent",
  "job": "Read the file at config/STERLING_STRATEGY.md and generate the Sterling Intelligence Briefing following those guidelines.",
  "enabled": true
}
```

### Telegram Auto-Post
After briefing generation, automatically post to Telegram via event handler (see TELEGRAM_POSTING.md for setup options).

## Key Principles

1. **Data-Driven:** Use real-time market data, not assumptions
2. **Balanced:** Present bull, bear, and neutral cases
3. **Actionable:** Provide specific levels and strategies
4. **Risk-Aware:** Always include warnings and sizing guidance
5. **Honest:** State probability estimates and conviction levels

## Conviction Levels

| Level | Description | Position Size |
|-------|-------------|---------------|
| High | Clear directional setup | 100% of normal |
| Medium | Mixed signals, one side favored | 50-75% of normal |
| Low | Unclear, range-bound | 25-50% of normal |
| None | Stand aside | 0% |

## Position Sizing Guidelines

**Base Rule:** Reduce position size when:
- Geopolitical risk elevated
- Low conviction environment
- Major central bank events pending
- Volatility spike (ATR > 20-day average)

**Increase Size When:**
- High conviction setup
- Clear technical pattern
- Fundamental and technical alignment
- Volatility normalized

## Key Levels Reference

Update these weekly based on technical analysis:

**Major Resistance Zones:**
- 220.00 (psychological)
- 215.00 (2024 high area)
- 212.50 (near-term)

**Major Support Zones:**
- 207.00 (recent swing low)
- 203.00 (strong support)
- 200.00 (psychological)

**Current Range:**
- Update daily in briefing based on H4 chart

## Event Calendar Watch List

Monitor these regularly:
- BoE Monetary Policy Meetings (8 per year)
- BoJ Policy Meetings (8 per year)
- UK CPI (monthly)
- Tokyo/National CPI (monthly)
- UK GDP (quarterly)
- UK Employment (monthly)
- UK PMI (monthly)
- Japan GDP (quarterly)

## Quality Checklist

Before publishing, verify:
- [ ] Current rate confirmed via multiple sources
- [ ] News events researched and cited
- [ ] Technical levels drawn from actual chart
- [ ] Probabilities add to 100%
- [ ] Entry/stop/target levels logical
- [ ] Risk warnings included
- [ ] Data sources cited
- [ ] Timestamps accurate
- [ ] Telegram format tested
- [ ] No obvious errors or contradictions

---

**Document Owner:** Sterling Briefing Team  
**Last Updated:** 2026-03-02  
**Next Review:** Quarterly or as market structure changes significantly
