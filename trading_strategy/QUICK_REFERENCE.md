# Quick Reference Guide

## 🚀 Quick Start (Copy & Paste)

### Installation
```bash
pip install pandas numpy matplotlib
```

### Basic Usage
```python
from trading_strategy import ValueAreaATRStrategy
import pandas as pd

# Initialize with defaults
strategy = ValueAreaATRStrategy(account_balance=10000)

# Load your data (must have: open, high, low, close, volume)
df = pd.read_csv('your_data.csv')

# Generate signal
signal = strategy.generate_signal(df)

# Check the signal
if signal['action'] == 'BUY':
    print(f"Long Entry: ${signal['entry_price']:.2f}")
    print(f"Stop Loss: ${signal['stop_loss']:.2f}")
    print(f"Size: {signal['position_size']:.2f}")
elif signal['action'] == 'SELL':
    print(f"Short Entry: ${signal['entry_price']:.2f}")
    print(f"Stop Loss: ${signal['stop_loss']:.2f}")
    print(f"Size: {signal['position_size']:.2f}")
```

## 📊 Strategy Cheat Sheet

### Entry Conditions

| Position | Price Location | Pressure Required | Target |
|----------|----------------|-------------------|---------|
| **LONG** | Above PoC | Buying ≥ 60/100 | Value Area Low |
| **SHORT** | Below PoC | Selling ≥ 60/100 | Value Area High |

### Risk Parameters

| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| `account_balance` | 10000 | Any | Starting capital |
| `risk_per_trade_pct` | 0.02 | 0.01-0.05 | 2% = 0.02 |
| `atr_period` | 14 | 7-21 | ATR lookback |
| `atr_multiplier` | 1.5 | 1.0-3.0 | Stop distance |
| `lookback_period` | 100 | 50-200 | Market Profile bars |

### Common Adjustments

```python
# More conservative (1% risk, wider stops)
strategy = ValueAreaATRStrategy(
    account_balance=10000,
    risk_per_trade_pct=0.01,
    atr_multiplier=2.0
)

# More aggressive (3% risk, tighter stops)
strategy = ValueAreaATRStrategy(
    account_balance=10000,
    risk_per_trade_pct=0.03,
    atr_multiplier=1.0
)

# Faster response (shorter lookback)
strategy = ValueAreaATRStrategy(
    lookback_period=50
)

# More stable (longer lookback)
strategy = ValueAreaATRStrategy(
    lookback_period=150
)
```

## 📈 Key Methods

### 1. Generate Signal
```python
signal = strategy.generate_signal(df, min_pressure=60)

# Returns:
{
    'action': 'BUY' | 'SELL' | 'HOLD',
    'entry_price': float,
    'stop_loss': float,
    'take_profit': float,
    'position_size': float,
    'buying_pressure': float,  # 0-100
    'selling_pressure': float  # 0-100
}
```

### 2. Market Analysis
```python
analysis = strategy.analyze_market(df)

# Returns:
{
    'current_price': float,
    'current_atr': float,
    'poc': float,
    'value_area_high': float,
    'value_area_low': float,
    'volatility_pct': float
}
```

### 3. Backtest
```python
results = strategy.backtest(df, initial_balance=10000)

# Returns:
{
    'total_trades': int,
    'winning_trades': int,
    'losing_trades': int,
    'win_rate': float,
    'total_return_pct': float,
    'final_balance': float,
    'profit_factor': float,
    'trades': list
}
```

### 4. Update Trailing Stop
```python
new_stop = strategy.update_trailing_stop(
    entry_price=100.0,
    current_price=105.0,
    current_atr=2.0,
    direction='long'
)
```

## 🛠️ Troubleshooting

### No Signals Generated
```python
# Lower pressure threshold
signal = strategy.generate_signal(df, min_pressure=40)

# Increase lookback period
strategy = ValueAreaATRStrategy(lookback_period=150)
```

### Stops Too Tight
```python
# Increase ATR multiplier
strategy = ValueAreaATRStrategy(atr_multiplier=2.0)
```

### Stops Too Wide
```python
# Decrease ATR multiplier
strategy = ValueAreaATRStrategy(atr_multiplier=1.0)
```

### Position Size Too Small
```python
# Increase risk (carefully!)
strategy = ValueAreaATRStrategy(risk_per_trade_pct=0.03)

# Or use tighter stops
strategy = ValueAreaATRStrategy(atr_multiplier=1.0)
```

## 📁 Data Format

### Required Columns
```python
df = pd.DataFrame({
    'open': [...],    # Opening prices
    'high': [...],    # High prices  
    'low': [...],     # Low prices
    'close': [...],   # Closing prices
    'volume': [...]   # Trading volume
})
```

### Load from CSV
```python
df = pd.read_csv('data.csv')
df = df[['open', 'high', 'low', 'close', 'volume']]
```

### Load from API (Yahoo Finance)
```python
import yfinance as yf

ticker = yf.Ticker("AAPL")
df = ticker.history(period="1y", interval="1h")
df = df.rename(columns=str.lower)
df = df[['open', 'high', 'low', 'close', 'volume']]
```

## 🎯 Performance Metrics Explained

| Metric | Good | Acceptable | Poor |
|--------|------|------------|------|
| **Win Rate** | >60% | 50-60% | <50% |
| **Profit Factor** | >2.0 | 1.5-2.0 | <1.5 |
| **Total Return** | >20%/yr | 10-20%/yr | <10%/yr |
| **Max Drawdown** | <10% | 10-20% | >20% |

```python
results = strategy.backtest(df)

print(f"Win Rate: {results['win_rate']:.1f}%")
print(f"Profit Factor: {results['profit_factor']:.2f}")
print(f"Total Return: {results['total_return_pct']:.2f}%")
```

## 💡 Pro Tips

### 1. Start Conservative
```python
strategy = ValueAreaATRStrategy(
    risk_per_trade_pct=0.01,  # 1% risk
    atr_multiplier=2.0        # Wide stops
)
```

### 2. Backtest Multiple Timeframes
```python
timeframes = ['1h', '4h', '1d']
for tf in timeframes:
    df = get_data(timeframe=tf)
    results = strategy.backtest(df)
    print(f"{tf}: {results['win_rate']:.1f}% win rate")
```

### 3. Walk-Forward Testing
```python
train_size = 1000
test_size = 200

for i in range(0, len(df) - train_size - test_size, test_size):
    test_data = df.iloc[i+train_size:i+train_size+test_size]
    results = strategy.backtest(test_data)
    # Analyze results...
```

### 4. Monitor Live Pressure
```python
while True:
    df = get_latest_data()
    
    buying = strategy.assess_buying_pressure(df)
    selling = strategy.assess_selling_pressure(df)
    
    print(f"Buy: {buying:.0f} | Sell: {selling:.0f}")
    time.sleep(60)
```

### 5. Log Everything
```python
import logging

logging.basicConfig(filename='trades.log', level=logging.INFO)

signal = strategy.generate_signal(df)
if signal['action'] != 'HOLD':
    logging.info(f"{signal['action']}: {signal['entry_price']}")
```

## 🔗 Quick Links

- **Full Documentation**: [README.md](README.md)
- **Setup Guide**: [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)
- **Visual Flow**: [STRATEGY_FLOWCHART.md](STRATEGY_FLOWCHART.md)
- **Example Code**: [example.py](example.py)

## ⚡ One-Liner Examples

### Check if Market is Tradeable
```python
analysis = strategy.analyze_market(df)
tradeable = analysis['volatility_pct'] < 5.0 and not analysis['price_position']['inside_value_area']
```

### Get Current Market Structure
```python
structure = strategy.analyze_market(df)
print(f"PoC: ${structure['poc']:.2f} | VA: ${structure['value_area_low']:.2f}-${structure['value_area_high']:.2f}")
```

### Quick Backtest
```python
print(f"Win Rate: {strategy.backtest(df)['win_rate']:.1f}%")
```

### Check Signal Strength
```python
signal = strategy.generate_signal(df)
strength = max(signal['buying_pressure'], signal['selling_pressure'])
print(f"Signal Strength: {strength:.0f}/100")
```

---

**Remember**: Always test thoroughly before live trading! 🧪
