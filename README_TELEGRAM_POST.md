# 📱 How to Post the Sterling Briefing to Telegram

## Quick Start

The Sterling Intelligence Briefing is **ready to post**. Here's how:

### ⚡ Fastest Method (Event Handler)

If you're on the server where the event handler runs:

```bash
cd /path/to/thepopebot
node event_handler/tools/post-briefing.js logs/telegram_post.txt
```

This will:
- ✅ Read the formatted briefing
- ✅ Convert markdown to HTML
- ✅ Post to your Telegram chat
- ✅ Confirm with message ID

---

## Alternative Methods

### Method 2: Standalone Script

If you have Telegram credentials in your environment:

```bash
export TELEGRAM_BOT_TOKEN="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
export TELEGRAM_CHAT_ID="123456789"
./tmp/post_briefing_telegram.sh
```

### Method 3: Manual Copy-Paste

1. Open `/job/logs/telegram_post.txt`
2. Copy the entire contents
3. Paste into your Telegram chat

---

## 📄 File Locations

| File | Path | Purpose |
|------|------|---------|
| **Telegram Version** | `/job/logs/telegram_post.txt` | Formatted for Telegram (1.8 KB) |
| **Full Briefing** | `/job/logs/STERLING_BRIEFING_2026-02-25.md` | Complete analysis (3.2 KB) |
| **Strategy Doc** | `/job/config/STERLING_STRATEGY.md` | Analysis framework |

---

## 🔧 Troubleshooting

**"TELEGRAM_BOT_TOKEN not set"**
- Make sure you're running from an environment that has the credentials
- Event handler server has these by default
- Docker agent does NOT have them (by security design)

**"Module 'grammy' not found"**
- Run `cd event_handler && npm install`
- This installs the Telegram bot dependencies

**"Chat not found"**
- Verify TELEGRAM_CHAT_ID is correct
- Make sure the bot has been added to the chat
- For groups, the chat ID is negative (e.g., -1001234567890)

---

## 📊 Briefing Preview

```
📊 STERLING INTELLIGENCE BRIEFING
GBP/JPY: 211.67 (+1.3%)

📈 SENTIMENT: BULLISH
✅ Breakout above 209.50-209.60
✅ JPY weakness on BoJ doubts
...
```

**Full preview available in:** `/job/logs/telegram_post.txt`

---

## 🔮 For Future Briefings

To enable automatic posting from the Docker agent:

1. **Add credentials to LLM_SECRETS** (less secure):
   ```json
   {
     "TELEGRAM_BOT_TOKEN": "your-token",
     "TELEGRAM_CHAT_ID": "your-chat-id"
   }
   ```

2. **Create an event handler trigger** (more secure):
   - Automatically detect new briefings in `/logs`
   - Post them via webhook
   - Keeps credentials secure in event handler layer

See `/job/logs/POST_TO_TELEGRAM.md` for detailed instructions.

---

**Current Status:** ✅ Briefing ready  
**Action Required:** Run posting command from authorized environment  
**Estimated Time:** < 5 seconds
