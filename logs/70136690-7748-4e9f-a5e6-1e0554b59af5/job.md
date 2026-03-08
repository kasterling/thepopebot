Network connectivity test for Telegram.

1. Check DNS resolution:
```bash
curl -sk --max-time 5 https://api.telegram.org/ | head -c 100
```

2. Check if the bot API base responds:
```bash
curl -sk --max-time 5 -o /dev/null -w '%{http_code}' https://api.telegram.org/
```

3. Try getMe with the token (just check HTTP status code):
```bash
curl -sk --max-time 5 -o /dev/null -w '%{http_code}' "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe"
```

4. Check via Python:
```bash
python3 -c "import urllib.request; r = urllib.request.urlopen('https://api.telegram.org/'); print('status:', r.status)"
```

Report all outputs.
