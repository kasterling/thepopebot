# Sterling Briefing Quick Reference

## Essential Data Points

### 1. Exchange Rate ✅
- [ ] Current GBP/JPY rate
- [ ] Intraday high/low
- [ ] 24h % change
- [ ] Source & timestamp

### 2. News Search Queries 🔍
```
"GBP/JPY exchange rate today"
"GBP JPY forex news sentiment"  
"GBP JPY H4 chart technical analysis"
"Bank of Japan policy"
"Bank of England interest rates"
```

### 3. Key Levels Checklist 📊

**Always identify:**
- [ ] 3-5 resistance levels above price
- [ ] 3-5 support levels below price
- [ ] 50-day SMA
- [ ] 100-day SMA
- [ ] Recent swing high/low

**Common Reference Points:**
- Previous day high/low
- Previous week high/low
- Monthly pivot points
- Psychological levels (round numbers)

### 4. Sentiment Signals 🎯

**Bullish Indicators:**
- ✅ JPY weakness (BoJ dovish)
- ✅ Risk-on environment
- ✅ RSI > 50
- ✅ Price above key moving averages
- ✅ Higher highs & higher lows

**Bearish Indicators:**
- ❌ JPY strength (BoJ hawkish)
- ❌ Risk-off / safe haven demand
- ❌ RSI < 50
- ❌ Price below key moving averages
- ❌ Lower highs & lower lows

**Neutral Indicators:**
- ↔️ Consolidation pattern
- ↔️ RSI near 50
- ↔️ Mixed fundamental signals
- ↔️ Tight range, low volatility

### 5. News Impact Priority 📰

**High Impact (Immediate reaction):**
1. BoJ/BoE interest rate decisions
2. BoJ/BoE board member appointments
3. Major economic surprises (GDP, CPI)
4. Emergency policy announcements
5. Geopolitical shocks

**Medium Impact (Gradual influence):**
1. Central bank meeting minutes
2. Economic data releases
3. Political developments
4. Cross-market correlations

**Low Impact (Background noise):**
1. Routine speeches
2. Expected data confirmations
3. Minor policy adjustments

### 6. Quick Analysis Template ⚡

```
RATE: [XXX.XX] JPY/GBP | [+/-X.XX%]
TREND: [Bullish/Bearish/Neutral]
KEY NEWS: [One-line summary]
TARGET: [XXX.XX] 
SUPPORT: [XXX.XX]
BIAS: [Direction] ([XX]% probability)
```

### 7. Brave Search Commands 💻

**Get current rate:**
```bash
cd /job/.pi/skills/brave-search
./search.js "GBP/JPY exchange rate today" -n 5 --content --freshness pd
```

**Get news & sentiment:**
```bash
./search.js "GBP JPY forex news sentiment" -n 5 --freshness pd
```

**Get technical analysis:**
```bash
./search.js "GBP JPY H4 technical analysis" -n 3 --freshness pd
```

**Extract specific article:**
```bash
./content.js https://www.fxstreet.com/news/[article-url]
```

### 8. Common GBP/JPY Patterns 📈

**Typical Ranges:**
- Daily: 50-150 pips
- Weekly: 200-500 pips
- High volatility: >150 pips/day

**Historical Levels (2024-2026):**
- 2024 High: ~220.00
- 2024 Low: ~180.00
- 2026 Current Range: 207-215

**Key Psychological Levels:**
- 200.00, 205.00, 210.00, 215.00, 220.00

### 9. Time Zone Considerations 🕐

**Best Trading Hours (GBP/JPY):**
- London Open: 08:00-12:00 UTC
- Tokyo-London Overlap: 08:00-09:00 UTC
- Major News: Usually 07:00-14:00 UTC

**Briefing Timing:**
- Generate: 08:00 UTC (Mon-Fri)
- Publish: Within 30 minutes
- Update: On major news breaks

### 10. Red Flags 🚩

**Skip posting if:**
- Data is >2 hours stale
- Major news pending (pre-NFP, etc.)
- Extreme volatility (circuit breakers)
- Technical/API failures

**Include disclaimer if:**
- Mixed signals (neutral bias)
- Low confidence (<50%)
- Major event risk ahead
- Unusual market conditions

---

## One-Minute Briefing Checklist ✓

1. [ ] Get rate (Brave search)
2. [ ] Get news (Brave search) 
3. [ ] Identify 3 supports
4. [ ] Identify 3 resistances
5. [ ] Check RSI/momentum
6. [ ] Assess sentiment (Bullish/Bearish/Neutral)
7. [ ] Calculate probability
8. [ ] Write strategy
9. [ ] Format for Telegram
10. [ ] Post & archive

**Target Time:** 5-10 minutes per briefing

---

**Pro Tips:**
- Always cross-reference multiple sources
- Trust price action over indicators
- Big picture > short-term noise
- Clear bias > fence-sitting
- Risk management first

**Emergency Contacts:**
- BoJ Policy: https://www.boj.or.jp/en/
- BoE Policy: https://www.bankofengland.co.uk/
- FX Calendar: https://www.forexfactory.com/calendar
