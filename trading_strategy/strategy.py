"""
Value Area + ATR Trading Strategy
A-Tier (Market Profile) + B-Tier (ATR) Combined Strategy
"""

import pandas as pd
import numpy as np
from typing import Dict, Optional, Tuple
from .market_profile import MarketProfile
from .indicators import calculate_atr
from .risk_management import RiskManager


class ValueAreaATRStrategy:
    """
    Trading strategy combining Market Profile Value Area with ATR risk management
    
    Entry Rules:
    - Long: Price above PoC + strong buying pressure
    - Short: Price below PoC + strong selling pressure
    
    Exit Rules:
    - Take profit at opposite side of Value Area
    - ATR-based trailing stops for dynamic exits
    
    Risk Management:
    - Stop loss at 1.5x ATR from entry
    - Position sizing based on volatility (ATR)
    """
    
    def __init__(self, 
                 account_balance=10000,
                 risk_per_trade_pct=0.02,
                 atr_period=14,
                 atr_multiplier=1.5,
                 value_area_pct=0.70,
                 lookback_period=100):
        """
        Initialize strategy
        
        Args:
            account_balance: Account balance for position sizing
            risk_per_trade_pct: Risk per trade as percentage (default: 2%)
            atr_period: ATR calculation period (default: 14)
            atr_multiplier: ATR multiplier for stop loss (default: 1.5)
            value_area_pct: Value Area percentage (default: 70%)
            lookback_period: Bars to use for Market Profile calculation
        """
        self.account_balance = account_balance
        self.risk_per_trade_pct = risk_per_trade_pct
        self.atr_period = atr_period
        self.atr_multiplier = atr_multiplier
        self.value_area_pct = value_area_pct
        self.lookback_period = lookback_period
        
        self.risk_manager = RiskManager(
            account_balance=account_balance,
            risk_per_trade_pct=risk_per_trade_pct,
            atr_multiplier=atr_multiplier
        )
        
    def analyze_market(self, df):
        """
        Analyze market structure using Market Profile and ATR
        
        Args:
            df: DataFrame with OHLCV data
        
        Returns:
            Dict with market analysis
        """
        # Use last N bars for Market Profile
        profile_df = df.tail(self.lookback_period).copy()
        
        # Calculate Market Profile
        mp = MarketProfile(profile_df, value_area_pct=self.value_area_pct)
        structure = mp.get_market_structure()
        
        # Calculate ATR
        df_with_atr = df.copy()
        df_with_atr['atr'] = calculate_atr(df, period=self.atr_period)
        
        current_price = df['close'].iloc[-1]
        current_atr = df_with_atr['atr'].iloc[-1]
        
        # Analyze price position
        price_position = mp.analyze_price_position(current_price)
        
        return {
            'current_price': current_price,
            'current_atr': current_atr,
            'poc': structure['poc'],
            'value_area_high': structure['value_area_high'],
            'value_area_low': structure['value_area_low'],
            'value_area_mid': structure['value_area_mid'],
            'price_position': price_position,
            'volatility_pct': (current_atr / current_price) * 100
        }
    
    def assess_buying_pressure(self, df, periods=5):
        """
        Assess buying pressure from recent price action
        
        Args:
            df: DataFrame with OHLCV data
            periods: Number of recent periods to analyze
        
        Returns:
            float: Buying pressure score (0-100)
        """
        recent = df.tail(periods)
        
        # Calculate factors
        closes_higher = (recent['close'] > recent['open']).sum() / periods
        volume_trend = recent['volume'].iloc[-1] / recent['volume'].mean()
        close_to_high = ((recent['close'] - recent['low']) / (recent['high'] - recent['low'])).mean()
        
        # Combine into score
        buying_pressure = (closes_higher * 40 + 
                          min(volume_trend, 2.0) / 2.0 * 30 + 
                          close_to_high * 30)
        
        return buying_pressure
    
    def assess_selling_pressure(self, df, periods=5):
        """
        Assess selling pressure from recent price action
        
        Args:
            df: DataFrame with OHLCV data
            periods: Number of recent periods to analyze
        
        Returns:
            float: Selling pressure score (0-100)
        """
        recent = df.tail(periods)
        
        # Calculate factors
        closes_lower = (recent['close'] < recent['open']).sum() / periods
        volume_trend = recent['volume'].iloc[-1] / recent['volume'].mean()
        close_to_low = ((recent['high'] - recent['close']) / (recent['high'] - recent['low'])).mean()
        
        # Combine into score
        selling_pressure = (closes_lower * 40 + 
                           min(volume_trend, 2.0) / 2.0 * 30 + 
                           close_to_low * 30)
        
        return selling_pressure
    
    def generate_signal(self, df, min_pressure=60):
        """
        Generate trading signal based on strategy rules
        
        Args:
            df: DataFrame with OHLCV data
            min_pressure: Minimum pressure score required (0-100)
        
        Returns:
            Dict with signal and trade parameters
        """
        # Analyze market
        analysis = self.analyze_market(df)
        
        # Assess pressure
        buying_pressure = self.assess_buying_pressure(df)
        selling_pressure = self.assess_selling_pressure(df)
        
        current_price = analysis['current_price']
        current_atr = analysis['current_atr']
        poc = analysis['poc']
        va_high = analysis['value_area_high']
        va_low = analysis['value_area_low']
        
        signal = {
            'action': 'HOLD',
            'direction': None,
            'entry_price': current_price,
            'stop_loss': None,
            'take_profit': None,
            'position_size': 0,
            'buying_pressure': buying_pressure,
            'selling_pressure': selling_pressure,
            'analysis': analysis
        }
        
        # Long Signal: Price above PoC + strong buying pressure
        if current_price > poc and buying_pressure >= min_pressure:
            signal['action'] = 'BUY'
            signal['direction'] = 'long'
            
            # Calculate stop loss (1.5x ATR below entry)
            signal['stop_loss'] = self.risk_manager.calculate_stop_loss(
                current_price, current_atr, direction='long'
            )
            
            # Take profit at lower end of Value Area
            signal['take_profit'] = va_low
            
            # Calculate position size
            position_info = self.risk_manager.calculate_position_size(
                entry_price=current_price,
                stop_loss_price=signal['stop_loss'],
                atr=current_atr
            )
            signal['position_size'] = position_info['position_size']
            signal['position_info'] = position_info
        
        # Short Signal: Price below PoC + strong selling pressure
        elif current_price < poc and selling_pressure >= min_pressure:
            signal['action'] = 'SELL'
            signal['direction'] = 'short'
            
            # Calculate stop loss (1.5x ATR above entry)
            signal['stop_loss'] = self.risk_manager.calculate_stop_loss(
                current_price, current_atr, direction='short'
            )
            
            # Take profit at upper end of Value Area
            signal['take_profit'] = va_high
            
            # Calculate position size
            position_info = self.risk_manager.calculate_position_size(
                entry_price=current_price,
                stop_loss_price=signal['stop_loss'],
                atr=current_atr
            )
            signal['position_size'] = position_info['position_size']
            signal['position_info'] = position_info
        
        return signal
    
    def update_trailing_stop(self, entry_price, current_price, current_atr, direction, trail_multiplier=2.0):
        """
        Update trailing stop for an open position
        
        Args:
            entry_price: Original entry price
            current_price: Current market price
            current_atr: Current ATR value
            direction: 'long' or 'short'
            trail_multiplier: ATR multiplier for trailing distance
        
        Returns:
            float: Updated trailing stop price
        """
        return self.risk_manager.calculate_trailing_stop(
            entry_price=entry_price,
            current_price=current_price,
            atr=current_atr,
            direction=direction,
            trail_multiplier=trail_multiplier
        )
    
    def backtest(self, df, initial_balance=None):
        """
        Simple backtest of the strategy
        
        Args:
            df: DataFrame with OHLCV data
            initial_balance: Starting balance (uses self.account_balance if None)
        
        Returns:
            Dict with backtest results
        """
        if initial_balance is not None:
            self.account_balance = initial_balance
            self.risk_manager.account_balance = initial_balance
        
        balance = self.account_balance
        position = None
        trades = []
        equity_curve = [balance]
        
        # Need enough data for indicators
        start_idx = max(self.lookback_period, self.atr_period) + 10
        
        for i in range(start_idx, len(df)):
            current_data = df.iloc[:i+1]
            current_price = current_data['close'].iloc[-1]
            
            # Calculate current ATR
            current_atr = calculate_atr(current_data, period=self.atr_period).iloc[-1]
            
            # If in position, check for exit
            if position is not None:
                # Check stop loss
                if position['direction'] == 'long' and current_price <= position['stop_loss']:
                    # Stopped out
                    metrics = self.risk_manager.evaluate_trade_metrics(
                        entry_price=position['entry_price'],
                        exit_price=current_price,
                        position_size=position['position_size'],
                        direction='long'
                    )
                    balance += metrics['pnl']
                    trades.append({**metrics, 'exit_reason': 'stop_loss', 'bar': i})
                    position = None
                
                elif position['direction'] == 'short' and current_price >= position['stop_loss']:
                    # Stopped out
                    metrics = self.risk_manager.evaluate_trade_metrics(
                        entry_price=position['entry_price'],
                        exit_price=current_price,
                        position_size=position['position_size'],
                        direction='short'
                    )
                    balance += metrics['pnl']
                    trades.append({**metrics, 'exit_reason': 'stop_loss', 'bar': i})
                    position = None
                
                # Check take profit
                elif position['direction'] == 'long' and current_price >= position['take_profit']:
                    metrics = self.risk_manager.evaluate_trade_metrics(
                        entry_price=position['entry_price'],
                        exit_price=current_price,
                        position_size=position['position_size'],
                        direction='long'
                    )
                    balance += metrics['pnl']
                    trades.append({**metrics, 'exit_reason': 'take_profit', 'bar': i})
                    position = None
                
                elif position['direction'] == 'short' and current_price <= position['take_profit']:
                    metrics = self.risk_manager.evaluate_trade_metrics(
                        entry_price=position['entry_price'],
                        exit_price=current_price,
                        position_size=position['position_size'],
                        direction='short'
                    )
                    balance += metrics['pnl']
                    trades.append({**metrics, 'exit_reason': 'take_profit', 'bar': i})
                    position = None
                
                # Update trailing stop
                elif position is not None:
                    trailing_stop = self.update_trailing_stop(
                        entry_price=position['entry_price'],
                        current_price=current_price,
                        current_atr=current_atr,
                        direction=position['direction']
                    )
                    
                    # Only move stop in favorable direction
                    if position['direction'] == 'long' and trailing_stop > position['stop_loss']:
                        position['stop_loss'] = trailing_stop
                    elif position['direction'] == 'short' and trailing_stop < position['stop_loss']:
                        position['stop_loss'] = trailing_stop
            
            # If not in position, check for entry
            if position is None:
                signal = self.generate_signal(current_data)
                
                if signal['action'] in ['BUY', 'SELL']:
                    position = {
                        'entry_price': signal['entry_price'],
                        'stop_loss': signal['stop_loss'],
                        'take_profit': signal['take_profit'],
                        'position_size': signal['position_size'],
                        'direction': signal['direction'],
                        'entry_bar': i
                    }
            
            equity_curve.append(balance)
        
        # Close any remaining position
        if position is not None:
            exit_price = df['close'].iloc[-1]
            metrics = self.risk_manager.evaluate_trade_metrics(
                entry_price=position['entry_price'],
                exit_price=exit_price,
                position_size=position['position_size'],
                direction=position['direction']
            )
            balance += metrics['pnl']
            trades.append({**metrics, 'exit_reason': 'end_of_data', 'bar': len(df)-1})
        
        # Calculate statistics
        if len(trades) > 0:
            winning_trades = [t for t in trades if t['pnl'] > 0]
            losing_trades = [t for t in trades if t['pnl'] <= 0]
            
            total_return = ((balance - self.account_balance) / self.account_balance) * 100
            win_rate = len(winning_trades) / len(trades) * 100 if len(trades) > 0 else 0
            
            avg_win = np.mean([t['pnl'] for t in winning_trades]) if winning_trades else 0
            avg_loss = np.mean([t['pnl'] for t in losing_trades]) if losing_trades else 0
            
            results = {
                'total_trades': len(trades),
                'winning_trades': len(winning_trades),
                'losing_trades': len(losing_trades),
                'win_rate': win_rate,
                'total_return_pct': total_return,
                'final_balance': balance,
                'average_win': avg_win,
                'average_loss': avg_loss,
                'profit_factor': abs(sum([t['pnl'] for t in winning_trades]) / sum([t['pnl'] for t in losing_trades])) if losing_trades else float('inf'),
                'trades': trades,
                'equity_curve': equity_curve
            }
        else:
            results = {
                'total_trades': 0,
                'message': 'No trades generated',
                'final_balance': balance
            }
        
        return results
