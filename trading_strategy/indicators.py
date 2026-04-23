"""
Technical Indicators Module
Provides ATR and other technical indicator calculations
"""

import numpy as np
import pandas as pd


def calculate_atr(df, period=14):
    """
    Calculate Average True Range (ATR)
    
    Args:
        df: DataFrame with 'high', 'low', 'close' columns
        period: ATR period (default: 14)
    
    Returns:
        Series with ATR values
    """
    high = df['high']
    low = df['low']
    close = df['close']
    
    # Calculate True Range components
    tr1 = high - low
    tr2 = abs(high - close.shift(1))
    tr3 = abs(low - close.shift(1))
    
    # True Range is the maximum of the three
    tr = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1)
    
    # ATR is the moving average of True Range
    atr = tr.rolling(window=period).mean()
    
    return atr


def calculate_ema(series, period):
    """Calculate Exponential Moving Average"""
    return series.ewm(span=period, adjust=False).mean()


def calculate_sma(series, period):
    """Calculate Simple Moving Average"""
    return series.rolling(window=period).mean()


def calculate_volume_profile(df, price_col='close', volume_col='volume', num_bins=50):
    """
    Calculate volume profile (volume distribution across price levels)
    
    Args:
        df: DataFrame with price and volume data
        price_col: Name of price column
        volume_col: Name of volume column
        num_bins: Number of price bins to create
    
    Returns:
        DataFrame with price levels and corresponding volumes
    """
    prices = df[price_col]
    volumes = df[volume_col]
    
    # Create price bins
    price_min = prices.min()
    price_max = prices.max()
    bins = np.linspace(price_min, price_max, num_bins + 1)
    
    # Assign each price to a bin
    price_bins = pd.cut(prices, bins=bins, include_lowest=True)
    
    # Sum volume for each bin
    volume_profile = df.groupby(price_bins)[volume_col].sum()
    
    # Get bin centers (mid-point of each price range)
    bin_centers = volume_profile.index.map(lambda x: x.mid)
    
    result = pd.DataFrame({
        'price_level': bin_centers,
        'volume': volume_profile.values
    })
    
    return result.sort_values('volume', ascending=False).reset_index(drop=True)
