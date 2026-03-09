---
name: send-email
description: Send emails using Resend API.
---

# Send Email

This skill allows PopeBot to send emails for reports, alerts, and summaries using the Resend API.

## Setup

1. Get a free API key from [resend.com](https://resend.com).
2. Set the key in PopeBot:
   `npx thepopebot set-agent-llm-secret RESEND_API_KEY <your-key>`

## Usage

```bash
/job/.pi/skills/send-email/send.sh <to> <subject> <body>
```

### Example

```bash
/job/.pi/skills/send-email/send.sh "user@example.com" "Hello" "This is a message from your PopeBot."
```
