#!/bin/bash

# Forex Exchange Rates Fetcher
# Usage: forex-rates.sh <pair1> <pair2> ...
# Example: forex-rates.sh GBP/JPY EUR/USD

set -e

# Check if pairs provided
if [ $# -eq 0 ]; then
    echo '{"error": "No currency pairs provided"}' >&2
    exit 1
fi

# Alpha Vantage API (free tier: 25 calls/day)
# Yahoo Finance as fallback

fetch_rate_yahoo() {
    local pair=$1
    local base=${pair%/*}
    local quote=${pair#*/}
    local symbol="${base}${quote}=X"

    # Try Yahoo Finance
    local response=$(curl -s "https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d" 2>/dev/null || echo '')

    if [ -n "$response" ] && echo "$response" | grep -q '"regularMarketPrice"'; then
        local price=$(echo "$response" | grep -o '"regularMarketPrice":[0-9.]*' | cut -d':' -f2)
        local change=$(echo "$response" | grep -o '"regularMarketChange":[0-9.-]*' | cut -d':' -f2)
        local change_pct=$(echo "$response" | grep -o '"regularMarketChangePercent":[0-9.-]*' | cut -d':' -f2)

        echo "{\"pair\": \"$pair\", \"price\": $price, \"change\": $change, \"change_percent\": $change_pct}"
    else
        # Fallback to mock data for demo purposes
        case "$pair" in
            "GBP/JPY") echo "{\"pair\": \"$pair\", \"price\": 189.45, \"change\": 0.82, \"change_percent\": 0.43, \"note\": \"demo data\"}" ;;
            "EUR/USD") echo "{\"pair\": \"$pair\", \"price\": 1.0845, \"change\": -0.12, \"change_percent\": -0.11, \"note\": \"demo data\"}" ;;
            "USD/JPY") echo "{\"pair\": \"$pair\", \"price\": 149.32, \"change\": 0.45, \"change_percent\": 0.30, \"note\": \"demo data\"}" ;;
            "EUR/GBP") echo "{\"pair\": \"$pair\", \"price\": 0.8521, \"change\": -0.08, \"change_percent\": -0.09, \"note\": \"demo data\"}" ;;
            *) echo "{\"pair\": \"$pair\", \"error\": \"Rate unavailable\"}" ;;
        esac
    fi
}

# Main output
{
    echo "{"
    echo '  "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",'
    echo '  "pairs": ['

    first=true
    for pair in "$@"; do
        if [ "$first" = true ]; then
            first=false
        else
            echo ","
        fi
        result=$(fetch_rate_yahoo "$pair")
        echo "    $result"
    done

    echo ""
    echo "  ]"
    echo "}"
} | python3 -m json.tool 2>/dev/null || cat
