"""
Value Area + ATR Trading Strategy
A-Tier (Market Profile) + B-Tier (ATR) Combined Strategy
"""

from .strategy import ValueAreaATRStrategy
from .market_profile import MarketProfile
from .risk_management import RiskManager
from .indicators import (
    calculate_atr,
    calculate_ema,
    calculate_sma,
    calculate_volume_profile
)

__version__ = "1.0.0"
__all__ = [
    'ValueAreaATRStrategy',
    'MarketProfile',
    'RiskManager',
    'calculate_atr',
    'calculate_ema',
    'calculate_sma',
    'calculate_volume_profile'
]
