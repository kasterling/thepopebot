"""
Market Profile Module
Implements Market Profile, Value Area, and Point of Control (PoC) calculations
"""

import numpy as np
import pandas as pd
from typing import Tuple, Dict


class MarketProfile:
    """
    Market Profile analyzer for identifying Value Area and Point of Control
    """
    
    def __init__(self, df, value_area_pct=0.70):
        """
        Initialize Market Profile
        
        Args:
            df: DataFrame with OHLCV data
            value_area_pct: Percentage for Value Area (default: 0.70 = 70%)
        """
        self.df = df.copy()
        self.value_area_pct = value_area_pct
        self.profile = None
        self.poc = None
        self.value_area_high = None
        self.value_area_low = None
        
    def calculate_profile(self, num_bins=50):
        """
        Calculate the Market Profile (volume distribution across price levels)
        
        Args:
            num_bins: Number of price levels to create
        
        Returns:
            DataFrame with price levels and volumes
        """
        # Create price bins using high and low
        price_min = self.df['low'].min()
        price_max = self.df['high'].max()
        bins = np.linspace(price_min, price_max, num_bins + 1)
        
        # For each candle, distribute volume across price levels it touched
        volume_at_price = np.zeros(num_bins)
        
        for idx, row in self.df.iterrows():
            # Find which bins this candle's range overlaps
            candle_low = row['low']
            candle_high = row['high']
            candle_volume = row['volume']
            
            # Distribute volume proportionally across touched bins
            for i in range(num_bins):
                bin_low = bins[i]
                bin_high = bins[i + 1]
                bin_mid = (bin_low + bin_high) / 2
                
                # Check if this bin is within the candle's range
                if bin_low <= candle_high and bin_high >= candle_low:
                    # Overlap exists - add proportional volume
                    overlap_low = max(bin_low, candle_low)
                    overlap_high = min(bin_high, candle_high)
                    overlap_pct = (overlap_high - overlap_low) / (candle_high - candle_low) if candle_high != candle_low else 1.0
                    volume_at_price[i] += candle_volume * overlap_pct
        
        # Create profile DataFrame
        bin_centers = [(bins[i] + bins[i + 1]) / 2 for i in range(num_bins)]
        self.profile = pd.DataFrame({
            'price': bin_centers,
            'volume': volume_at_price
        })
        
        return self.profile
    
    def find_poc(self):
        """
        Find the Point of Control (price level with highest volume)
        
        Returns:
            float: PoC price level
        """
        if self.profile is None:
            self.calculate_profile()
        
        poc_idx = self.profile['volume'].idxmax()
        self.poc = self.profile.loc[poc_idx, 'price']
        
        return self.poc
    
    def calculate_value_area(self):
        """
        Calculate Value Area (price range containing specified % of volume)
        
        Returns:
            Tuple[float, float]: (value_area_low, value_area_high)
        """
        if self.profile is None:
            self.calculate_profile()
        
        if self.poc is None:
            self.find_poc()
        
        # Sort profile by volume descending
        sorted_profile = self.profile.sort_values('volume', ascending=False).reset_index(drop=True)
        
        total_volume = sorted_profile['volume'].sum()
        target_volume = total_volume * self.value_area_pct
        
        # Accumulate volume starting from highest
        cumulative_volume = 0
        value_area_prices = []
        
        for idx, row in sorted_profile.iterrows():
            cumulative_volume += row['volume']
            value_area_prices.append(row['price'])
            
            if cumulative_volume >= target_volume:
                break
        
        # Value area is the range of these prices
        self.value_area_low = min(value_area_prices)
        self.value_area_high = max(value_area_prices)
        
        return self.value_area_low, self.value_area_high
    
    def get_market_structure(self) -> Dict:
        """
        Get complete market structure (PoC and Value Area)
        
        Returns:
            Dict with 'poc', 'value_area_high', 'value_area_low'
        """
        if self.profile is None:
            self.calculate_profile()
        
        if self.poc is None:
            self.find_poc()
        
        if self.value_area_low is None or self.value_area_high is None:
            self.calculate_value_area()
        
        return {
            'poc': self.poc,
            'value_area_high': self.value_area_high,
            'value_area_low': self.value_area_low,
            'value_area_mid': (self.value_area_high + self.value_area_low) / 2
        }
    
    def analyze_price_position(self, current_price):
        """
        Analyze current price position relative to Market Profile
        
        Args:
            current_price: Current market price
        
        Returns:
            Dict with position analysis
        """
        structure = self.get_market_structure()
        
        position = {
            'price': current_price,
            'above_poc': current_price > structure['poc'],
            'below_poc': current_price < structure['poc'],
            'above_value_area': current_price > structure['value_area_high'],
            'below_value_area': current_price < structure['value_area_low'],
            'inside_value_area': structure['value_area_low'] <= current_price <= structure['value_area_high'],
            'distance_from_poc': current_price - structure['poc'],
            'distance_from_poc_pct': ((current_price - structure['poc']) / structure['poc']) * 100
        }
        
        return position
