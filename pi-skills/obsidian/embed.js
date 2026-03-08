#!/usr/bin/env node
/**
 * Vault Embeddings Indexer
 * Embeds all vault notes using OpenAI text-embedding-3-small.
 * Only re-embeds notes that have changed since last run (mtime check).
 * Stores index at vault/.index/embeddings.json
 *
 * Usage: node embed.js [--force]
 */

import { readFileSync, writeFileSync, mkdirSync, statSync, readdirSync, existsSync } from 'fs';
import { join, resolve, relative } from 'path';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const VAULT_PATH = process.env.OBSIDIAN_VAULT_PATH
  ? resolve(process.env.OBSIDIAN_VAULT_PATH)
  : resolve(process.cwd(), 'vault');
const INDEX_DIR  = join(VAULT_PATH, '.index');
const INDEX_PATH = join(INDEX_DIR, 'embeddings.json');
const MODEL      = 'text-embedding-3-small';
const FORCE      = process.argv.includes('--force');

async function getEmbedding(text) {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ model: MODEL, input: text.slice(0, 8191) }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`OpenAI embeddings error: ${JSON.stringify(data.error)}`);
  return data.data[0].embedding;
}

function getAllNotes(dir, base = dir) {
  const notes = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue; // skip hidden dirs (.index, etc.)
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      notes.push(...getAllNotes(full, base));
    } else if (entry.name.endsWith('.md')) {
      notes.push(relative(base, full));
    }
  }
  return notes;
}

async function main() {
  if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not set');
  if (!existsSync(VAULT_PATH)) throw new Error(`Vault not found: ${VAULT_PATH}`);

  mkdirSync(INDEX_DIR, { recursive: true });

  // Load existing index
  let index = {};
  try { index = JSON.parse(readFileSync(INDEX_PATH, 'utf8')); } catch {}

  const notes = getAllNotes(VAULT_PATH);
  let updated = 0;
  let skipped = 0;

  for (const notePath of notes) {
    const fullPath = join(VAULT_PATH, notePath);
    const mtime = statSync(fullPath).mtimeMs;

    if (!FORCE && index[notePath]?.mtime === mtime) {
      skipped++;
      continue;
    }

    const content = readFileSync(fullPath, 'utf8');
    const text = `${notePath}\n\n${content}`;

    process.stdout.write(`  Embedding: ${notePath} ... `);
    const embedding = await getEmbedding(text);
    index[notePath] = { mtime, embedding };
    updated++;
    process.stdout.write('done\n');

    await new Promise(r => setTimeout(r, 200)); // avoid rate limits
  }

  // Remove entries for deleted notes
  const noteSet = new Set(notes);
  for (const key of Object.keys(index)) {
    if (!noteSet.has(key)) {
      delete index[key];
      console.log(`  Removed: ${key}`);
    }
  }

  writeFileSync(INDEX_PATH, JSON.stringify(index));
  console.log(`\nDone — ${updated} updated, ${skipped} unchanged, ${notes.length} total notes.`);
}

main().catch(err => { console.error('embed.js failed:', err.message); process.exit(1); });
