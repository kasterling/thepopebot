# Value Area + ATR Trading Strategy

**A-Tier (Market Profile) + B-Tier (ATR) Combined Strategy**

A robust, risk-managed trading strategy that combines Market Profile analysis (Value Area, Point of Control) with ATR-based risk management for optimal entries and exits.

## 📊 Strategy Overview

This strategy identifies high-probability trade setups by analyzing where the majority of trading activity occurs (Market Profile) and managing risk based on market volatility (ATR).

### Core Concepts

1. **Market Profile / Value Area**
   - **Point of Control (PoC)**: Price level with the highest trading volume (the "fattest node")
   - **Value Area**: Price range containing 70% of trading activity
   - Identifies institutional support/resistance levels

2. **ATR (Average True Range)**
   - Measures market volatility
   - Used for dynamic stop loss placement
   - Adjusts position sizing based on current market conditions

## 🎯 Entry Rules

### Long Entry
- ✅ Price is **above** the Point of Control (PoC)
- ✅ Strong **buying pressure** detected (>60/100 score)
- ✅ Confirms bullish market structure

### Short Entry
- ✅ Price is **below** the Point of Control (PoC)
- ✅ Strong **selling pressure** detected (>60/100 score)
- ✅ Confirms bearish market structure

## 🛡️ Risk Management

### Stop Loss Placement
- Set at **1.5x ATR** from entry price
- Prevents premature stop-outs from normal volatility
- Automatically adjusts to market conditions

### Position Sizing
- Risk **2%** of account balance per trade (configurable)
- Smaller positions during high volatility (large ATR)
- Larger positions during low volatility (small ATR)
- Formula: `Position Size = (Account × Risk%) / (Entry - Stop Loss)`

### Dynamic Exits
- **Take Profit**: Opposite side of Value Area
  - Long trades target Value Area Low
  - Short trades target Value Area High
- **Trailing Stop**: 2x ATR trailing stop for trend-following exits

## 📁 Module Structure

```
trading_strategy/
├── __init__.py              # Package initialization
├── strategy.py              # Main strategy implementation
├── market_profile.py        # Market Profile / Value Area calculations
├── indicators.py            # ATR and technical indicators
├── risk_management.py       # Position sizing and risk management
├── example.py               # Usage examples
├── requirements.txt         # Python dependencies
└── README.md               # This file
```

## 🚀 Quick Start

### Installation

```bash
# Install required dependencies
pip install -r requirements.txt
```

### Basic Usage

```python
import pandas as pd
from trading_strategy import ValueAreaATRStrategy

# Load your OHLCV data into a DataFrame
# df must have columns: 'open', 'high', 'low', 'close', 'volume'
df = pd.read_csv('your_data.csv')

# Initialize strategy
strategy = ValueAreaATRStrategy(
    account_balance=10000,
    risk_per_trade_pct=0.02,  # 2% risk per trade
    atr_period=14,
    atr_multiplier=1.5,
    lookback_period=100
)

# Generate trading signal
signal = strategy.generate_signal(df)

print(f"Action: {signal['action']}")  # BUY, SELL, or HOLD
print(f"Entry Price: ${signal['entry_price']:.2f}")
print(f"Stop Loss: ${signal['stop_loss']:.2f}")
print(f"Take Profit: ${signal['take_profit']:.2f}")
print(f"Position Size: {signal['position_size']:.2f} units")
```

### Market Analysis

```python
# Analyze current market structure
analysis = strategy.analyze_market(df)

print(f"Point of Control: ${analysis['poc']:.2f}")
print(f"Value Area High: ${analysis['value_area_high']:.2f}")
print(f"Value Area Low: ${analysis['value_area_low']:.2f}")
print(f"Current ATR: ${analysis['current_atr']:.2f}")
```

### Backtesting

```python
# Run strategy backtest
results = strategy.backtest(df, initial_balance=10000)

print(f"Total Trades: {results['total_trades']}")
print(f"Win Rate: {results['win_rate']:.1f}%")
print(f"Total Return: {results['total_return_pct']:.2f}%")
print(f"Profit Factor: {results['profit_factor']:.2f}")
```

## 📈 Examples

Run the included examples to see the strategy in action:

```bash
cd trading_strategy
python example.py
```

This will demonstrate:
1. Basic signal generation
2. Market analysis
3. Full backtest with performance metrics
4. Risk management at different risk levels

## 🔧 Configuration

### Strategy Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `account_balance` | 10000 | Total account balance for position sizing |
| `risk_per_trade_pct` | 0.02 | Risk per trade (2% = 0.02) |
| `atr_period` | 14 | Period for ATR calculation |
| `atr_multiplier` | 1.5 | ATR multiplier for stop loss |
| `value_area_pct` | 0.70 | Value Area percentage (70% = 0.70) |
| `lookback_period` | 100 | Bars to use for Market Profile |

### Customization Example

```python
# Conservative setup (lower risk, wider stops)
conservative = ValueAreaATRStrategy(
    account_balance=50000,
    risk_per_trade_pct=0.01,  # 1% risk
    atr_multiplier=2.0,       # Wider stops
    lookback_period=150       # Longer lookback
)

# Aggressive setup (higher risk, tighter stops)
aggressive = ValueAreaATRStrategy(
    account_balance=50000,
    risk_per_trade_pct=0.05,  # 5% risk
    atr_multiplier=1.0,       # Tighter stops
    lookback_period=50        # Shorter lookback
)
```

## 📊 Understanding the Signals

### Signal Output Structure

```python
{
    'action': 'BUY' | 'SELL' | 'HOLD',
    'direction': 'long' | 'short' | None,
    'entry_price': float,
    'stop_loss': float,
    'take_profit': float,
    'position_size': float,
    'buying_pressure': float,  # 0-100 score
    'selling_pressure': float, # 0-100 score
    'position_info': {
        'position_size': float,
        'risk_per_unit': float,
        'max_risk_dollars': float,
        'total_position_value': float
    },
    'analysis': {
        'current_price': float,
        'current_atr': float,
        'poc': float,
        'value_area_high': float,
        'value_area_low': float,
        'volatility_pct': float
    }
}
```

## 🎓 Strategy Logic Flow

```
1. Calculate Market Profile from recent price action
   ↓
2. Identify Point of Control (PoC) - highest volume price level
   ↓
3. Calculate Value Area (70% of volume)
   ↓
4. Assess current buying/selling pressure
   ↓
5. Check entry conditions:
   - Is price above PoC with strong buying? → BUY
   - Is price below PoC with strong selling? → SELL
   ↓
6. If signal triggered:
   - Calculate ATR for current volatility
   - Set stop loss at 1.5x ATR from entry
   - Set take profit at opposite Value Area edge
   - Calculate position size based on risk parameters
   ↓
7. Monitor position with trailing stops
```

## ⚠️ Important Notes

### Data Requirements
- DataFrame must have columns: `open`, `high`, `low`, `close`, `volume`
- Minimum required bars: `max(lookback_period, atr_period) + 10`
- Regular time intervals (e.g., 1h, 4h, 1d candles)

### Risk Warnings
- **Backtesting != Live Trading**: Past performance doesn't guarantee future results
- **Slippage & Fees**: Real trading involves costs not included in backtest
- **Market Conditions**: Strategy performance varies across different market regimes
- **Position Sizing**: Always verify position sizes don't exceed account balance

### Best Practices
1. **Test on historical data** before live trading
2. **Paper trade** to validate signals in real-time
3. **Start with small position sizes** when going live
4. **Monitor ATR values** - adjust multipliers if stops are too tight/wide
5. **Review trades regularly** to refine pressure thresholds

## 🔌 Integration Examples

### Live Trading (Conceptual)

```python
# Example integration pattern (not executable without exchange API)
while True:
    # Fetch latest market data
    df = fetch_ohlcv_data(symbol='BTC/USDT', timeframe='1h', limit=200)
    
    # Generate signal
    signal = strategy.generate_signal(df)
    
    if signal['action'] == 'BUY':
        place_order(
            side='buy',
            amount=signal['position_size'],
            price=signal['entry_price'],
            stop_loss=signal['stop_loss'],
            take_profit=signal['take_profit']
        )
    
    elif signal['action'] == 'SELL':
        place_order(
            side='sell',
            amount=signal['position_size'],
            price=signal['entry_price'],
            stop_loss=signal['stop_loss'],
            take_profit=signal['take_profit']
        )
    
    time.sleep(3600)  # Check every hour
```

## 📚 Further Reading

- **Market Profile**: Understanding volume distribution and institutional levels
- **ATR**: Measuring and using volatility for risk management
- **Position Sizing**: Kelly Criterion, Fixed Fractional, Fixed Ratio methods
- **Backtesting**: Walk-forward analysis, Monte Carlo simulation

## 🤝 Contributing

This strategy is part of the thepopebot autonomous trading agent system. To modify or extend:

1. Add new indicators to `indicators.py`
2. Enhance pressure detection in `strategy.py`
3. Implement new risk management rules in `risk_management.py`
4. Add visualization capabilities for market structure

## 📄 License

See LICENSE file in repository root.

## ⚡ Performance Tips

1. **Optimize lookback_period**: Longer = more stable PoC, Shorter = more responsive
2. **Adjust pressure threshold**: Start with 60/100, increase for higher quality trades
3. **Fine-tune ATR multiplier**: 1.5 is balanced, increase for fewer stop-outs
4. **Consider market regime**: Strategy works best in ranging markets with clear value areas

## 📞 Support

For issues or questions about this trading strategy implementation:
- Review the example code in `example.py`
- Check the module docstrings for detailed parameter information
- Test with sample data before live usage

---

**⚠️ DISCLAIMER**: This software is for educational purposes only. Trading involves substantial risk. Always conduct your own research and never risk more than you can afford to lose.
