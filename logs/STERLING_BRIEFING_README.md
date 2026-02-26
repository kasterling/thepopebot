# Sterling Intelligence Briefing - Usage Guide

## 📋 Overview

The Sterling Intelligence Briefing provides daily GBP/JPY forex analysis with H4 (4-hour) timeframe technical outlook, sentiment analysis, and trading recommendations.

## 📂 Files Generated

| File | Purpose |
|------|---------|
| `config/STERLING_STRATEGY.md` | Strategy framework and methodology |
| `logs/sterling-briefing-2026-02-26.md` | Full detailed briefing (Markdown) |
| `logs/sterling-briefing-summary.md` | Job execution summary |
| `tmp/post-telegram.sh` | Bash script to post to Telegram |
| `tmp/post-to-telegram.js` | Node.js script to post to Telegram |

## 🚀 How to Post to Telegram

### Method 1: Using the Bash Script

```bash
export TELEGRAM_BOT_TOKEN="your_bot_token_here"
export TELEGRAM_CHAT_ID="your_chat_id_here"
./tmp/post-telegram.sh
```

Or pass credentials directly:
```bash
./tmp/post-telegram.sh <bot_token> <chat_id>
```

### Method 2: Using the Node.js Script

```bash
cd /job
export TELEGRAM_BOT_TOKEN="your_bot_token_here"
export TELEGRAM_CHAT_ID="your_chat_id_here"
node tmp/post-to-telegram.js
```

Or pass credentials directly:
```bash
node tmp/post-to-telegram.js <bot_token> <chat_id>
```

### Method 3: Manual Copy-Paste

1. Open `/job/logs/sterling-briefing-2026-02-26.md`
2. Copy the content
3. Send via your Telegram bot or channel

## 🔄 Automating the Briefing

### Option A: Daily Cron Job

Add to `operating_system/CRONS.json`:

```json
{
  "name": "sterling-briefing-daily",
  "schedule": "0 6 * * 1-5",
  "type": "agent",
  "job": "Generate the Sterling Intelligence Briefing for GBP/JPY and post to Telegram",
  "enabled": true
}
```

Schedule explanation:
- `0 6 * * 1-5` = 6:00 AM UTC, Monday-Friday (weekdays only)
- Adjust time zone as needed for your target audience

### Option B: On-Demand via Webhook

Add to `operating_system/TRIGGERS.json`:

```json
{
  "name": "sterling-briefing-on-demand",
  "watch_path": "/webhook",
  "actions": [
    {
      "type": "agent",
      "job": "Generate the Sterling Intelligence Briefing for GBP/JPY and post to Telegram"
    }
  ],
  "enabled": true
}
```

Trigger with:
```bash
curl -X POST https://your-domain.com/webhook \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"trigger": "sterling_briefing"}'
```

## 🔑 Getting Telegram Credentials

### 1. Get Bot Token

1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Send `/newbot`
3. Follow prompts to create your bot
4. Copy the bot token (format: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`)

### 2. Get Chat ID

**For personal chat:**
1. Message your bot
2. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
3. Find `"chat":{"id":123456789}` in the JSON response

**For channel:**
1. Add bot as admin to your channel
2. Post a message in the channel
3. Visit same URL as above
4. Chat ID for channels starts with `-` (e.g., `-1001234567890`)

### 3. Store Credentials Securely

**Option 1:** Environment variables (Event Handler)
```bash
export TELEGRAM_BOT_TOKEN="your_bot_token"
export TELEGRAM_CHAT_ID="your_chat_id"
```

**Option 2:** GitHub Secrets (for CI/CD)
- Go to repo Settings → Secrets and variables → Actions
- Add secrets: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`

## 📊 Briefing Contents

Each briefing includes:

1. **Current Rate & Movement** - Latest GBP/JPY price and 24h change
2. **Key Headlines** - Top 4 news items affecting the pair
3. **H4 Technical Outlook** - Support, resistance, trend, momentum
4. **Sentiment Analysis** - Bullish/bearish with rationale
5. **Trading Bias** - Specific entry, target, stop levels
6. **Risk Factors** - Events and levels to watch

## 🔄 Updating the Strategy

Edit `config/STERLING_STRATEGY.md` to customize:
- Analysis timeframes
- Technical indicators
- Sentiment factors
- Briefing format
- Risk management rules

## 📈 Example Output

```
🇬🇧💴 Sterling Intelligence Briefing
GBP/JPY Analysis | February 26, 2026

📊 Current Rate: 211.94 (+0.80%)

📰 Key Headlines:
1️⃣ BoJ Dovish Shift: PM Takaichi nominates dovish academics
2️⃣ Policy Pressure: Uncertainty around rate hikes
3️⃣ UK Labor Weakness: Unemployment highest since 2021
4️⃣ Yen Weakness: JPY weakest G8 currency

📈 H4 Outlook: BULLISH
Support: 211.11 | 209.68 | 208.14
Resistance: 212.00 | 214.44 | 215.00

🎯 Trading Bias: Breakout above 212.00 targets 214.44+
```

## ⚠️ Disclaimer

This briefing is for informational purposes only. Not financial advice. Always:
- Do your own research
- Use proper risk management
- Never risk more than you can afford to lose
- Consult a qualified financial advisor

## 🆘 Troubleshooting

### "Failed to post to Telegram"
- Verify bot token is correct
- Verify chat ID is correct
- Ensure bot has been started (send /start)
- For channels, ensure bot is admin

### "No data found"
- Check internet connection
- Verify Brave Search API key is set
- Check if markets are open (data less available on weekends)

### "Permission denied"
- Make scripts executable: `chmod +x tmp/*.sh`
- Run with proper permissions

## 📞 Support

For issues or questions:
1. Check the strategy document at `config/STERLING_STRATEGY.md`
2. Review the job summary at `logs/sterling-briefing-summary.md`
3. Check Pi agent logs for errors

---

**Generated:** February 26, 2026 00:00 UTC  
**Version:** 1.0.0  
**License:** MIT
