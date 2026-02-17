"""
Risk Management Module
Position sizing and risk management based on ATR
"""

import pandas as pd
from typing import Dict


class RiskManager:
    """
    Risk Management system using ATR-based calculations
    """
    
    def __init__(self, account_balance, risk_per_trade_pct=0.02, atr_multiplier=1.5):
        """
        Initialize Risk Manager
        
        Args:
            account_balance: Total account balance
            risk_per_trade_pct: Maximum risk per trade as percentage (default: 2%)
            atr_multiplier: ATR multiplier for stop loss (default: 1.5)
        """
        self.account_balance = account_balance
        self.risk_per_trade_pct = risk_per_trade_pct
        self.atr_multiplier = atr_multiplier
    
    def calculate_position_size(self, entry_price, stop_loss_price, atr=None):
        """
        Calculate position size based on risk parameters
        
        Args:
            entry_price: Entry price for the trade
            stop_loss_price: Stop loss price
            atr: Current ATR value (optional, for volatility adjustment)
        
        Returns:
            Dict with position sizing details
        """
        # Calculate risk per unit
        risk_per_unit = abs(entry_price - stop_loss_price)
        
        # Calculate maximum dollar risk
        max_risk_dollars = self.account_balance * self.risk_per_trade_pct
        
        # Calculate base position size
        base_position_size = max_risk_dollars / risk_per_unit if risk_per_unit > 0 else 0
        
        # Adjust for volatility if ATR provided
        if atr is not None:
            # Reduce position size during high volatility
            volatility_ratio = atr / entry_price
            
            # Scale down position if volatility is high (>2% of price)
            if volatility_ratio > 0.02:
                adjustment_factor = 0.02 / volatility_ratio
                adjusted_position_size = base_position_size * adjustment_factor
            else:
                adjusted_position_size = base_position_size
        else:
            adjusted_position_size = base_position_size
        
        return {
            'position_size': adjusted_position_size,
            'base_position_size': base_position_size,
            'risk_per_unit': risk_per_unit,
            'max_risk_dollars': max_risk_dollars,
            'total_position_value': adjusted_position_size * entry_price,
            'risk_pct': self.risk_per_trade_pct * 100
        }
    
    def calculate_stop_loss(self, entry_price, atr, direction='long'):
        """
        Calculate stop loss based on ATR
        
        Args:
            entry_price: Entry price
            atr: Current ATR value
            direction: 'long' or 'short'
        
        Returns:
            float: Stop loss price
        """
        stop_distance = atr * self.atr_multiplier
        
        if direction == 'long':
            stop_loss = entry_price - stop_distance
        else:  # short
            stop_loss = entry_price + stop_distance
        
        return stop_loss
    
    def calculate_trailing_stop(self, entry_price, current_price, atr, direction='long', trail_multiplier=2.0):
        """
        Calculate trailing stop based on ATR
        
        Args:
            entry_price: Original entry price
            current_price: Current market price
            atr: Current ATR value
            direction: 'long' or 'short'
            trail_multiplier: ATR multiplier for trailing distance
        
        Returns:
            float: Trailing stop price
        """
        trail_distance = atr * trail_multiplier
        
        if direction == 'long':
            trailing_stop = current_price - trail_distance
        else:  # short
            trailing_stop = current_price + trail_distance
        
        return trailing_stop
    
    def calculate_take_profit(self, entry_price, target_price, atr=None, rr_ratio=2.0):
        """
        Calculate take profit level
        
        Args:
            entry_price: Entry price
            target_price: Target price from strategy (e.g., opposite value area)
            atr: Current ATR (optional)
            rr_ratio: Risk/Reward ratio (default: 2.0)
        
        Returns:
            float: Take profit price
        """
        # If target price is provided, use it
        if target_price is not None:
            return target_price
        
        # Otherwise, use risk/reward ratio with ATR
        if atr is not None:
            stop_distance = atr * self.atr_multiplier
            profit_distance = stop_distance * rr_ratio
            
            # Determine direction based on typical usage
            take_profit = entry_price + profit_distance
            
            return take_profit
        
        return None
    
    def evaluate_trade_metrics(self, entry_price, exit_price, position_size, direction='long'):
        """
        Evaluate trade performance metrics
        
        Args:
            entry_price: Entry price
            exit_price: Exit price
            position_size: Position size
            direction: 'long' or 'short'
        
        Returns:
            Dict with trade metrics
        """
        if direction == 'long':
            pnl = (exit_price - entry_price) * position_size
            pnl_pct = ((exit_price - entry_price) / entry_price) * 100
        else:  # short
            pnl = (entry_price - exit_price) * position_size
            pnl_pct = ((entry_price - exit_price) / entry_price) * 100
        
        return {
            'pnl': pnl,
            'pnl_pct': pnl_pct,
            'return_on_account': (pnl / self.account_balance) * 100,
            'entry_price': entry_price,
            'exit_price': exit_price,
            'position_size': position_size,
            'direction': direction
        }
