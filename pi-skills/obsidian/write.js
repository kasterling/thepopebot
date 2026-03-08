#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const vaultPath = process.env.OBSIDIAN_VAULT_PATH || path.join(process.cwd(), 'vault');
const args = process.argv.slice(2);

if (args.length < 2) {
	console.log('Usage: write.js <note-path> <content>');
	console.log('       write.js <note-path> --file <path-to-file>');
	console.log('');
	console.log('Examples:');
	console.log('  write.js "memory/forex-rules" "# Forex Rules\\n\\nAlways use stop loss."');
	console.log('  write.js "daily/2026-03-06" --file /tmp/briefing.md');
	process.exit(1);
}

const notePath = args[0].replace(/\.md$/, '');
let content;

if (args[1] === '--file') {
	const filePath = args[2];
	if (!filePath || !fs.existsSync(filePath)) {
		console.error(`File not found: ${filePath}`);
		process.exit(1);
	}
	content = fs.readFileSync(filePath, 'utf8');
} else {
	content = args.slice(1).join(' ').replace(/\\n/g, '\n');
}

if (!fs.existsSync(vaultPath)) {
	fs.mkdirSync(vaultPath, { recursive: true });
}

const fullPath = path.join(vaultPath, `${notePath}.md`);
const dir = path.dirname(fullPath);

if (!fs.existsSync(dir)) {
	fs.mkdirSync(dir, { recursive: true });
}

const existed = fs.existsSync(fullPath);
fs.writeFileSync(fullPath, content, 'utf8');

const relative = path.relative(vaultPath, fullPath);
console.log(`${existed ? 'Updated' : 'Created'}: ${relative}`);
console.log(`Path: ${fullPath}`);
console.log(`Size: ${content.length} chars`);
