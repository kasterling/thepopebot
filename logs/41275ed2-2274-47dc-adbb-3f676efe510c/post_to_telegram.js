#!/usr/bin/env node
/**
 * Post Sterling Briefing to Telegram
 * 
 * Usage:
 *   TELEGRAM_BOT_TOKEN=xxx TELEGRAM_CHAT_ID=yyy node post_to_telegram.js
 * 
 * Or use the event handler's credentials from the parent process
 */

const fs = require('fs');
const path = require('path');

async function postToTelegram() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error('❌ Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
    console.error('\nPlease set environment variables:');
    console.error('  export TELEGRAM_BOT_TOKEN="your-bot-token"');
    console.error('  export TELEGRAM_CHAT_ID="your-chat-id"');
    process.exit(1);
  }

  // Read the HTML formatted briefing
  const briefingPath = path.join(__dirname, 'sterling_briefing_telegram.html');
  const message = fs.readFileSync(briefingPath, 'utf8');

  // Send via Telegram Bot API
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });

    const result = await response.json();
    
    if (result.ok) {
      console.log('✅ Sterling Briefing posted to Telegram successfully!');
      console.log(`   Message ID: ${result.result.message_id}`);
    } else {
      console.error('❌ Telegram API error:', result.description);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Failed to post to Telegram:', error.message);
    process.exit(1);
  }
}

postToTelegram();
