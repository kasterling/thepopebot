Debug Telegram token availability.

1. Run: `echo TELEGRAM_BOT_TOKEN="${TELEGRAM_BOT_TOKEN}" TELEGRAM_CHAT_ID="${TELEGRAM_CHAT_ID}"`
2. Run: `echo FIRST_FIVE="${TELEGRAM_BOT_TOKEN:0:5}"`
3. Run: `printenv | grep TELEGRAM`
4. Run: `/job/.pi/skills/llm-secrets/llm-secrets.js`
5. Then try sending a Telegram message using the token shown in step 1.

Report exactly what was shown for each step.
