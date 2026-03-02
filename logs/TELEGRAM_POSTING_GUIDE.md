# Telegram Posting Guide - Sterling Briefing
**For:** Afternoon Update (2026-03-02 16:00 UTC)

---

## 📱 Three Ways to Post to Telegram

### Option 1: Automatic (Event Handler) ⭐ Recommended

**When:** After this PR is merged to main  
**How:** The `update-event-handler.yml` workflow automatically sends a notification

**Message content:** Job completion summary (default)

**To send the briefing instead:**
1. The event handler will send a completion notification automatically
2. You can then manually post the briefing using Option 2 below

**Pros:** Zero manual work  
**Cons:** Sends job summary, not the briefing itself

---

### Option 2: Manual Script Execution ⭐ For Immediate Posting

**When:** Right now, from the event handler server  
**File:** `/tmp/send-telegram-briefing.js`

**Steps:**
```bash
# 1. Set environment variables
export TELEGRAM_BOT_TOKEN="your-bot-token-from-botfather"
export TELEGRAM_CHAT_ID="your-chat-id"

# 2. Run the script
node /job/tmp/send-telegram-briefing.js
```

**Expected output:**
```
📤 Sending briefing to Telegram...
📱 Chat ID: 123456789
📄 Message length: 1600 chars

✅ Briefing sent successfully!
📨 Message ID: 123
```

**Message:** Full afternoon briefing from `sterling-telegram-afternoon-2026-03-02.txt`

**Pros:** Immediate posting, full control  
**Cons:** Requires manual execution with credentials

---

### Option 3: Direct API Call (Advanced)

**When:** If you prefer not to use the script  
**Method:** POST to Telegram Bot API

**curl example:**
```bash
export TELEGRAM_BOT_TOKEN="your-token"
export TELEGRAM_CHAT_ID="your-chat-id"

curl -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -H "Content-Type: application/json" \
  -d @- << 'JSON'
{
  "chat_id": "'"${TELEGRAM_CHAT_ID}"'",
  "text": "$(cat /job/logs/sterling-telegram-afternoon-2026-03-02.txt)",
  "parse_mode": "HTML",
  "disable_web_page_preview": true
}
JSON
```

**Pros:** No dependencies  
**Cons:** More complex, manual escaping needed

---

## 📄 Message Preview

The Telegram message will contain:

```
🔔 STERLING INTELLIGENCE BRIEFING - AFTERNOON UPDATE
📅 March 2, 2026 | 16:00 UTC

💱 GBP/JPY: 209.20-210.08
📊 Range: 209.00-210.40 (+150 pips recovery)
📈 Bias: Neutral-to-Constructive (UPGRADED)

⚡ KEY DEVELOPMENTS
• 🎯 BoE held rates at 3.75% (5-4 split vote = hawkish surprise)
• 💥 Iran strikes absorbed, V-shaped recovery validates resilience  
• 📐 Technical structure "constructive" above 210.00 (FXStreet)
• 🏠 UK mortgage approvals lowest in 2 years (minor negative)

... (continues with scenarios, strategy, levels, risks)
```

**Full message:** 1,600 characters (well under 4,096 limit)  
**Format:** Plain text with emojis (no HTML formatting)  
**Preview:** Disabled (no link expansion)

---

## 🔐 Security Notes

**Why credentials aren't in Docker agent:**
- TELEGRAM_BOT_TOKEN is filtered from LLM's environment by `env-sanitizer`
- This prevents accidental exposure in bash commands or logs
- Event handler (Node.js server) manages external communications
- Docker agent (Pi + LLM) focuses on analysis, not API calls

**Where credentials live:**
- Event handler environment variables (server.js)
- GitHub Secrets (for workflows)
- NOT in Docker container environment (by design)

**Getting your credentials:**
1. **Bot Token:** Message @BotFather on Telegram, create a bot
2. **Chat ID:** Message your bot, then visit `https://api.telegram.org/bot<TOKEN>/getUpdates`
3. **Verification:** Use TELEGRAM_VERIFICATION code to confirm chat ID (see event handler docs)

---

## ⚙️ Future Automation

**To enable automatic briefing posting (not just notifications):**

### Step 1: Add Internal Endpoint
Create a new route in `event_handler/server.js`:

```javascript
// POST /internal/telegram/send
app.post('/internal/telegram/send', authenticateInternalSecret, async (req, res) => {
  const { message, chat_id } = req.body;
  const chatId = chat_id || process.env.TELEGRAM_CHAT_ID;
  
  if (!message) {
    return res.status(400).json({ error: 'Missing message field' });
  }
  
  try {
    const result = await sendMessage(
      process.env.TELEGRAM_BOT_TOKEN,
      chatId,
      message
    );
    res.json({ success: true, message_id: result.message_id });
  } catch (error) {
    console.error('Telegram send error:', error);
    res.status(500).json({ error: error.message });
  }
});
```

### Step 2: Add Authentication Middleware
```javascript
function authenticateInternalSecret(req, res, next) {
  const secret = req.headers['x-internal-secret'];
  if (secret !== process.env.INTERNAL_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}
```

### Step 3: Set Secrets
```bash
# In GitHub Secrets, add to SECRETS JSON:
{
  "INTERNAL_SECRET": "random-secure-string",
  "EVENT_HANDLER_URL": "https://your-event-handler.com"
}
```

### Step 4: Update Agent Job
Then the Docker agent can POST:
```javascript
const response = await fetch(`${process.env.EVENT_HANDLER_URL}/internal/telegram/send`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Internal-Secret': process.env.INTERNAL_SECRET
  },
  body: JSON.stringify({
    message: fs.readFileSync('sterling-telegram-afternoon.txt', 'utf8')
  })
});
```

**Benefits:**
- ✅ Fully automated posting
- ✅ No manual steps
- ✅ Credentials stay in event handler
- ✅ Docker agent can trigger posts
- ✅ Maintains security architecture

---

## 📊 Posting Checklist

Before posting, verify:

- [ ] Briefing content is accurate (review `sterling-intelligence-briefing-afternoon-2026-03-02.md`)
- [ ] GBP/JPY levels are current (check if market has moved significantly)
- [ ] Telegram bot token is valid (test with `/getMe` endpoint)
- [ ] Chat ID is correct (send a test message first)
- [ ] Message length < 4,096 chars (current: 1,600 ✓)
- [ ] No sensitive data in message (API keys, tokens, etc.)

After posting, confirm:

- [ ] Message delivered successfully (check Telegram app)
- [ ] Formatting looks correct (emojis, line breaks)
- [ ] No error messages in console
- [ ] Recipients can read and understand the content

---

## 🐛 Troubleshooting

**Error: "Unauthorized"**
- Check TELEGRAM_BOT_TOKEN is correct
- Verify token starts with a number and contains colon (e.g., `123456:ABC-DEF`)

**Error: "Chat not found"**
- Check TELEGRAM_CHAT_ID is correct
- For private chats, ID is a number (e.g., `123456789`)
- For groups, ID is negative (e.g., `-100123456789`)

**Error: "Message too long"**
- Current message is 1,600 chars (safe)
- Telegram limit is 4,096 chars
- Split long messages if needed (script handles this)

**No error but no message**
- Check bot is added to the chat/group
- Verify bot has permission to send messages
- Check bot wasn't blocked by user

**Message sent but formatting wrong**
- Script uses plain text (no HTML)
- Emojis should render correctly
- Line breaks preserved

---

## 📚 Documentation Links

- **Telegram Bot API:** https://core.telegram.org/bots/api
- **grammY (Bot framework):** https://grammy.dev/
- **Event handler code:** `/job/event_handler/tools/telegram.js`
- **Posting script:** `/job/tmp/send-telegram-briefing.js`
- **Completion summary:** `/job/logs/BRIEFING_COMPLETION_SUMMARY.md`

---

**Quick Command Reference:**

```bash
# Check bot info
curl "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe"

# Get updates (find chat ID)
curl "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates"

# Send test message
curl -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -d "chat_id=${TELEGRAM_CHAT_ID}" \
  -d "text=Test message from Sterling Briefing Bot"

# Post the briefing
node /job/tmp/send-telegram-briefing.js
```

---

**Generated:** 2026-03-02 16:00 UTC  
**For:** Sterling Intelligence Briefing Afternoon Update  
**Status:** Ready for execution

---

*For questions about event handler integration, see event_handler/README.md*
