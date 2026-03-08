Telegram deep diagnostics. Run these commands and report ALL output (full JSON responses).

1. Get bot identity:
```bash
curl -s "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe"
```

2. Show env vars (safe, no full secrets):
```bash
echo "TOKEN_LEN=${#TELEGRAM_BOT_TOKEN}"
echo "TOKEN_PREFIX=${TELEGRAM_BOT_TOKEN:0:10}"
echo "CHAT_ID=${TELEGRAM_CHAT_ID}"
```

3. Try sending a message with JSON body:
```bash
curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -H "Content-Type: application/json" \
  -d "{\"chat_id\": \"${TELEGRAM_CHAT_ID}\", \"text\": \"Test from Pi agent - diagnostics\"}"
```

4. Try sending with numeric chat_id (no quotes):
```bash
curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -H "Content-Type: application/json" \
  -d "{\"chat_id\": ${TELEGRAM_CHAT_ID}, \"text\": \"Test from Pi agent - numeric chat_id\"}"
```

Report every single output verbatim.