#!/usr/bin/env node

/**
 * Validation script for trading strategy implementation
 * Checks file structure and provides setup instructions
 */

const fs = require('fs');
const path = require('path');

console.log('═'.repeat(70));
console.log('VALUE AREA + ATR STRATEGY - VALIDATION');
console.log('═'.repeat(70));

const requiredFiles = [
    '__init__.py',
    'strategy.py',
    'market_profile.py',
    'indicators.py',
    'risk_management.py',
    'example.py',
    'requirements.txt',
    'README.md',
    'IMPLEMENTATION_GUIDE.md'
];

let allPresent = true;
let fileStats = [];

console.log('\n📁 Checking file structure...\n');

requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    const exists = fs.existsSync(filePath);
    
    if (exists) {
        const stats = fs.statSync(filePath);
        const sizeKB = (stats.size / 1024).toFixed(2);
        console.log(`  ✓ ${file.padEnd(30)} (${sizeKB} KB)`);
        fileStats.push({ file, size: stats.size, exists: true });
    } else {
        console.log(`  ✗ ${file.padEnd(30)} MISSING`);
        allPresent = false;
        fileStats.push({ file, size: 0, exists: false });
    }
});

console.log('\n' + '─'.repeat(70));

if (allPresent) {
    console.log('✓ All required files are present!\n');
    
    // Calculate total size
    const totalSize = fileStats.reduce((sum, f) => sum + f.size, 0);
    const totalSizeKB = (totalSize / 1024).toFixed(2);
    
    console.log(`Total implementation size: ${totalSizeKB} KB\n`);
    
    // Count lines of code
    console.log('📊 Code statistics:\n');
    
    const pythonFiles = requiredFiles.filter(f => f.endsWith('.py'));
    let totalLines = 0;
    
    pythonFiles.forEach(file => {
        const filePath = path.join(__dirname, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n').length;
        totalLines += lines;
        console.log(`  ${file.padEnd(30)} ${lines.toString().padStart(5)} lines`);
    });
    
    console.log(`  ${'─'.repeat(30)} ${'─'.repeat(5)}────`);
    console.log(`  ${'Total Python Code'.padEnd(30)} ${totalLines.toString().padStart(5)} lines\n`);
    
} else {
    console.log('✗ Some files are missing. Please check the implementation.\n');
}

console.log('═'.repeat(70));
console.log('SETUP INSTRUCTIONS');
console.log('═'.repeat(70));

console.log(`
This trading strategy is implemented in Python and requires a Python 3.8+
environment to run.

📋 Quick Setup:

1. Ensure Python 3.8+ is installed:
   $ python3 --version

2. Install dependencies:
   $ cd trading_strategy
   $ pip install -r requirements.txt

3. Run examples:
   $ python3 example.py

4. Use in your code:
   $ python3
   >>> from trading_strategy import ValueAreaATRStrategy
   >>> strategy = ValueAreaATRStrategy(account_balance=10000)

📚 Documentation:

- README.md                - Complete strategy overview and API reference
- IMPLEMENTATION_GUIDE.md  - Step-by-step setup and integration guide
- example.py               - Working examples with sample data

🎯 Strategy Features:

✓ Market Profile analysis (Point of Control, Value Area)
✓ ATR-based risk management (dynamic stops and position sizing)
✓ Entry signals based on price position + buying/selling pressure
✓ Built-in backtesting engine with performance metrics
✓ Trailing stop management for trend-following exits
✓ Comprehensive position sizing and risk controls

⚠️  Important Notes:

- This container runs Node.js, not Python
- To use the strategy, set up Python separately (see IMPLEMENTATION_GUIDE.md)
- Always backtest thoroughly before live trading
- Start with paper trading to validate signals
- Never risk more than you can afford to lose

🚀 Next Steps:

1. Read README.md for strategy overview
2. Review IMPLEMENTATION_GUIDE.md for setup instructions
3. Run example.py to see the strategy in action
4. Backtest with your own historical data
5. Paper trade before going live

`);

console.log('═'.repeat(70));
console.log('VALIDATION COMPLETE');
console.log('═'.repeat(70) + '\n');

// Exit with appropriate code
process.exit(allPresent ? 0 : 1);
