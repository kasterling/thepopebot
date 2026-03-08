#!/usr/bin/env node
/**
 * Semantic Search across vault notes using cosine similarity.
 * Requires embed.js to have been run first to build the index.
 *
 * Usage: node semantic-search.js "your query" [--top 5]
 */

import { readFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const VAULT_PATH = process.env.OBSIDIAN_VAULT_PATH
  ? resolve(process.env.OBSIDIAN_VAULT_PATH)
  : resolve(process.cwd(), 'vault');
const INDEX_PATH = join(VAULT_PATH, '.index', 'embeddings.json');
const MODEL = 'text-embedding-3-small';

const args  = process.argv.slice(2);
const topI  = args.indexOf('--top');
const TOP_N = topI >= 0 ? parseInt(args[topI + 1]) || 5 : 5;
const query = args.filter((a, i) => a !== '--top' && i !== topI + 1).join(' ').trim();

if (!query) {
  console.error('Usage: semantic-search.js "query" [--top 5]');
  process.exit(1);
}

function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot   += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function getEmbedding(text) {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ model: MODEL, input: text }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`OpenAI embeddings error: ${JSON.stringify(data.error)}`);
  return data.data[0].embedding;
}

async function main() {
  if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not set');

  if (!existsSync(INDEX_PATH)) {
    console.error('No embeddings index found. Run embed.js first.');
    process.exit(1);
  }

  const index = JSON.parse(readFileSync(INDEX_PATH, 'utf8'));
  const noteCount = Object.keys(index).length;
  if (noteCount === 0) {
    console.error('Index is empty. Run embed.js to index your vault.');
    process.exit(1);
  }

  const queryEmbedding = await getEmbedding(query);

  const results = Object.entries(index)
    .map(([notePath, { embedding }]) => ({
      path: notePath,
      score: cosineSimilarity(queryEmbedding, embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, TOP_N);

  console.log(`\nSemantic search: "${query}" (top ${TOP_N} of ${noteCount} notes)\n`);
  console.log('='.repeat(60));

  for (const { path, score } of results) {
    const content = readFileSync(join(VAULT_PATH, path), 'utf8');
    const preview = content.slice(0, 300).replace(/\n+/g, ' ').trim();
    console.log(`\n📄 ${path}  (score: ${score.toFixed(3)})`);
    console.log(`   ${preview}${content.length > 300 ? '...' : ''}`);
  }
}

main().catch(err => { console.error('semantic-search.js failed:', err.message); process.exit(1); });
