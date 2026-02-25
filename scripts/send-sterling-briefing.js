#!/usr/bin/env node

/**
 * Send Sterling Intelligence Briefing to Telegram
 * 
 * Usage:
 *   node send-sterling-briefing.js [briefing-file]
 * 
 * Environment variables required:
 *   TELEGRAM_BOT_TOKEN - Bot token from @BotFather
 *   TELEGRAM_CHAT_ID - Chat ID to send message to
 * 
 * If no file is provided, uses today's briefing from logs/
 */

const fs = require('fs');
const path = require('path');
const { sendMessage } = require('../event_handler/tools/telegram.js');

async function main() {
  // Check for required environment variables
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken) {
    console.error('❌ Error: TELEGRAM_BOT_TOKEN environment variable not set');
    process.exit(1);
  }

  if (!chatId) {
    console.error('❌ Error: TELEGRAM_CHAT_ID environment variable not set');
    process.exit(1);
  }

  // Determine briefing file to send
  let briefingFile = process.argv[2];
  if (!briefingFile) {
    const today = new Date().toISOString().split('T')[0];
    briefingFile = path.join(__dirname, '../logs', `sterling-briefing-${today}.md`);
  }

  // Check if file exists
  if (!fs.existsSync(briefingFile)) {
    console.error(`❌ Error: Briefing file not found: ${briefingFile}`);
    process.exit(1);
  }

  // Read briefing content
  const briefingContent = fs.readFileSync(briefingFile, 'utf-8');
  
  // Convert markdown formatting to HTML for Telegram
  let htmlContent = briefingContent
    // Convert bold emoji headings to HTML bold
    .replace(/^(📊|💱|📈|📰|🎯|⚠️|🔮|⚡)\s+(.+)$/gm, '<b>$1 $2</b>')
    // Convert ** bold ** to HTML
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    // Convert * italic * to HTML
    .replace(/\*(.+?)\*/g, '<i>$1</i>')
    // Convert code blocks to monospace
    .replace(/`(.+?)`/g, '<code>$1</code>')
    // Preserve line breaks
    .replace(/\n/g, '\n');

  console.log('📤 Sending Sterling Intelligence Briefing to Telegram...');
  console.log(`   Chat ID: ${chatId}`);
  console.log(`   File: ${path.basename(briefingFile)}`);

  try {
    await sendMessage(botToken, chatId, htmlContent, { disablePreview: true });
    console.log('✅ Briefing sent successfully!');
  } catch (error) {
    console.error('❌ Failed to send briefing:', error.message);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});
