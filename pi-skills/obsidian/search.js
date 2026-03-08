#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const vaultPath = process.env.OBSIDIAN_VAULT_PATH || path.join(process.cwd(), 'vault');
const args = process.argv.slice(2);

if (!args[0] || args[0].startsWith('-')) {
	console.log('Usage: search.js <query> [--title] [-n <num>]');
	console.log('');
	console.log('Options:');
	console.log('  --title    Search titles only (default: titles + content)');
	console.log('  -n <num>   Max results (default: 5)');
	console.log('');
	console.log('Examples:');
	console.log('  search.js "GBP/JPY setup"');
	console.log('  search.js "stop loss" --title');
	console.log('  search.js "forex" -n 20');
	process.exit(1);
}

const titleOnly = args.includes('--title');
if (titleOnly) args.splice(args.indexOf('--title'), 1);

let maxResults = 5;
const nIdx = args.indexOf('-n');
if (nIdx !== -1 && args[nIdx + 1]) {
	maxResults = parseInt(args[nIdx + 1], 10);
	args.splice(nIdx, 2);
}

const query = args.join(' ').toLowerCase();

if (!fs.existsSync(vaultPath)) {
	console.error(`Vault not found at: ${vaultPath}`);
	process.exit(1);
}

const results = [];

function walk(dir) {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			walk(full);
		} else if (entry.name.endsWith('.md')) {
			const relative = path.relative(vaultPath, full);
			const titleMatch = entry.name.replace(/\.md$/, '').toLowerCase().includes(query);

			if (titleOnly) {
				if (titleMatch) {
					results.push({ path: relative, titleMatch: true, snippet: '' });
				}
				return;
			}

			const content = fs.readFileSync(full, 'utf8');
			const contentLower = content.toLowerCase();
			const contentMatch = contentLower.includes(query);

			if (titleMatch || contentMatch) {
				let snippet = '';
				if (contentMatch) {
					const idx = contentLower.indexOf(query);
					const start = Math.max(0, idx - 80);
					const end = Math.min(content.length, idx + query.length + 120);
					snippet = content.slice(start, end).replace(/\n/g, ' ').trim();
					if (start > 0) snippet = '...' + snippet;
					if (end < content.length) snippet = snippet + '...';
				}
				results.push({ path: relative, titleMatch, snippet });
			}
		}
	}
}

walk(vaultPath);

// Sort: title matches first
results.sort((a, b) => (b.titleMatch ? 1 : 0) - (a.titleMatch ? 1 : 0));

const shown = results.slice(0, maxResults);

if (shown.length === 0) {
	console.log(`No notes found matching: "${query}"`);
	process.exit(0);
}

console.log(`Found ${results.length} note(s) matching "${query}" (showing ${shown.length}):\n`);
for (const r of shown) {
	console.log(`--- ${r.path} ---`);
	if (r.snippet) console.log(`  ${r.snippet}`);
	console.log('');
}
