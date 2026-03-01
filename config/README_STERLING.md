# Sterling Intelligence Briefing System

## 📋 Overview

An automated GBP/JPY (British Pound / Japanese Yen) forex analysis system that:
1. ✅ Gathers current exchange rates and news via Brave Search
2. ✅ Analyzes Bank of England and Bank of Japan policies
3. ✅ Evaluates market sentiment
4. ✅ Provides H4 (4-hour) timeframe technical outlook
5. ⏳ Posts formatted summary to Telegram (manual step required)

## 🎯 Current Status

**Latest Briefing**: March 1, 2026 16:00 UTC
- **GBP/JPY Rate**: 210.08
- **H4 Outlook**: NEUTRAL to BEARISH
- **Key Driver**: BoE likely to cut rates March 19 (80% probability)
- **Sentiment**: Sterling weak, Yen strengthening despite dovish politics

## 📂 System Files

```
config/
├── STERLING_STRATEGY.md           # Analysis framework and methodology
├── STERLING_QUICK_REFERENCE.md    # Cheat sheet for quick usage
└── README_STERLING.md             # This file

docs/
└── STERLING_INTELLIGENCE_BRIEFING.md  # Complete documentation

event_handler/tools/
├── send-telegram.js               # CLI tool for Telegram messages
└── send-sterling-briefing.sh      # Quick send script

logs/fdef5010-a334-4f32-8bb0-d593c91e1310/
├── STERLING_INTELLIGENCE_BRIEFING.md   # Current briefing (Telegram-ready)
└── JOB_COMPLETION_SUMMARY.md           # Job completion details
```

## 🚀 Quick Actions

### 📱 Send Current Briefing to Telegram

**Requirements**: `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` environment variables

```bash
# From event handler server (has Telegram credentials)
./event_handler/tools/send-sterling-briefing.sh
```

### 🔄 Generate New Briefing

**Manual** (via webhook):
```bash
curl -X POST https://your-event-handler.com/webhook \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"job": "Generate the Sterling Intelligence Briefing. 1. Check GBP/JPY rates and news. 2. Analyze sentiment. 3. Summarize H4 outlook based on config/STERLING_STRATEGY.md. 4. Post summary to Telegram."}'
```

**Automated** (add to `operating_system/CRONS.json`):
```json
{
  "name": "sterling-briefing",
  "schedule": "0 9,15 * * 1-5",
  "type": "agent",
  "job": "Generate the Sterling Intelligence Briefing. 1. Check GBP/JPY rates and news. 2. Analyze sentiment. 3. Summarize H4 outlook based on config/STERLING_STRATEGY.md. 4. Post summary to Telegram.",
  "enabled": true
}
```

## 📊 What's in the Briefing

| Section | Content |
|---------|---------|
| **Current Rate** | Live GBP/JPY spot rate |
| **Weekly Performance** | 7-day trend and key levels |
| **Bank of England** | Policy stance, rate expectations, UK economic data |
| **Bank of Japan** | Monetary policy, political influences, economic conditions |
| **Sentiment** | Market mood for Sterling and Yen |
| **H4 Outlook** | 4-hour timeframe bias (bullish/bearish/neutral) |
| **Key Levels** | Support and resistance zones to monitor |
| **Recommendation** | Trading scenarios and upcoming risk events |

## 🔧 Configuration

### Analysis Framework
Edit `STERLING_STRATEGY.md` to customize:
- Monitored data points
- Bullish/bearish factors
- Technical analysis approach
- Report structure

### Schedule
Recommended times (UTC):
- **7:00 AM** - London market open
- **1:00 PM** - New York market open
- **9:00 AM + 3:00 PM** - Both markets active

### Telegram Format
Briefing uses strict Telegram HTML:
- `<b>bold</b>` for emphasis
- `<i>italic</i>` for disclaimers
- `<code>code</code>` for technical terms
- Plain text bullets (• or -)
- No Markdown, no unsupported HTML tags

## 🎓 Understanding the Analysis

### H4 Outlook Interpretation

**BULLISH** (↑):
- BoE hawkish or rate hike expected
- BoJ ultra-dovish
- Strong UK data, weak Japan data
- Risk-on sentiment (carry trades)

**BEARISH** (↓):
- BoE dovish or rate cut expected (← Current)
- BoJ hawkish or intervention risk
- Weak UK data, strong Japan data
- Risk-off sentiment (safe-haven flows)

**NEUTRAL**:
- Mixed signals from central banks
- Range-bound price action
- Low volatility, awaiting catalysts

### Key Levels Usage

**Support** (potential buy zones):
- 209.50 - Immediate support, watch for bounce
- 208.00 - Psychological level
- 206.50 - Strong support, major zone

**Resistance** (potential sell zones):
- 211.50 - Immediate resistance, breakout watch
- 212.80 - Weekly resistance
- 214.00 - Strong resistance, major zone

**Trading logic**:
- Break above resistance → bullish continuation expected
- Break below support → bearish continuation expected
- Bounce off level → potential reversal
- Consolidation → wait for clear breakout

## 📚 Documentation

- **Full System Guide**: `docs/STERLING_INTELLIGENCE_BRIEFING.md`
- **Quick Reference**: `config/STERLING_QUICK_REFERENCE.md`
- **Strategy Framework**: `config/STERLING_STRATEGY.md`
- **Latest Briefing**: `logs/*/STERLING_INTELLIGENCE_BRIEFING.md`

## 🔐 Security Notes

- **BRAVE_API_KEY**: Stored in LLM_SECRETS (agent can access)
- **TELEGRAM_BOT_TOKEN**: Stored in SECRETS (agent cannot access, event handler can)
- **TELEGRAM_CHAT_ID**: Environment variable on event handler

This separation ensures the Docker agent (LLM) can gather data but cannot directly send Telegram messages, maintaining security boundaries.

## ⚠️ Disclaimers

1. **Not Financial Advice**: This system provides information only, not trading recommendations
2. **Data Accuracy**: Relies on Brave Search API; verify critical data independently
3. **Market Risk**: Forex trading involves substantial risk; only trade with risk capital
4. **No Guarantee**: Past performance does not guarantee future results

## 🚧 Future Enhancements

Potential improvements:
- [ ] Direct forex data API integration (OANDA, Alpha Vantage)
- [ ] Technical indicator calculations (RSI, MACD, Bollinger Bands)
- [ ] Chart generation with indicators
- [ ] Multiple timeframe analysis (H1 + H4 + D1)
- [ ] Economic calendar integration
- [ ] Position sizing recommendations
- [ ] Multi-pair analysis (add EUR/JPY, USD/JPY, etc.)

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Briefing not generated | Check Brave API key, review job logs |
| Outdated data | Verify Brave Search API status, check `--freshness pd` flag |
| Telegram send fails | Verify `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` |
| Parse error | Check HTML formatting (only `<b>`, `<i>`, `<code>` allowed) |
| Rate limits | Reduce search frequency or upgrade Brave API plan |

## 📞 Quick Help

**View latest briefing**:
```bash
find logs -name "STERLING_INTELLIGENCE_BRIEFING.md" -exec ls -lt {} + | head -1
```

**Send to Telegram**:
```bash
./event_handler/tools/send-sterling-briefing.sh
```

**Test Telegram credentials**:
```bash
node event_handler/tools/send-telegram.js "Test message"
```

---

**System Version**: 1.0  
**Created**: March 1, 2026  
**Job ID**: fdef5010-a334-4f32-8bb0-d593c91e1310
