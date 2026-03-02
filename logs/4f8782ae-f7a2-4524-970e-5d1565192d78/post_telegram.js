#!/usr/bin/env node
/**
 * Post Sterling Intelligence Briefing to Telegram
 * This script sends the briefing using the event handler's Telegram utilities
 */

const fs = require('fs');
const path = require('path');
const { sendMessage } = require('../event_handler/tools/telegram');

async function postBriefing() {
  // Read briefing content
  const briefingPath = path.join(__dirname, 'sterling_briefing.md');
  const briefing = fs.readFileSync(briefingPath, 'utf8');

  // Get credentials from environment (these are in SECRETS, not LLM_SECRETS)
  // We need to access them through a subprocess that has the full environment
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken) {
    console.error('❌ TELEGRAM_BOT_TOKEN not found in environment');
    console.log('This script needs access to SECRETS environment variables.');
    console.log('Briefing generated at:', briefingPath);
    console.log('\nTo post manually, set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID,');
    console.log('then run this script from the event handler context.');
    process.exit(1);
  }

  if (!chatId) {
    console.error('❌ TELEGRAM_CHAT_ID not found in environment');
    console.log('Please set TELEGRAM_CHAT_ID to the target chat/channel ID.');
    console.log('Briefing generated at:', briefingPath);
    process.exit(1);
  }

  // Convert markdown to HTML formatting for Telegram
  const htmlBriefing = convertToTelegramHTML(briefing);

  console.log('📤 Posting Sterling Intelligence Briefing to Telegram...');
  console.log(`   Chat ID: ${chatId}`);
  console.log(`   Content length: ${htmlBriefing.length} chars`);

  try {
    const result = await sendMessage(botToken, chatId, htmlBriefing, {
      disablePreview: false
    });
    console.log('✅ Briefing posted successfully!');
    console.log(`   Message ID: ${result.message_id}`);
  } catch (error) {
    console.error('❌ Failed to post briefing:', error.message);
    process.exit(1);
  }
}

/**
 * Convert markdown to Telegram HTML format
 * Telegram supports: <b>, <i>, <u>, <s>, <code>, <pre>, <a>
 */
function convertToTelegramHTML(markdown) {
  let html = markdown;

  // Convert headers to bold
  html = html.replace(/^#{1,6}\s+(.+)$/gm, '<b>$1</b>');

  // Convert **bold**
  html = html.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');

  // Convert *italic*
  html = html.replace(/\*(.+?)\*/g, '<i>$1</i>');

  // Convert `code`
  html = html.replace(/`(.+?)`/g, '<code>$1</code>');

  // Convert [text](url) links
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');

  // Convert --- to horizontal line equivalent (empty line)
  html = html.replace(/^---+$/gm, '');

  // Convert tables to preformatted text
  html = html.replace(/\|(.+)\|/g, (match) => {
    return match.replace(/\|/g, ' │ ').trim();
  });

  // Clean up multiple newlines
  html = html.replace(/\n{3,}/g, '\n\n');

  return html.trim();
}

// Run the script
postBriefing().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
