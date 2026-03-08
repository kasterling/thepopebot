Quick token length check (no values exposed).

1. Check TELEGRAM_BOT_TOKEN length in bash:
```bash
echo "TG_TOKEN_LEN=${#TELEGRAM_BOT_TOKEN}"
```

2. Check in Node.js:
```bash
node -e "console.log('node_TG_LEN=' + (process.env.TELEGRAM_BOT_TOKEN||'').length)"
```

3. Check first 5 chars of token:
```bash
echo "TG_START=${TELEGRAM_BOT_TOKEN:0:5}"
```

Report the exact output.
