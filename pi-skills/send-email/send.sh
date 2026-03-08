#!/bin/bash

# Usage: send.sh <to> <subject> <body>
# Requires: RESEND_API_KEY environment variable

TO=$1
SUBJECT=$2
BODY=$3

if [ -z "$TO" ] || [ -z "$SUBJECT" ] || [ -z "$BODY" ]; then
    echo "Usage: $0 <to> <subject> <body>"
    exit 1
fi

if [ -z "$RESEND_API_KEY" ]; then
    echo "Error: RESEND_API_KEY is not set."
    exit 1
fi

# Resend API endpoint
curl -s -X POST "https://api.resend.com/emails" \
     -H "Authorization: Bearer $RESEND_API_KEY" \
     -H "Content-Type: application/json" \
     -d "{
       \"from\": \"PopeBot <onboarding@resend.dev>\",
       \"to\": [\"$TO\"],
       \"subject\": \"$SUBJECT\",
       \"text\": \"$BODY\"
     }"
