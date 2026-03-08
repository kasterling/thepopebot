#!/bin/bash

# GitHub Secrets Setup Script for Sterling Forex Trading Agent
# Run this script to configure all required GitHub secrets and variables

set -e

echo "=========================================="
echo "Sterling Forex Agent - GitHub Setup"
echo "=========================================="
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo ""
    echo "Install it with:"
    echo "  - macOS: brew install gh"
    echo "  - Ubuntu/Debian: sudo apt install gh"
    echo "  - Windows: winget install --id GitHub.cli"
    echo ""
    echo "Then authenticate: gh auth login"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub."
    echo "Run: gh auth login"
    exit 1
fi

REPO="kasterling/thepopebot"
echo "✅ GitHub CLI found and authenticated"
echo "📁 Repository: $REPO"
echo ""

# Load secrets from .env
if [ -f .env ]; then
    source .env
    echo "✅ Loaded environment from .env"
else
    echo "❌ .env file not found. Run this script from the my-popebot directory."
    exit 1
fi

echo ""
echo "=========================================="
echo "Setting GitHub Secrets (Protected)"
echo "=========================================="
echo ""

# Protected secrets (filtered from LLM access)
set_secret() {
    local name=$1
    local value=$2
    echo -n "Setting AGENT_$name... "
    if gh secret set "AGENT_$name" --repo "$REPO" --body "$value" 2>/dev/null; then
        echo "✅"
    else
        echo "❌ Failed"
    fi
}

set_secret "GH_TOKEN" "$GH_TOKEN"
set_secret "ANTHROPIC_API_KEY" "$ANTHROPIC_API_KEY"
set_secret "OPENAI_API_KEY" "$OPENAI_API_KEY"
set_secret "GROQ_API_KEY" "$GROQ_API_KEY"
set_secret "TELEGRAM_BOT_TOKEN" "$TELEGRAM_BOT_TOKEN"
set_secret "ALPHA_VANTAGE_API_KEY" "$ALPHA_VANTAGE_API_KEY"
set_secret "TRADINGVIEW_WEBHOOK_SECRET" "$TRADINGVIEW_WEBHOOK_SECRET"
set_secret "API_KEY" "$API_KEY"

echo ""
echo "=========================================="
echo "Setting GitHub Secrets (LLM-Accessible)"
echo "=========================================="
echo ""

# LLM-accessible secrets
set_llm_secret() {
    local name=$1
    local value=$2
    echo -n "Setting AGENT_LLM_$name... "
    if gh secret set "AGENT_LLM_$name" --repo "$REPO" --body "$value" 2>/dev/null; then
        echo "✅"
    else
        echo "❌ Failed"
    fi
}

# Note: These secrets will be visible to the LLM agent
set_llm_secret "OLLAMA_URL" "$OLLAMA_URL"
set_llm_secret "OLLAMA_MODEL" "$OLLAMA_MODEL"

echo ""
echo "=========================================="
echo "Setting GitHub Variables"
echo "=========================================="
echo ""

set_var() {
    local name=$1
    local value=$2
    echo -n "Setting $name... "
    if gh variable set "$name" --repo "$REPO" --body "$value" 2>/dev/null; then
        echo "✅"
    else
        echo "❌ Failed"
    fi
}

set_var "APP_URL" "$APP_URL"
set_var "GH_OWNER" "$GH_OWNER"
set_var "GH_REPO" "$GH_REPO"
set_var "TELEGRAM_CHAT_ID" "$TELEGRAM_CHAT_ID"
set_var "AUTO_MERGE" "true"
set_var "ALLOWED_PATHS" "/logs,/config,/pi-skills"

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "  1. Start Docker: docker compose up -d"
echo "  2. Set up Telegram: npm run setup-telegram"
echo "  3. Access web UI at: $APP_URL"
echo "  4. Your first cron job runs at 9:00 AM"
echo ""
echo "📚 Documentation:"
echo "  - Strategy: config/STERLING_STRATEGY.md"
echo "  - Crons: config/CRONS.json"
echo "  - Logs will appear in: logs/"
echo ""
