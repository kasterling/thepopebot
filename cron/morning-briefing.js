#!/usr/bin/env node
'use strict';
/**
 * Morning Analyst Briefing
 * Calls the Gemini CLI (host-side) to research what trading analysts
 * are saying today, then formats the result into a briefing table
 * and sends it to Telegram.
 *
 * Run from host (not Docker):
 *   node --env-file=/home/keith/Desktop/Pope_Bot/my-popebot/.env \
 *        /home/keith/Desktop/Pope_Bot/my-popebot/cron/morning-briefing.js
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID   = process.env.TELEGRAM_CHAT_ID;

// Stable path to gemini binary (fnm v20)
const GEMINI = process.env.GEMINI_PATH ||
  '/home/keith/.local/share/fnm/node-versions/v20.20.0/installation/bin/gemini';

function callGemini(prompt) {
  const result = execFileSync(GEMINI, ['-p', prompt], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'], // suppress MCP/extension noise on stderr
    timeout: 300_000, // 5 min — Gemini CLI loads MCP extensions before querying
  });
  return result.trim();
}

async function sendTelegram(text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  // Split on line boundaries to stay under 4096-char Telegram limit
  const chunks = [];
  let current = '';
  for (const line of text.split('\n')) {
    if ((current + '\n' + line).length > 4000) {
      chunks.push(current);
      current = line;
    } else {
      current = current ? current + '\n' + line : line;
    }
  }
  if (current) chunks.push(current);

  for (const chunk of chunks) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: chunk,
        parse_mode: 'Markdown',
      }),
    });
    // Retry without Markdown if parse error
    if (!res.ok) {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: chunk }),
      });
    }
    if (chunks.length > 1) await new Promise(r => setTimeout(r, 600));
  }
}

async function main() {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    throw new Error('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set in .env');
  }

  const today = new Date().toISOString().split('T')[0];
  console.log(`Generating morning briefing for ${today}...`);

  // ── Step 1: Research ──────────────────────────────────────────────────────
  const researchPrompt =
    `What is Gareth Soloway, ForexAnalytix, Alessio Rastani, Grega Horvat Elliott Wave Analysis, ` +
    `and Jason Sen saying about the market today (${today})? ` +
    `For each analyst, capture their directional bias (bullish/bearish/neutral) on: ` +
    `EURUSD, GBPUSD, USDJPY, USDCHF, AUDUSD, USDCAD, NZDUSD, ` +
    `EURGBP, EURJPY, GBPJPY, AUDJPY, EURCHF, ` +
    `XAUUSD (Gold), XAGUSD (Silver), BTCUSD, ETHUSD, SOLUSD. ` +
    `Include any specific price levels (entry, take profit, stop loss, support, resistance) ` +
    `and whether each setup is for a day trade or swing trade.`;

  console.log('Step 1: Researching analysts...');
  const research = callGemini(researchPrompt);
  console.log('Research complete.');

  // ── Step 2: Format into briefing table ───────────────────────────────────
  const formatPrompt =
    `Here is today's analyst research (${today}):\n\n${research}\n\n` +
    `Compile a Morning Trading Briefing in this exact format:\n\n` +
    `**📊 Morning Trading Briefing — ${today}**\n\n` +
    `**🌍 Key Macro Themes:**\n• [theme 1]\n• [theme 2]\n• [theme 3]\n\n` +
    `**🎯 Top 3 High-Conviction Setups** (most analyst agreement):\n` +
    `1. [SYMBOL — LONG/SHORT — one-line reason]\n` +
    `2. [SYMBOL — LONG/SHORT — one-line reason]\n` +
    `3. [SYMBOL — LONG/SHORT — one-line reason]\n\n` +
    `**📋 Full Analyst Briefing Table:**\n\n` +
    `| SYMBOL | GARETH BIAS | FOREXANALYTIX BIAS | GREGA BIAS | JASON BIAS | ENTRY PRICE | TAKE PROFIT | STOP LOSS | SUPPORT | RESISTANCE | DAY/SWING |\n` +
    `|--------|-------------|-------------------|-----------|-----------|-------------|-------------|-----------|---------|------------|----------|\n` +
    `[rows]\n\n` +
    `Rules:\n` +
    `- BIAS columns: LONG / SHORT / NEUTRAL / N/A\n` +
    `- Alessio Rastani's views inform ENTRY PRICE and TAKE PROFIT consensus\n` +
    `- ENTRY/TP/SL/SUPPORT/RESISTANCE: specific price level or N/A\n` +
    `- DAY/SWING: DAY / SWING / BOTH\n` +
    `- Only include rows where ≥1 analyst has a clear directional view`;

  console.log('Step 2: Formatting briefing table...');
  const briefing = callGemini(formatPrompt);
  console.log('Formatting complete.');

  // ── Save to logs ──────────────────────────────────────────────────────────
  try {
    const logsDir = path.resolve(path.join(__dirname, '..', 'logs'));
    fs.mkdirSync(logsDir, { recursive: true });
    fs.writeFileSync(
      path.join(logsDir, `morning-briefing-${today}.md`),
      `# Morning Analyst Briefing — ${today}\n\n## Research\n\n${research}\n\n## Briefing\n\n${briefing}\n`
    );
    console.log(`Saved to logs/morning-briefing-${today}.md`);
  } catch (e) {
    console.warn('Could not save to logs (non-fatal):', e.message);
  }

  // ── Send to Telegram ──────────────────────────────────────────────────────
  await sendTelegram(briefing);
  console.log(`Morning briefing sent to Telegram for ${today}.`);
}

main().catch(err => {
  console.error('Morning briefing failed:', err.message);
  process.exit(1);
});
