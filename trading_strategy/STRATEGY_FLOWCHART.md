# Strategy Flowchart

## Visual Strategy Flow

```
╔══════════════════════════════════════════════════════════════════════╗
║                   VALUE AREA + ATR TRADING STRATEGY                  ║
║                     (A-Tier + B-Tier Combined)                       ║
╚══════════════════════════════════════════════════════════════════════╝

                              ┌──────────────┐
                              │ Market Data  │
                              │   (OHLCV)    │
                              └──────┬───────┘
                                     │
                    ┌────────────────┴────────────────┐
                    │                                 │
         ┌──────────▼──────────┐         ┌───────────▼──────────┐
         │  MARKET PROFILE     │         │   ATR CALCULATION    │
         │   CALCULATION       │         │    (Volatility)      │
         └──────────┬──────────┘         └───────────┬──────────┘
                    │                                 │
         ┌──────────▼──────────┐                     │
         │  Find Point of      │                     │
         │  Control (PoC)      │                     │
         │  (Fattest Node)     │                     │
         └──────────┬──────────┘                     │
                    │                                 │
         ┌──────────▼──────────┐                     │
         │  Calculate Value    │                     │
         │  Area (70% volume)  │                     │
         └──────────┬──────────┘                     │
                    │                                 │
         ┌──────────▼──────────┐                     │
         │  Analyze Price      │                     │
         │  Position vs PoC    │                     │
         └──────────┬──────────┘                     │
                    │                                 │
                    └────────────┬────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  ASSESS PRESSURE        │
                    │  - Buying Pressure      │
                    │  - Selling Pressure     │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   CHECK ENTRY RULES     │
                    └────────────┬────────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
       ┌────────▼────────┐  ┌───▼───┐  ┌────────▼────────┐
       │  LONG SIGNAL?   │  │ HOLD  │  │  SHORT SIGNAL?  │
       │                 │  └───────┘  │                 │
       │ Price > PoC     │              │ Price < PoC     │
       │ Buying > 60     │              │ Selling > 60    │
       └────────┬────────┘              └────────┬────────┘
                │                                │
                │ YES                            │ YES
                │                                │
       ┌────────▼────────────────────────────────▼────────┐
       │         CALCULATE TRADE PARAMETERS                │
       │                                                   │
       │  1. Stop Loss = Entry ± (1.5 × ATR)              │
       │  2. Take Profit = Opposite Value Area Edge       │
       │  3. Position Size = Risk$ / (Entry - Stop)       │
       │  4. Adjust size for volatility                   │
       └────────┬──────────────────────────────────────────┘
                │
       ┌────────▼────────┐
       │  OPEN POSITION  │
       └────────┬────────┘
                │
       ┌────────▼────────────────────────────────────┐
       │         POSITION MANAGEMENT                 │
       │                                             │
       │  ┌────────────┐  ┌────────────┐           │
       │  │ Monitor    │  │ Update     │           │
       │  │ Stop Loss  │  │ Trailing   │           │
       │  │            │  │ Stop (2×ATR)│           │
       │  └─────┬──────┘  └─────┬──────┘           │
       │        │               │                   │
       │  ┌─────▼───────────────▼──────┐           │
       │  │   EXIT CONDITIONS?         │           │
       │  │                            │           │
       │  │  • Stop loss hit           │           │
       │  │  • Take profit hit         │           │
       │  │  • Trailing stop hit       │           │
       │  └─────┬──────────────────────┘           │
       └────────┼──────────────────────────────────┘
                │
       ┌────────▼────────┐
       │  CLOSE POSITION │
       │  Calculate P&L  │
       └────────┬────────┘
                │
       ┌────────▼────────┐
       │  LOG RESULTS    │
       │  Update Stats   │
       └─────────────────┘


╔══════════════════════════════════════════════════════════════════════╗
║                        ENTRY LOGIC DETAILS                           ║
╚══════════════════════════════════════════════════════════════════════╝

LONG ENTRY:
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Current Price ───────────────► ABOVE PoC                      │
│                                    ▲                            │
│                                    │                            │
│                            Value Area High ──────┐              │
│                                    │             │              │
│                                   PoC ───────────┤ 70% Volume  │
│                                    │             │              │
│                            Value Area Low ───────┘              │
│                                                                 │
│  Buying Pressure Score ──────────► >= 60/100                   │
│                                                                 │
│  ACTION: BUY                                                    │
│  Stop Loss: Entry - (1.5 × ATR)                                │
│  Target: Value Area Low                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

SHORT ENTRY:
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                            Value Area High ──────┐              │
│                                    │             │              │
│                                   PoC ───────────┤ 70% Volume  │
│                                    │             │              │
│                            Value Area Low ───────┘              │
│                                    ▼                            │
│  Current Price ───────────────► BELOW PoC                      │
│                                                                 │
│  Selling Pressure Score ─────────► >= 60/100                   │
│                                                                 │
│  ACTION: SELL                                                   │
│  Stop Loss: Entry + (1.5 × ATR)                                │
│  Target: Value Area High                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘


╔══════════════════════════════════════════════════════════════════════╗
║                     RISK MANAGEMENT DETAILS                          ║
╚══════════════════════════════════════════════════════════════════════╝

POSITION SIZING:
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Max Risk per Trade = Account Balance × Risk% (default: 2%)    │
│                                                                 │
│  Risk per Unit = |Entry Price - Stop Loss|                     │
│                                                                 │
│  Base Position Size = Max Risk / Risk per Unit                 │
│                                                                 │
│  Volatility Adjustment:                                        │
│    • If ATR/Price > 2%: Reduce position size                   │
│    • If ATR/Price < 2%: Use base position size                 │
│                                                                 │
│  Example:                                                       │
│    Account: $10,000                                            │
│    Risk%: 2% = $200                                            │
│    Entry: $100                                                 │
│    Stop: $98 (ATR = $1.33, 1.5× = $2)                         │
│    Risk/Unit: $2                                               │
│    Position: $200 / $2 = 100 units                            │
│    Position Value: 100 × $100 = $10,000                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

STOP LOSS LOGIC:
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Initial Stop:                                                  │
│    Long: Entry - (1.5 × ATR)                                   │
│    Short: Entry + (1.5 × ATR)                                  │
│                                                                 │
│  Trailing Stop (after position opened):                        │
│    Distance = 2.0 × ATR                                        │
│    Updates only in favorable direction                         │
│                                                                 │
│  Rationale:                                                     │
│    • 1.5× ATR accommodates normal volatility                   │
│    • 2.0× ATR for trailing allows room for pullbacks           │
│    • Prevents premature stop-outs                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘


╔══════════════════════════════════════════════════════════════════════╗
║                         PRESSURE ASSESSMENT                          ║
╚══════════════════════════════════════════════════════════════════════╝

BUYING PRESSURE (0-100 score):
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Factor 1: Close > Open candles (40 points)                    │
│    • Count recent bullish candles / total candles              │
│                                                                 │
│  Factor 2: Volume Trend (30 points)                            │
│    • Current volume / Average volume                           │
│    • Capped at 2x for normalization                            │
│                                                                 │
│  Factor 3: Close near High (30 points)                         │
│    • (Close - Low) / (High - Low)                              │
│    • Measures rejection of lower prices                        │
│                                                                 │
│  Total = F1×40 + F2×30 + F3×30                                 │
│                                                                 │
│  Threshold: 60/100 required for signal                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

SELLING PRESSURE (0-100 score):
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Factor 1: Close < Open candles (40 points)                    │
│    • Count recent bearish candles / total candles              │
│                                                                 │
│  Factor 2: Volume Trend (30 points)                            │
│    • Current volume / Average volume                           │
│    • Capped at 2x for normalization                            │
│                                                                 │
│  Factor 3: Close near Low (30 points)                          │
│    • (High - Close) / (High - Low)                             │
│    • Measures rejection of higher prices                       │
│                                                                 │
│  Total = F1×40 + F2×30 + F3×30                                 │
│                                                                 │
│  Threshold: 60/100 required for signal                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘


╔══════════════════════════════════════════════════════════════════════╗
║                        EXAMPLE SCENARIO                              ║
╚══════════════════════════════════════════════════════════════════════╝

Market Conditions:
  • Asset: BTC/USDT
  • Timeframe: 1 hour
  • Current Price: $42,500
  • ATR (14): $850

Market Profile Analysis:
  • Point of Control: $41,800
  • Value Area High: $42,200
  • Value Area Low: $41,400
  • Price Position: Above PoC ✓

Pressure Assessment:
  • Buying Pressure: 72/100 ✓
  • Selling Pressure: 28/100

Signal Generated:
  ┌──────────────────────────────────────┐
  │ ACTION: BUY (Long Entry)             │
  ├──────────────────────────────────────┤
  │ Entry Price: $42,500                 │
  │ Stop Loss: $41,225 ($850 × 1.5)     │
  │ Take Profit: $41,400 (VA Low)        │
  │ Risk per Unit: $1,275                │
  │ Position Size: 15.69 BTC             │
  │   (Assuming $20k account, 2% risk)   │
  └──────────────────────────────────────┘

Risk Metrics:
  • Max Loss: $400 (2% of $20,000)
  • Potential Gain: $17,259 ($1,100 × 15.69)
  • Risk/Reward: 1:43 🚀
  • Position Value: $666,825

Note: This example shows how the strategy generates signals and calculates
      position parameters based on market conditions.
```
