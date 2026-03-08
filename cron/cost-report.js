#!/usr/bin/env node
'use strict';
/**
 * Weekly Cost Report
 * Scans logs/ for Pi agent JSONL session files, calculates token usage
 * and estimated USD cost, then sends a summary to Telegram.
 *
 * Runs as a command-type cron inside the Docker container.
 * Also run manually: node --env-file=.env cron/cost-report.js
 */

const fs   = require('fs');
const path = require('path');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID   = process.env.TELEGRAM_CHAT_ID;

// USD per 1M tokens (input / output)
const PRICING = {
  // Anthropic
  'claude-haiku-4-5-20251001': { input: 0.80,  output: 4.00  },
  'claude-haiku-4-5':          { input: 0.80,  output: 4.00  },
  'claude-sonnet-4-6':         { input: 3.00,  output: 15.00 },
  'claude-opus-4-6':           { input: 15.00, output: 75.00 },
  // OpenAI
  'gpt-4o':                    { input: 2.50,  output: 10.00 },
  'gpt-4o-mini':               { input: 0.15,  output: 0.60  },
  // Google
  'gemini-2.0-flash':          { input: 0.075, output: 0.30  },
  'gemini-2.5-pro':            { input: 1.25,  output: 10.00 },
};
const DEFAULT_PRICING = PRICING['claude-haiku-4-5-20251001'];

function parseSessionTokens(jsonlPath) {
  let inputTokens  = 0;
  let outputTokens = 0;
  let model        = null;

  const lines = fs.readFileSync(jsonlPath, 'utf8').trim().split('\n');
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const obj = JSON.parse(line);
      // LangGraph usage_metadata format
      if (obj?.usage_metadata) {
        inputTokens  += obj.usage_metadata.input_tokens  || 0;
        outputTokens += obj.usage_metadata.output_tokens || 0;
      }
      // Anthropic raw API format
      if (obj?.usage && !obj.usage.prompt_tokens) {
        inputTokens  += obj.usage.input_tokens  || 0;
        outputTokens += obj.usage.output_tokens || 0;
      }
      // OpenAI format
      if (obj?.usage?.prompt_tokens !== undefined) {
        inputTokens  += obj.usage.prompt_tokens     || 0;
        outputTokens += obj.usage.completion_tokens || 0;
      }
      // Extract model name wherever it appears
      const m = obj?.model || obj?.response?.model || obj?.data?.model;
      if (m && !model) model = m;
    } catch {}
  }

  return { inputTokens, outputTokens, model };
}

async function sendTelegram(text) {
  const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: 'Markdown' }),
  });
  if (!res.ok) {
    // Retry without Markdown
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
    });
  }
}

async function main() {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    throw new Error('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set');
  }

  const logsDir = path.resolve(path.join(__dirname, '..', 'logs'));
  const now     = new Date();
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const today   = now.toISOString().split('T')[0];

  // ── Scan Docker agent job sessions ───────────────────────────────────────
  let totalJobs        = 0;
  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  let totalCostUSD     = 0;
  const perModelCost   = {};

  if (fs.existsSync(logsDir)) {
    for (const entry of fs.readdirSync(logsDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const jobDir = path.join(logsDir, entry.name);

      // Only count jobs from this week
      if (fs.statSync(jobDir).mtimeMs < weekAgo.getTime()) continue;

      const jsonlFiles = fs.readdirSync(jobDir).filter(f => f.endsWith('.jsonl'));
      if (jsonlFiles.length === 0) continue;

      totalJobs++;
      for (const f of jsonlFiles) {
        const { inputTokens, outputTokens, model } = parseSessionTokens(path.join(jobDir, f));
        totalInputTokens  += inputTokens;
        totalOutputTokens += outputTokens;

        const pricing = (model && PRICING[model]) ? PRICING[model] : DEFAULT_PRICING;
        const label   = model || 'claude-haiku-4-5-20251001';
        const cost    = (inputTokens / 1_000_000) * pricing.input
                      + (outputTokens / 1_000_000) * pricing.output;
        totalCostUSD += cost;
        perModelCost[label] = (perModelCost[label] || 0) + cost;
      }
    }
  }

  // ── Count morning briefings this week ────────────────────────────────────
  let morningBriefings = 0;
  if (fs.existsSync(logsDir)) {
    morningBriefings = fs.readdirSync(logsDir)
      .filter(f => f.startsWith('morning-briefing-') && f.endsWith('.md'))
      .filter(f => fs.statSync(path.join(logsDir, f)).mtimeMs >= weekAgo.getTime())
      .length;
  }

  // ── Build report ─────────────────────────────────────────────────────────
  const lines = [
    `*💰 Weekly Cost Report — ${today}*`,
    `_Period: last 7 days_`,
    ``,
    `*🤖 Docker Agent Jobs:*`,
    `• Jobs run: ${totalJobs}`,
  ];

  if (totalJobs === 0) {
    lines.push(`• No agent jobs this week`);
  } else if (totalInputTokens === 0) {
    lines.push(`• Token data not yet parseable from session files`);
    lines.push(`• (will populate as jobs complete)`);
  } else {
    lines.push(`• Input tokens:  ${totalInputTokens.toLocaleString()}`);
    lines.push(`• Output tokens: ${totalOutputTokens.toLocaleString()}`);
    lines.push(`• Estimated cost: $${totalCostUSD.toFixed(4)}`);
    if (Object.keys(perModelCost).length > 1) {
      lines.push(``, `*By model:*`);
      for (const [m, c] of Object.entries(perModelCost)) {
        lines.push(`• ${m}: $${c.toFixed(4)}`);
      }
    }
  }

  lines.push(
    ``,
    `*☀️ Morning Briefings (Gemini CLI):*`,
    `• Sent this week: ${morningBriefings}`,
    `• Cost: $0.00 (OAuth — no API billing)`,
    ``,
    `*💬 Event Handler Chat (Claude Haiku):*`,
    `• Tracked via Anthropic dashboard`,
    `• Model: claude-haiku-4-5-20251001`,
  );

  await sendTelegram(lines.join('\n'));
  console.log(`Cost report sent for week ending ${today}.`);
}

main().catch(err => {
  console.error('Cost report failed:', err.message);
  process.exit(1);
});
