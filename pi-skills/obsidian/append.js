#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const vaultPath = process.env.OBSIDIAN_VAULT_PATH || path.join(process.cwd(), 'vault');
const args = process.argv.slice(2);

if (args.length < 2) {
	console.log('Usage: append.js <note-path> <content>');
	console.log('');
	console.log('Examples:');
	console.log('  append.js "daily/2026-03-06" "## Update\\n\\nGBP/JPY showing strength."');
	console.log('  append.js "memory/lessons-learned" "- Never trade before NFP release."');
	process.exit(1);
}

const notePath = args[0].replace(/\.md$/, '');
const content = args.slice(1).join(' ').replace(/\\n/g, '\n');

if (!fs.existsSync(vaultPath)) {
	fs.mkdirSync(vaultPath, { recursive: true });
}

const fullPath = path.join(vaultPath, `${notePath}.md`);
const dir = path.dirname(fullPath);

if (!fs.existsSync(dir)) {
	fs.mkdirSync(dir, { recursive: true });
}

const separator = fs.existsSync(fullPath) ? '\n\n' : '';
fs.appendFileSync(fullPath, `${separator}${content}`, 'utf8');

const relative = path.relative(vaultPath, fullPath);
const stat = fs.statSync(fullPath);
console.log(`Appended to: ${relative}`);
console.log(`Total size: ${stat.size} bytes`);
