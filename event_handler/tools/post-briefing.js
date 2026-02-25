/**
 * Post briefing to Telegram
 * Usage: node post-briefing.js <briefing-file-path>
 */

const fs = require('fs');
const path = require('path');
const { sendMessage } = require('./telegram.js');

async function postBriefing(briefingPath) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    throw new Error('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set');
  }

  // Read briefing file
  const fullPath = path.resolve(briefingPath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Briefing file not found: ${fullPath}`);
  }

  const briefing = fs.readFileSync(fullPath, 'utf8');

  // Simple markdown to HTML conversion for Telegram
  const htmlMessage = briefing
    .replace(/^# (.+)$/gm, '<b>$1</b>')
    .replace(/^## (.+)$/gm, '<b>$1</b>')
    .replace(/^### (.+)$/gm, '<b>$1</b>')
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/\*(.+?)\*/g, '<i>$1</i>')
    .replace(/_(.+?)_/g, '<i>$1</i>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/^---$/gm, '—————————————————')
    .trim();

  console.log(`📤 Posting briefing to Telegram...`);
  console.log(`📍 File: ${path.basename(fullPath)}`);
  console.log(`📏 Size: ${(briefing.length / 1024).toFixed(2)} KB`);

  try {
    const result = await sendMessage(botToken, chatId, htmlMessage, {
      disablePreview: false,
    });
    console.log(`✅ Posted successfully! Message ID: ${result.message_id}`);
    return result;
  } catch (error) {
    console.error(`❌ Error posting to Telegram:`, error.message);
    throw error;
  }
}

// CLI usage
if (require.main === module) {
  const briefingPath = process.argv[2];
  if (!briefingPath) {
    console.error('Usage: node post-briefing.js <briefing-file-path>');
    process.exit(1);
  }

  postBriefing(briefingPath)
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err.message);
      process.exit(1);
    });
}

module.exports = { postBriefing };
