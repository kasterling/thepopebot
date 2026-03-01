#!/usr/bin/env node

/**
 * Send Sterling Intelligence Briefing to Telegram
 * 
 * Usage:
 *   node send-sterling-briefing.js <briefing-file-path>
 * 
 * Requires environment variables:
 *   TELEGRAM_BOT_TOKEN - Bot token from @BotFather
 *   TELEGRAM_CHAT_ID - Target chat ID
 */

const { sendMessage } = require('./tools/telegram');
const fs = require('fs');
const path = require('path');

// Convert markdown to Telegram-safe HTML
function convertToTelegramHtml(md) {
  let html = md;
  
  // Remove horizontal rules
  html = html.replace(/^---+$/gm, '');
  
  // Convert headers to bold
  html = html.replace(/^#{1,6} (.*?)$/gm, '<b>$1</b>');
  
  // Convert **bold** to <b>
  html = html.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  
  // Convert *italic* to <i>  
  html = html.replace(/\*(.*?)\*/g, '<i>$1</i>');
  
  // Convert `code` to <code>
  html = html.replace(/`(.*?)`/g, '<code>$1</code>');
  
  // Remove extra blank lines (3+ becomes 2)
  html = html.replace(/\n{3,}/g, '\n\n');
  
  // Trim
  html = html.trim();
  
  return html;
}

async function main() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  
  if (!botToken || !chatId) {
    console.error('❌ Missing environment variables:');
    if (!botToken) console.error('  - TELEGRAM_BOT_TOKEN');
    if (!chatId) console.error('  - TELEGRAM_CHAT_ID');
    process.exit(1);
  }
  
  // Get briefing file path from args or find latest
  let briefingPath = process.argv[2];
  
  if (!briefingPath) {
    // Find the most recent sterling briefing
    const logsDir = path.join(__dirname, '..', 'logs');
    const jobs = fs.readdirSync(logsDir);
    
    let latestBriefing = null;
    let latestTime = 0;
    
    for (const jobId of jobs) {
      const jobDir = path.join(logsDir, jobId);
      if (!fs.statSync(jobDir).isDirectory()) continue;
      
      const files = fs.readdirSync(jobDir);
      for (const file of files) {
        if (file.includes('sterling_briefing')) {
          const filePath = path.join(jobDir, file);
          const stat = fs.statSync(filePath);
          if (stat.mtimeMs > latestTime) {
            latestTime = stat.mtimeMs;
            latestBriefing = filePath;
          }
        }
      }
    }
    
    if (!latestBriefing) {
      console.error('❌ No sterling briefing found in logs');
      process.exit(1);
    }
    
    briefingPath = latestBriefing;
  }
  
  if (!fs.existsSync(briefingPath)) {
    console.error(`❌ File not found: ${briefingPath}`);
    process.exit(1);
  }
  
  const briefingMd = fs.readFileSync(briefingPath, 'utf-8');
  const briefingHtml = convertToTelegramHtml(briefingMd);
  
  try {
    console.log(`📤 Sending briefing from: ${path.basename(briefingPath)}`);
    await sendMessage(botToken, chatId, briefingHtml);
    console.log('✅ Sterling Intelligence Briefing sent successfully!');
  } catch (error) {
    console.error('❌ Failed to send message:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);
