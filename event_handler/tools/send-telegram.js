#!/usr/bin/env node
/**
 * Send a message to Telegram
 * 
 * Usage:
 *   node send-telegram.js "message text"
 *   node send-telegram.js --file path/to/file.md
 *   node send-telegram.js --file path/to/file.md --chat-id 123456
 * 
 * Environment variables:
 *   TELEGRAM_BOT_TOKEN - Required
 *   TELEGRAM_CHAT_ID - Optional (can be specified via --chat-id)
 */

const { sendMessage } = require('./telegram');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

function showUsage() {
  console.log(`
Usage:
  node send-telegram.js "message text"
  node send-telegram.js --file path/to/file.md
  node send-telegram.js --file path/to/file.md --chat-id 123456

Environment variables:
  TELEGRAM_BOT_TOKEN - Required
  TELEGRAM_CHAT_ID - Optional (can be specified via --chat-id)
  `);
  process.exit(1);
}

async function main() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    console.error('Error: TELEGRAM_BOT_TOKEN environment variable is required');
    process.exit(1);
  }

  let chatId = process.env.TELEGRAM_CHAT_ID;
  let message = '';
  let filePath = '';

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--file') {
      filePath = args[i + 1];
      i++;
    } else if (args[i] === '--chat-id') {
      chatId = args[i + 1];
      i++;
    } else if (args[i] === '--help' || args[i] === '-h') {
      showUsage();
    } else {
      message = args[i];
    }
  }

  if (!chatId) {
    console.error('Error: Chat ID must be provided via TELEGRAM_CHAT_ID env var or --chat-id flag');
    process.exit(1);
  }

  // Read from file if specified
  if (filePath) {
    const fullPath = path.resolve(filePath);
    if (!fs.existsSync(fullPath)) {
      console.error(`Error: File not found: ${fullPath}`);
      process.exit(1);
    }
    message = fs.readFileSync(fullPath, 'utf8');
  }

  if (!message) {
    console.error('Error: No message provided');
    showUsage();
  }

  try {
    const result = await sendMessage(botToken, chatId, message, { disablePreview: true });
    console.log('Message sent successfully!');
    console.log('Message ID:', result.message_id);
  } catch (error) {
    console.error('Error sending message:', error.message);
    process.exit(1);
  }
}

main();
