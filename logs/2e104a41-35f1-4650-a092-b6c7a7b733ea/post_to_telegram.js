#!/usr/bin/env node

/**
 * Post Sterling Intelligence Briefing to Telegram
 * 
 * Usage from event_handler directory:
 *   node ../logs/2e104a41-35f1-4650-a092-b6c7a7b733ea/post_to_telegram.js
 * 
 * Requires environment variables:
 *   TELEGRAM_BOT_TOKEN - Bot token from @BotFather
 *   TELEGRAM_CHAT_ID - Target chat ID
 */

const path = require('path');

async function main() {
  // Try to import telegram tools
  let sendMessage;
  try {
    ({ sendMessage } = require(path.join(__dirname, '../../event_handler/tools/telegram')));
  } catch (err) {
    console.error('❌ Could not load Telegram tools. Run this script from the repository root:');
    console.error('   node logs/2e104a41-35f1-4650-a092-b6c7a7b733ea/post_to_telegram.js');
    process.exit(1);
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error('❌ Missing Telegram credentials');
    console.error('Set these environment variables:');
    console.error('  export TELEGRAM_BOT_TOKEN="your-bot-token"');
    console.error('  export TELEGRAM_CHAT_ID="your-chat-id"');
    process.exit(1);
  }

  // Telegram-optimized briefing (under 4096 chars)
  const briefing = `📊 <b><u>Sterling Intelligence Briefing</u></b>
<b>GBP/JPY Analysis - Feb 26, 2026</b>

━━━━━━━━━━━━━━━━

💱 <b>Current Market Data</b>

<b>Rate:</b> 211.43 JPY per GBP
• Intraday High: 212.12
• Current: 211.94  
• 24h Change: <b>+0.80%</b> 🟢

━━━━━━━━━━━━━━━━

📰 <b>Key Development</b>

PM Takaichi nominated two <b>dovish academics</b> to BoJ board → significant JPY weakness. JPY is today's <b>weakest major currency</b>, while GBP shows strength (+0.83% vs JPY).

━━━━━━━━━━━━━━━━

📈 <b>Technical Analysis - H4</b>

<b>Trend: BULLISH RESUMPTION 🟢</b>

✓ Bottom confirmed at 207.62 (100-day SMA + trendline)
✓ RSI crossed above 50 - strong buyers
✓ Breaking key resistance levels

<b>Resistance Zones:</b>
🎯 212.00 (immediate target)
🎯 214.44 (Feb 9 high)  
🎯 215.00 (Feb 4 peak)
🎯 215.88 (July 2008 peak)

<b>Support Zones:</b>
🛡️ 211.11 (50-day SMA)
🛡️ 209.68 (Feb 16 support)
🛡️ 208.14 (Feb 23 low)

━━━━━━━━━━━━━━━━

🎯 <b>Sentiment: BULLISH</b>

<b>Drivers:</b>
✅ BoJ dovish tilt
✅ Risk-on environment  
✅ Technical breakout
✅ Strong momentum

<b>Risks:</b>
⚠️ BoJ rate hike speculation
⚠️ UK data surprises
⚠️ Risk sentiment shifts

━━━━━━━━━━━━━━━━

💡 <b>H4 Trading Outlook</b>

<b>Bias: Bullish</b>

<b>Strategy:</b>
• Trend followers: Buy pullbacks to 211.11
• Breakout traders: Watch 212.00 break
• Target: 214.44 → 215.00
• Stop: Below 209.68

<b>Probability:</b>
📈 Upside: 70%
↔️ Consolidation: 20%  
📉 Reversal: 10%

━━━━━━━━━━━━━━━━

⚡ <b>Summary:</b> GBP/JPY shows strong bullish momentum on H4, supported by BoJ dovish signals and technical breakout. Target 212.00, extending to 214-215. Support at 211.11 holds structure.

<i>Generated: Feb 26, 2026 04:00 UTC</i>`;

  console.log('📤 Sending Sterling Intelligence Briefing to Telegram...');
  console.log(`   Chat ID: ${chatId}`);
  
  try {
    await sendMessage(botToken, chatId, briefing, { disablePreview: true });
    console.log('✅ Briefing sent successfully!');
  } catch (error) {
    console.error('❌ Failed to send briefing:', error.message);
    if (error.response) {
      console.error('   Response:', error.response.data || error.response);
    }
    process.exit(1);
  }
}

// Only run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
