# Implementation Guide

## Environment Setup

This trading strategy is implemented in Python and requires a Python 3.8+ environment. Since the thepopebot Docker agent runs Node.js, you'll need to set up Python separately to use this strategy.

### Option 1: Local Python Installation

```bash
# Install Python 3.8+
# On Ubuntu/Debian:
sudo apt-get update
sudo apt-get install python3 python3-pip

# On macOS:
brew install python3

# On Windows:
# Download from python.org
```

### Option 2: Create a Python Docker Container

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY trading_strategy/ /app/trading_strategy/
COPY requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt

CMD ["python", "trading_strategy/example.py"]
```

Build and run:
```bash
docker build -t trading-strategy .
docker run trading-strategy
```

### Option 3: Use in Jupyter Notebook

```bash
pip install jupyter notebook
jupyter notebook
```

Then open a new notebook and import the strategy:
```python
from trading_strategy import ValueAreaATRStrategy
```

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd trading_strategy
pip install -r requirements.txt
```

### 2. Verify Installation

```python
# test_install.py
import pandas as pd
import numpy as np
from trading_strategy import ValueAreaATRStrategy

print("✓ All imports successful!")
print("✓ Strategy ready to use")
```

Run:
```bash
python test_install.py
```

### 3. Run Examples

```bash
python example.py
```

Expected output:
- Signal generation example
- Market analysis details
- Backtest results with win rate and returns
- Risk management demonstrations

## Data Integration

### Format Your Data

Your data must be a pandas DataFrame with these columns:

```python
import pandas as pd

# Example data structure
df = pd.DataFrame({
    'timestamp': [...],  # datetime objects (optional)
    'open': [...],       # Opening prices
    'high': [...],       # High prices
    'low': [...],        # Low prices
    'close': [...],      # Closing prices
    'volume': [...]      # Trading volume
})
```

### Loading Data from CSV

```python
import pandas as pd

# Load from CSV
df = pd.read_csv('your_data.csv')

# Ensure correct data types
df['open'] = pd.to_numeric(df['open'])
df['high'] = pd.to_numeric(df['high'])
df['low'] = pd.to_numeric(df['low'])
df['close'] = pd.to_numeric(df['close'])
df['volume'] = pd.to_numeric(df['volume'])

# Optional: Parse timestamps
df['timestamp'] = pd.to_datetime(df['timestamp'])
```

### Getting Data from Yahoo Finance

```python
import yfinance as yf

# Download historical data
ticker = yf.Ticker("AAPL")
df = ticker.history(period="1y", interval="1h")

# Rename columns to match strategy requirements
df = df.rename(columns={
    'Open': 'open',
    'High': 'high',
    'Low': 'low',
    'Close': 'close',
    'Volume': 'volume'
})

# Reset index to make timestamp a column
df = df.reset_index()
```

### Getting Data from Crypto Exchanges (CCXT)

```python
import ccxt
import pandas as pd

# Initialize exchange
exchange = ccxt.binance()

# Fetch OHLCV data
ohlcv = exchange.fetch_ohlcv('BTC/USDT', '1h', limit=500)

# Convert to DataFrame
df = pd.DataFrame(
    ohlcv, 
    columns=['timestamp', 'open', 'high', 'low', 'close', 'volume']
)

# Convert timestamp to datetime
df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
```

## Live Trading Integration

### Basic Structure

```python
import time
from trading_strategy import ValueAreaATRStrategy

# Initialize strategy
strategy = ValueAreaATRStrategy(
    account_balance=10000,
    risk_per_trade_pct=0.02
)

# Trading loop
while True:
    # 1. Fetch latest data
    df = get_latest_ohlcv()  # Your data source
    
    # 2. Generate signal
    signal = strategy.generate_signal(df)
    
    # 3. Execute trades
    if signal['action'] == 'BUY':
        open_long_position(
            size=signal['position_size'],
            entry=signal['entry_price'],
            stop=signal['stop_loss'],
            target=signal['take_profit']
        )
    elif signal['action'] == 'SELL':
        open_short_position(
            size=signal['position_size'],
            entry=signal['entry_price'],
            stop=signal['stop_loss'],
            target=signal['take_profit']
        )
    
    # 4. Wait for next signal
    time.sleep(3600)  # Check every hour
```

### With Position Management

```python
class TradingBot:
    def __init__(self, strategy, exchange):
        self.strategy = strategy
        self.exchange = exchange
        self.position = None
    
    def run(self):
        while True:
            df = self.fetch_data()
            
            # Update existing position
            if self.position:
                self.update_position(df)
            
            # Check for new signals
            else:
                self.check_signals(df)
            
            time.sleep(60)
    
    def check_signals(self, df):
        signal = self.strategy.generate_signal(df)
        
        if signal['action'] in ['BUY', 'SELL']:
            self.open_position(signal)
    
    def update_position(self, df):
        current_price = df['close'].iloc[-1]
        current_atr = calculate_atr(df).iloc[-1]
        
        # Update trailing stop
        new_stop = self.strategy.update_trailing_stop(
            entry_price=self.position['entry'],
            current_price=current_price,
            current_atr=current_atr,
            direction=self.position['direction']
        )
        
        # Check exit conditions
        if self.should_exit(current_price, new_stop):
            self.close_position(current_price)
```

## Backtesting Best Practices

### 1. Walk-Forward Analysis

```python
# Split data into chunks
train_size = 1000
test_size = 200

results = []

for i in range(0, len(df) - train_size - test_size, test_size):
    train_data = df.iloc[i:i+train_size]
    test_data = df.iloc[i+train_size:i+train_size+test_size]
    
    # Could optimize parameters on train_data here
    strategy = ValueAreaATRStrategy(account_balance=10000)
    
    result = strategy.backtest(test_data)
    results.append(result)

# Aggregate results
total_return = sum(r['total_return_pct'] for r in results) / len(results)
print(f"Average Return per Period: {total_return:.2f}%")
```

### 2. Monte Carlo Simulation

```python
import random

def monte_carlo_simulation(df, strategy, num_simulations=1000):
    returns = []
    
    for _ in range(num_simulations):
        # Randomly shuffle trades (bootstrap)
        shuffled_df = df.sample(frac=1, replace=True)
        
        result = strategy.backtest(shuffled_df)
        returns.append(result['total_return_pct'])
    
    return {
        'mean_return': np.mean(returns),
        'std_return': np.std(returns),
        'best_case': np.percentile(returns, 95),
        'worst_case': np.percentile(returns, 5)
    }
```

### 3. Parameter Optimization

```python
from itertools import product

def optimize_parameters(df, param_grid):
    best_params = None
    best_return = -float('inf')
    
    # Generate all combinations
    combinations = list(product(*param_grid.values()))
    param_names = list(param_grid.keys())
    
    for combo in combinations:
        params = dict(zip(param_names, combo))
        
        strategy = ValueAreaATRStrategy(**params)
        result = strategy.backtest(df)
        
        if result['total_return_pct'] > best_return:
            best_return = result['total_return_pct']
            best_params = params
    
    return best_params, best_return

# Example usage
param_grid = {
    'atr_multiplier': [1.0, 1.5, 2.0, 2.5],
    'lookback_period': [50, 75, 100, 150],
    'risk_per_trade_pct': [0.01, 0.02, 0.03]
}

best_params, best_return = optimize_parameters(df, param_grid)
print(f"Best Parameters: {best_params}")
print(f"Best Return: {best_return:.2f}%")
```

## Monitoring and Logging

### Trade Logger

```python
import logging
from datetime import datetime

class TradeLogger:
    def __init__(self, filename='trades.log'):
        logging.basicConfig(
            filename=filename,
            level=logging.INFO,
            format='%(asctime)s - %(message)s'
        )
        self.logger = logging.getLogger()
    
    def log_signal(self, signal):
        self.logger.info(
            f"SIGNAL: {signal['action']} | "
            f"Price: ${signal['entry_price']:.2f} | "
            f"Stop: ${signal['stop_loss']:.2f} | "
            f"Target: ${signal['take_profit']:.2f}"
        )
    
    def log_trade(self, trade_result):
        self.logger.info(
            f"TRADE CLOSED: {trade_result['direction'].upper()} | "
            f"P&L: ${trade_result['pnl']:.2f} ({trade_result['pnl_pct']:.2f}%)"
        )

# Usage
logger = TradeLogger()
signal = strategy.generate_signal(df)
if signal['action'] != 'HOLD':
    logger.log_signal(signal)
```

### Performance Dashboard

```python
import matplotlib.pyplot as plt

def plot_backtest_results(results):
    fig, axes = plt.subplots(2, 2, figsize=(15, 10))
    
    # Equity curve
    axes[0, 0].plot(results['equity_curve'])
    axes[0, 0].set_title('Equity Curve')
    axes[0, 0].set_xlabel('Trade Number')
    axes[0, 0].set_ylabel('Balance ($)')
    axes[0, 0].grid(True)
    
    # Trade distribution
    pnl_values = [t['pnl'] for t in results['trades']]
    axes[0, 1].hist(pnl_values, bins=30, edgecolor='black')
    axes[0, 1].set_title('P&L Distribution')
    axes[0, 1].set_xlabel('P&L ($)')
    axes[0, 1].set_ylabel('Frequency')
    axes[0, 1].axvline(x=0, color='r', linestyle='--')
    
    # Win/Loss ratio
    wins = results['winning_trades']
    losses = results['losing_trades']
    axes[1, 0].bar(['Wins', 'Losses'], [wins, losses])
    axes[1, 0].set_title('Win/Loss Distribution')
    axes[1, 0].set_ylabel('Number of Trades')
    
    # Cumulative returns
    cumulative_returns = []
    total = 0
    for trade in results['trades']:
        total += trade['pnl']
        cumulative_returns.append(total)
    
    axes[1, 1].plot(cumulative_returns)
    axes[1, 1].set_title('Cumulative Returns')
    axes[1, 1].set_xlabel('Trade Number')
    axes[1, 1].set_ylabel('Cumulative P&L ($)')
    axes[1, 1].grid(True)
    
    plt.tight_layout()
    plt.savefig('backtest_results.png', dpi=300)
    plt.show()

# Usage
results = strategy.backtest(df)
plot_backtest_results(results)
```

## Troubleshooting

### Issue: No trades generated in backtest

**Cause**: Pressure threshold might be too high or lookback period too short

**Solution**:
```python
# Lower the pressure threshold
signal = strategy.generate_signal(df, min_pressure=40)

# Increase lookback period
strategy = ValueAreaATRStrategy(lookback_period=150)
```

### Issue: Stop loss too tight (frequent stop-outs)

**Cause**: ATR multiplier too low for current market volatility

**Solution**:
```python
# Increase ATR multiplier
strategy = ValueAreaATRStrategy(atr_multiplier=2.0)
```

### Issue: Position sizes too small

**Cause**: Stop loss too far from entry, or risk percentage too low

**Solution**:
```python
# Increase risk per trade (carefully!)
strategy = ValueAreaATRStrategy(risk_per_trade_pct=0.03)

# Or decrease ATR multiplier for tighter stops
strategy = ValueAreaATRStrategy(atr_multiplier=1.0)
```

## Next Steps

1. **Paper Trade**: Test with simulated money first
2. **Small Size**: Start with minimum position sizes
3. **Monitor**: Track all trades and analyze performance
4. **Refine**: Adjust parameters based on real-world results
5. **Scale**: Gradually increase position sizes as confidence grows

## Resources

- **Sample Data**: Use `example.py` to generate test data
- **Documentation**: See `README.md` for full API reference
- **Code**: All modules have detailed docstrings

---

**Remember**: Always test thoroughly before risking real capital. Past performance does not guarantee future results.
