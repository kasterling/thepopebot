# Sterling Intelligence Briefing - Quick Reference

## 🚀 Quick Start

### Generate Briefing (Manual)
```bash
# Via webhook
curl -X POST https://your-event-handler.com/webhook \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"job": "Generate the Sterling Intelligence Briefing. 1. Check GBP/JPY rates and news. 2. Analyze sentiment. 3. Summarize H4 outlook based on config/STERLING_STRATEGY.md. 4. Post summary to Telegram."}'
```

### Send to Telegram
```bash
# From event handler server
./event_handler/tools/send-sterling-briefing.sh
```

## 📊 Briefing Components

| Component | What It Shows |
|-----------|---------------|
| **Current Rate** | GBP/JPY spot rate (1 GBP = X JPY) |
| **Weekly Performance** | 7-day price movement and trend |
| **BoE Analysis** | Bank of England policy, rate expectations |
| **BoJ Analysis** | Bank of Japan stance, political influences |
| **Sentiment** | Market mood (bullish/bearish/neutral) |
| **H4 Outlook** | 4-hour timeframe bias and drivers |
| **Key Levels** | Support and resistance zones |
| **Recommendation** | Trading scenarios and risk events |

## 🔧 Key Files

```
config/STERLING_STRATEGY.md              # Analysis framework
logs/{job-id}/STERLING_INTELLIGENCE_BRIEFING.md  # Generated briefing
event_handler/tools/send-telegram.js     # Telegram sender
event_handler/tools/send-sterling-briefing.sh    # Quick sender
docs/STERLING_INTELLIGENCE_BRIEFING.md   # Full documentation
```

## ⏰ Recommended Schedule

```json
{
  "name": "sterling-briefing-morning",
  "schedule": "0 7 * * 1-5",
  "job": "Generate Sterling briefing",
  "enabled": true
}
```

Common times (UTC):
- `0 7 * * 1-5` - 7 AM (London open)
- `0 13 * * 1-5` - 1 PM (New York open)
- `0 0 * * 1-5` - Midnight (Tokyo open)
- `0 9,15 * * 1-5` - 9 AM + 3 PM (overlap)

## 🎯 Reading the Outlook

### Bullish Signals (↑ GBP/JPY)
- BoE hawkish / rate hike expectations
- BoJ ultra-dovish stance
- Strong UK economic data
- Risk-on sentiment (JPY weakens)
- Price above key MAs

### Bearish Signals (↓ GBP/JPY)
- BoE dovish / rate cut expectations
- BoJ hawkish shift
- Weak UK economic data
- Risk-off sentiment (JPY safe-haven)
- Price below key MAs

### Neutral
- Conflicting signals
- Range-bound trading
- Low volatility
- Awaiting key events

## 📱 Telegram Format

✅ **Supported**:
- `<b>bold</b>`
- `<i>italic</i>`
- `<code>code</code>`
- Plain bullets (• -)

❌ **Unsupported**:
- Markdown (* ** ` etc)
- HTML tags (div, p, h1, ul, li, br)
- HTML comments
- Unclosed tags

## 🔑 Environment Variables

```bash
# Required for agent (LLM can see)
BRAVE_API_KEY="sk-..."

# Required for Telegram (LLM cannot see)
TELEGRAM_BOT_TOKEN="123456:ABC..."
TELEGRAM_CHAT_ID="123456789"
```

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| No briefing generated | Check Brave API key, job logs |
| Telegram send fails | Verify bot token, chat ID |
| Outdated data | Check Brave Search API status |
| Rate limit errors | Wait or reduce search frequency |
| Parse error | Check HTML formatting (no unsupported tags) |

## 📈 Key Levels Interpretation

**Current**: 210.08

**Support** (potential buy zones):
- 209.50 - Recent swing low
- 208.00 - Psychological level
- 206.50 - Strong support

**Resistance** (potential sell zones):
- 211.50 - Recent swing high
- 212.80 - Weekly resistance
- 214.00 - Strong resistance

**Trading Logic**:
- Break above resistance → bullish continuation
- Break below support → bearish continuation
- Bounce off level → reversal possible
- Range-bound → wait for breakout

## 🎓 Central Bank Impact

| Event | Impact on GBP | Impact on JPY | Result on GBP/JPY |
|-------|---------------|---------------|-------------------|
| BoE rate hike | ↑ Strengthen | - | ↑ Rise |
| BoE rate cut | ↓ Weaken | - | ↓ Fall |
| BoJ rate hike | - | ↑ Strengthen | ↓ Fall |
| BoJ ultra-dovish | - | ↓ Weaken | ↑ Rise |
| Risk-off | - | ↑ Safe-haven | ↓ Fall |
| Risk-on | - | ↓ Carry unwinding | ↑ Rise |

## 📚 Further Reading

- Full docs: `docs/STERLING_INTELLIGENCE_BRIEFING.md`
- Strategy framework: `config/STERLING_STRATEGY.md`
- Latest briefing: `logs/*/STERLING_INTELLIGENCE_BRIEFING.md`
