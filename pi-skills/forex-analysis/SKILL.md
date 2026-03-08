---
name: forex-analysis
description: Fetch and analyze Forex market data including currency strength, exchange rates, and technical analysis
---

# Forex Analysis Skill

This skill provides Forex market data and analysis capabilities for the Sterling trading agent.

## Capabilities

- Fetch real-time exchange rates for major currency pairs
- Calculate currency strength rankings
- Analyze technical indicators (EMAs, support/resistance)
- Access economic calendar data
- Generate trading signals based on Strong Weak Analysis

## Usage

### Get Exchange Rates

```bash
{baseDir}/forex-rates.sh <pair1> <pair2> ...
```

Example:
```bash
{baseDir}/forex-rates.sh GBP/JPY EUR/USD USD/JPY
```

Output: JSON with current bid/ask prices and daily change

### Get Currency Strength

```bash
{baseDir}/currency-strength.sh
```

Output: JSON with strength scores for all major currencies (0-10 scale)

### Analyze Pair

```bash
{baseDir}/analyze-pair.sh <pair> <timeframe>
```

Example:
```bash
{baseDir}/analyze-pair.sh GBP/JPY 4H
```

Output: Technical analysis including trend, EMA alignment, support/resistance levels

## Data Sources

- Exchange rates: Alpha Vantage or Yahoo Finance API
- Currency strength: Calculated from basket of pairs
- Technical analysis: Calculated from historical OHLC data

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| ALPHA_VANTAGE_API_KEY | API key for Alpha Vantage | For real-time data |

## Response Format

All commands output JSON for easy parsing by the agent.
