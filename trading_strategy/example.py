"""
Example usage of the Value Area + ATR Strategy
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from strategy import ValueAreaATRStrategy


def generate_sample_data(num_bars=500, base_price=100, volatility=0.02):
    """
    Generate sample OHLCV data for testing
    
    Args:
        num_bars: Number of bars to generate
        base_price: Starting price
        volatility: Price volatility factor
    
    Returns:
        DataFrame with OHLCV data
    """
    np.random.seed(42)
    
    dates = [datetime.now() - timedelta(hours=num_bars-i) for i in range(num_bars)]
    
    # Generate random walk prices
    returns = np.random.normal(0, volatility, num_bars)
    prices = base_price * np.exp(np.cumsum(returns))
    
    data = []
    for i, price in enumerate(prices):
        # Generate OHLC from close price
        daily_range = abs(np.random.normal(0, volatility * price))
        
        high = price + daily_range * np.random.uniform(0.3, 0.7)
        low = price - daily_range * np.random.uniform(0.3, 0.7)
        open_price = low + (high - low) * np.random.uniform(0.2, 0.8)
        
        # Ensure OHLC relationships are correct
        high = max(high, open_price, price)
        low = min(low, open_price, price)
        
        volume = np.random.uniform(1000000, 5000000)
        
        data.append({
            'timestamp': dates[i],
            'open': open_price,
            'high': high,
            'low': low,
            'close': price,
            'volume': volume
        })
    
    return pd.DataFrame(data)


def example_1_basic_signal_generation():
    """
    Example 1: Basic signal generation
    """
    print("=" * 70)
    print("EXAMPLE 1: Basic Signal Generation")
    print("=" * 70)
    
    # Generate sample data
    df = generate_sample_data(num_bars=200, base_price=100, volatility=0.015)
    
    # Initialize strategy
    strategy = ValueAreaATRStrategy(
        account_balance=10000,
        risk_per_trade_pct=0.02,
        atr_period=14,
        atr_multiplier=1.5,
        lookback_period=50
    )
    
    # Generate signal
    signal = strategy.generate_signal(df)
    
    print(f"\nCurrent Price: ${signal['entry_price']:.2f}")
    print(f"Action: {signal['action']}")
    print(f"Direction: {signal['direction']}")
    print(f"Buying Pressure: {signal['buying_pressure']:.1f}/100")
    print(f"Selling Pressure: {signal['selling_pressure']:.1f}/100")
    
    if signal['action'] != 'HOLD':
        print(f"\nTrade Parameters:")
        print(f"  Entry Price: ${signal['entry_price']:.2f}")
        print(f"  Stop Loss: ${signal['stop_loss']:.2f}")
        print(f"  Take Profit: ${signal['take_profit']:.2f}")
        print(f"  Position Size: {signal['position_size']:.2f} units")
        print(f"  Position Value: ${signal['position_info']['total_position_value']:.2f}")
        print(f"  Max Risk: ${signal['position_info']['max_risk_dollars']:.2f}")
    
    # Market structure
    analysis = signal['analysis']
    print(f"\nMarket Structure:")
    print(f"  Point of Control (PoC): ${analysis['poc']:.2f}")
    print(f"  Value Area High: ${analysis['value_area_high']:.2f}")
    print(f"  Value Area Low: ${analysis['value_area_low']:.2f}")
    print(f"  Value Area Mid: ${analysis['value_area_mid']:.2f}")
    print(f"  Current ATR: ${analysis['current_atr']:.2f}")
    print(f"  Volatility: {analysis['volatility_pct']:.2f}%")
    
    print(f"\nPrice Position:")
    pos = analysis['price_position']
    print(f"  Above PoC: {pos['above_poc']}")
    print(f"  Inside Value Area: {pos['inside_value_area']}")
    print(f"  Distance from PoC: ${pos['distance_from_poc']:.2f} ({pos['distance_from_poc_pct']:.2f}%)")


def example_2_market_analysis():
    """
    Example 2: Detailed market analysis
    """
    print("\n" + "=" * 70)
    print("EXAMPLE 2: Detailed Market Analysis")
    print("=" * 70)
    
    df = generate_sample_data(num_bars=150, base_price=50, volatility=0.02)
    
    strategy = ValueAreaATRStrategy(
        account_balance=50000,
        lookback_period=75
    )
    
    analysis = strategy.analyze_market(df)
    
    print(f"\nCurrent Market Conditions:")
    print(f"  Current Price: ${analysis['current_price']:.2f}")
    print(f"  Current ATR: ${analysis['current_atr']:.2f}")
    print(f"  Volatility: {analysis['volatility_pct']:.2f}%")
    
    print(f"\nValue Area Analysis:")
    print(f"  Point of Control: ${analysis['poc']:.2f}")
    print(f"  Value Area Range: ${analysis['value_area_low']:.2f} - ${analysis['value_area_high']:.2f}")
    print(f"  Value Area Width: ${analysis['value_area_high'] - analysis['value_area_low']:.2f}")
    
    pos = analysis['price_position']
    print(f"\nPrice Positioning:")
    if pos['above_value_area']:
        print("  ⚠️  Price is ABOVE value area (potential overbought)")
    elif pos['below_value_area']:
        print("  ⚠️  Price is BELOW value area (potential oversold)")
    elif pos['inside_value_area']:
        print("  ✓ Price is INSIDE value area (balanced)")
    
    if pos['above_poc']:
        print("  ↑ Price is above Point of Control (bullish structure)")
    else:
        print("  ↓ Price is below Point of Control (bearish structure)")


def example_3_backtest():
    """
    Example 3: Strategy backtest
    """
    print("\n" + "=" * 70)
    print("EXAMPLE 3: Strategy Backtest")
    print("=" * 70)
    
    # Generate larger dataset for backtest
    df = generate_sample_data(num_bars=1000, base_price=100, volatility=0.018)
    
    strategy = ValueAreaATRStrategy(
        account_balance=10000,
        risk_per_trade_pct=0.02,
        atr_period=14,
        lookback_period=100
    )
    
    print("\nRunning backtest...")
    results = strategy.backtest(df, initial_balance=10000)
    
    print(f"\n{'='*50}")
    print("BACKTEST RESULTS")
    print(f"{'='*50}")
    
    if results['total_trades'] > 0:
        print(f"\nPerformance Summary:")
        print(f"  Total Trades: {results['total_trades']}")
        print(f"  Winning Trades: {results['winning_trades']}")
        print(f"  Losing Trades: {results['losing_trades']}")
        print(f"  Win Rate: {results['win_rate']:.1f}%")
        
        print(f"\nFinancial Results:")
        print(f"  Initial Balance: $10,000.00")
        print(f"  Final Balance: ${results['final_balance']:.2f}")
        print(f"  Total Return: {results['total_return_pct']:.2f}%")
        
        print(f"\nTrade Statistics:")
        print(f"  Average Win: ${results['average_win']:.2f}")
        print(f"  Average Loss: ${results['average_loss']:.2f}")
        print(f"  Profit Factor: {results['profit_factor']:.2f}")
        
        # Show first few trades
        print(f"\nSample Trades (first 5):")
        for i, trade in enumerate(results['trades'][:5]):
            print(f"\n  Trade {i+1}:")
            print(f"    Direction: {trade['direction'].upper()}")
            print(f"    Entry: ${trade['entry_price']:.2f}")
            print(f"    Exit: ${trade['exit_price']:.2f}")
            print(f"    P&L: ${trade['pnl']:.2f} ({trade['pnl_pct']:.2f}%)")
            print(f"    Exit Reason: {trade['exit_reason']}")
    else:
        print(f"\n{results.get('message', 'No trades executed')}")


def example_4_risk_management():
    """
    Example 4: Risk management demonstration
    """
    print("\n" + "=" * 70)
    print("EXAMPLE 4: Risk Management")
    print("=" * 70)
    
    df = generate_sample_data(num_bars=200)
    
    # Test different risk levels
    risk_levels = [0.01, 0.02, 0.05]
    
    for risk_pct in risk_levels:
        print(f"\n{'─'*50}")
        print(f"Risk Level: {risk_pct*100}% per trade")
        print(f"{'─'*50}")
        
        strategy = ValueAreaATRStrategy(
            account_balance=10000,
            risk_per_trade_pct=risk_pct,
            lookback_period=50
        )
        
        signal = strategy.generate_signal(df)
        
        if signal['action'] != 'HOLD':
            info = signal['position_info']
            print(f"  Entry Price: ${signal['entry_price']:.2f}")
            print(f"  Stop Loss: ${signal['stop_loss']:.2f}")
            print(f"  Risk per Unit: ${info['risk_per_unit']:.2f}")
            print(f"  Max Risk: ${info['max_risk_dollars']:.2f}")
            print(f"  Position Size: {info['position_size']:.2f} units")
            print(f"  Position Value: ${info['total_position_value']:.2f}")


def main():
    """Run all examples"""
    print("\n" + "█" * 70)
    print("VALUE AREA + ATR STRATEGY - EXAMPLES")
    print("█" * 70)
    
    try:
        example_1_basic_signal_generation()
        example_2_market_analysis()
        example_3_backtest()
        example_4_risk_management()
        
        print("\n" + "█" * 70)
        print("ALL EXAMPLES COMPLETED SUCCESSFULLY")
        print("█" * 70 + "\n")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
