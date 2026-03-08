#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const vaultPath = process.env.OBSIDIAN_VAULT_PATH || path.join(process.cwd(), 'vault');
const args = process.argv.slice(2);

if (!args[0]) {
	console.log('Usage: read.js <note-path>');
	console.log('');
	console.log('Examples:');
	console.log('  read.js "daily/2026-03-06"');
	console.log('  read.js "memory/forex-rules"');
	console.log('  read.js "trade-journal"');
	process.exit(1);
}

const notePath = args[0].replace(/\.md$/, '');

// Try exact path first, then search
function tryRead(filePath) {
	const withExt = filePath.endsWith('.md') ? filePath : `${filePath}.md`;
	if (fs.existsSync(withExt)) return withExt;
	return null;
}

function findNote(query) {
	const exact = tryRead(path.join(vaultPath, query));
	if (exact) return exact;

	// Walk vault to find by filename
	const results = [];
	function walk(dir) {
		if (!fs.existsSync(dir)) return;
		for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
			const full = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				walk(full);
			} else if (entry.name.endsWith('.md')) {
				const name = entry.name.replace(/\.md$/, '');
				if (name.toLowerCase() === query.toLowerCase()) {
					results.push(full);
				}
			}
		}
	}
	walk(vaultPath);
	return results[0] || null;
}

if (!fs.existsSync(vaultPath)) {
	console.error(`Vault not found at: ${vaultPath}`);
	console.error('Set OBSIDIAN_VAULT_PATH or create a vault/ directory in the project root.');
	process.exit(1);
}

const found = findNote(notePath);
if (!found) {
	console.error(`Note not found: ${notePath}`);
	console.error(`Vault: ${vaultPath}`);
	process.exit(1);
}

const content = fs.readFileSync(found, 'utf8');
const stat = fs.statSync(found);
const relative = path.relative(vaultPath, found);

console.log(`--- Note: ${relative} ---`);
console.log(`Modified: ${stat.mtime.toISOString().slice(0, 10)}`);
console.log('');
console.log(content);
