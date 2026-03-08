# Diagnostic Test Job

Run a quick diagnostic to verify the agent setup is working correctly.

1. Run `/job/.pi/skills/llm-secrets/llm-secrets.js` to list available LLM secrets. Report what keys are available.

2. Check if BRAVE_API_KEY is available: `echo ${BRAVE_API_KEY:-NOT_SET}`

3. Test Alpha Vantage access — fetch GBP/JPY daily rate:
```bash
curl -s "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=GBP&to_currency=JPY&apikey=$ALPHA_VANTAGE_API_KEY" | head -50
```

4. Send a Telegram message confirming the agent is working:
```bash
curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -d chat_id="${TELEGRAM_CHAT_ID}" \
  -d parse_mode="Markdown" \
  --data-urlencode text="✅ *Agent Diagnostic Complete*

- Secrets accessible: checking llm-secrets output
- Alpha Vantage: tested GBP/JPY rate
- Telegram: working (you're reading this!)
- Path fix: brave-search at /job/.pi/skills/brave-search/"
```

5. Write a brief summary to `vault/knowledge/2026-03-08-agent-diagnostic.md`:
```
---
date: 2026-03-08
tags: [diagnostic, agent-test]
---
# Agent Diagnostic - 2026-03-08

Agent is operational. Verified:
- LLM secrets accessible
- Alpha Vantage API connected
- Telegram messaging working
- brave-search path corrected
```

That's it — short job, just confirming everything is wired up correctly.

